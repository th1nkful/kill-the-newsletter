import { SMTPServer } from 'smtp-server';
import mailparser from 'mailparser';
import R from 'escape-string-regexp';
import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import writeFileAtomic from 'write-file-atomic';
import html from 'tagged-template-noop';

import createIdentifier from './src/lib/createIdentifier';
import config from './src/config';

import entry from './src/lib/xml/entry';
import * as utils from './src/lib/utils';
import app from './src/webServer';

const {
  emailPort: EMAIL_PORT,
  emailDomain: EMAIL_DOMAIN,
} = config;

export const webServer = app.listen(config.webPort,
  () => console.log(`Server started: ${config.baseUrl}`));

export const emailServer = new SMTPServer({
  disabledCommands: ['AUTH', 'STARTTLS'],
  async onData(stream, session, callback) {
    try {
      const email = await mailparser.simpleParser(stream);
      const content = typeof email.html === 'string' ? email.html : email.textAsHtml ?? '';
      for (const address of new Set(
        session.envelope.rcptTo.map(({ address }) => address)
      )) {
        const match = address.match(
          new RegExp(`^(?<identifier>\\w+)@${R(EMAIL_DOMAIN)}$`)
        );
        if (match?.groups === undefined) continue;
        const identifier = match.groups.identifier.toLowerCase();
        const path = utils.feedFilePath(identifier);
        let text;
        try {
          text = await fs.readFile(path, 'utf8');
        } catch {
          continue;
        }
        const feed = new JSDOM(text, { contentType: 'text/xml' });
        const document = feed.window.document;
        const updated = document.querySelector('feed > updated');
        if (updated === null) {
          console.error(`Field ‘updated’ not found: ‘${path}’`);
          continue;
        }
        updated.textContent = utils.now();
        const renderedEntry = entry(
          identifier,
          createIdentifier(),
          utils.X(email.subject ?? ''),
          utils.X(email.from?.text ?? ''),
          utils.X(content),
        );
        const firstEntry = document.querySelector('feed > entry:first-of-type');
        if (firstEntry === null)
          document
            .querySelector('feed')!
            .insertAdjacentHTML('beforeend', renderedEntry);
        else firstEntry.insertAdjacentHTML('beforebegin', renderedEntry);
        while (feed.serialize().length > 500_000) {
          const lastEntry = document.querySelector('feed > entry:last-of-type');
          if (lastEntry === null) break;
          lastEntry.remove();
        }
        await writeFileAtomic(
          path,
          html`<?xml version="1.0" encoding="utf-8"?>${feed.serialize()}`.trim()
        );
      }
      callback();
    } catch (error) {
      console.error(
        `Failed to receive message: ‘${JSON.stringify(session, null, 2)}’`
      );
      console.error(error);
      stream.resume();
      callback(new Error('Failed to receive message. Please try again.'));
    }
  },
}).listen(EMAIL_PORT);
