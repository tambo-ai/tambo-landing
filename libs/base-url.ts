interface GetBaseUrlOptions {
  requireInProduction?: boolean
}

export function getBaseUrl(options: GetBaseUrlOptions = {}): string {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (
    options.requireInProduction &&
    process.env.NODE_ENV === 'production' &&
    !rawBaseUrl
  ) {
    throw new Error(
      'NEXT_PUBLIC_BASE_URL environment variable must be set in production'
    )
  }

  const baseUrl = rawBaseUrl ?? 'https://tambo.co'
  return baseUrl.replace(/\/+$/, '')
}
