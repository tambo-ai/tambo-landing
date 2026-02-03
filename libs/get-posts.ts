import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'
import { BLOG_DEFAULTS } from './blog/defaults'
import type { BlogCategory, BlogPostListItem } from './blog/types'

const BLOG_CATEGORIES: readonly BlogCategory[] = [
  'new',
  'feature',
  'bug fix',
  'update',
  'event',
  'tutorial',
  'announcement',
]

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Define our blog post types
export interface BlogFrontMatter {
  title: string
  date: string
  description?: string
  author?: string
  category?: BlogCategory
}

export interface BlogPost {
  name: string
  route: string
  frontMatter: BlogFrontMatter
  content: string
}

export async function getPosts(): Promise<BlogPost[]> {
  const pageMap = await getPageMap('/blog/posts')
  const { directories } = normalizePages({
    list: pageMap,
    route: '/blog/posts',
  })

  const posts = directories
    .filter((item: { name?: string }) => item.name !== 'index')
    .map((item): BlogPost | null => {
      const frontMatter = item.frontMatter
      if (!isPlainObject(frontMatter)) {
        return null
      }

      const title =
        typeof frontMatter.title === 'string' ? frontMatter.title : null
      const date =
        typeof frontMatter.date === 'string' ? frontMatter.date : null
      if (!(title && date)) {
        return null
      }

      const description =
        typeof frontMatter.description === 'string'
          ? frontMatter.description
          : undefined

      const author =
        typeof frontMatter.author === 'string'
          ? frontMatter.author
          : BLOG_DEFAULTS.author

      const categoryRaw =
        typeof frontMatter.category === 'string' ? frontMatter.category : null
      const category =
        categoryRaw && BLOG_CATEGORIES.includes(categoryRaw as BlogCategory)
          ? (categoryRaw as BlogCategory)
          : undefined

      return {
        name: item.name,
        route: item.route,
        content: (item as unknown as { content?: string }).content || '',
        frontMatter: {
          title,
          date,
          description,
          author,
          category,
        },
      }
    })
    .filter((post): post is BlogPost => post !== null)
    .toSorted(
      (a, b) =>
        new Date(b.frontMatter.date).getTime() -
        new Date(a.frontMatter.date).getTime()
    )

  return posts
}

// Transform posts to BlogPostListItem format
export async function getPostListItems(): Promise<BlogPostListItem[]> {
  const posts = await getPosts()

  return posts.map((post) => {
    const slug = post.name
    // Use explicit frontmatter category or default to "update"
    const category = post.frontMatter.category ?? 'update'

    return {
      id: slug,
      slug,
      title: post.frontMatter.title,
      category,
      date: post.frontMatter.date,
      description: post.frontMatter.description,
      author: post.frontMatter.author,
    }
  })
}
