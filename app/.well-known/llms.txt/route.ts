import { NextResponse } from 'next/server'

const WELL_KNOWN_LLMS_SUFFIX = '/.well-known/llms.txt'

export function GET(request: Request) {
  const url = new URL(request.url)

  if (url.pathname.endsWith(WELL_KNOWN_LLMS_SUFFIX)) {
    url.pathname = `${url.pathname.slice(0, -WELL_KNOWN_LLMS_SUFFIX.length)}/llms.txt`
  } else {
    url.pathname = '/llms.txt'
  }

  return NextResponse.redirect(url, 308)
}
