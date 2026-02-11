import { BlogPost } from './blog-post'

interface BlogPostWithFrontmatterProps {
  children: React.ReactNode
  meta: {
    title?: string
    description?: string
    author?: string
    date?: string
    /** OG/twitter card image path (e.g. /assets/blog/slug/og.jpg). Omit to use site default. */
    image?: string
  }
}

/**
 * BlogPostWithFrontmatter component for MDX blog posts.
 *
 * Receives frontmatter via the `meta` prop. Frontmatter is exported by remark-mdx-frontmatter
 * and this layout is injected by remarkInjectBlogLayout—no manual import needed.
 *
 * MDX frontmatter for posts under /blog/posts/:
 *
 * ---
 * title: "Post Title"           # Required. Used in layout and as og:title / twitter:title.
 * date: "2026-02-10"            # Required. ISO date or YYYY-MM-DD.
 * description: "One or two sentences for SEO and social previews (og:description)."
 * author: "Author Name"
 * image: "/assets/blog/slug/og.jpg"   # Optional. 1200×630 for best results. Omit for site default.
 * ---
 *
 * The plugin wraps each post with this component automatically.
 */
export function BlogPostWithFrontmatter({
  children,
  meta,
}: BlogPostWithFrontmatterProps) {
  return <BlogPost frontmatter={meta}>{children}</BlogPost>
}
