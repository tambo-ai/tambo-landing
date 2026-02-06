import * as z from 'zod'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { checkRateLimit } from '~/libs/rate-limit'
import {
  isDisposableEmail,
  isSpammyContent,
  isValidOrigin,
  isValidSubmissionTime,
  verifyTurnstileToken,
} from '~/libs/spam-protection'

const SOURCE_OPTIONS = [
  'Word of mouth',
  'GitHub',
  'X',
  'LinkedIn',
  'Reddit',
  'Slack/Discord',
  'Meetup/Conference',
  'ChatGPT/Claude',
  'Newsletter',
] as const

const contactFormSchema = z.object({
  name: z.string().trim().min(1).max(200),
  company_email: z.email().max(320),
  use_case: z.string().trim().min(10).max(5000),
  source: z.enum(SOURCE_OPTIONS),
  submitted_at: z.iso.datetime(),
  // Spam protection fields
  _hp: z.string().optional(), // honeypot
  _t: z.number().optional(), // form load timestamp
  _cf: z.string().optional(), // Turnstile token
})

const ALLOWED_ORIGINS = [
  'https://tambo.co',
  'https://www.tambo.co',
  process.env.NEXT_PUBLIC_BASE_URL,
].filter(Boolean) as string[]

// Silent fake success — prevents bots from learning what triggers rejection
function silentReject() {
  return NextResponse.json({ success: true })
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()

    // --- Origin check ---
    const origin = headersList.get('origin')
    if (!isValidOrigin(origin, ALLOWED_ORIGINS)) {
      return silentReject()
    }

    // --- Rate limiting ---
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { limited } = checkRateLimit(ip)
    if (limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // --- Parse and validate with Zod ---
    const body = await request.json()
    const result = contactFormSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    const data = result.data

    // --- Honeypot check ---
    if (data._hp) {
      return silentReject()
    }

    // --- Time-based detection ---
    if (data._t) {
      const timeCheck = isValidSubmissionTime(data._t)
      if (!timeCheck.valid) {
        if (timeCheck.reason === 'session_expired') {
          return NextResponse.json(
            { error: 'Form session expired. Please refresh the page.' },
            { status: 400 }
          )
        }
        return silentReject()
      }
    }

    // --- Disposable email check ---
    if (isDisposableEmail(data.company_email)) {
      return silentReject()
    }

    // --- Spam content check ---
    if (isSpammyContent(data.use_case)) {
      return silentReject()
    }

    // --- Turnstile verification ---
    if (data._cf) {
      const turnstileValid = await verifyTurnstileToken(data._cf)
      if (!turnstileValid) {
        return silentReject()
      }
    } else if (process.env.TURNSTILE_SECRET_KEY) {
      // Turnstile is configured but no token was provided — likely a bot
      return silentReject()
    }

    // --- Forward to Clay webhook ---
    const webhookUrl = process.env.CLAY_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      )
    }

    const webhookPayload = {
      name: data.name,
      company_email: data.company_email,
      use_case: data.use_case,
      source: data.source,
      submitted_at: data.submitted_at,
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const responseData = await response.json()
      return NextResponse.json(responseData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
