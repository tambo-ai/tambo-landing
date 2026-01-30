import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "~/libs/blog/format-date";

interface BlogPostProps {
  children: React.ReactNode;
  title?: string;
  author?: string;
  date?: string;
  frontmatter?: {
    title?: string;
    author?: string;
    date?: string;
  };
}

export function BlogPost({
  children,
  title: titleProp,
  author: authorProp,
  date: dateProp,
  frontmatter,
}: BlogPostProps) {
  const title = titleProp ?? frontmatter?.title;
  const author = authorProp ?? frontmatter?.author;
  const rawDate = dateProp ?? frontmatter?.date;
  const date = rawDate ? formatDate(rawDate) : undefined;

  return (
    <article
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f9f7",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: "#1a2e28",
      }}
    >
      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "2rem 1.5rem 5rem",
        }}
      >
        {/* Breadcrumb Navigation */}
        <nav style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              fontSize: "0.9375rem",
            }}
          >
            <Link
              href="/"
              style={{
                color: "#5d7a72",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              Home
            </Link>
            <ChevronRight style={{ width: "1rem", height: "1rem", color: "#8aa8a0" }} />
            <Link
              href="/blog"
              style={{
                color: "#5d7a72",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              Blog
            </Link>
            {title && (
              <>
                <ChevronRight style={{ width: "1rem", height: "1rem", color: "#8aa8a0" }} />
                <span
                  style={{
                    color: "#1a2e28",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "220px",
                  }}
                >
                  {title}
                </span>
              </>
            )}
          </div>
        </nav>

        {/* Title */}
        {title && (
          <h1
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
              marginBottom: "1.75rem",
              marginTop: "1.5rem",
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              color: "#1a2e28",
            }}
          >
            {title}
          </h1>
        )}

        {/* Author and Date Badge */}
        {(author || date) && (
          <div style={{ marginBottom: "3rem", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#e8f3ef",
                borderRadius: "9999px",
                fontSize: "0.9375rem",
                border: "1px solid #d4e5df",
              }}
            >
              {author && (
                <span style={{ fontWeight: 500, color: "#1a2e28" }}>By {author}</span>
              )}
              {author && date && (
                <span style={{ color: "#8aa8a0" }}>•</span>
              )}
              {date && (
                <span style={{ color: "#5d7a72", fontWeight: 500 }}>{date}</span>
              )}
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="blog-prose">{children}</div>
      </div>
    </article>
  );
}
