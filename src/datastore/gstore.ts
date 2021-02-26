import 'dotenv/config';
import { Gstore } from 'gstore-node';
import { Datastore } from '@google-cloud/datastore';

const gstore = new Gstore();
const datastore = new Datastore();
gstore.connect(datastore);

export default gstore;
