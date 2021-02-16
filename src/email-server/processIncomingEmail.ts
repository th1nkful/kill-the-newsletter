import { SMTPServerDataStream, SMTPServerSession } from 'smtp-server';

import { simpleParser } from 'mailparser';
import escapeRegEx from 'escape-string-regexp';

import writeFileAtomic from 'write-file-atomic';
import { promises as fs } from 'fs';
import { JSDOM } from 'jsdom';

import config from '../config';
import * as utils from '../lib/utils';
import entry from '../lib/xml/entry';
import createIdentifier from '../lib/createIdentifier';

const emailDomain = escapeRegEx(config.emailDomain);

const processIncomingEmail = async (
  stream: SMTPServerDataStream,
  session: SMTPServerSession,
) => {
  const email = await simpleParser(stream);
  const content = (typeof email.html === 'string')
    ? email.html
    : email.textAsHtml ?? '';

  const { rcptTo } = session.envelope;
  const addresses = rcptTo
    .map(({ address }) => address);

  await Promise.all(addresses.map(async (address) => {
    // check if emailDomain is part of address
    const match = address.match(new RegExp(`^(?<identifier>\\w+)@${emailDomain}$`));
    if (match?.groups === undefined) {
      return;
    }

    // Extract ID from address
    const identifier = match.groups.identifier.toLowerCase();
    const path = utils.feedFilePath(identifier);

    // try open xml document
    // ! find feed in datastore
    let text;
    try {
      text = await fs.readFile(path, 'utf8');
    } catch {
      return;
    }

    // ! save to bucket and get public URL
    // ! add to pretty template

    // parse xml document
    const feed = new JSDOM(text, { contentType: 'text/xml' });
    const { document } = feed.window;

    // find update field, exit if missing
    const updated = document.querySelector('feed > updated');
    if (updated === null) {
      console.error(`Field ‘updated’ not found: ‘${path}’`);
      return;
    }

    // Add updated field as today's date
    // ! update feed updated field in datastore
    updated.textContent = utils.now();

    // Create new entry
    // ! add entry to datastore
    const renderedEntry = entry(
      identifier,
      createIdentifier(),
      utils.X(email.subject ?? ''),
      utils.X(email.from?.text ?? ''),
      utils.X(content),
    );

    // ! V cleanup & maintenance below now necessary

    // Add new entry to xml document
    const firstEntry = document.querySelector('feed > entry:first-of-type');
    if (firstEntry === null) {
      document
        .querySelector('feed')!
        .insertAdjacentHTML('beforeend', renderedEntry);
    } else {
      firstEntry.insertAdjacentHTML('beforebegin', renderedEntry);
    }

    // Shorten xml feed if its too long
    while (feed.serialize().length > 500_000) {
      const lastEntry = document.querySelector('feed > entry:last-of-type');
      if (lastEntry === null) break;
      lastEntry.remove();
    }

    await writeFileAtomic(
      path,
      `<?xml version="1.0" encoding="utf-8"?>${feed.serialize()}`.trim(),
    );
  }));
};

export default processIncomingEmail;
