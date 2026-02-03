import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { MetadataRoute } from 'next'
import { getBaseUrl } from '~/libs/base-url'

function parseFrontmatter(raw: string): Record<string, string> {
  const result: Record<string, string> = {}

  for (const line of raw.split('\n')) {
    const trimmedLine = line.trim()
    if (!trimmedLine) {
      break
    }

    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(trimmedLine)
    if (!match) continue

    const [, key, valueRaw] = match
    const value = valueRaw.trim()

    const unquoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
        ? value.slice(1, -1)
        : value

    result[key] = unquoted
  }

  return result
}

function parseBlogDate(raw: string): Date | null {
  const date = new Date(`${raw}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

async function getBlogPostSlugsAndDates(): Promise<
  Array<{ slug: string; date: string }>
> {
  const postsDir = path.join(process.cwd(), 'app', 'blog', 'posts')
  const entries = await readdir(postsDir, { withFileTypes: true })

  const slugs = entries
    .filter((entry) => entry.isDirectory())
    .map((d) => d.name)
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const mdxPath = path.join(postsDir, slug, 'page.mdx')
      let content: string
      try {
        content = await readFile(mdxPath, 'utf8')
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          error.code === 'ENOENT'
        ) {
          return null
        }

        console.warn(`Failed to read blog post for sitemap: ${mdxPath}`, error)
        return null
      }

      const frontmatterMatch = /^---\n([\s\S]*?)\n---\n/m.exec(content)
      if (!frontmatterMatch) return null

      const frontmatter = parseFrontmatter(frontmatterMatch[1])
      const date = frontmatter.date
      if (typeof date !== 'string' || !date) return null

      if (!parseBlogDate(date)) {
        return null
      }

      return { slug, date }
    })
  )

  return posts.filter(
    (post): post is { slug: string; date: string } => post !== null
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl({ requireInProduction: true })

  const posts = await getBlogPostSlugsAndDates()

  const blogPosts = posts.flatMap((post) => {
    const parsedDate = parseBlogDate(post.date)
    if (!parsedDate) return []

    return [
      {
        url: `${baseUrl}/blog/posts/${post.slug}`,
        lastModified: parsedDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ]
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  return [...staticRoutes, ...blogPosts]
}
