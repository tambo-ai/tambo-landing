import { NextResponse } from 'next/server'

export function GET(request: Request) {
  const target = new URL('/llms.txt', request.url)
  // Permanent redirect to a canonical URL; strip query params to avoid variants.
  target.search = ''

  const res = NextResponse.redirect(target, 308)
  res.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=2592000')
  return res
}
