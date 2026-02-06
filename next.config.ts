import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'
import nextra from 'nextra'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { remarkInjectBlogLayout } from './libs/mdx/inject-blog-layout.mjs'
import './libs/validate-env.ts'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Required for PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  reactCompiler: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps:
    process.env.SOURCE_MAPS === 'true' && typeof Bun === 'undefined',
  typedRoutes: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              memo: true,
              dimensions: false,
              svgoConfig: {
                multipass: true,
                plugins: [
                  'removeDimensions',
                  'removeOffCanvasPaths',
                  'reusePaths',
                  'removeElementsByAttr',
                  // 'removeStyleElement',
                  'removeScriptElement',
                  // 'prefixIds',
                  // 'cleanupIds',
                  // {
                  //   name: 'cleanupNumericValues',
                  //   params: {
                  //     floatPrecision: 1,
                  //   },
                  // },
                  // {
                  //   name: 'convertPathData',
                  //   params: {
                  //     floatPrecision: 1,
                  //   },
                  // },
                  // {
                  //   name: 'convertTransform',
                  //   params: {
                  //     floatPrecision: 1,
                  //   },
                  // },
                  // {
                  //   name: 'cleanupListOfValues',
                  //   params: {
                  //     floatPrecision: 1,
                  //   },
                  // },
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
    reactRemoveProperties: true,
  },
  cacheComponents: true,
  compress: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    taint: true,
    browserDebugInfoInTerminal: true,
    // Inline critical CSS to reduce render-blocking
    inlineCss: true,
    optimizePackageImports: [
      '@phosphor-icons/react',
      '@react-three/drei',
      '@react-three/fiber',
      '@rive-app/react-webgl2',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tooltip',
      '@base-ui-components/react',
      'gsap',
      'three',
      'postprocessing',
      'lenis',
      'zustand',
      'lucide-react',
      'highlight.js',
      'hamo',
      'tempus',
      'posthog-js',
    ],
  },
  devIndicators: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.darkroom.engineering',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    qualities: [90],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'self';",
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ],
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
    {
      source: '/docs',
      destination: process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.tambo.co',
      permanent: true,
    },
    {
      source: '/docs/:path*',
      destination: process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.tambo.co',
      permanent: true,
    },
    {
      source: '/blog/posts',
      destination: '/blog',
      permanent: true,
    },
    {
      source: '/book',
      destination: 'https://cal.com/michaelmagan',
      permanent: false,
    },
    {
      source: '/discord',
      destination: 'https://discord.gg/dJNvPEHth6',
      permanent: false,
    },
    {
      source: '/gh',
      destination: 'https://github.com/tambo-ai/tambo',
      permanent: false,
    },
    {
      source: '/issue',
      destination: 'https://github.com/tambo-ai/tambo/issues/new',
      permanent: false,
    },
    // License, terms and Privacy pages are now local MDX pages
    // {
    //   source: '/license',
    //   destination:
    //     process.env.NEXT_PUBLIC_LICENSE_URL ||
    //     'https://docs.google.com/document/d/1UHvU9pKnuZ4wHRjxRk_8nqmeDK8KTmHc/edit?usp=sharing&ouid=105761745283245441798&rtpof=true&sd=true',
    //   permanent: false,
    // },
    // {
    //   source: '/privacy',
    //   destination:
    //     process.env.NEXT_PUBLIC_PRIVACY_URL ||
    //     'https://docs.google.com/document/d/1OFX8Y-uc7_TLDFUKxq3dYI0ozbpN8igD/edit?usp=sharing&ouid=105761745283245441798&rtpof=true&sd=true',
    //   permanent: false,
    // },
    // {
    //   source: '/terms',
    //   destination:
    //     process.env.NEXT_PUBLIC_TERMS_URL ||
    //     'https://docs.google.com/document/d/1GOjwt8tHx3AQ1SeZJ0rXhxuuSfRYnjLIaF02chvFqYo/edit?usp=sharing',
    //   permanent: false,
    // },
    {
      source: '/start',
      destination:
        'https://stackblitz.com/~/github.com/tambo-ai/tambo-template',
      permanent: false,
    },
    {
      source: '/x',
      destination: 'https://x.com/tambo_ai',
      permanent: false,
    },
  ],
  rewrites: async () => [
    {
      source: '/',
      destination: '/home',
    },
    // PostHog reverse proxy for more accurate tracking (avoids ad blockers)
    {
      source: '/ph/static/:path*',
      destination: 'https://us-assets.i.posthog.com/static/:path*',
    },
    {
      source: '/ph/:path*',
      destination: 'https://us.i.posthog.com/:path*',
    },
  ],
  // Webpack config for SVG handling and optional peer dependencies
  webpack: (config) => {
    // Add SVGR loader for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            memo: true,
            dimensions: false,
            svgoConfig: {
              multipass: true,
              plugins: [
                'removeDimensions',
                'removeOffCanvasPaths',
                'reusePaths',
                'removeElementsByAttr',
                'removeStyleElement',
                'removeScriptElement',
                'prefixIds',
                'cleanupIds',
              ],
            },
          },
        },
      ],
    })

    // Ignore optional peer dependencies for @tambo-ai/react
    config.resolve.alias = {
      ...config.resolve.alias,
      effect: false,
      sury: false,
    }
    return config
  },
}

// Nextra MDX config
const withNextra = nextra({
  defaultShowCopyCode: true,
  readingTime: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMdxFrontmatter, remarkInjectBlogLayout],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'github-light',
            dark: 'github-dark',
          },
          keepBackground: false,
          defaultLang: 'typescript',
        },
      ],
    ],
  },
})

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const NextApp = () => {
  const plugins = [withNextra, bundleAnalyzerPlugin]
  return plugins.reduce((config, plugin) => plugin(config), nextConfig)
}

export default NextApp
