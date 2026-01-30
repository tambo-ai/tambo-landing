"use client";

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
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <article
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "1.75rem",
          backgroundColor: "#e8f3ef",
          border: "1px solid #d4e5df",
          borderRadius: "0.875rem",
          transition: "all 0.2s ease",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.06)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = "#c4d8d0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "#d4e5df";
        }}
      >
        <h3 
          style={{ 
            fontSize: "1.1875rem",
            fontWeight: 600,
            color: "#1a2e28",
            marginBottom: "0.75rem",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
          }}
        >
          {post.title}
        </h3>
        {post.description && (
          <p 
            style={{ 
              fontSize: "0.9375rem",
              color: "#4a6860",
              lineHeight: 1.65,
              marginBottom: "1.25rem",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.description}
          </p>
        )}
        <div 
          style={{ 
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8125rem",
            color: "#5d7a72",
            marginTop: "auto",
            paddingTop: "0.5rem",
          }}
        >
          {post.author && (
            <>
              <span style={{ fontWeight: 500 }}>{post.author}</span>
              <span style={{ opacity: 0.5 }}>•</span>
            </>
          )}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </article>
    </Link>
  );
}
