import * as utils from '../utils';

const entry = (
  feedIdentifier: string,
  entryIdentifier: string,
  title: string,
  author: string,
  content: string,
): string => `
    <entry>
      <id>${utils.urn(entryIdentifier)}</id>
      <title>${title}</title>
      <author><name>${author}</name></author>
      <updated>${utils.now()}</updated>
      <link
        rel="alternate"
        type="text/html"
        href="${utils.alternateURL(feedIdentifier, entryIdentifier)}"
      />
      <content type="html">${content}</content>
    </entry>
  `.trim();

export default entry;
