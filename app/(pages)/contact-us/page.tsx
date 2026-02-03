'use client'

import cn from 'clsx'
import { useEffect, useState } from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { Dropdown } from '~/components/dropdown'
import { Wrapper } from '../_components/wrapper'
import s from './contact-us.module.css'

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

export default function ContactUsPage() {
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
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
    <Wrapper
      theme="light"
      lenis={{}}
      className="mx-auto bg-off-white max-w-screen dt:max-w-[calc(var(--max-width)*1px)]"
    >
      <div className={cn(s.container, mounted && s.mounted)}>
        <HashPattern className={s.background} />

        <div className={s.content}>
          {status === 'success' ? (
            <div className={cn(s.successMessage, s.fadeIn)}>
              <div className={s.successIcon}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 32L28 40L44 24"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className={cn('typo-h1', s.successTitle)}>
                Thanks for your request.
              </h1>
              <p className={cn('typo-p', s.successText)}>
                We'll get back to you soon!
              </p>
              <button
                onClick={() => setStatus('idle')}
                className={cn('typo-button', s.backButton)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className={s.header}>
                <h1 className={cn('typo-h1', s.title)}>
                  Got something in mind?
                </h1>
                <p className={cn('typo-p-l', s.subtitle)}>
                  Drop us a line and we'll get back to you{' '}
                  <span className={s.subtitleHighlight}>as soon as possible</span>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className={s.form}>
                <div className={s.field}>
                  <label htmlFor="name" className={cn('typo-label-m', s.label)}>
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={cn(s.input, errors.name && s.inputError)}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <span className={cn('typo-label-s', s.error)}>
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className={s.field}>
                  <label htmlFor="email" className={cn('typo-label-m', s.label)}>
                    Company email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={cn(s.input, errors.email && s.inputError)}
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <span className={cn('typo-label-s', s.error)}>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className={s.field}>
                  <label
                    htmlFor="useCase"
                    className={cn('typo-label-m', s.label)}
                  >
                    What's your use case for Tambo?
                  </label>
                  <textarea
                    id="useCase"
                    value={formData.useCase}
                    onChange={(e) => handleChange('useCase', e.target.value)}
                    className={cn(s.textarea, errors.useCase && s.inputError)}
                    placeholder="Tell us about your project..."
                    rows={4}
                  />
                  {errors.useCase && (
                    <span className={cn('typo-label-s', s.error)}>
                      {errors.useCase}
                    </span>
                  )}
                </div>

                <div className={s.field}>
                  <label htmlFor="source" className={cn('typo-label-m', s.label)}>
                    How did you hear about us?
                  </label>
                  <Dropdown
                    placeholder="Select an option"
                    options={SOURCE_OPTIONS}
                    defaultValue={formData.source ? SOURCE_OPTIONS.indexOf(formData.source) : undefined}
                    onChange={(index) => handleChange('source', SOURCE_OPTIONS[index])}
                  />
                  {errors.source && (
                    <span className={cn('typo-label-s', s.error)}>
                      {errors.source}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn('typo-button', s.submitButton, {
                    [s.loading]: status === 'loading',
                  })}
                >
                  {status === 'loading' ? (
                    <span className={s.loadingText}>
                      <span className={s.spinner} />
                      Sending...
                    </span>
                  ) : (
                    'Talk to Tambo'
                  )}
                </button>

                {status === 'error' && (
                  <div className={cn('typo-p', s.errorMessage)}>
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  )
}
