// Backend-only stdin/stdout bridge. Never imported by the browser application.
import { readFileSync } from 'node:fs';
import { createElement, type ComponentType } from 'react';
import { render } from '@react-email/render';
import { templates, type TemplateName } from './registry';
import { brand } from './theme';

async function main() {
  const request = JSON.parse(readFileSync(0, 'utf8')) as {
    template: TemplateName; props: Record<string, unknown>; siteUrl?: string; supportEmail?: string;
  };
  if (!Object.hasOwn(templates, request.template)) throw new Error('Unknown email template');
  if (request.siteUrl) {
    const url = new URL(request.siteUrl);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid site URL');
    brand.siteUrl = url.origin + '/';
    brand.accountUrl = url.origin + '/account';
  }
  if (request.supportEmail) brand.supportEmail = request.supportEmail;
  const entry = templates[request.template];
  // The Python event adapters provide the fields required by each template.
  const Component = entry.default as unknown as ComponentType<Record<string, unknown>>;
  const subject = entry.subject as (props: Record<string, unknown>) => string;
  const element = createElement(Component, request.props);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  process.stdout.write(JSON.stringify({ subject: subject(request.props), html, text }));
}

main().catch(() => { process.stderr.write('Email rendering failed\n'); process.exitCode = 1; });
