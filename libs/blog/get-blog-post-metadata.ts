import type { Metadata } from 'next'

const DEFAULT_OG_IMAGE = '/opengraph-image.jpg?v=3'
const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630

export interface BlogPostFrontmatterForMetadata {
  title?: string
  description?: string
  author?: string
  date?: string
  image?: string
}

/**
 * Builds Next.js Metadata for a blog post so shared links get proper
 * Open Graph and Twitter card previews (title, description, image).
 */
export function getBlogPostMetadata(
  frontmatter: BlogPostFrontmatterForMetadata = {}
): Metadata {
  const title = frontmatter.title ?? 'Blog'
  const description = frontmatter.description ?? undefined
  const imagePath =
    frontmatter.image && frontmatter.image.trim() !== ''
      ? frontmatter.image.trim()
      : DEFAULT_OG_IMAGE

  const ogImage = {
    url: imagePath,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: title,
  }

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: frontmatter.date ?? undefined,
      authors: frontmatter.author ? [frontmatter.author] : undefined,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imagePath],
    },
  }
}
