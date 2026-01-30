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
    <div className="blog-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <div className="blog-page-container">
        {/* Header */}
        <header className="blog-page-header">
          <h1 className="blog-page-title">tambo updates</h1>
          <p className="blog-page-subtitle">
            Latest features, fixes, changes, and events from the tambo team.
          </p>
        </header>

        {/* Search */}
        <div className="blog-page-search-wrapper">
          <BlogSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Results Count */}
        <p className="blog-page-count">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
        </p>

        {/* Posts Grid - 2 columns */}
        <div className="blog-page-grid">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="blog-page-empty">
            <p>No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
