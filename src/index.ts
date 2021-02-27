import { v4 } from 'uuid';
import config from './config';

import Feed from './datastore/Feed';

import createNewFeed from './lib/createNewFeed';
import app from './webServer/app';

const runWebServer = async () => {
  app.listen(config.webPort, () => {
    console.log(`Server started: ${config.baseUrl}`);
  });

  try {
    const { entities: feeds } = await Feed.list();
    console.log('feeds', feeds);

    if (feeds.length === 0) {
      const f = await createNewFeed({
        title: `Test:${v4()}`,
      });

      console.log('f', JSON.stringify(f, null, 2));
    }
  } catch (error) {
    console.log('error');
    console.error(error);
  }
};

runWebServer();
