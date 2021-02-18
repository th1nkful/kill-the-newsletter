import html from 'tagged-template-noop';
import config from '../../config';

const {
  issueReport,
  baseUrl,
} = config;

const layout = (mainContent: string): string => {
  const content = html`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Kill the Newsletter!</title>
      <meta name="author" content="Leandro Facchinetti" />
      <meta
        name="description"
        content="Convert email newsletters into Atom feeds."
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="${baseUrl}/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="${baseUrl}/favicon-16x16.png"
      />
      <link rel="icon" type="image/x-icon" href="${baseUrl}/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="${baseUrl}/styles.css" />
    </head>
    <body>
      <header>
        <h1><a href="${baseUrl}/">Kill the Newsletter!</a></h1>
        <p>Convert email newsletters into Atom feeds</p>
        <p>
          <img
            src="${baseUrl}/logo.svg"
            alt="Convert email newsletters into Atom feeds"
          />
        </p>
      </header>
      <main>${mainContent}</main>
      <footer>
        <p>
          By <a href="https://leafac.com">Leandro Facchinetti</a> ·
          <a href="https://github.com/leafac/kill-the-newsletter.com"
            >Source</a
          >
          · <a href="${issueReport}">Report an Issue</a>
        </p>
      </footer>
      <script src="${baseUrl}/clipboard.min.js"></script>
      <script src="${baseUrl}/scripts.js"></script>
    </body>
  </html>`;

  return content.trim();
};

export default layout;
