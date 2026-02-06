import { NextResponse } from 'next/server'

export function GET(request: Request) {
  const target = new URL('/llms.txt', request.url)
  // Strip query params to keep the well-known endpoint canonical.
  target.search = ''
  return NextResponse.redirect(target, 308)
}
