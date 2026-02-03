import localFont from 'next/font/local'

const mono = localFont({
  src: [
    {
      path: '../public/fonts/ServerMono/ServerMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--next-font-mono',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'monospace',
  ],
})

const geist = localFont({
  src: [
    {
      path: '../public/fonts/Geist/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist/Geist-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--next-font-geist',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'monospace',
  ],
})

const geistMono = localFont({
  src: [
    {
      path: '../public/fonts/GeistMono/GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono/GeistMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono/GeistMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--next-font-geist-mono',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'monospace',
  ],
})

const sentient = localFont({
  src: [
    {
      path: '../public/fonts/Sentient/Sentient-Light.woff2',
      weight: '300',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--next-font-sentient',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'monospace',
  ],
})

const fonts = [mono, geist, geistMono, sentient]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }
