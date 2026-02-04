import { NextResponse } from 'next/server'

type ContactFormData = {
  name: string
  company_email: string
  use_case: string
  source: string
  submitted_at: string
}

function validateFormData(data: unknown): data is ContactFormData {
  if (typeof data !== 'object' || data === null) return false

  const fields = data as Record<string, unknown>
  return (
    typeof fields.name === 'string' &&
    typeof fields.company_email === 'string' &&
    typeof fields.use_case === 'string' &&
    typeof fields.source === 'string' &&
    typeof fields.submitted_at === 'string' &&
    fields.name.trim().length > 0 &&
    fields.company_email.trim().length > 0 &&
    fields.use_case.trim().length > 0 &&
    fields.source.trim().length > 0
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!validateFormData(body)) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.CLAY_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: response.status }
      )
    }

    // Handle potential non-JSON responses
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Return success for non-JSON responses
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
