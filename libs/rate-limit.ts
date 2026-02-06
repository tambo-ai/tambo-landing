// In-memory rate limiter. Best-effort in serverless (state not shared across instances).
// Sufficient for a marketing contact form; upgrade to Upstash Redis if exact limiting is needed.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5
const MAX_KEYS = 10_000

export function checkRateLimit(ip: string): {
  limited: boolean
  retryAfter?: number
} {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  // Cleanup: expire old entries probabilistically + enforce hard cap
  if (Math.random() < 0.01 || rateLimitMap.size > MAX_KEYS) {
    for (const [key, val] of rateLimitMap) {
      if (val.resetAt < now) rateLimitMap.delete(key)
    }
    // If still over cap after expiring, evict oldest entries
    if (rateLimitMap.size > MAX_KEYS) {
      for (const [key] of rateLimitMap) {
        rateLimitMap.delete(key)
        if (rateLimitMap.size <= MAX_KEYS) break
      }
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
