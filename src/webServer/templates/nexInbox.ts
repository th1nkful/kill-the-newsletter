import html from 'tagged-template-noop';
import config from '../../config';

const {
  baseUrl: BASE_URL,
} = config;

const newInbox = (): string => html`
    <form method="POST" action="${BASE_URL}/">
      <p>
        <input
          type="text"
          name="name"
          placeholder="Newsletter Name…"
          maxlength="500"
          size="30"
          required
        />
        <button>Create Inbox</button>
      </p>
    </form>
  `;

export default newInbox;
