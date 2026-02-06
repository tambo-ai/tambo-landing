import { NextResponse } from 'next/server'

export function GET(request: Request) {
  const target = new URL('/llms.txt', request.url)
  target.search = ''
  return NextResponse.redirect(target, 308)
}
