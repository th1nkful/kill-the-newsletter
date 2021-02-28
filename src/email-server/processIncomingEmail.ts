import { simpleParser } from 'mailparser';
import escapeRegEx from 'escape-string-regexp';

import config from '../config';

import Feeds from '../models/Feeds';
import createNewFeedItem from '../lib/createNewFeedItem';

const emailDomain = escapeRegEx(config.emailDomain);

const processIncomingEmail = async () => {
  const email = await simpleParser(stream);
  const content = (typeof email.html === 'string')
    ? email.html
    : email.textAsHtml ?? '';

  const addresses = session.envelope.rcptTo
    .map(({ address }) => address);

  await Promise.all(addresses.map(async (address) => {
    // check if emailDomain is part of address
    const match = address.match(new RegExp(`^(?<identifier>\\w+)@${emailDomain}$`));
    if (match?.groups === undefined) {
      return;
    }

    const feedId = match.groups.identifier.toLowerCase();
    const feed = await Feeds.findOne({ feedId });
    if (!feed) {
      return;
    }

    await createNewFeedItem(feed.feedId, {
      title: email.subject ?? 'New Email',
      author: email.from?.text ?? '',
      content,
    });
  }));
};

export default processIncomingEmail;
