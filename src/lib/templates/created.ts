import config from '../../config';

const {
  baseUrl: BASE_URL,
} = config;

const created = (identifier: string): string => `
    <p>
      Sign up for the newsletter with<br /><code class="copyable"
        >${feedEmail(identifier)}</code
      >
    </p>
    <p>
      Subscribe to the Atom feed at<br /><code class="copyable"
        >${feedURL(identifier)}</code
      >
    </p>
    <p>
      Don’t share these addresses.<br />They contain an identifier that other
      people could use<br />to send you spam and to control your newsletter
      subscriptions.
    </p>
    <p>Enjoy your readings!</p>
    <p>
      <a href="${BASE_URL}"><strong>Create Another Inbox</strong></a>
    </p>
  `.trim();

export default created;
