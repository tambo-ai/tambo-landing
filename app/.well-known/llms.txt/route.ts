import { NextResponse } from 'next/server'

const WELL_KNOWN_LLMS_SUFFIX = '/.well-known/llms.txt'

export function GET(request: Request) {
  const url = new URL(request.url)

  const suffixIndex = url.pathname.lastIndexOf(WELL_KNOWN_LLMS_SUFFIX)
  if (suffixIndex >= 0) {
    url.pathname = `${url.pathname.slice(0, suffixIndex)}/llms.txt`
  } else {
    url.pathname = '/llms.txt'
  }

  const response = NextResponse.redirect(url, 308)
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'
  )
  return response
}
