import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { PUBLISHER_ID, AD_CLIENT, AD_LOADER_SRC, ADS_TXT } from './adsense';

/**
 * public/ads.txt cannot import TypeScript, so it is generated. These tests are
 * the guard: a publisher ID that disagrees with the AdSense account stops ads
 * serving, and it fails silently — no build error, no console warning.
 */
describe('AdSense publisher ID is consistent everywhere', () => {
  it('ads.txt matches the configured publisher', () => {
    const file = fs.readFileSync('public/ads.txt', 'utf8').trim();
    expect(file, 'public/ads.txt is stale — run: npx tsx scripts/gen-ads-txt.mjs').toBe(ADS_TXT);
  });

  it('no layout or component hardcodes an ID of its own', () => {
    for (const path of ['src/layouts/AppLayout.astro', 'src/layouts/Layout.astro', 'src/components/AdUnit.astro']) {
      const src = fs.readFileSync(path, 'utf8');
      expect(src, `${path} hardcodes a publisher ID instead of importing from config/adsense`).not.toMatch(/ca-pub-\d+/);
    }
  });

  it('derives the client ID and loader from one publisher ID', () => {
    expect(AD_CLIENT).toBe(`ca-${PUBLISHER_ID}`);
    expect(AD_LOADER_SRC).toContain(AD_CLIENT);
  });

  it('ads.txt uses the format Google parses', () => {
    // domain, publisher id, relationship, TAG ID
    expect(ADS_TXT).toMatch(/^google\.com, pub-\d+, DIRECT, f08c47fec0942fa0$/);
  });
});
