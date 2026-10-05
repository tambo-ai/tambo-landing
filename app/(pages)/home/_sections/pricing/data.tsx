import { siteConfig } from '~/libs/config'

export const notice = {
  label: 'Tambo Cloud',
  title: 'Shutting down on October 31, 2026',
  description:
    'Free and paid cloud plans are no longer available. Tambo stays open source, so you can still self-host it.',
  button: {
    text: 'Read the announcement',
    href: siteConfig.links.shutdownPost,
  },
}

export const banner = {
  title: 'Open Source',
  description: 'Self-host for Free. Forever.',
  features: [
    'tambo.ai/react package',
    'ui component library',
    'tambo-ai/tambo-cloud',
  ],
  button: {
    text: 'GITHUB',
    href: 'https://github.com/tambo-ai/tambo',
  },
}
