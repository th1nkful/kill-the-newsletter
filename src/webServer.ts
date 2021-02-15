import express from 'express';
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
app.get('/', (req, res) => res.send(layout(newInbox())));

// Create new feeds
app.post('/', async (req, res, next) => {
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
          utils.X(renderedCreated),
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
});

app.get(
  utils.alternatePath(':feedIdentifier', ':entryIdentifier'),
  async (req, res, next) => {
    try {
      const { feedIdentifier, entryIdentifier } = req.params;
      const path = utils.feedFilePath(feedIdentifier);

      let text;
      try {
        text = await fs.readFile(path, 'utf8');
      } catch {
        res.sendStatus(404);
        return;
      }

      const rssFeed = new JSDOM(text, { contentType: 'text/xml' });
      const { document } = rssFeed.window;
      const link = document.querySelector(
        `link[href="${utils.alternateURL(feedIdentifier, entryIdentifier)}"]`,
      );

      if (link === null) {
        res.sendStatus(404);
        return;
      }

      res.send(
        entities.decodeXML(
          link.parentElement!.querySelector('content')!.textContent!,
        ),
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
);

export default app;
