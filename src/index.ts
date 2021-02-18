import config from './config';
import app from './webServer/app';

app.listen(config.webPort,
  () => console.log(`Server started: ${config.baseUrl}`));
