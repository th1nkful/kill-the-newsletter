import cryptoRandomString from 'crypto-random-string';

const characters = '1234567890qwertyuiopasdfghjklzxcvbnm';

const createIdentifier = (): string => cryptoRandomString({
  length: 16,
  characters,
});

export default createIdentifier;
