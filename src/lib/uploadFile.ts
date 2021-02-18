import { Storage } from '@google-cloud/storage';
import config from '../config';

const { publicBucket } = config;

const storage = new Storage();

const getPublicUrl = (
  fileName: string,
) => `https://storage.googleapis.com/${publicBucket}/${fileName}`;

const uploadFile = async (
  feedId: string,
  itemId: string,
  content: string,
): Promise<string> => new Promise((resolve, reject) => {
  const fileName = `${feedId}/${itemId}.html`;

  const file = storage
    .bucket(publicBucket)
    .file(fileName);

  const stream = file.createWriteStream({
    resumable: false,
    metadata: {
      contentType: 'text/html',
      cacheControl: 'public, max-age=31536000',
    },
  });

  stream
    .on('finish', () => {
      resolve(getPublicUrl(fileName));
    })
    .on('error', () => {
      reject(new Error('Unable to upload file, something went wrong'));
    })
    .end(Buffer.from(content));
});

export default uploadFile;
