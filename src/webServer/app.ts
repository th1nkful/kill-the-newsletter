import express from 'express';
import asyncHandler from 'express-async-handler';
import html from 'tagged-template-noop';

import created from './templates/created';
import layout from './templates/layout';
import newInbox from './templates/nexInbox';

import sanitiseHtml from '../lib/sanitiseHtml';
import createNewFeed from '../lib/createNewFeed';
import createNewFeedItem from '../lib/createNewFeedItem';
import getRssFeed from '../lib/getRssFeed';

import Feed from '../datastore/Feed';
import FeedItem from '../datastore/FeedItem';

const app = express();

app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use('/feeds', (req, res, next) => {
  res.header('X-Robots-Tag', 'noindex');
  next();
});

// ! replace with react app?
app.get('/',
  (req, res) => res.send(layout(newInbox())));

app.post('/webhooks', asyncHandler(async (req, res) => {
  console.log('req ->', req);
  console.log('req ^^^');

  console.log(JSON.stringify(req.body, null, 2));
  console.log('req.body ^^^');

  console.log(JSON.stringify(req.headers, null, 2));
  console.log('req.headers ^^^');

  res.sendStatus(200);
}));

app.post('/',
  asyncHandler(async (req, res) => {
    const feed = await createNewFeed(req.body);
    console.log('feed created', feed.feedId);
    const content = created(feed);

    await createNewFeedItem(feed.feedId, {
      title: `“${sanitiseHtml(feed.title)}” Inbox Created`,
      author: 'Kill the Newsletter!',
      content,
    });

    // ! send inbox created page
    res.send(
      layout(html`
        <p><strong>“${sanitiseHtml(feed.title)}” Inbox Created</strong></p>
        ${content}
      `),
    );
  }));

app.get('/feeds/:feedId',
  asyncHandler(async (req, res) => {
    const { feedId } = req.params;
    const feed = await Feed.findOne({ feedId });
    if (!feed) {
      res.sendStatus(404);
      return;
    }

    const rssFeed = await getRssFeed(feed);
    const { format = 'rss' } = req.query;

    if (format === 'atom') {
      res.send(rssFeed.atom1());
      return;
    }

    if (format === 'json') {
      res.json(rssFeed.json1());
      return;
    }

    res.send(rssFeed.rss2());
  }));

app.get('/feeds/:feedId/item/:feedItemId',
  asyncHandler(async (req, res) => {
    const { feedId, feedItemId } = req.params;

    const feed = await Feed.findOne({ feedId });
    if (!feed) {
      res.sendStatus(404);
      return;
    }

    const item = await FeedItem.findOne({ feedId, feedItemId });
    if (!item) {
      res.sendStatus(404);
      return;
    }

    res.redirect(301, item.url);
  }));

export default app;
