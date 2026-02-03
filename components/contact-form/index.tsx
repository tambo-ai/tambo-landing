'use client'

import cn from 'clsx'
import { useState } from 'react'
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

  if (status === 'success') {
    return (
      <div
        className={cn(
          'text-center dr-py-80 dr-px-32 dt:dr-py-120 dt:dr-px-48 bg-white border-2 border-dark-grey dr-rounded-24 dt:dr-rounded-32 shadow-[0_8px_32px_rgba(15,26,23,0.08)]',
          s.fadeIn
        )}
      >
        <div
          className={cn(
            'dr-w-96 dr-h-96 dt:dr-w-112 dt:dr-h-112 mx-auto dr-mb-40 dt:dr-mb-48 text-forest',
            s.successIcon
          )}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M20 32L28 40L44 24"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="typo-h1 text-black dr-mb-20 dt:dr-mb-24 font-semibold">
          Thanks for your request.
        </h1>
        <p className="typo-p-l text-black dr-mb-48 dt:dr-mb-56 leading-[1.6] dr-max-w-340 dt:dr-max-w-420 mx-auto">
          We'll get back to you soon!
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="typo-button dr-py-16 dr-px-32 dt:dr-py-18 dt:dr-px-36 bg-teal text-black border-2 border-dark-grey dr-rounded-12 dt:dr-rounded-16 cursor-pointer transition-all duration-300 ease-out-cubic uppercase tracking-[0.05em] font-semibold hover:bg-mint hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(127,255,195,0.4)] hover:border-teal active:translate-y-0"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="text-center dr-mb-48 dt:dr-mb-64">
        <h1 className="typo-h1 text-black dr-mb-20 dt:dr-mb-28">
          Got something in mind?
        </h1>
        <p className="typo-p-l text-black dr-max-w-340 dt:dr-max-w-500 mx-auto leading-[1.6]">
          Drop us a line and we'll get back to you{' '}
          <span className="text-forest font-semibold relative whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:dr-h-6 dt:after:dr-h-8 after:bg-mint after:opacity-40 after:-z-10">
            as soon as possible
          </span>
          .
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-dark-grey dr-rounded-24 dt:dr-rounded-32 dr-p-32 dt:dr-p-48 backdrop-blur-[30px] shadow-[0_4px_24px_rgba(15,26,23,0.04)] relative overflow-visible"
      >
        <div className="dr-mb-24 dt:dr-mb-32 last:dr-mb-32 last:dt:dr-mb-40">
          <label
            htmlFor="name"
            className="typo-label-m block text-black dr-mb-8 dt:dr-mb-12 uppercase tracking-[0.05em]"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={cn(
              'w-full dr-py-16 dr-px-20 dt:dr-py-18 dt:dr-px-24 bg-off-white border-2 border-dark-grey dr-rounded-12 dt:dr-rounded-16 text-black font-[system-ui] dr-text-15 dt:dr-text-15 leading-[1.6] transition-all duration-300 ease-out-cubic placeholder:text-dark-teal placeholder:opacity-50 focus:outline-none focus:border-teal focus:bg-white focus:shadow-[0_0_0_4px_rgba(127,255,195,0.1)] hover:border-teal',
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
            className="typo-label-m block text-black dr-mb-8 dt:dr-mb-12 uppercase tracking-[0.05em]"
          >
            Company email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={cn(
              'w-full dr-py-16 dr-px-20 dt:dr-py-18 dt:dr-px-24 bg-off-white border-2 border-dark-grey dr-rounded-12 dt:dr-rounded-16 text-black font-[system-ui] dr-text-15 dt:dr-text-15 leading-[1.6] transition-all duration-300 ease-out-cubic placeholder:text-dark-teal placeholder:opacity-50 focus:outline-none focus:border-teal focus:bg-white focus:shadow-[0_0_0_4px_rgba(127,255,195,0.1)] hover:border-teal',
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
            className="typo-label-m block text-black dr-mb-8 dt:dr-mb-12 uppercase tracking-[0.05em]"
          >
            What's your use case for Tambo?
          </label>
          <textarea
            id="useCase"
            value={formData.useCase}
            onChange={(e) => handleChange('useCase', e.target.value)}
            className={cn(
              'w-full dr-py-16 dr-px-20 dt:dr-py-18 dt:dr-px-24 bg-off-white border-2 border-dark-grey dr-rounded-12 dt:dr-rounded-16 text-black font-[system-ui] dr-text-15 dt:dr-text-15 leading-[1.6] transition-all duration-300 ease-out-cubic placeholder:text-dark-teal placeholder:opacity-50 focus:outline-none focus:border-teal focus:bg-white focus:shadow-[0_0_0_4px_rgba(127,255,195,0.1)] hover:border-teal resize-vertical dr-min-h-120 dt:dr-min-h-140',
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
            className="typo-label-m block text-black dr-mb-8 dt:dr-mb-12 uppercase tracking-[0.05em]"
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

        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'typo-button w-full dr-py-18 dr-px-32 dt:dr-py-20 dt:dr-px-40 bg-teal text-black border-2 border-dark-grey dr-rounded-12 dt:dr-rounded-16 font-semibold uppercase tracking-[0.05em] cursor-pointer transition-all duration-300 ease-out-cubic relative hover:bg-mint hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(127,255,195,0.3)] hover:border-teal active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed',
            status === 'loading' && 'pointer-events-none'
          )}
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center dr-gap-12 dt:dr-gap-12">
              <span
                className={cn(
                  'dr-w-16 dr-h-16 dt:dr-w-16 dt:dr-h-16 border-2 border-black border-t-transparent rounded-full',
                  s.spinner
                )}
              />
              Sending...
            </span>
          ) : (
            'Talk to Tambo'
          )}
        </button>

        {status === 'error' && (
          <div className="typo-p text-red text-center dr-p-16 dt:dr-p-20 bg-[rgba(227,6,19,0.05)] dr-rounded-12 dt:dr-rounded-16 dr-mt-16 dt:dr-mt-20">
            Something went wrong. Please try again or email us directly.
          </div>
        )}
      </form>
    </>
  )
}

export default ContactForm
