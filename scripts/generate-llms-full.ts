#!/usr/bin/env npx tsx
/**
 * Generates llms-full.txt from site content sources:
 * - Blog posts (MDX files with frontmatter)
 * - Marketing copy from section data files
 * - Base llms.txt content
 *
 * Run: npx tsx scripts/generate-llms-full.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const BLOG_DIR = join(ROOT, 'app/blog/posts')
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
  return (
    content
      // Remove import statements
      .replace(/^import\s+.*$/gm, '')
      // Remove JSX components but keep text content
      .replace(/<video[\s\S]*?\/>/gi, '[Video]')
      .replace(/<Video[\s\S]*?>[\s\S]*?<\/Video>/gi, '[Video]')
      .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '')
      .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

function readBlogPosts(): string[] {
  const posts: string[] = []
  const dirs = readdirSync(BLOG_DIR)

  for (const dir of dirs) {
    const mdxPath = join(BLOG_DIR, dir, 'page.mdx')
    try {
      const content = readFileSync(mdxPath, 'utf-8')
      const { meta, body } = extractFrontmatter(content)
      const cleanedBody = cleanMdx(body)

      posts.push(`### ${meta.title || dir}

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

// ─────────────────────────────────────────────────────────────────────────────
// Marketing content from data files
// ─────────────────────────────────────────────────────────────────────────────

const HERO_CONTENT = `## Hero

**Headline:** Build agents that speak your UI

**Subheadline:** An open-source toolkit for adding agents to your React app. Connect your existing components—Tambo handles streaming, state management, and MCP.`

const WHY_TAMBO_CONTENT = `## Why Tambo

**From zero to agent in a weekend** — Everything you need to add AI to your React app.

- **Agent included**: No heavy frameworks required. Drop Tambo into your app in minutes.
- **Auth just works**: The agent inherits your user's permissions, keeping your AI features secure.
- **Your components**: Register them once. The agent renders your UI with the right props.
- **The boring parts, solved**: Error states, cancellation, message threads, MCP—already done.`

const HOW_IT_WORKS_CONTENT = `## How It Works

**The missing layer between React and LLMs**

When a user asks a question like "What seats are available?":
1. Tambo's agent renders your components (like <SeatMap>) with your styling and logic
2. Tambo updates state when users interact
3. Same components, new capabilities—ship AI features without rebuilding`

const FEATURES_CONTENT = `## Features

What Tambo solves for you:

- **Generative UI Components**: AI agents render your React components with correct props
- **Interactable Components**: Components that respond to user interactions
- **MCP-Native**: Full Model Context Protocol support
- **Local Tools**: Run tools locally in the browser
- **Streaming Support**: Real-time streaming built-in
- **Message History**: Persistent conversation threads
- **State Management**: Handles complex state across agent interactions
- **Suggested Actions**: Contextual action suggestions for users
- **Tool Orchestration**: Coordinate multiple tools seamlessly
- **Model Flexibility**: Works with various LLM providers
- **Component Library**: Pre-built UI components at ui.tambo.co`

const PRICING_CONTENT = `## Pricing

### Starter (Free)
Perfect for getting started.
- 10K stored messages / mo
- Unlimited users (OAuth)
- Chat-thread history
- Analytics + observability
- Community support

### Growth ($25/mo)
For growing teams and projects.
- 200K messages / mo included
- $8 per +100k (billed in 100k blocks)
- Unlimited users
- Chat-thread history
- Analytics + observability

### Enterprise (Annual Contract)
For large organisations.
- Negotiated message volume
- Unlimited seats for cloud
- Enterprise-only features
- SSO / SAML, SCIM, RBAC
- Single-tenant or on-prem
- 99.99% uptime SLA
- SOC 2, HIPAA opt-in, GDPR (upon request)
- Early access to new features
- 24x7 support

### Open Source
**Self-host for Free. Forever.**
- tambo.ai/react package
- UI component library
- tambo-ai/tambo-cloud`

const SHOWCASE_CONTENT = `## Built With Tambo

### db-thing
Database design through conversation. Create schemas, generate ERDs, get optimization tips, export SQL.
https://db-thing.vercel.app/

### Strudel AI
Strudel lets you code music patterns live. You layer drums, melodies, and synths in real time, making complex electronic music using code.
https://strudellm.com/

### CheatSheet
AI-powered document assistant.
https://cheatsheet.tambo.co/`

const TESTIMONIAL_CONTENT = `## Testimonials

> "Tambo was insanely easy to get up and running—it's how you get a full chatbot from frontend to backend in minutes. I plugged it into my UI on a Friday and demoed it to my team on Monday."
> — Jean-Philippe Bergeron, Product Engineer at Solink`

const CONTACT_PAGE_CONTENT = `## Contact / Partner with Tambo

We're working closely with select teams building agents in React apps. Get direct access to Tambo's founders.

### Become a Design Partner
We're working closely with select teams building agents in React apps. Get direct access to Tambo's founders for expert help.

### Enterprise Support
We'll help you set up on-prem, SSO, SOC 2, HIPAA, whatever your security and compliance needs.

Contact: https://tambo.co/contact-us`

// ─────────────────────────────────────────────────────────────────────────────
// Main generation
// ─────────────────────────────────────────────────────────────────────────────

function generateLlmsFull(): string {
  const blogPosts = readBlogPosts()

  const sections = [
    `# Tambo - Full Site Content

> Build agents that speak your UI

Tambo is the open-source generative UI toolkit for React. Built for product engineers adding AI features to existing apps.

Tambo lets any React app add AI features that show real UI—not just chat responses. When a user asks "show me sales by region," the agent renders an actual interactive chart, not a text summary. Register your components, and the agent picks the right one and streams the props.

It's a drop-in fullstack solution: a React SDK plus a backend that handles conversation state and agent execution. No separate agent framework required.

---

# Marketing Site Content`,
    HERO_CONTENT,
    WHY_TAMBO_CONTENT,
    HOW_IT_WORKS_CONTENT,
    FEATURES_CONTENT,
    PRICING_CONTENT,
    SHOWCASE_CONTENT,
    TESTIMONIAL_CONTENT,
    CONTACT_PAGE_CONTENT,
    `---

# Blog Posts`,
    ...blogPosts,
    `---

## Resources

- Documentation: https://docs.tambo.co
- GitHub: https://github.com/tambo-ai/tambo
- Component Library: https://ui.tambo.co
- Discord: https://discord.com/invite/dJNvPEHth6
- Twitter: https://x.com/tambo_ai
- Website: https://tambo.co

## About

Tambo is developed by Fractal Dynamics Inc. The toolkit is open-source and free to self-host forever.`,
  ]

  return sections.join('\n\n')
}

// Run
const output = generateLlmsFull()
writeFileSync(OUTPUT_PATH, output)
console.log(
  `Generated ${OUTPUT_PATH} (${output.length} chars, ${output.split('\n').length} lines)`
)
