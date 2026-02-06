import { NextResponse } from 'next/server'

// Caching for the llms.txt discovery redirect (llms.txt changes roughly monthly).
// - Browser: 7 days (preserves flexibility if redirect behavior needs to change)
// - Edge: 30 days
// Note: intentionally omit `immutable` so we can update redirect behavior within weeks if needed.
const REDIRECT_CACHE_BROWSER_DAYS = 7
const REDIRECT_CACHE_EDGE_DAYS = 30
const REDIRECT_CACHE_BROWSER_SECONDS = REDIRECT_CACHE_BROWSER_DAYS * 24 * 60 * 60
const REDIRECT_CACHE_EDGE_SECONDS = REDIRECT_CACHE_EDGE_DAYS * 24 * 60 * 60
const REDIRECT_CACHE_CONTROL = `public, max-age=${REDIRECT_CACHE_BROWSER_SECONDS}, s-maxage=${REDIRECT_CACHE_EDGE_SECONDS}`

export function GET(request: Request) {
  const target = new URL('/llms.txt', request.url)
  // Permanent redirect to a canonical URL; strip query params to avoid variants.
  target.search = ''

  const res = NextResponse.redirect(target, 308)
  res.headers.set('Cache-Control', REDIRECT_CACHE_CONTROL)
  return res
}
