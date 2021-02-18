import * as sanitizeXMLString from 'sanitize-xml-string';
import * as entities from 'entities';

const sanitiseHtml = (string: string): string => entities
  .encodeHTML(sanitizeXMLString.sanitize(string));

export default sanitiseHtml;
