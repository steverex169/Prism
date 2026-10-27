import * as React from 'react';
import { render } from '@react-email/render';

/**
 * Render any email component to { html, text } ready for your mail provider.
 *
 *   const { html, text } = await renderEmail(OrderShipped, { firstName: 'Amelia', ... });
 */
export async function renderEmail<P extends object>(Component: React.ComponentType<P>, props: P) {
  const element = React.createElement(Component, props);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  return { html, text };
}
