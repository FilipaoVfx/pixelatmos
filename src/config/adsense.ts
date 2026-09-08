/**
 * AdSense configuration — single source of truth for the publisher ID.
 *
 * The ID appears in four places (both layouts, AdUnit.astro and
 * public/ads.txt) and a mismatch between any of them and the AdSense account
 * stops ads serving entirely. That already happened once: the site shipped
 * with a previous owner's ID while a different account was under review, and
 * the review sat stalled for weeks.
 *
 * public/ads.txt cannot import, so scripts/gen-ads-txt.mjs writes it from here
 * and adsense.test.ts fails if the two drift.
 *
 * To move to a different AdSense account, change PUBLISHER_ID and run:
 *   npx tsx scripts/gen-ads-txt.mjs
 */

/** Publisher ID without the "ca-" prefix, as it appears in ads.txt. */
export const PUBLISHER_ID = 'pub-1028294908787451';

/** Client ID as the ad tag and <ins> elements expect it. */
export const AD_CLIENT = `ca-${PUBLISHER_ID}`;

/** The AdSense loader URL for this publisher. */
export const AD_LOADER_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;

/**
 * ads.txt content. The trailing TAG ID is Google's, identical for every
 * AdSense publisher — it is not account-specific.
 */
export const ADS_TXT = `google.com, ${PUBLISHER_ID}, DIRECT, f08c47fec0942fa0`;

/**
 * Ad slots created in the AdSense dashboard.
 *
 * Slot IDs belong to the publisher that created them — the ones below were
 * made under a different account and will not fill. Create the unit again in
 * this account and replace the value; until then the slot renders nothing,
 * which AdUnit collapses so no gap appears.
 */
export const AD_SLOTS = {
  /** Responsive display unit used on article and wallpaper pages. TODO: recreate under pub-1028294908787451. */
  inArticle: '7346728233',
} as const;
