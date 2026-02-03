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

## Tech Stack

- **Next.js 16** - App Router, Turbopack, Cache Components
- **React 19** - Latest React with React Compiler enabled
- **Tailwind CSS 4** - CSS-first configuration
- **TypeScript** - Strict mode
- **Biome** - Linting and formatting
- **Bun** - Package manager and runtime
- **GSAP** - Animations
- **React Three Fiber** - WebGL/3D graphics

## Repository Structure

```
app/
├── (pages)/home/       # Landing page sections (hero, features, pricing, etc.)
├── blog/               # Blog with MDX posts
├── layout.tsx          # Root layout with metadata and JSON-LD
└── sitemap.ts          # Dynamic sitemap generation

components/
├── blog/               # Blog components
├── button/             # CTA buttons
├── image/              # Image wrapper (always use this, not next/image)
├── link/               # Link wrapper (auto-detects external)
├── gsap/               # GSAP runtime and animations
└── ...                 # UI components

integrations/
└── tambo/              # Tambo AI demo integration

libs/
├── config.tsx          # Site configuration and links
└── get-posts.ts        # Blog post utilities

styles/                 # Global styles, Tailwind config
webgl/                  # 3D graphics and WebGL components
orchestra/              # Debug tools (CMD+O to toggle)
```

## Key Files

- `app/layout.tsx` - Site metadata, SEO, JSON-LD structured data
- `public/llms.txt` - Plain text endpoint for AI agents
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
bun lint:fix
bun typecheck

# Utilities
bun setup:styles            # Generate style files
bun validate:env            # Check environment variables
bun cleanup:integrations    # List unused integrations
bun analyze                 # Bundle analysis
```

## Styling

### CSS Modules
Components use CSS modules with the `s` import convention:

```tsx
import s from './component.module.css'

function Component() {
  return <div className={s.wrapper} />
}
```

### Responsive Design
Custom viewport functions:

```css
.element {
  width: mobile-vw(150);    /* 150px at mobile viewport */
  height: desktop-vh(100);  /* 100px at desktop viewport */
}
```

## Debug Tools

Toggle with `Cmd/Ctrl + O`:
- Theatre.js Studio - Visual animation editor
- FPS Meter - Performance monitoring
- Grid Overlay - Layout debugging
- Minimap - Page overview

## Important Notes

**Images & Links**
- Always use `~/components/link` (auto-detects external, smart prefetch)
- Always use `~/components/image` for DOM (never `next/image` directly)
- Use `~/webgl/components/image` in WebGL contexts

**GSAP & Animation**
- `<GSAPRuntime />` is in `app/layout.tsx` for ScrollTrigger + Lenis
- No manual ticker setup needed

**React Compiler**
- Enabled automatically (`reactCompiler: true`)
- No need for manual `useMemo`, `useCallback`, or `React.memo`

**Orchestra Debug**
- State persists in `localStorage` and syncs across tabs
- Automatically excluded from production builds

## Marketing Voice

Tambo's voice is technical but accessible. Direct and punchy. Like a developer at a meetup explaining something they built.

**Key positioning:**
- "toolkit" not "framework" or "platform"
- "open-source generative UI toolkit for React"
- Tagline: "Build agents that speak your UI"

**Important:** Any copy changes to the landing page should also update `public/llms.txt` to keep messaging consistent for AI agents.

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
