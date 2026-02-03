if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  const initPostHog = () => {
    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: '/ph',
        ui_host: 'https://us.posthog.com',
        cross_subdomain_cookie: true,
        persistence: 'localStorage+cookie',
        defaults: '2025-11-30',
      })
    })
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(initPostHog, { timeout: 3000 })
  } else {
    setTimeout(initPostHog, 1000)
  }
}
