import html from 'tagged-template-noop';
import config from '../../config';

const created = (feed: any): string => html`
    <p>
      Sign up for the newsletter with<br /><code class="copyable"
        >${feed.email}</code
      >
    </p>
    <p>
      Subscribe to the Atom feed at<br /><code class="copyable"
        >${feed.url}</code
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
