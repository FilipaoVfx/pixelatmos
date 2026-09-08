/**
 * Regenerates the security-header block at the top of public/_headers from
 * src/config/securityHeaders.ts. Run after changing the policy:
 *   npx tsx scripts/gen-headers.mjs
 * securityHeaders.test.ts fails if the file and the config drift apart.
 */
import fs from 'node:fs';
import { SECURITY_HEADERS } from '../src/config/securityHeaders.ts';

const MARKER = '# --- security headers: generated, do not edit by hand ---';
const END = '# --- end security headers ---';

const block = [
  MARKER,
  '# Astro middleware only runs on SSR routes, and almost every page here is',
  '# prerender = true, so without this the site ships with no CSP at all.',
  '# Source: src/config/securityHeaders.ts · regen: npx tsx scripts/gen-headers.mjs',
  '/*',
  ...Object.entries(SECURITY_HEADERS).map(([k, v]) => `  ${k}: ${v}`),
  END,
];

const path = 'public/_headers';
let existing = fs.readFileSync(path, 'utf8');
const start = existing.indexOf(MARKER);
if (start !== -1) {
  const stop = existing.indexOf(END, start) + END.length;
  existing = (existing.slice(0, start) + existing.slice(stop)).replace(/^\n+/, '');
}
fs.writeFileSync(path, block.join('\n') + '\n\n' + existing);
console.log(`wrote ${Object.keys(SECURITY_HEADERS).length} headers to ${path}`);
