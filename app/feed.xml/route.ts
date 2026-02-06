export function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: '/blog/feed.xml',
    },
  })
}
