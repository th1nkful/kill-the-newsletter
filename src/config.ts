import 'dotenv/config';

const {
  PORT,
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

const port: string|undefined = WEB_PORT || PORT;
if (port) {
  config.webPort = parseInt(port, 10);
}

if (EMAIL_PORT) {
  config.emailPort = parseInt(EMAIL_PORT, 10);
}

export default config;
