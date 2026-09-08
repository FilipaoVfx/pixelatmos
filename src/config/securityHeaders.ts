/**
 * Security headers — single source of truth.
 *
 * These must be applied twice, because Astro middleware only runs for SSR
 * routes: almost every page here is `prerender = true` and is served straight
 * from Cloudflare's asset store, bypassing middleware entirely. That is why the
 * site shipped with no CSP in production despite middleware.ts setting one.
 *
 *   - SSR routes  -> src/middleware.ts imports these
 *   - Static pages -> public/_headers repeats them literally
 *
 * public/_headers cannot import, so the two are kept in sync by
 * securityHeaders.test.ts, which fails if they drift.
 */

/**
 * AdSense needs more than the loader origin. Ad requests, creative frames and
 * the ad-traffic-quality beacons each come from different Google hosts, so a
 * policy listing only pagead2 blocks ad serving outright.
 */
const ADSENSE_SCRIPT = [
  'https://pagead2.googlesyndication.com',
  'https://partner.googleadservices.com',
  'https://tpc.googlesyndication.com',
  'https://www.googletagservices.com',
  'https://adservice.google.com',
  'https://googleads.g.doubleclick.net',
];

const ADSENSE_FRAME = [
  'https://googleads.g.doubleclick.net',
  'https://tpc.googlesyndication.com',
  'https://www.google.com',
  'https://ep1.adtrafficquality.google',
  'https://ep2.adtrafficquality.google',
];

const ADSENSE_CONNECT = [
  'https://pagead2.googlesyndication.com',
  'https://googleads.g.doubleclick.net',
  'https://ep1.adtrafficquality.google',
  'https://ep2.adtrafficquality.google',
  'https://csi.gstatic.com',
];

export const CSP = [
  "default-src 'self'",
  // Ad creatives pull imagery from arbitrary advertiser hosts, so this stays
  // broad; it is the one directive AdSense makes impossible to pin down.
  "img-src 'self' data: https: blob:",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms ${ADSENSE_SCRIPT.join(' ')}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `connect-src 'self' https://cauitdpbsedajkuodsaf.supabase.co https://openrouter.ai https://*.clarity.ms https://c.bing.com ${ADSENSE_CONNECT.join(' ')}`,
  `frame-src 'self' ${ADSENSE_FRAME.join(' ')}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

/** Every security header, in the order public/_headers lists them. */
export const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};
