import * as sanitizeXMLString from 'sanitize-xml-string';
import * as entities from 'entities';

import config from '../config';

const {
  baseUrl: BASE_URL,
  emailDomain: EMAIL_DOMAIN,
} = config;

export const now = (): string => new Date().toISOString();

export const feedFilePath = (identifier: string): string => `static/feeds/${identifier}.xml`;

export const feedURL = (identifier: string): string => `${BASE_URL}/feeds/${identifier}.xml`;

export const feedEmail = (identifier: string): string => `${identifier}@${EMAIL_DOMAIN}`;

export const alternateURL = (
  feedIdentifier: string,
  entryIdentifier: string,
): string => `${BASE_URL}/alternate/${feedIdentifier}/${entryIdentifier}`;

export const urn = (identifier: string): string => `urn:kill-the-newsletter:${identifier}`;

export const X = (string: string): string => entities
  .encodeXML(sanitizeXMLString.sanitize(string));

export const H = (string: string): string => entities
  .encodeHTML(sanitizeXMLString.sanitize(string));
