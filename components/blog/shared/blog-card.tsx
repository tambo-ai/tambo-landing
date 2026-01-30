import type { BlogPostListItem } from "~/libs/blog/types";
import { formatDate } from "~/libs/blog/format-date";
import Link from "next/link";

interface BlogCardProps {
  post: BlogPostListItem;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/posts/${post.slug}`} className="blog-card-link">
      <article className="blog-card">
        <h3 className="blog-card-title">{post.title}</h3>
        {post.description && (
          <p className="blog-card-description">{post.description}</p>
        )}
        <div className="blog-card-meta">
          {post.author && (
            <>
              <span className="blog-card-author">{post.author}</span>
              <span className="blog-card-separator">•</span>
            </>
          )}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </article>
    </Link>
  );
}
