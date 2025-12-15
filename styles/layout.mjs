// THIS FILE HAS TO STAY .mjs AS ITS CONSUMED BY POSTCSS
const breakpoints = {
  dt: 800,
}

const screens = {
  mobile: { width: 375, height: 650 },
  desktop: { width: 1440, height: 900 },
}

const layout = {
  columns: { mobile: 4, desktop: 12 },
  gap: { mobile: 12, desktop: 24 },
  safe: { mobile: 24, desktop: 40 },
}

const maxWidth = 1440

const customSizes = {
  'header-height': { mobile: 58, desktop: 98 },
}

export { breakpoints, customSizes, layout, screens, maxWidth }
