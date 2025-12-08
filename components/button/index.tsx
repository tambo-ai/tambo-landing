'use client'

import cn from 'clsx'
import { useState } from 'react'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import { Link } from '~/components/link'
import s from './button.module.css'

type ButtonProps = {
  className?: string
  href?: string
  as?: React.ElementType
  type?: 'primary' | 'secondary'
  color?: 'white' | 'black'
  snippet?: boolean
  disabled?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children: React.ReactNode
}

export function Button({
  className,
  href,
  as,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const baseClassName = cn(className, 'relative')

  if (href) {
    const Component = as || Link
    return React.createElement(Component, {
      href,
      className: baseClassName,
      children,
      ...props,
      onMouseEnter,
      onMouseLeave,
    })
  }

  return (
    <button
      className={baseClassName}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}

export function CTA({
  className,
  href,
  as,
  children,
  type = 'primary',
  color = 'white',
  snippet = false,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      <Button
        className={cn(
          'dt:dr-rounded-16 flex items-center dt:dr-pl-16 dt:dr-pr-8 dt:dr-py-8 dt:dr-h-52',
          s.button,
          color === 'black' && s.isBlack,
          type === 'secondary' && s.isSecondary,
          snippet && s.isSnippet,
          className
        )}
        href={href}
        as={as}
        {...props}
        onMouseEnter={() => {
          setIsHovered(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
        }}
      >
        <span className={cn(s.text, 'typo-button')}>{children}</span>
        <span
          className={cn(
            'dt:dr-w-32 dt:dr-h-32 bg-mint flex items-center justify-center dr-rounded-10',
            s.arrow
          )}
        >
          <ArrowSVG className="dt:dr-w-16 dt:dr-h-16 z-1" />
        </span>
      </Button>
      {snippet && (
        <button
          className={cn(
            'dr-rounded-16 absolute w-full top-full left-0 dr-mt-4 dr-pl-16 dr-pr-8 dr-pb-16 dr-pt-8 border-2 border-solid border-dark-grey transition-opacity duration-300 ease-in-out',
            isHovered
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          )}
          type="button"
        >
          <p className="typo-code-snippet">testing</p>
        </button>
      )}
    </div>
  )
}
