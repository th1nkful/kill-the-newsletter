const getRssFeed = async (feed) => {
  const rss = new Feed({
    title: feed.title,
    description: feed.description,
    id: feed.feed_url,
    link: feed.feed_url,
    copyright: `${feed.title} ${new Date().getFullYear()}`,
    updated: feed.pubDate,
    generator: 'Kill the Newsletter!',
    feedLinks: {
      json: `${feed.feed_url}?format=json`,
      atom: `${feed.feed_url}?format=atom`,
    },
  });

  const { entities: feedItems } = await FeedItem.list({
    filters: ['feedId', feed.feedId],
    limit: 25, // in future, have this per feed
    order: [
      { property: 'createdOn', descending: true },
    ],
  });

  feedItems.forEach((item) => {
    const rssEntry: Item = {
      title: item.title,
      id: item.url,
      link: item.url,
      description: feed.description || '',
      date: item.date || new Date(),
    };

    if (item.author) {
      rssEntry.author = [{
        name: item.author,
      }];
    }

    rss.addItem(rssEntry);
  });

  return rss;
};

export default getRssFeed;
