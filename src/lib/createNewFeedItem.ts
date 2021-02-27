import { v4 as uuid } from 'uuid';

import Feed from '../datastore/Feed';
import FeedItem from '../datastore/FeedItem';
import uploadFile from './uploadFile';
import sanitiseHtml from './sanitiseHtml';

interface FeedItemData {
  title: string;
  content: string;
  author?: string;
}

const createNewFeedItem = async (
  feedId: string,
  data: FeedItemData,
) => {
  const feed = await Feed.findOne({ feedId });
  if (!feed) {
    throw new Error('No feed for feedId');
  }

  const feedItemId = uuid().toLowerCase();
  const content = sanitiseHtml(data.content);

  // ! add to pretty template
  // ? pretty html around email
  // TODO: remove tracking pixels

  // ? - image = findPrimaryImage(content)
  // ? - description = summarise(content)

  const publicUrl = await uploadFile(
    feed.feedId,
    feedItemId,
    content,
  );

  const feedItem = new FeedItem({
    feedItemId,
    feedId,
    title: data.title,
    url: publicUrl,
    guid: publicUrl,
    author: data.author,
    date: new Date(),
  });

  feed.pubDate = new Date();
  feed.save(undefined, { method: 'update' });

  return feedItem.save(undefined, { method: 'insert' });
};

export default createNewFeedItem;
