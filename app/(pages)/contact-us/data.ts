import { Handshake, Shield } from 'lucide-react'

export const contactPageContent = {
  title: 'Partner with Tambo',
  subtitle:
    "We're working closely with select teams building agents in React apps. Get direct access to Tambo's founders.",
}

export const valueProps = [
  {
    icon: Handshake,
    title: 'Become a Design Partner.',
    description:
      "We're working closely with select teams building agents in React apps. Get direct access to Tambo's founders for expert help.",
  },
  {
    icon: Shield,
    title: 'Enterprise Support.',
    description:
      "We'll help you set up on-prem, SSO, SOC 2, HIPAA, whatever your security and compliance needs.",
  },
] as const
