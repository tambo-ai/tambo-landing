import { NextResponse } from 'next/server'

const WELL_KNOWN_LLMS_SUFFIX = '/.well-known/llms.txt'

function redirect(url: URL) {
  const response = NextResponse.redirect(url, 308)
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'
  )
  return response
}

export function GET(request: Request) {
  const url = new URL(request.url)

  if (!url.pathname.endsWith(WELL_KNOWN_LLMS_SUFFIX)) {
    return redirect(new URL('/llms.txt', url))
  }

  url.pathname = `${url.pathname.slice(0, -WELL_KNOWN_LLMS_SUFFIX.length)}/llms.txt`

  return redirect(url)
}
