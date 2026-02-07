'use client'

import Script from 'next/script'

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script'
const TURNSTILE_LOADED_FLAG = '__turnstileLoaded'

export function TurnstileScript() {
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
  if (!siteKey) return null

  return (
    <Script
      id={TURNSTILE_SCRIPT_ID}
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="lazyOnload"
      onLoad={() => {
        const w = window as unknown as Record<string, boolean>
        if (w[TURNSTILE_LOADED_FLAG]) return
        w[TURNSTILE_LOADED_FLAG] = true
        window.dispatchEvent(new Event('turnstile:loaded'))
      }}
    />
  )
}
