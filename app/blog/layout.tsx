import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Theme } from '~/app/(pages)/_components/theme'
import { BlogFooter } from '~/components/blog/blog-footer'
import { BlogNavWrapper } from '~/components/blog/blog-nav-wrapper'

export const metadata: Metadata = {
  title: {
    template: '%s | tambo blog',
    default: 'blog',
  },
  description:
    'Latest updates, tutorials, and insights about tambo - the AI orchestration framework for React frontends.',
}

interface BlogLayoutProps {
  children: ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <Theme theme="light" global>
      <div className="min-h-dvh flex flex-col bg-white">
        <BlogNavWrapper />
        <main className="flex-1 dr-pt-80">{children}</main>
        <BlogFooter />
      </div>
    </Theme>
  )
}
