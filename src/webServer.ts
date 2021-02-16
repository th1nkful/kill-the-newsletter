import express from 'express';
import asyncHandler from 'express-async-handler';

import * as entities from 'entities';
import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import writeFileAtomic from 'write-file-atomic';
import html from 'tagged-template-noop';

import createIdentifier from './lib/createIdentifier';
import created from './lib/templates/created';
import layout from './lib/templates/layout';
import newInbox from './lib/templates/nexInbox';

import entry from './lib/xml/entry';
import feed from './lib/xml/feed';
import * as utils from './lib/utils';

// import config from './config';

// const {
//   webPort: WEB_PORT,
//   emailPort: EMAIL_PORT,
//   baseUrl: BASE_URL,
//   emailDomain: EMAIL_DOMAIN,
// } = config;

const app = express();

app.use(['/feeds', '/alternate'], (req, res, next) => {
  res.header('X-Robots-Tag', 'noindex');
  next();
});

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

// Get main page to create new feed
// ! replace with react app
app.get('/',
  (req, res) => res.send(layout(newInbox())));

// ! add an app.get('/:feedId') which returns a rss feed (not xml)
// ! which is generated on request from datastore

// Create new feeds
app.post('/',
  asyncHandler(async (req, res) => {
    const { name } = req.body;

    const identifier = createIdentifier();
    const renderedCreated = created(identifier);

    // create file with feed id with intro entry
    // ! create feed in datastore
    // ! add initial entry
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
          utils.X(renderedCreated),
        ),
      ),
    );

    // ! send inbox created page
    res.send(
      layout(html`
        <p><strong>“${utils.H(name)}” Inbox Created</strong></p>
        ${renderedCreated}
      `),
    );
  }));

app.get('/alternate/:feedIdentifier/:entryIdentifier',
  asyncHandler(async (req, res) => {
    const { feedIdentifier, entryIdentifier } = req.params;

    // try open file with feed
    // ! find feed in datastore
    let text;
    try {
      const path = utils.feedFilePath(feedIdentifier);
      text = await fs.readFile(path, 'utf8');
    } catch {
      res.sendStatus(404);
      return;
    }

    // parse xml feed
    const rssFeed = new JSDOM(text, { contentType: 'text/xml' });
    const { document } = rssFeed.window;

    // try find specific entry
    // ! find element for feed in datastore
    const href = utils.alternateURL(feedIdentifier, entryIdentifier);
    const linkElement = document.querySelector(`link[href="${href}"]`);
    if (linkElement === null) {
      res.sendStatus(404);
      return;
    }

    // send specific entry
    // ! redirect to public html
    res.send(entities
      .decodeXML(linkElement.parentElement!.querySelector('content')!.textContent!));
  }));

export default app;
