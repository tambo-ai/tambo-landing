const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5

export function checkRateLimit(ip: string): {
  limited: boolean
  retryAfter?: number
} {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  // Probabilistic cleanup of expired entries
  if (Math.random() < 0.01) {
    for (const [key, val] of rateLimitMap) {
      if (val.resetAt < now) rateLimitMap.delete(key)
    }
  }

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { limited: false }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { limited: true, retryAfter: entry.resetAt - now }
  }

  entry.count++
  return { limited: false }
}
