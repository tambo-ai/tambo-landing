# Blog AGENTS.md

This file provides detailed guidance for AI agents working with the Tambo blog system.

## Technology Stack

**MDX Processing:**

- **Nextra** - Primary MDX framework that handles blog post compilation and metadata extraction
- **remark-mdx-frontmatter** - Exports frontmatter as JavaScript variables
- **remarkInjectBlogLayout** - Custom plugin that auto-injects BlogPost wrapper for posts under `/blog/posts/`
- **rehype-pretty-code** - Syntax highlighting with Shiki (themes: github-light/github-dark)
- **rehype-katex** - Math equation rendering
- **remark-gfm** - GitHub Flavored Markdown support

**Frontend:**

- Next.js 16 App Router
- React 19.2
- Tailwind CSS 4
- Client-side filtering/sorting (BlogPage is "use client")

**Configuration:**

- MDX config in `next.config.ts` (Nextra wrapper with remark/rehype plugins)
- Syntax highlighting: github-light/github-dark themes
- keepBackground: false (styling handled by CSS)

## File Structure

```
app/blog/
├── layout.tsx                    # Blog layout with header/footer
├── page.tsx                      # Blog list page (server component)
├── posts/
│   ├── ai-powered-spreadsheet/page.mdx
│   ├── llm-web-apps/page.mdx
│   ├── mcp-sampling-support/page.mdx
│   ├── tambo-hack/page.mdx
│   ├── tambo-with-tambo/page.mdx
│   └── what-is-generative-ui/page.mdx
├── CLAUDE.md                     # Pointer file
└── AGENTS.md                     # This file

components/blog/
├── blog-page.tsx                 # Client component with search/filter/sort
├── blog-post.tsx                 # Individual post wrapper
├── blog-post-wrapper.tsx         # Wrapper that receives frontmatter from plugin
├── blog-header.tsx
├── list/
│   ├── blog-filters.tsx          # Category filters
│   ├── blog-search.tsx           # Search input
│   └── blog-sort.tsx             # Sort dropdown
└── shared/
    ├── blog-card.tsx             # Post card component
    ├── blog-badge.tsx            # Category badge
    └── featured-post-card.tsx    # Featured post display

libs/
├── get-posts.ts                  # Uses Nextra's getPageMap() API
├── schema.ts                     # Zod schemas for blog types
└── mdx/
    └── inject-blog-layout.mjs    # Custom remark plugin for auto-injecting BlogPost wrapper

styles/css/
├── highlight-custom.css          # Shiki syntax highlighting styles
└── blog-variables.css            # Blog prose styles
```

## How Blog Posts Work

### Post Discovery

1. Nextra scans `app/blog/posts/` directory
2. `getPageMap("/blog/posts")` in `libs/get-posts.ts` returns all posts
3. `normalizePages()` extracts frontmatter and metadata
4. Posts rendered via `app/blog/page.tsx` calling `BlogPage` component

### Automatic Layout Injection

The `remarkInjectBlogLayout` plugin automatically wraps all MDX files under `/blog/posts/` with the BlogPost component. You don't need to add any import or export statements.

**Write blog posts like this:**

```mdx
---
title: "Post Title"
date: "2025-10-30"
description: "Brief description"
author: "Author Name"
---

Your content here...
```

The plugin automatically injects:

```tsx
import { BlogPostWithFrontmatter as BlogPost } from "~/components/blog/blog-post-wrapper";

export default function Layout(props) {
  return <BlogPost meta={frontmatter}>{props.children}</BlogPost>;
}
```

### How It Works

1. **remark-mdx-frontmatter** plugin parses YAML frontmatter and exports it as `frontmatter` variable
2. **remarkInjectBlogLayout** plugin (in `libs/mdx/inject-blog-layout.mjs`):
   - Detects if file is under `/blog/posts/`
   - Checks if it already has a layout export (to avoid double-wrapping)
   - Injects the import and default export
3. `BlogPostWithFrontmatter` receives frontmatter via `meta` prop
4. Wrapper passes it to `BlogPost` component which renders title, author, date

### MDX Components

Custom components available in MDX via `mdx-components.tsx`:

- `<BlogPost>` - Wraps post content with layout, breadcrumbs, title, author/date
- `<ImageZoom>` - Zoomable images
- Standard HTML elements with custom Tailwind styling

Code blocks are styled via CSS (`styles/css/highlight-custom.css`), not inline Tailwind.

## CSS Structure

### highlight-custom.css

Handles all code block and syntax highlighting styles:

- `pre` - Code block container (dark background, padding, border-radius)
- `code` - Base code styling
- `pre code span` - Shiki syntax highlighting via CSS variables (`--shiki-dark`, `--shiki-light`)
- `:not(pre) > code` - Inline code styling
- Line numbers, highlighted lines, highlighted characters support
- Custom scrollbar styling

### blog-variables.css

Blog-specific prose styles (`.blog-prose` class):

- Typography (headings, paragraphs, links)
- Lists and blockquotes
- Horizontal rules and images

## Best Practices

### Adding New Posts

1. Create new directory: `app/blog/posts/{slug}/`
2. Add `page.mdx` with frontmatter only (no imports needed)
3. Images go in `/public/` or `/public/assets/blog/{slug}/`
4. Use code blocks with language: \`\`\`tsx or \`\`\`bash

### Code Blocks

Use fenced code blocks with language identifier:

````markdown
```tsx
export function Example() {
  return <div>Hello</div>;
}
```
````

Syntax highlighting is handled by rehype-pretty-code with Shiki.

### Styling

- Tailwind utilities for layout
- Custom MDX component styling in `mdx-components.tsx`
- Code block styling in `styles/css/highlight-custom.css`
- Blog prose styling in `styles/css/blog-variables.css`

## Development Commands

```bash
bun dev              # Start dev server
bun run build        # Build for production
bun lint             # Check code quality (Biome)
```

## Related Files

- `next.config.ts` - Nextra and rehype plugin configuration
- `mdx-components.tsx` - Custom MDX component definitions
- `components/blog/blog-post.tsx` - Main blog post wrapper
- `components/blog/blog-post-wrapper.tsx` - Frontmatter injection wrapper
- `libs/mdx/inject-blog-layout.mjs` - Auto-inject plugin
- `styles/css/highlight-custom.css` - Code block CSS
- `styles/css/blog-variables.css` - Blog prose CSS
