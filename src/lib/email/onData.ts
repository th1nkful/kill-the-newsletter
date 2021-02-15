import { SMTPServerDataStream, SMTPServerSession } from 'smtp-server';

import { simpleParser } from 'mailparser';
import writeFileAtomic from 'write-file-atomic';
import R from 'escape-string-regexp';
import { promises as fs } from 'fs';
import { JSDOM } from 'jsdom';

import config from '../../config';
import * as utils from '../utils';
import entry from '../xml/entry';
import createIdentifier from '../createIdentifier';

const {
  emailDomain: EMAIL_DOMAIN,
} = config;

const onData = async (
  stream: SMTPServerDataStream,
  session: SMTPServerSession,
  callback: (error?: Error | null | undefined) => void,
) => {
  try {
    const email = await simpleParser(stream);
    const content = typeof email.html === 'string'
      ? email.html
      : email.textAsHtml ?? '';

    const addresses = session.envelope.rcptTo.map(({ address }) => address);

    await Promise.all(addresses.map(async (address) => {
      const match = address.match(
        new RegExp(`^(?<identifier>\\w+)@${R(EMAIL_DOMAIN)}$`),
      );

      if (match?.groups === undefined) {
        return;
      }

      const identifier = match.groups.identifier.toLowerCase();
      const path = utils.feedFilePath(identifier);

      let text;
      try {
        text = await fs.readFile(path, 'utf8');
      } catch {
        return;
      }

      const feed = new JSDOM(text, { contentType: 'text/xml' });
      const { document } = feed.window;

      const updated = document.querySelector('feed > updated');
      if (updated === null) {
        console.error(`Field ‘updated’ not found: ‘${path}’`);
        return;
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
      if (firstEntry === null) {
        document
          .querySelector('feed')!
          .insertAdjacentHTML('beforeend', renderedEntry);
      } else {
        firstEntry.insertAdjacentHTML('beforebegin', renderedEntry);
      }

      while (feed.serialize().length > 500_000) {
        const lastEntry = document.querySelector('feed > entry:last-of-type');
        if (lastEntry === null) break;
        lastEntry.remove();
      }

      await writeFileAtomic(
        path,
        `<?xml version="1.0" encoding="utf-8"?>${feed.serialize()}`.trim(),
      );
    }));

    callback();
  } catch (error) {
    console.error(`Failed to receive message: ‘${JSON.stringify(session, null, 2)}’`);
    console.error(error);

    stream.resume();
    callback(new Error('Failed to receive message. Please try again.'));
  }
};

export default onData;
