export const cards = [
  {
    title: 'Components',
    text: "Connect Tambo to your own React components so it can generate, modify, or interact with them in responses. You control exactly which components are available, whether they're rendered by Tambo or placed on screen as interactive UI.",
    video: {
      mp4: '/videos/Octo-Wave-compressed.mov',
      webm: '/videos/Octo-Wave-compressed.webm',
    },
    button: {
      text: 'See more',
      href: 'https://docs.tambo.co/concepts/components',
    },
  },
  {
    title: 'Context',
    text: 'Use context helpers and attachments to control what Tambo knows at any moment. Mark components as selectable context so users can point Tambo at specific parts of the interface for precise, "edit with AI" interactions.',
    video: {
      mp4: '/videos/Octo-Juggle-compressed.mov',
      webm: '/videos/Octo-Juggle-compressed.webm',
    },
    button: {
      text: 'See more',
      href: 'https://docs.tambo.co',
    },
  },
  {
    title: 'Tools',
    text: 'Define custom tools in JavaScript to let Tambo perform actions or retrieve data. From API calls to mutations and workflows, tools turn responses into real execution not just text.',
    video: {
      mp4: '/videos/Octo-Wave-compressed.mov',
      webm: '/videos/Octo-Wave-compressed.webm',
    },
    button: {
      text: 'See more',
      href: 'https://docs.tambo.co',
    },
  },
  {
    title: 'MCP Native',
    text: 'Connect to MCP servers client- side or server-side to automatically access their tools, resources, and prompts. Tambo inherits capabilities without manual wiring, keeping integrations flexible and extensible.',
    video: {
      mp4: '/videos/Octo-Juggle-compressed.mov',
      webm: '/videos/Octo-Juggle-compressed.webm',
    },
    button: {
      text: 'See more',
      href: 'https://docs.tambo.co',
    },
  },
] as const

export const persons = [
  {
    name: 'Eric Wittman',
    roles: ['ceo', 'vsco'],
    image: '/assets/leads/Lead-2.png',
  },
  {
    name: 'Daniel Lewis',
    roles: ['cvp', 'microsoft ai'],
    image: '/assets/leads/Lead-1.png',
  },
  {
    name: 'Drew Houston',
    roles: ['Dropbox'],
    image: '/assets/leads/Lead-3.png',
  },
] as const
