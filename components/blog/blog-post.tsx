import { ChevronRight } from 'lucide-react'
import { Link } from '~/components/link'
import { formatDate } from '~/libs/blog/format-date'
import type { BlogPostMeta } from '~/libs/blog/types'

interface BlogPostProps {
  children: React.ReactNode
  meta?: BlogPostMeta
}

export function BlogPost({ children, meta }: BlogPostProps) {
  const title = typeof meta?.title === 'string' ? meta.title : undefined
  const author = typeof meta?.author === 'string' ? meta.author : undefined
  const rawDate = typeof meta?.date === 'string' ? meta.date : undefined
  const date = rawDate ? formatDate(rawDate) : undefined

  return (
    <article className="min-h-dvh dr-layout-grid-inner dr-py-32">
      <div className="col-span-full dt:col-start-4 dt:col-end-10">
        {/* Back Navigation */}
        <nav className="dr-mb-40">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 typo-p dr-text-14 text-black no-underline hover:text-forest transition-colors duration-150"
          >
            <ChevronRight className="dr-size-16 rotate-180" />
            Back to Blog
          </Link>
        </nav>

        {/* Title */}
        {title && (
          <h1 className="typo-h1 dr-text-36 dt:dr-text-52 text-center dr-mb-24 dr-mt-24 text-balance">
            {title}
          </h1>
        )}

        {/* Author and Date Badge */}
        {(author || date) && (
          <div className="dr-mb-48 text-center">
            <div className="inline-flex items-center dr-gap-16 dr-px-24 dr-py-12 bg-white rounded-full typo-p dr-text-14 border border-dark-grey">
              {author && (
                <span className="font-medium text-black">By {author}</span>
              )}
              {author && date && <span className="text-black">•</span>}
              {date && <span className="text-black font-medium">{date}</span>}
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="blog-prose">{children}</div>
      </div>
    </article>
  )
}
