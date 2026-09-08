import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { SECURITY_HEADERS, CSP } from './securityHeaders';

/**
 * public/_headers cannot import TypeScript, so it repeats the policy literally.
 * These tests are the guard against the two drifting apart — the same class of
 * bug that left the nav and sidebar with different tool lists.
 */
const headersFile = fs.readFileSync('public/_headers', 'utf8');

describe('public/_headers stays in sync with securityHeaders.ts', () => {
  it('contains every header with the exact value', () => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(headersFile, `${name} missing or stale in public/_headers — run: npx tsx scripts/gen-headers.mjs`).toContain(`  ${name}: ${value}`);
    }
  });

  it('applies them to every path', () => {
    expect(headersFile).toContain('/*');
  });
});

describe('CSP allows what the site actually loads', () => {
  // A CSP that blocks ad serving would cost real revenue, so the AdSense hosts
  // are asserted explicitly rather than trusted to survive future edits.
  it.each([
    ['pagead2.googlesyndication.com', 'AdSense loader'],
    ['googleads.g.doubleclick.net', 'ad requests and creative frames'],
    ['tpc.googlesyndication.com', 'creative rendering'],
    ['ep1.adtrafficquality.google', 'ad traffic quality beacons'],
  ])('allows %s (%s)', (host) => {
    expect(CSP).toContain(host);
  });

  it('keeps the existing third parties working', () => {
    for (const host of ['www.googletagmanager.com', 'clarity.ms', 'supabase.co', 'openrouter.ai', 'fonts.gstatic.com']) {
      expect(CSP).toContain(host);
    }
  });

  it('keeps the directives that cost nothing and block real attacks', () => {
    expect(CSP).toContain("object-src 'none'");
    expect(CSP).toContain("base-uri 'self'");
    expect(CSP).toContain("form-action 'self'");
    expect(CSP).toContain("frame-ancestors 'self'");
  });

  it('does not fall back to a wildcard script-src', () => {
    expect(CSP).not.toMatch(/script-src[^;]*\*/);
  });
});
