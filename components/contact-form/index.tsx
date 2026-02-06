'use client'

import cn from 'clsx'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dropdown } from '~/components/dropdown'
import s from './contact-form.module.css'

type FormData = {
  name: string
  email: string
  useCase: string
  source: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

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
]

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: Record<string, unknown>
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    useCase: '',
    source: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  )

  // Spam protection state
  const [honeypot, setHoneypot] = useState('')
  const formLoadedAt = useRef(0)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string>(undefined)

  useEffect(() => {
    formLoadedAt.current = Date.now()
  }, [])

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!(siteKey && turnstileRef.current)) return

    const renderWidget = () => {
      if (!(window.turnstile && turnstileRef.current)) return
      turnstileWidgetId.current = window.turnstile.render(
        turnstileRef.current,
        {
          sitekey: siteKey,
          callback: handleTurnstileVerify,
          theme: 'light',
          size: 'flexible',
        }
      )
    }

    // If script already loaded, render immediately; otherwise wait for event
    if (window.turnstile) {
      renderWidget()
    } else {
      window.addEventListener('turnstile:loaded', renderWidget)
    }

    return () => {
      window.removeEventListener('turnstile:loaded', renderWidget)
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current)
      }
    }
  }, [handleTurnstileVerify])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.useCase.trim()) {
      newErrors.useCase = 'Please tell us about your use case'
    }

    if (!formData.source) {
      newErrors.source = 'Please select how you heard about us'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company_email: formData.email,
          use_case: formData.useCase,
          source: formData.source,
          submitted_at: new Date().toISOString(),
          _hp: honeypot,
          _t: formLoadedAt.current,
          ...(turnstileToken && { _cf: turnstileToken }),
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', useCase: '', source: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="bg-white border border-dark-grey dr-rounded-24 dt:dr-rounded-32 shadow-[0_8px_32px_rgba(15,26,23,0.08)] relative">
        {/* Success overlay - absolutely positioned over the form */}
        <div
          className={cn(
            'absolute inset-0 bg-white dr-p-32 dt:dr-p-48 flex flex-col justify-center text-center transition-opacity duration-300 dr-rounded-24 dt:dr-rounded-32',
            status === 'success' ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none z-0'
          )}
        >
          <CheckCircle2
            className={cn(
              'dr-w-96 dr-h-96 dt:dr-w-112 dt:dr-h-112 mx-auto dr-mb-40 dt:dr-mb-48 text-forest',
              status === 'success' && s.successIcon
            )}
            strokeWidth={1.5}
          />
          <h1 className="typo-h1 text-black dr-mb-20 dt:dr-mb-24 font-semibold">
            Thanks for your request.
          </h1>
          <p className="typo-p-l text-black dr-mb-48 dt:dr-mb-56 leading-[1.6] dr-max-w-340 dt:dr-max-w-420 mx-auto">
            We'll get back to you soon!
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="typo-button dr-py-16 dr-px-32 dt:dr-py-18 dt:dr-px-36 bg-teal text-black border border-dark-grey dr-rounded-12 dt:dr-rounded-16 cursor-pointer transition-all duration-300 ease-out-cubic uppercase tracking-[0.05em] font-semibold hover:bg-mint hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(127,255,195,0.4)] hover:border-teal active:translate-y-0 mx-auto"
          >
            Send another message
          </button>
        </div>

        {/* Form - always in DOM to maintain height */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            'dr-p-32 dt:dr-p-48 transition-opacity duration-300',
            status === 'success' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
        {/* Honeypot field — hidden from humans via CSS */}
        <div className={s.formHelper} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="one-time-code"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="dr-mb-24 dt:dr-mb-32 last:dr-mb-32 last:dt:dr-mb-40">
          <label
            htmlFor="name"
            className="typo-label-m block text-black dr-mb-8 dt:dr-mb-12 uppercase font-semibold tracking-[0.05em]"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={cn(
              'w-full dr-py-16 dr-px-20 dt:dr-py-18 dt:dr-px-24 bg-white border border-dark-grey dr-rounded-12 dt:dr-rounded-16 text-black font-[system-ui] dr-text-15 dt:dr-text-15 leading-[1.6] transition-all duration-300 ease-out-cubic placeholder:text-black/50 focus:outline-none focus:border-teal focus:shadow-[0_0_0_4px_rgba(127,255,195,0.1)] hover:border-teal',
              errors.name &&
                'border-red! focus:shadow-[0_0_0_4px_rgba(227,6,19,0.1)]!'
            )}
            placeholder="Your name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span
              id="name-error"
              className="typo-label-s block text-red dr-mt-6 dt:dr-mt-8"
              role="alert"
            >
              {errors.name}
            </span>
          )}
        </div>

        <div className="dr-mb-24 dt:dr-mb-32 last:dr-mb-32 last:dt:dr-mb-40">
          <label
            htmlFor="email"
            className="typo-label-m block text-black dr-mb-8 dt:dr-mb-12 uppercase font-semibold tracking-[0.05em]"
          >
            Company email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={cn(
              'w-full dr-py-16 dr-px-20 dt:dr-py-18 dt:dr-px-24 bg-white border border-dark-grey dr-rounded-12 dt:dr-rounded-16 text-black font-[system-ui] dr-text-15 dt:dr-text-15 leading-[1.6] transition-all duration-300 ease-out-cubic placeholder:text-black/50 focus:outline-none focus:border-teal focus:shadow-[0_0_0_4px_rgba(127,255,195,0.1)] hover:border-teal',
              errors.email &&
                'border-red! focus:shadow-[0_0_0_4px_rgba(227,6,19,0.1)]!'
            )}
            placeholder="you@company.com"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span
              id="email-error"
              className="typo-label-s block text-red dr-mt-6 dt:dr-mt-8"
              role="alert"
            >
              {errors.email}
            </span>
          )}
        </div>

        <div className="dr-mb-24 dt:dr-mb-32 last:dr-mb-32 last:dt:dr-mb-40">
          <label
            htmlFor="useCase"
            className="typo-label-m block text-black dr-mb-8 dt:dr-mb-12 uppercase font-semibold tracking-[0.05em]"
          >
            What's your use case for Tambo?
          </label>
          <textarea
            id="useCase"
            value={formData.useCase}
            onChange={(e) => handleChange('useCase', e.target.value)}
            className={cn(
              'w-full dr-py-16 dr-px-20 dt:dr-py-18 dt:dr-px-24 bg-white border border-dark-grey dr-rounded-12 dt:dr-rounded-16 text-black font-[system-ui] dr-text-15 dt:dr-text-15 leading-[1.6] transition-all duration-300 ease-out-cubic placeholder:text-black/50 focus:outline-none focus:border-teal focus:shadow-[0_0_0_4px_rgba(127,255,195,0.1)] hover:border-teal resize-vertical dr-min-h-120 dt:dr-min-h-140',
              errors.useCase &&
                'border-red! focus:shadow-[0_0_0_4px_rgba(227,6,19,0.1)]!'
            )}
            placeholder="Tell us about your project..."
            rows={4}
            required
            aria-invalid={!!errors.useCase}
            aria-describedby={errors.useCase ? 'useCase-error' : undefined}
          />
          {errors.useCase && (
            <span
              id="useCase-error"
              className="typo-label-s block text-red dr-mt-6 dt:dr-mt-8"
              role="alert"
            >
              {errors.useCase}
            </span>
          )}
        </div>

        <div className="dr-mb-32 dt:dr-mb-40">
          <label
            htmlFor="source"
            className="typo-label-m block text-black dr-mb-8 dt:dr-mb-12 uppercase font-semibold tracking-[0.05em]"
          >
            How did you hear about us?
          </label>
          <Dropdown
            placeholder="Select an option"
            options={SOURCE_OPTIONS}
            defaultValue={
              formData.source
                ? Math.max(0, SOURCE_OPTIONS.indexOf(formData.source))
                : undefined
            }
            onChange={(index) => {
              if (index >= 0 && index < SOURCE_OPTIONS.length) {
                handleChange('source', SOURCE_OPTIONS[index])
              }
            }}
          />
          {errors.source && (
            <span
              id="source-error"
              className="typo-label-s block text-red dr-mt-6 dt:dr-mt-8"
              role="alert"
            >
              {errors.source}
            </span>
          )}
        </div>

        {/* Cloudflare Turnstile widget */}
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div ref={turnstileRef} className="dr-mb-24 dt:dr-mb-32" />
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'typo-button w-full dr-py-18 dr-px-20 dt:dr-py-20 dt:dr-px-24 bg-teal text-black border border-dark-grey dr-rounded-12 dt:dr-rounded-16 font-semibold uppercase tracking-[0.05em] cursor-pointer transition-all duration-300 ease-out-cubic relative hover:bg-mint hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(127,255,195,0.3)] hover:border-teal active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed text-left',
            status === 'loading' && 'pointer-events-none'
          )}
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center dr-gap-12 dt:dr-gap-12">
              <Loader2 className={cn('dr-w-18 dr-h-18', s.spinner)} />
              Sending...
            </span>
          ) : (
            'Talk to Tambo Team'
          )}
        </button>

        {status === 'error' && (
          <div className="typo-p text-red text-center dr-p-16 dt:dr-p-20 bg-[rgba(227,6,19,0.05)] dr-rounded-12 dt:dr-rounded-16 dr-mt-16 dt:dr-mt-20">
            Something went wrong. Please try again or email us directly.
          </div>
        )}
        </form>
    </div>
  )
}
