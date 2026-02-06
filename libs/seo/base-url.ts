export function getBaseUrl(): string {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!rawBaseUrl && process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_BASE_URL environment variable must be set in production'
    )
  }

  return (rawBaseUrl || 'https://tambo.co').replace(/\/+$/, '')
}
