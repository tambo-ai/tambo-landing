import type { CSSProperties } from 'react'

const fonts = {
  mono: '--next-font-mono', // this should be the variable name defined in fonts.ts
  geist: '--next-font-geist',
  geistMono: '--next-font-geist-mono',
  sentient: '--next-font-sentient',
} as const

const typography: TypeStyles = {
  'test-mono': {
    'font-family': `var(${fonts.mono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '90%',
    'letter-spacing': '0em',
    'font-size': { mobile: 20, desktop: 24 },
  },
  h1: {
    'font-family': `var(${fonts.sentient})`,
    'font-style': 'normal',
    'font-weight': 300,
    'line-height': '110%',
    'letter-spacing': '-0.05em',
    'font-size': { mobile: 48, desktop: 48 },
  },
  h2: {
    'font-family': `var(${fonts.sentient})`,
    'font-style': 'normal',
    'font-weight': 300,
    'line-height': '110%',
    'letter-spacing': '-0.05em',
    'font-size': { mobile: 40, desktop: 40 },
  },
  h3: {
    'font-family': `var(${fonts.sentient})`,
    'font-style': 'normal',
    'font-weight': 300,
    'line-height': '110%',
    'letter-spacing': '-0.05em',
    'font-size': { mobile: 32, desktop: 32 },
  },
  h4: {
    'font-family': `var(${fonts.geistMono})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '110%',
    'letter-spacing': '0.02em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 24, desktop: 16 },
  },
  surtitle: {
    'font-family': `var(${fonts.geistMono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0.02em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 16, desktop: 16 },
  },
  button: {
    'font-family': `var(${fonts.geistMono})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '110%',
    'letter-spacing': '0.02em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 14, desktop: 14 },
  },
  link: {
    'font-family': `var(${fonts.geistMono})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '110%',
    'letter-spacing': '0.02em',
    'text-transform': 'uppercase',
    'text-decoration': 'underline',
    'font-size': { mobile: 14, desktop: 14 },
  },
  'label-m': {
    'font-family': `var(${fonts.geistMono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0.02em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 12, desktop: 12 },
  },
  'label-s': {
    'font-family': `var(${fonts.geistMono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '110%',
    'letter-spacing': '0.02em',
    'text-transform': 'uppercase',
    'font-size': { mobile: 10, desktop: 10 },
  },
  'p-l': {
    'font-family': `var(${fonts.geist})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '110%',
    'letter-spacing': '0em',
    'font-size': { mobile: 20, desktop: 20 },
  },
  p: {
    'font-family': `var(${fonts.geist})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0em',
    'font-size': { mobile: 16, desktop: 16 },
  },
  'p-s': {
    'font-family': `var(${fonts.geist})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '140%',
    'letter-spacing': '0em',
    'font-size': { mobile: 12, desktop: 12 },
  },
  'code-snippet': {
    'font-family': `var(${fonts.geistMono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '120%',
    'letter-spacing': '0.02em',
    'font-size': { mobile: 14, desktop: 14 },
  },
} as const

export { fonts, typography }

// UTIL TYPES
type TypeStyles = Record<
  string,
  {
    'font-family': string
    'font-style': CSSProperties['fontStyle']
    'font-weight': CSSProperties['fontWeight']
    'line-height':
      | `${number}%`
      | { mobile: `${number}%`; desktop: `${number}%` }
    'letter-spacing':
      | `${number}em`
      | { mobile: `${number}em`; desktop: `${number}em` }
    'font-feature-settings'?: string
    'font-size': number | { mobile: number; desktop: number }
    'text-transform'?: CSSProperties['textTransform']
    'text-decoration'?: CSSProperties['textDecoration']
  }
>
