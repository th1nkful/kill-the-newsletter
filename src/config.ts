import 'dotenv/config';

const {
  PORT,
  WEB_PORT,
  BASE_URL = 'http://localhost:8000',
  EMAIL_DOMAIN = 'localhost',
  ISSUE_REPORT = 'mailto:kill-the-newsletter@leafac.com',
  PUBLIC_GCP_BUCKET = 'rss-from-email-dev-public',
} = process.env;

const config = {
  webPort: 8000,
  baseUrl: BASE_URL,
  emailDomain: EMAIL_DOMAIN,
  issueReport: ISSUE_REPORT,
  publicBucket: PUBLIC_GCP_BUCKET,
};

const port: string|undefined = WEB_PORT || PORT;
if (port) {
  config.webPort = parseInt(port, 10);
}

export default config;
