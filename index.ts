import express from 'express';
import { SMTPServer } from 'smtp-server';
import mailparser from 'mailparser';
import * as sanitizeXMLString from 'sanitize-xml-string';
import * as entities from 'entities';
import R from 'escape-string-regexp';
import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import writeFileAtomic from 'write-file-atomic';
import html from 'tagged-template-noop';

import createIdentifier from './src/lib/createIdentifier';
import layout from './src/lib/templates/layout';
import config from './src/config';
import newInbox from './src/lib/templates/nexInbox';
import created from './src/lib/templates/created';

import * as utils from './src/lib/utils';

const {
  webPort: WEB_PORT,
  emailPort: EMAIL_PORT,
  baseUrl: BASE_URL,
  emailDomain: EMAIL_DOMAIN,
} = config;

export const webServer = express()
  .use(['/feeds', '/alternate'], (req, res, next) => {
    res.header('X-Robots-Tag', 'noindex');
    next();
  })
  .use(express.static('static'))
  .use(express.urlencoded({ extended: true }))
  .get('/', (req, res) => res.send(layout(newInbox())))
  .post('/', async (req, res, next) => {
    try {
      const { name } = req.body;
      const identifier = createIdentifier();
      const renderedCreated = created(identifier);
      await writeFileAtomic(
        utils.feedFilePath(identifier),
        feed(
          identifier,
          utils.X(name),
          entry(
            identifier,
            createIdentifier(),
            `“${utils.X(name)}” Inbox Created`,
            'Kill the Newsletter!',
            utils.X(renderedCreated)
          ),
        ),
      );
      res.send(
        layout(html`
          <p><strong>“${utils.H(name)}” Inbox Created</strong></p>
          ${renderedCreated}
        `),
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .get(
    utils.alternatePath(':feedIdentifier', ':entryIdentifier'),
    async (req, res, next) => {
      try {
        const { feedIdentifier, entryIdentifier } = req.params;
        const path = utils.feedFilePath(feedIdentifier);
        let text;
        try {
          text = await fs.readFile(path, 'utf8');
        } catch {
          return res.sendStatus(404);
        }
        const feed = new JSDOM(text, { contentType: 'text/xml' });
        const document = feed.window.document;
        const link = document.querySelector(
          `link[href="${utils.alternateURL(feedIdentifier, entryIdentifier)}"]`
        );
        if (link === null) return res.sendStatus(404);
        res.send(
          entities.decodeXML(
            link.parentElement!.querySelector('content')!.textContent!
          ),
        );
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  )
  .listen(WEB_PORT, () => console.log(`Server started: ${BASE_URL}`));

export const emailServer = new SMTPServer({
  disabledCommands: ['AUTH', 'STARTTLS'],
  async onData(stream, session, callback) {
    try {
      const email = await mailparser.simpleParser(stream);
      const content =
        typeof email.html === 'string' ? email.html : email.textAsHtml ?? '';
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

function feed(identifier: string, name: string, initialEntry: string): string {
  return html`
    <?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <link
        rel="self"
        type="application/atom+xml"
        href="${utils.feedURL(identifier)}"
      />
      <link rel="alternate" type="text/html" href="${BASE_URL}" />
      <id>${utils.urn(identifier)}</id>
      <title>${name}</title>
      <subtitle
        >Kill the Newsletter! Inbox: ${utils.feedEmail(identifier)} →
        ${utils.feedURL(identifier)}</subtitle
      >
      <updated>${utils.now()}</updated>
      <author><name>Kill the Newsletter!</name></author>
      ${initialEntry}
    </feed>
  `.trim();
}

function entry(
  feedIdentifier: string,
  entryIdentifier: string,
  title: string,
  author: string,
  content: string,
): string {
  return html`
    <entry>
      <id>${utils.urn(entryIdentifier)}</id>
      <title>${title}</title>
      <author><name>${author}</name></author>
      <updated>${utils.now()}</updated>
      <link
        rel="alternate"
        type="text/html"
        href="${utils.alternateURL(feedIdentifier, entryIdentifier)}"
      />
      <content type="html">${content}</content>
    </entry>
  `.trim();
}
