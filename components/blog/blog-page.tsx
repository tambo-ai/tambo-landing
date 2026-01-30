"use client";

import { BlogSearch } from "~/components/blog/list/blog-search";
import { BlogCard } from "~/components/blog/shared/blog-card";
import type { BlogPostListItem } from "~/libs/blog/types";
import { useMemo, useState } from "react";

interface BlogPageProps {
  posts: BlogPostListItem[];
}

export function BlogPage({ posts }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const query = searchQuery.toLocaleLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLocaleLowerCase().includes(query) ||
        post.description?.toLocaleLowerCase().includes(query),
    );
  }, [posts, searchQuery]);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://tambo.co";

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "tambo Blog",
    description: "Latest updates, tutorials, and insights about tambo.",
    url: `${baseUrl}/blog`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      author: { "@type": "Person", name: post.author || "tambo team" },
      datePublished: post.date,
      url: `${baseUrl}/blog/posts/${post.slug}`,
    })),
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f9f7",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontSize: "2.75rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: "0.875rem",
              color: "#1a2e28",
              lineHeight: 1.15,
            }}
          >
            tambo updates
          </h1>
          <p style={{ color: "#5d7a72", fontSize: "1.0625rem", lineHeight: 1.6 }}>
            Latest features, fixes, changes, and events from the tambo team.
          </p>
        </header>

        {/* Search */}
        <div style={{ maxWidth: "32rem", margin: "0 auto 2rem auto" }}>
          <BlogSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Results Count */}
        <p
          style={{
            fontSize: "0.9375rem",
            color: "#5d7a72",
            marginBottom: "1.5rem",
          }}
        >
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
        </p>

        {/* Posts Grid - 2 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.25rem",
          }}
        >
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ color: "#5d7a72" }}>No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
