export const pricingCards = [
  {
    plan: 'Starter',
    title: 'Free',
    description: 'Perfect for getting started.',
    button: {
      text: 'SIGNUP',
      href: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://console.tambo.co',
    },
    features: [
      '10K stored messages / mo',
      'Unlimited users (Oauth)',
      'chat-thread history',
      'analytics + observability',
      'community support',
    ],
  },
  {
    plan: 'Growth',
    title: '$25 /mo',
    description: 'For growing teams and projects',
    button: {
      text: 'SIGNUP',
      href: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://console.tambo.co',
    },
    features: [
      '200K messages / mo included',
      '$8 per +100k (billed in 100k blocks)',
      'unlimited users',
      'chat-thread history',
      'analytics + observability',
    ],
  },
  {
    plan: 'Enterprise',
    title: 'Annual Contract',
    description: 'For large organisations',
    button: {
      text: 'contact us',
      href: '/contact-us',
    },
    features: [
      'negotiated message volume',
      'Unlimited seats for cloud',
      'enterprise-only features',
      'SSO / SAML, SCIM, RBAC',
      'single-tenant or on-prem',
      '99.99% uptime SLA',
      'SOC 2, HIPAA opt-in, GDPR (upon request)',
      'early access to new features',
      '24x7 support',
    ],
  },
]

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
