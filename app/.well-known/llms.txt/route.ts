import { NextResponse } from 'next/server'

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

  url.pathname = '/llms.txt'
  url.search = ''
  url.hash = ''

  return redirect(url)
}
