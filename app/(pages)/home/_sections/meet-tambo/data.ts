export const cards = [
  {
    title: 'your components',
    text: "Connect Tambo to your own React components so it can generate, modify, or interact with them in responses. You control exactly which components are available, whether they're rendered by Tambo or placed on screen as interactive UI.",
    video: {
      mp4: '/videos/Octo-File-compressed.mov',
      webm: '/videos/Octo-File-compressed.webm',
      png: '/videos/Octo-File.png',
    },
    button: {
      text: 'See more',
    },
    anchor: 'moment-1',
  },
  {
    title: 'custom context',
    text: 'Use context helpers and attachments to control what Tambo knows at any moment. Mark components as selectable context so users can point Tambo at specific parts of the interface for precise, "edit with AI" interactions.',
    video: {
      mp4: '/videos/Octo-Search-compressed.mov',
      webm: '/videos/Octo-Search-compressed.webm',
      png: '/videos/Octo-Search.png',
    },
    button: {
      text: 'See more',
    },
    anchor: 'moment-2',
  },
  {
    title: 'Local Tools',
    text: 'Define custom tools in JavaScript to let Tambo perform actions or retrieve data. From API calls to mutations and workflows, tools turn responses into real execution not just text.',
    video: {
      mp4: '/videos/Octo-Carry-compressed.mov',
      webm: '/videos/Octo-Carry-compressed.webm',
      png: '/videos/Octo-Carry.png',
    },
    button: {
      text: 'See more',
    },
    anchor: 'moment-2',
  },
  {
    title: 'MCP Native',
    text: 'Connect to MCP servers client- side or server-side to automatically access their tools, resources, and prompts. Tambo inherits capabilities without manual wiring, keeping integrations flexible and extensible.',
    video: {
      mp4: '/videos/Octo-Multi-compressed.mov',
      webm: '/videos/Octo-Multi-compressed.webm',
    },
    button: {
      text: 'See more',
    },
    anchor: 'moment-3',
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
