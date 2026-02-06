const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'tempmail.com',
  'throwaway.email',
  '10minutemail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'grr.la',
  'dispostable.com',
  'maildrop.cc',
  'temp-mail.org',
  'fakeinbox.com',
  'emailondeck.com',
  'guerrillamail.info',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.de',
  'tempail.com',
  'tempr.email',
  'temp-mail.io',
  'mohmal.com',
  'burpcollaborator.net',
  'mailnesia.com',
  'spamgourmet.com',
  'trash-mail.com',
  'mytemp.email',
  'throwawaymail.com',
  'getnada.com',
  'mailsac.com',
  'harakirimail.com',
  'tmail.ws',
  'tempmailo.com',
  'disposableemailaddresses.emailmiser.com',
])

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return true
  return DISPOSABLE_DOMAINS.has(domain)
}

export function isSpammyContent(text: string): boolean {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|prince|inheritance|cryptocurrency\s+invest|earn\s+\$?\d{4,})\b/i,
    /(.)(\1{10,})/, // 10+ repeated characters
  ]

  // More than 2 URLs in the use case field
  const urlCount = (text.match(/https?:\/\//g) || []).length
  if (urlCount > 2) return true

  return spamPatterns.some((pattern) => pattern.test(text))
}

export function isValidOrigin(
  origin: string | null,
  allowedHosts: string[]
): boolean {
  if (!origin) return false
  try {
    const { host } = new URL(origin)
    return allowedHosts.includes(host)
  } catch {
    return false
  }
}

const MIN_SUBMISSION_TIME_MS = 3_000 // 3 seconds
const MAX_SUBMISSION_TIME_MS = 2 * 60 * 60 * 1000 // 2 hours

export function isValidSubmissionTime(loadedAt: number): {
  valid: boolean
  reason?: string
} {
  const elapsed = Date.now() - loadedAt

  if (elapsed < MIN_SUBMISSION_TIME_MS) {
    return { valid: false, reason: 'submitted_too_fast' }
  }

  if (elapsed > MAX_SUBMISSION_TIME_MS) {
    return { valid: false, reason: 'session_expired' }
  }

  return { valid: true }
}

export async function verifyTurnstileToken(
  token: string,
  remoteip?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // Skip verification if not configured

  const form = new URLSearchParams({ secret, response: token })
  if (remoteip) form.set('remoteip', remoteip)

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form,
      }
    )
    const data = await response.json()
    return data.success === true
  } catch {
    // Fail open if Turnstile is down — other layers still protect
    return true
  }
}
