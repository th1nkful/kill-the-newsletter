import Feed from '../datastore/Feed';
import FeedItem from '../datastore/FeedItem';

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
  const publicUrl = 'upload(data.content)';

  const feedItem = new FeedItem({
    feedId,
    title: data.title,
    url: publicUrl,
    guid: publicUrl,
    author: data.author,
    date: new Date(),
    feed: feed?.entityKey,
  });

  return feedItem.save();
};

export default createNewFeedItem;
