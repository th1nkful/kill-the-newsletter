import config from './config';
import db from './database';
import app from './webServer/app';

const runWebServer = async () => {
  console.log(db);

  app.listen(config.webPort, () => {
    console.log(`Server started: ${config.baseUrl}`);
  });
};

runWebServer();
