import 'dotenv/config';

const {
  WEB_PORT,
  EMAIL_PORT,
  BASE_URL = 'http://localhost:8000',
  EMAIL_DOMAIN = 'localhost',
  ISSUE_REPORT = 'mailto:kill-the-newsletter@leafac.com',
  PUBLIC_GCP_BUCKET = 'rss-from-email-dev-public',
} = process.env;

const config = {
  webPort: 8000,
  emailPort: 2525,
  baseUrl: BASE_URL,
  emailDomain: EMAIL_DOMAIN,
  issueReport: ISSUE_REPORT,
  publicBucket: PUBLIC_GCP_BUCKET,
};

if (WEB_PORT) {
  config.webPort = parseInt(WEB_PORT, 10);
}

if (EMAIL_PORT) {
  config.emailPort = parseInt(EMAIL_PORT, 10);
}

export default config;
