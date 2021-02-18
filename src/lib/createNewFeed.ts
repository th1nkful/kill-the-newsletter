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

  const feed = new Feed({
    feedId,
    title: data.title,
    feedEmail,
    feed_url: feedUrl,
    site_url: feedUrl,
  });

  return feed.save();
};

export default createNewFeed;
