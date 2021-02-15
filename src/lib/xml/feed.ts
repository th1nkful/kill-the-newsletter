import * as utils from '../utils';
import config from '../../config';

const {
  baseUrl: BASE_URL,
} = config;

const feed = (
  identifier: string,
  name: string,
  initialEntry: string,
): string => `
    <?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <link
        rel="self"
        type="application/atom+xml"
        href="${utils.feedURL(identifier)}"
      />
      <link rel="alternate" type="text/html" href="${BASE_URL}" />
      <id>${utils.urn(identifier)}</id>
      <title>${name}</title>
      <subtitle
        >Kill the Newsletter! Inbox: ${utils.feedEmail(identifier)} →
        ${utils.feedURL(identifier)}</subtitle
      >
      <updated>${utils.now()}</updated>
      <author><name>Kill the Newsletter!</name></author>
      ${initialEntry}
    </feed>
  `.trim();

export default feed;
