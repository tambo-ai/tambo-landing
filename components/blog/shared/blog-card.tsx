import { Link } from '~/components/link'
import { formatDate } from '~/libs/blog/format-date'
import type { BlogPostListItem } from '~/libs/blog/types'

interface BlogCardProps {
  post: BlogPostListItem
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/posts/${post.slug}`}
      className="group block no-underline"
    >
      <article className="dr-p-24 bg-white border border-dark-grey dr-rounded-20 transition-shadow duration-150 group-hover:shadow-[0_0_24px_8px_rgba(127,255,195,0.7)]">
        <h3 className="typo-h3 dr-text-28 text-black text-balance dr-mb-12">
          {post.title}
        </h3>
        {post.description && (
          <p className="typo-p dr-text-16 text-black text-pretty dr-mb-16">
            {post.description}
          </p>
        )}
        <div className="flex items-center justify-between typo-p dr-text-14 text-black">
          {post.author && <span>{post.author}</span>}
          <time dateTime={post.date} className="ml-auto">
            {formatDate(post.date)}
          </time>
        </div>
      </article>
    </Link>
  )
}
