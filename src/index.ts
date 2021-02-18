import config from './config';
import setupGstore from './datastore/gstore';
import app from './webServer/app';

setupGstore();
app.listen(config.webPort,
  () => console.log(`Server started: ${config.baseUrl}`));
