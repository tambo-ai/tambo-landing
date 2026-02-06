import { NextResponse } from 'next/server'

export function GET(request: Request) {
  const target = new URL('/llms.txt', request.url)
  // Permanent redirect to a canonical URL; strip query params to avoid variants.
  target.search = ''
  return NextResponse.redirect(target, 308)
}
