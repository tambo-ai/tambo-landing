/**
 * Generates llms-full.txt from site content sources:
 * - Blog posts (MDX files with frontmatter)
 * - Marketing copy from canonical data modules
 * - Base llms.txt content
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

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
  let cleaned = content
    // Remove ESM import/export blocks
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    // Replace known media tags
    .replace(/<video[\s\S]*?\/>/gi, '[Video]')
    .replace(/<Video[\s\S]*?>[\s\S]*?<\/Video>/gi, '[Video]')

  // Unwrap wrapper components (<Callout>text</Callout> -> text)
  for (;;) {
    const next = cleaned.replace(/<([A-Z][\w]*)\b[^>]*>([\s\S]*?)<\/\1>/g, '$2')
    if (next === cleaned) break
    cleaned = next
  }

  // Remove any remaining self-closing components
  cleaned = cleaned.replace(/<([A-Z][\w]*)\b[^>]*\/>/g, '')

  return cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+$/gm, '')
    .trim()
}

function readBlogPosts(): string[] {
  if (!existsSync(BLOG_DIR)) return []

  const posts: string[] = []
  const dirs = readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

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
      const url = `${BASE_URL}/blog/posts/${slug}`
      const cleanedBody = cleanMdx(parsed.content)

      posts.push(`### ${meta.title || slug}

URL: ${url}

${meta.description || ''}

${meta.date ? `*Published: ${meta.date}*` : ''}
${meta.author ? `*Author: ${meta.author}*` : ''}

${cleanedBody}`)
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

  return posts
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
  const quote = socials[0]

  if (!quote) {
    return ''
  }

  return [
    '## Testimonials',
    '',
    `> ${quote.text}`,
    `> — ${quote.author}, ${quote.position}`,
  ].join('\n')
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
const output = generateLlmsFull()
writeFileSync(OUTPUT_PATH, output)
console.log(
  `Generated ${OUTPUT_PATH} (${output.length} chars, ${output.split('\n').length} lines)`
)
