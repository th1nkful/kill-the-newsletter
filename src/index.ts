import config from './config';
import app from './webServer';
import email from './emailServer';

export const webServer = app.listen(config.webPort,
  () => console.log(`Server started: ${config.baseUrl}`));

export const emailServer = email.listen(config.emailPort);
