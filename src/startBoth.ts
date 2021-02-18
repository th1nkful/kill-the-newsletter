import config from './config';
import app from './webServer/app';
import email from './email-server';
import setupGstore from './datastore/gstore';

setupGstore();

export const webServer = app.listen(config.webPort,
  () => console.log(`Server started: ${config.baseUrl}`));

export const emailServer = email.listen(config.emailPort);
