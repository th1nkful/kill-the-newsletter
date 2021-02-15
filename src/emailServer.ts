import { SMTPServer } from 'smtp-server';

import onData from './lib/email/onData';

const emailServer = new SMTPServer({
  disabledCommands: ['AUTH', 'STARTTLS'],
  onData,
});

export default emailServer;
