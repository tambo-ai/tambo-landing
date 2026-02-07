'use client'

import Script from 'next/script'

export function TurnstileScript() {
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
  if (!siteKey) return null

  return (
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="lazyOnload"
      onLoad={() => window.dispatchEvent(new Event('turnstile:loaded'))}
    />
  )
}
