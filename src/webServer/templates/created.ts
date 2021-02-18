import html from 'tagged-template-noop';
import config from '../../config';
import { FeedModel } from '../../datastore/Feed';

const created = (feed: FeedModel): string => html`
    <p>
      Sign up for the newsletter with<br /><code class="copyable"
        >${feed.feedEmail}</code
      >
    </p>
    <p>
      Subscribe to the Atom feed at<br /><code class="copyable"
        >${feed.feed_url}</code
      >
    </p>
    <p>
      Don’t share these addresses.<br />They contain an identifier that other
      people could use<br />to send you spam and to control your newsletter
      subscriptions.
    </p>
    <p>Enjoy your readings!</p>
    <p>
      <a href="${config.baseUrl}"><strong>Create Another Inbox</strong></a>
    </p>
  `.trim();

export default created;
