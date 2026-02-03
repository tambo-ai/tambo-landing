const colors = {
  red: '#e30613',
  blue: '#0070f3',
  green: '#00ff88',
  purple: '#7928ca',
  pink: '#FFC4EB',
  'light-pink': '#FFD6F1',
  'dark-pink': '#E1C9D9',
  // PRIMARY
  'ghost-mint': '#D6FFEC',
  mint: '#B6FFDD',
  teal: '#7FFFC3',
  'dark-teal': '#80C1A2',
  // NEUTRAL
  'off-white': '#F2F8F6',
  'light-gray': '#E5F0ED',
  grey: '#D8E9E4',
  'dark-grey': '#CBE2DB',
  // WHITE & SHADES
  white: '#ffffff',
  // BLACK & SHADES
  black: '#0F1A17',
  // FOREST & SHADES
  forest: '#008346',
} as const

const themeNames = ['light'] as const
const colorNames = ['primary', 'secondary', 'contrast'] as const

const themes = {
  light: {
    primary: colors['light-gray'],
    secondary: colors.black,
    contrast: colors.mint,
  },
} as const satisfies Themes

export { colors, themeNames, themes }

// UTIL TYPES
export type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
