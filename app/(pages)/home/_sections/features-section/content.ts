export type FeatureButton = {
  title: string
  href: string
  top: number
  left?: number
  right?: number
}

export const featureButtons = [
  {
    title: 'Generative UI Components',
    href: 'https://docs.tambo.co/concepts/generative-interfaces/generative-components',
    top: 18,
    left: 30,
  },
  {
    title: 'Interactable Components',
    href: 'https://docs.tambo.co/concepts/generative-interfaces/interactable-components',
    top: 35,
    right: 15,
  },
  {
    title: 'MCP-Native',
    href: 'https://docs.tambo.co/concepts/model-context-protocol',
    top: 20,
    left: 10,
  },
  {
    title: 'Local Tools',
    href: 'https://docs.tambo.co/concepts/tools',
    top: 45,
    left: 25,
  },
  {
    title: 'Streaming Support',
    href: 'https://docs.tambo.co/reference/react-sdk/providers',
    top: 35,
    right: 90,
  },
  {
    title: 'Message History',
    href: 'https://docs.tambo.co/concepts/conversation-storage',
    top: 18,
    left: 70,
  },
  {
    title: 'State Management',
    href: 'https://docs.tambo.co/reference/react-sdk/hooks',
    top: 68,
    left: 85,
  },
  {
    title: 'Suggested Actions',
    href: 'https://docs.tambo.co/guides/build-interfaces/build-chat-interface#add-contextual-suggestions-optional',
    top: 76,
    right: 33,
  },
  {
    title: 'Tool Orchestration',
    href: 'https://docs.tambo.co/#why-tambo',
    top: 85,
    left: 40,
  },
  {
    title: 'Model Flexibility',
    href: 'https://docs.tambo.co/models',
    top: 90,
    right: 23,
  },
  {
    title: 'Component Library ',
    href: 'https://ui.tambo.co/',
    top: 76,
    left: 18,
  },
] satisfies readonly FeatureButton[]
