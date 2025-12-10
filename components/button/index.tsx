'use client'

import cn from 'clsx'
import React from 'react'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import ClipboardSVG from '~/assets/svgs/clipboard.svg'
import DiscordSVG from '~/assets/svgs/discord.svg'
import GithubSVG from '~/assets/svgs/github.svg'
import { Link } from '~/components/link'
import s from './button.module.css'

type ButtonProps = {
  className?: string
  href?: string
  as?: React.ElementType
  type?: 'primary' | 'secondary'
  color?: 'white' | 'black'
  icon?: 'arrow' | 'github' | 'discord'
  snippet?: boolean
  disabled?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children: React.ReactNode
}

export function Button({
  className,
  href,
  as,
  children,
  onClick,
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
      onClick,
    })
  }

  return (
    <button
      className={baseClassName}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
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
  icon = 'arrow',
  ...props
}: ButtonProps) {
  // Split children: first child = button text, rest = snippet content
  const childrenArray = React.Children.toArray(children)
  const buttonText =
    snippet && childrenArray.length > 1 ? childrenArray[0] : children
  const snippetContent =
    snippet && childrenArray.length > 1 ? childrenArray.slice(1) : null

  const contentRef = React.useRef<HTMLSpanElement>(null)

  const handleCopy = () => {
    if (!contentRef.current) return
    const text = contentRef.current.innerText
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={cn('relative', s.wrapper)}>
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
      >
        <span className={cn(s.text, 'typo-button')}>{buttonText}</span>
        <span
          className={cn(
            'dt:dr-w-32 dt:dr-h-32 bg-mint flex items-center justify-center dr-rounded-10',
            s.arrow
          )}
        >
          <ButtonIcon icon={icon} />
        </span>
      </Button>
      {snippet && (
        <button
          className={cn(
            'dr-rounded-16 absolute top-full left-0 w-full dr-mt-2 dr-pl-16 dr-pr-8 dr-pb-16 dr-pt-8 border-2 border-solid border-dark-grey',
            s.snippet
          )}
          type="button"
          onClick={handleCopy}
        >
          <span className="flex items-center justify-between dt:dr-mb-24">
            <span className="typo-label-s text-white">JSX</span>
            <span className="flex items-center justify-center dt:dr-w-32 dt:dr-h-32 dr-rounded-10 bg-white/10">
              <ClipboardSVG className="dt:dr-w-16 dt:dr-h-16" />
            </span>
          </span>

          <span ref={contentRef} className="block">
            {snippetContent}
          </span>
        </button>
      )}
    </div>
  )
}

export function ButtonIcon({ icon }: { icon: 'arrow' | 'github' | 'discord' }) {
  return (
    <>
      {icon === 'arrow' && <ArrowSVG className="dt:dr-w-16 dt:dr-h-16 z-1" />}
      {icon === 'github' && <GithubSVG className="dt:dr-w-24 dt:dr-h-24 z-1" />}
      {icon === 'discord' && (
        <DiscordSVG className="dt:dr-w-24 dt:dr-h-24 z-1" />
      )}
    </>
  )
}
