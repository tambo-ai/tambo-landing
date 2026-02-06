/**
 * Generates llms-full.txt from site content sources:
 * - Blog posts (MDX files with frontmatter)
 * - Marketing copy from canonical data modules
 * - Base llms.txt content
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'

import matter from 'gray-matter'

// NOTE: These content modules must remain pure (no browser-only imports), since this
// script runs in a Node environment during `bun run build`.
import {
  contactPageContent,
  valueProps,
} from '../app/(pages)/contact-us/content'
import { featureButtons } from '../app/(pages)/home/_sections/features-section/content'
import { heroContent } from '../app/(pages)/home/_sections/hero/content'
import { howItWorksContent } from '../app/(pages)/home/_sections/how-it-works/content'
import { cards as meetTamboCards } from '../app/(pages)/home/_sections/meet-tambo/content'
import {
  banner as pricingBanner,
  pricingCards,
} from '../app/(pages)/home/_sections/pricing/content'
import { showcaseCards } from '../app/(pages)/home/_sections/showcase/content'
import { socials } from '../app/(pages)/home/_sections/social-proof/content'

const ROOT = process.cwd()
const BLOG_DIR = join(ROOT, 'app/blog/posts')
const BASE_LLMS_PATH = join(ROOT, 'public/llms.txt')
const OUTPUT_PATH = join(ROOT, 'public/llms-full.txt')

// ─────────────────────────────────────────────────────────────────────────────
// Content extraction helpers
// ─────────────────────────────────────────────────────────────────────────────

function normalizeBaseUrl(rawBaseUrl: string): string {
  return rawBaseUrl.replace(/\/+$/, '')
}

const BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_BASE_URL || 'https://tambo.co'
)

type BlogFrontmatter = {
  title?: string
  description?: string
  date?: string
  author?: string
  slug?: string
}

const MAX_COMPONENT_UNWRAP_PASSES = 10

// Accepts ISO-like date strings. If a time is provided, it is ignored and we
// sort by the date component only.
function parseIsoDateOnly(value: string | undefined): number | undefined {
  if (!value) return undefined

  const match = /^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:T.*)?$/.exec(value)
  if (!match) return undefined

  const [, yearStr, monthStr, dayStr] = match
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined
  }

  return date.getTime()
}

function getString(
  data: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  if (!data) return undefined
  const value = data[key]
  if (typeof value !== 'string') return undefined
  return value
}

function cleanMdx(content: string): string {
  const fenceRegex = /^\s*```/

  const segments: { content: string; isCode: boolean }[] = []
  let current: string[] = []
  let inFence = false

  for (const line of content.split('\n')) {
    if (fenceRegex.test(line)) {
      if (!inFence) {
        segments.push({ content: current.join('\n'), isCode: false })
        current = [line]
        inFence = true
        continue
      }

      current.push(line)
      segments.push({ content: current.join('\n'), isCode: true })
      current = []
      inFence = false
      continue
    }

    current.push(line)
  }

  segments.push({ content: current.join('\n'), isCode: inFence })

  const cleaned = segments
    .map((segment) => {
      if (segment.isCode) {
        // Preserve fenced code blocks verbatim (including import/export lines)
        // so code samples remain intact in llms-full.txt.
        return segment.content
      }

      let next = segment.content
        .replace(/^\s*import\s+(?:type\s+)?[^\n]*\bfrom\b[^\n]*$/gm, '')
        .replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '')
        .replace(
          /^\s*export\s+(?:\{[^}]*\}|default|const|let|var|function|class|type|interface)\b[^\n]*$/gm,
          ''
        )
        .replace(/<video[\s\S]*?\/>/gi, '[Video]')
        .replace(/<Video[\s\S]*?>[\s\S]*?<\/Video>/gi, '[Video]')

      for (let i = 0; i < MAX_COMPONENT_UNWRAP_PASSES; i += 1) {
        const unwrapped = next.replace(
          /<([A-Z][\w]*)\b[^>]*>([\s\S]*?)<\/\1>/g,
          '$2'
        )
        if (unwrapped === next) break

        if (i === MAX_COMPONENT_UNWRAP_PASSES - 1) {
          console.warn(
            `[llms-full] Reached MAX_COMPONENT_UNWRAP_PASSES=${MAX_COMPONENT_UNWRAP_PASSES} while cleaning MDX; wrappers may remain.`
          )
        }

        next = unwrapped
      }

      next = next.replace(/<([A-Z][\w]*)\b[^>]*\/>/g, '')

      return next
    })
    .join('\n')

  return cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+$/gm, '')
    .trim()
}

function readBlogPosts(): string[] {
  if (!existsSync(BLOG_DIR)) return []

  const dirs = readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort((a, b) => a.localeCompare(b))

  const posts: {
    slug: string
    title: string
    description?: string
    date?: string
    dateTimestamp?: number
    author?: string
    body: string
  }[] = []

  for (const dir of dirs) {
    const mdxPath = join(BLOG_DIR, dir, 'page.mdx')
    try {
      const content = readFileSync(mdxPath, 'utf-8')
      const parsed = matter(content)

      const meta: BlogFrontmatter = {
        title: getString(parsed.data, 'title'),
        description: getString(parsed.data, 'description'),
        date: getString(parsed.data, 'date'),
        author: getString(parsed.data, 'author'),
        slug: getString(parsed.data, 'slug'),
      }

      const slug = meta.slug || dir

      const dateTimestamp = parseIsoDateOnly(meta.date)
      if (meta.date && dateTimestamp == null) {
        console.warn(
          `[llms-full] Blog date must start with YYYY-MM-DD for ${slug}: ${meta.date}`
        )
      }

      posts.push({
        slug,
        title: meta.title || slug,
        description: meta.description,
        date: meta.date,
        dateTimestamp,
        author: meta.author,
        body: cleanMdx(parsed.content),
      })
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        err.code === 'ENOENT'
      ) {
        continue
      }

      console.warn(`[llms-full] Failed to read ${mdxPath}:`, err)
      if (process.env.CI) {
        throw err
      }
    }
  }

  // Deterministic ordering: newest first (YYYY-MM-DD), undated last, then slug.
  posts.sort((a, b) => {
    const aDate = a.dateTimestamp
    const bDate = b.dateTimestamp

    if (aDate != null && bDate != null && aDate !== bDate) return bDate - aDate

    if (aDate != null && bDate == null) return -1
    if (aDate == null && bDate != null) return 1

    return a.slug.localeCompare(b.slug)
  })

  return posts.map((post) => {
    const url = `${BASE_URL}/blog/posts/${post.slug}`

    return `### ${post.title}

URL: ${url}

${post.description || ''}

${post.date ? `*Published: ${post.date}*` : ''}
${post.author ? `*Author: ${post.author}*` : ''}

${post.body}`
  })
}

function readBaseLlms(): string {
  if (!existsSync(BASE_LLMS_PATH)) {
    const message = `Base llms.txt not found at ${BASE_LLMS_PATH}`

    if (process.env.CI) {
      throw new Error(message)
    }

    console.warn(`${message} — falling back to a minimal header.`)
    return '# Tambo'
  }

  return readFileSync(BASE_LLMS_PATH, 'utf-8').trim()
}

function formatHeroSection(): string {
  return `## Hero

**Headline:** ${heroContent.headline.line1} ${heroContent.headline.line2Lead} ${heroContent.headline.line2Tail}

**Subheadline:** ${heroContent.subheadline.line1} ${heroContent.subheadline.line2}`
}

function formatWhyTamboSection(): string {
  return [
    '## Why Tambo',
    '',
    '**From zero to agent in a weekend** — Everything you need to add AI to your React app.',
    '',
    ...meetTamboCards.map((card) => `- **${card.title}**: ${card.text}`),
  ].join('\n')
}

function formatHowItWorksSection(): string {
  return `## How It Works

**${howItWorksContent.title.line1} ${howItWorksContent.title.line2}**`
}

function formatFeaturesSection(): string {
  return [
    '## Features',
    '',
    'What Tambo solves for you:',
    '',
    ...featureButtons.map((button) => `- **${button.title}**: ${button.href}`),
  ].join('\n')
}

function formatPricingSection(): string {
  const plans = pricingCards
    .map((card) => {
      return [
        `### ${card.plan} (${card.title})`,
        card.description,
        ...card.features.map((feature) => `- ${feature}`),
      ].join('\n')
    })
    .join('\n\n')

  const openSource = [
    `### ${pricingBanner.title}`,
    pricingBanner.description,
    ...pricingBanner.features.map((feature) => `- ${feature}`),
  ].join('\n')

  return ['## Pricing', '', plans, '', openSource].join('\n')
}

function formatShowcaseSection(): string {
  return [
    '## Built With Tambo',
    '',
    ...showcaseCards.map((card) => {
      return `### ${card.title}\n${card.paragraph}\n${card.href}`
    }),
  ].join('\n\n')
}

function formatTestimonialsSection(): string {
  // De-dupe and cap testimonials to keep the output compact and avoid
  // placeholder repetition.
  const uniqueByKey = new Map<string, (typeof socials)[number]>()

  for (const quote of socials) {
    const text = String(quote.text ?? '').trim()
    const author = String(quote.author ?? '').trim()
    if (!(text && author)) continue

    // De-dupe on (text, author) only; position is not considered unique.
    const key = JSON.stringify({
      text,
      author,
    })

    if (!uniqueByKey.has(key)) {
      uniqueByKey.set(key, { ...quote, text, author })
    }
  }

  const quotes = Array.from(uniqueByKey.values()).slice(0, 5)
  if (quotes.length === 0) return ''

  return [
    '## Testimonials',
    '',
    ...quotes.flatMap((quote) => [
      `> ${quote.text}`,
      `> — ${quote.author}, ${quote.position}`,
      '',
    ]),
  ]
    .join('\n')
    .trimEnd()
}

function formatContactUsSection(): string {
  return [
    '## Contact / Partner with Tambo',
    '',
    contactPageContent.subtitle,
    '',
    ...valueProps.map((prop) => `- **${prop.title}** ${prop.description}`),
    '',
    'Contact: https://tambo.co/contact-us',
  ].join('\n')
}

// ─────────────────────────────────────────────────────────────────────────────
// Main generation
// ─────────────────────────────────────────────────────────────────────────────

function generateLlmsFull(): string {
  const blogPosts = readBlogPosts()
  const base = readBaseLlms()

  const sections = [
    base,
    '---',
    '# Marketing Site Content',
    formatHeroSection(),
    formatWhyTamboSection(),
    formatHowItWorksSection(),
    formatFeaturesSection(),
    formatPricingSection(),
    formatShowcaseSection(),
    formatTestimonialsSection(),
    formatContactUsSection(),
    `---

# Blog Posts`,
    ...blogPosts,
  ]

  return sections.join('\n\n')
}

// Run
// Normalize to a single trailing newline for more stable diffs and LLM corpora.
const rawOutput = generateLlmsFull()
const output = `${rawOutput.trimEnd()}\n`
try {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  writeFileSync(OUTPUT_PATH, output, { encoding: 'utf8' })
} catch (err) {
  console.error(`[llms-full] Failed to write ${OUTPUT_PATH}:`, err)
  throw err
}
console.log(
  `Generated ${OUTPUT_PATH} (${output.length} chars, ${output.split('\n').length} lines)`
)
