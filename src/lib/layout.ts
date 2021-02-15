import config from '../config';

const {
  issueReport: ISSUE_REPORT,
  baseUrl: BASE_URL,
} = config;

const layout = (content: string): string => {
  const html = `<!DOCTYPE html>
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
        href="${BASE_URL}/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="${BASE_URL}/favicon-16x16.png"
      />
      <link rel="icon" type="image/x-icon" href="${BASE_URL}/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="${BASE_URL}/styles.css" />
    </head>
    <body>
      <header>
        <h1><a href="${BASE_URL}/">Kill the Newsletter!</a></h1>
        <p>Convert email newsletters into Atom feeds</p>
        <p>
          <img
            src="${BASE_URL}/logo.svg"
            alt="Convert email newsletters into Atom feeds"
          />
        </p>
      </header>
      <main>${content}</main>
      <footer>
        <p>
          By <a href="https://leafac.com">Leandro Facchinetti</a> ·
          <a href="https://github.com/leafac/kill-the-newsletter.com"
            >Source</a
          >
          · <a href="${ISSUE_REPORT}">Report an Issue</a>
        </p>
      </footer>
      <script src="${BASE_URL}/clipboard.min.js"></script>
      <script src="${BASE_URL}/scripts.js"></script>
    </body>
  </html>`;

  return html.trim();
};

export default layout;
