import { redirect } from 'next/navigation'

export function GET() {
  redirect('/blog/feed.xml')
}
