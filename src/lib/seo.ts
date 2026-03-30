/**
 * SEO helpers shared across public pages.
 * Keep server-only — no 'use client'.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourportfolio.com'
export const SITE_NAME = 'Designer Portfolio'
export const SITE_DESCRIPTION =
  'Product, Graphics & Motion Designer — pixel-perfect digital experiences.'
export const TWITTER_HANDLE = '@yourhandle'

/** Build a canonical URL for a given path. */
export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Build the openGraph.images array from a Cloudinary URL or fallback.
 * Accepts undefined so callers don't need to guard.
 */
export function ogImages(
  url?: string | null,
): { url: string; width: number; height: number; alt: string }[] {
  if (!url) return []
  return [{ url, width: 1200, height: 630, alt: 'Cover image' }]
}
