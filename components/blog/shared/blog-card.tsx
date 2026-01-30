import type { BlogPostListItem } from "~/libs/blog/types";
import { formatDate } from "~/libs/blog/format-date";
import Link from "next/link";

interface BlogCardProps {
  post: BlogPostListItem;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/posts/${post.slug}`}
      className="block no-underline text-inherit"
    >
      <article
        className="flex flex-col h-full p-7 bg-[#e8f3ef] border border-[#d4e5df] rounded-[0.875rem] transition-all duration-200 ease-out cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:border-[#c4d8d0]"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        <h3 className="text-[1.1875rem] font-semibold text-[#1a2e28] mb-3 leading-[1.35] tracking-[-0.01em]">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-[0.9375rem] text-[#4a6860] leading-[1.65] mb-5 line-clamp-3">
            {post.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-[0.8125rem] text-[#5d7a72] mt-auto pt-2">
          {post.author && (
            <>
              <span className="font-medium">{post.author}</span>
              <span className="opacity-50">•</span>
            </>
          )}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </article>
    </Link>
  );
}
