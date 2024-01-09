import { ServerStyleSheet } from 'styled-components';
import { renderToString } from 'react-dom/server';

export default function getHtmlString(Component: JSX.Element) {
  const sheet = new ServerStyleSheet();
  const htmlString = renderToString(Component);
  const styleTags = sheet.getStyleTags();

  return `${htmlString}${styleTags}`;
}
