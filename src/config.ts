import 'dotenv/config';

const {
  WEB_PORT,
  EMAIL_PORT,
  BASE_URL,
  EMAIL_DOMAIN,
  ISSUE_REPORT,
} = process.env;

const config = {
  webPort: 8000,
  emailPort: 2525,
  baseUrl: BASE_URL || 'http://localhost:8000',
  emailDomain: EMAIL_DOMAIN || 'localhost',
  issueReport: ISSUE_REPORT || 'mailto:kill-the-newsletter@leafac.com',
};

if (WEB_PORT) {
  config.webPort = parseInt(WEB_PORT, 10);
}

if (EMAIL_PORT) {
  config.emailPort = parseInt(EMAIL_PORT, 10);
}

export default config;
