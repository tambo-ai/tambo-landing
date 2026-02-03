# Tambo Landing Site

Marketing website for Tambo, the open-source generative UI toolkit for React.

## Key Points

1. This is a marketing site for Tambo, not the SDK itself
2. Tambo is a "toolkit" not a "framework" or "platform"
3. Voice is technical but accessible, direct and punchy
4. SEO metadata lives in `app/layout.tsx` and `package.json`
5. AI agent discovery endpoint is at `/llms.txt`

## What is Tambo?

Tambo lets any app add AI features that show real UI instead of chat responses. When a user asks "show me sales by region," the agent renders an actual interactive chart.

Drop Tambo into your React app. Register your components with Zod schemas. The agent picks the right one and streams the props.

- Agent included, no LangChain or Mastra required
- Uses your existing components
- Auth inherited from user session
- Streaming, cancellation, error handling solved
- MCP support built in

## Repository Structure

```
app/
├── (pages)/home/       # Landing page sections (hero, features, pricing, etc.)
├── blog/               # Blog with MDX posts
├── llms.txt/           # AI agent discovery endpoint
├── layout.tsx          # Root layout with metadata and JSON-LD
└── sitemap.ts          # Dynamic sitemap generation

components/
├── blog/               # Blog components
├── button/             # CTA buttons
└── ...                 # UI components

libs/
├── config.tsx          # Site configuration and links
└── get-posts.ts        # Blog post utilities
```

## Key Files

- `app/layout.tsx` - Site metadata, SEO, JSON-LD structured data
- `app/llms.txt/route.ts` - Plain text endpoint for AI agents
- `package.json` - Site description (used in metadata)
- `libs/config.tsx` - Site configuration, social links, footer

## Commands

```bash
# Development
bun install
bun dev

# Build
bun build
bun start

# Code quality
bun lint
bun typecheck
```

## Marketing Voice

Tambo's voice is technical but accessible. Direct and punchy. Like a developer at a meetup explaining something they built.

**Key positioning:**
- "toolkit" not "framework" or "platform"
- "open-source generative UI toolkit for React"
- Tagline: "Build agents that speak your UI"

**Important:** Any copy changes to the landing page should also update `/llms.txt` to keep messaging consistent for AI agents.

## SEO and Metadata

Metadata is defined in:
- `app/layout.tsx` - Main site metadata, JSON-LD
- `app/blog/layout.tsx` - Blog metadata
- `app/blog/page.tsx` - Blog index page metadata
- `package.json` - Site description

The site includes:
- JSON-LD structured data (Organization, WebSite schemas)
- OpenGraph and Twitter card tags
- Dynamic sitemap at `/sitemap.xml`
- AI agent endpoint at `/llms.txt`

## Links

- Website: https://tambo.co
- Docs: https://docs.tambo.co
- GitHub: https://github.com/tambo-ai/tambo
- Discord: https://discord.gg/wMeVUZXBPg
