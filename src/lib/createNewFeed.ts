import config from '../config';
import Feed from '../datastore/Feed';
import createIdentifier from './createIdentifier';

const {
  baseUrl,
  emailDomain,
} = config;

interface FeedData {
  title: string;
}

const createNewFeed = async (data: FeedData) => {
  const feedId = createIdentifier();
  const feedUrl = `${baseUrl}/feeds/${feedId}`;
  const feedEmail = `${feedId}@${emailDomain}`;

  console.log({
    feedId,
    title: data.title,
    feedEmail,
    feed_url: feedUrl,
    site_url: feedUrl,
  });

  const feed = new Feed({
    feedId,
    title: data.title,
    feedEmail,
    feed_url: feedUrl,
    site_url: feedUrl,
  });

  console.log('created feed obj, trying save...');

  return feed.save();
};

export default createNewFeed;
