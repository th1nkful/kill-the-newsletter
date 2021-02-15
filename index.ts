import config from './src/config';
import app from './src/webServer';
import email from './src/emailServer';

export const webServer = app.listen(config.webPort,
  () => console.log(`Server started: ${config.baseUrl}`));

export const emailServer = email.listen(config.emailPort);
