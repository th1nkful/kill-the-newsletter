import {
  SMTPServerDataStream, SMTPServerSession, SMTPServer,
} from 'smtp-server';

import config from '../config';
import processIncomingEmail from './processIncomingEmail';

const emailServer = new SMTPServer({
  disabledCommands: ['AUTH', 'STARTTLS'],
  // onRcptTo: async (
  //   address,
  //   session,
  //   callback,
  // ) => {
  //   callback();
  // },
  onData: async (
    stream: SMTPServerDataStream,
    session: SMTPServerSession,
    callback: (error?: Error | null | undefined) => void,
  ) => {
    console.log('Processing incoming message...');
    try {
      await processIncomingEmail(stream, session);
      callback();
    } catch (error) {
      console.error(`Failed to receive message: ‘${JSON.stringify(session, null, 2)}’`);
      console.error(error);
      stream.resume();
      callback(new Error('Failed to receive message. Please try again.'));
    }
  },
});

export const startListening = async () => {
  emailServer.listen(config.emailPort, () => {
    console.log(`SMTP server listening on port: ${config.emailPort}`);
  });
};

export default emailServer;
