const colors = {
  red: '#e30613',
  blue: '#0070f3',
  green: '#00ff88',
  purple: '#7928ca',
  pink: '#FFC4EB',
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
  'white-80': '#ffffffcc',
  'white-60': '#ffffff99',
  'white-50': '#ffffff80',
  'white-10': '#ffffff1a',
  // BLACK & SHADES
  black: '#0F1A17',
  'black-70': '#0f1a17b3',
  'black-50': '#0f1a1780',
  // FOREST & SHADES
  forest: '#008346',
  'forest-50': '#00834680',
  'forest-30': '#0083464d',
  'forest-20': '#00834633',
  'forest-10': '#0083461a',
} as const

const themeNames = ['light', 'dark', 'red'] as const
const colorNames = ['primary', 'secondary', 'contrast'] as const

const themes = {
  light: {
    primary: colors.white,
    secondary: colors.black,
    contrast: colors.red,
  },
  dark: {
    primary: colors.black,
    secondary: colors.white,
    contrast: colors.red,
  },
  red: {
    primary: colors.red,
    secondary: colors.black,
    contrast: colors.white,
  },
} as const satisfies Themes

export { colors, themeNames, themes }

// UTIL TYPES
export type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
