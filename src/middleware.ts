import { defineMiddleware } from 'astro:middleware';
import { SECURITY_HEADERS } from './config/securityHeaders';

/**
 * Security headers for SSR routes only.
 *
 * Prerendered pages never reach this middleware — Cloudflare serves them from
 * the asset store — so public/_headers carries the same set for those. Both
 * read from the same source of truth (src/config/securityHeaders.ts) and
 * securityHeaders.test.ts fails if they drift apart.
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
});
