import 'dotenv/config';
import { Gstore, instances } from 'gstore-node';
import { Datastore } from '@google-cloud/datastore';

const setupGstore = () => {
  const gstore = new Gstore();

  const datastore = new Datastore({
    projectId: process.env.GCP_PROJECT,
  });

  gstore.connect(datastore);
  instances.set('default', gstore);
};

export default setupGstore;
