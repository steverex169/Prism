import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createElement, type ComponentType } from 'react';
import { render } from '@react-email/render';
import { templates } from './registry';

const directory = resolve('email-preview');
await mkdir(directory, { recursive: true });
for (const [name, entry] of Object.entries(templates)) {
  const component = entry.default as unknown as ComponentType<Record<string, unknown>>;
  const html = await render(createElement(component, entry.default.PreviewProps));
  await writeFile(resolve(directory, `${name}.html`), html);
}
process.stdout.write(`Rendered ${Object.keys(templates).length} emails to ${directory}\n`);
