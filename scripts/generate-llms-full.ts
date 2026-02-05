/**
 * Generates llms-full.txt from site content sources:
 * - Blog posts (MDX files with frontmatter)
 * - Marketing copy from canonical data modules
 * - Base llms.txt content
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { contactPageContent, valueProps } from '../app/(pages)/contact-us/data'
import { featureButtons } from '../app/(pages)/home/_sections/features-section/data'
import { heroContent } from '../app/(pages)/home/_sections/hero/data'
import { howItWorksContent } from '../app/(pages)/home/_sections/how-it-works/data'
import { cards as meetTamboCards } from '../app/(pages)/home/_sections/meet-tambo/data'
import {
  banner as pricingBanner,
  pricingCards,
} from '../app/(pages)/home/_sections/pricing/data'
import { showcaseCards } from '../app/(pages)/home/_sections/showcase/data'
import { socials } from '../app/(pages)/home/_sections/social-proof/data'

const ROOT = process.cwd()
const BLOG_DIR = join(ROOT, 'app/blog/posts')
const BASE_LLMS_PATH = join(ROOT, 'public/llms.txt')
const OUTPUT_PATH = join(ROOT, 'public/llms-full.txt')

// ─────────────────────────────────────────────────────────────────────────────
// Content extraction helpers
// ─────────────────────────────────────────────────────────────────────────────

function extractFrontmatter(content: string): {
  meta: Record<string, string>
  body: string
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: content }

  const meta: Record<string, string> = {}
  match[1].split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) {
      meta[key.trim()] = rest
        .join(':')
        .trim()
        .replace(/^["']|["']$/g, '')
    }
  })
  return { meta, body: match[2] }
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
  for (let i = 0; i < 10; i += 1) {
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
      const { meta, body } = extractFrontmatter(content)
      const cleanedBody = cleanMdx(body)

      posts.push(`### ${meta.title || dir}

URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://tambo.co'}/blog/posts/${dir}

${meta.description || ''}

${meta.date ? `*Published: ${meta.date}*` : ''}
${meta.author ? `*Author: ${meta.author}*` : ''}

${cleanedBody}`)
    } catch {
      // Skip if file doesn't exist
    }
  }

  return posts
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
  const base = existsSync(BASE_LLMS_PATH)
    ? readFileSync(BASE_LLMS_PATH, 'utf-8').trim()
    : '# Tambo'

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
