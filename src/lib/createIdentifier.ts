import cryptoRandomString from 'crypto-random-string';

const createIdentifier = (): string => cryptoRandomString({
  length: 16,
  characters: '1234567890qwertyuiopasdfghjklzxcvbnm',
});

export default createIdentifier;
