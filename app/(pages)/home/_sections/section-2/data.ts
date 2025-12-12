export const cards = [
  {
    title: 'Components',
    text: "Connect Tambo to your own React components so it can generate, modify, or interact with them in responses. You control exactly which components are available, whether they're rendered by Tambo or placed on screen as interactive UI.",
    video: '/video/components.mp4',
    button: {
      text: 'See more',
      href: '/',
    },
  },
  {
    title: 'Context',
    text: 'Use context helpers and attachments to control what Tambo knows at any moment. Mark components as selectable context so users can point Tambo at specific parts of the interface for precise, "edit with AI" interactions.',
    video: '/video/context.mp4',
    button: {
      text: 'See more',
      href: '/',
    },
  },
  {
    title: 'Tools',
    text: 'Define custom tools in JavaScript to let Tambo perform actions or retrieve data. From API calls to mutations and workflows, tools turn responses into real execution not just text.',
    video: '/video/tools.mp4',
    button: {
      text: 'See more',
      href: '/',
    },
  },
  {
    title: 'MCP Native',
    text: 'Connect to MCP servers client- side or server-side to automatically access their tools, resources, and prompts. Tambo inherits capabilities without manual wiring, keeping integrations flexible and extensible.',
    video: '/video/mcp-native.mp4',
    button: {
      text: 'See more',
      href: '/',
    },
  },
] as const
