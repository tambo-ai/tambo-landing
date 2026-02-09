'use client'

import cn from 'clsx'
import React from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import CheckSVG from '~/assets/svgs/check.svg'
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
  ref?: React.Ref<HTMLButtonElement>
}

export function Button({
  className,
  href,
  as,
  ref,
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
      ref,
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
      ref={ref}
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

type CTAProps = ButtonProps & {
  wrapperRef?: React.RefObject<HTMLDivElement | null>
  wrapperClassName?: string
  snippetEyebrow?: string
  active?: boolean
}

export function CTA({
  wrapperRef,
  wrapperClassName,
  className,
  href,
  as,
  children,
  type = 'primary',
  color = 'white',
  snippet = false,
  snippetEyebrow = 'JSX',
  icon = 'arrow',
  active = false,
  ...props
}: CTAProps) {
  // Split children: first child = button text, rest = snippet content
  const childrenArray = React.Children.toArray(children)
  const buttonText =
    snippet && childrenArray.length > 1 ? childrenArray[0] : children
  const snippetContent =
    snippet && childrenArray.length > 1 ? childrenArray.slice(1) : null

  const contentRef = React.useRef<HTMLSpanElement>(null)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (!contentRef.current) return
    const text = contentRef.current.innerText
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      ref={wrapperRef}
      className={cn('relative', s.wrapper, wrapperClassName)}
    >
      <Button
        className={cn(
          'dr-rounded-16 flex items-center dr-gap-x-12 dt:dr-gap-x-0 dr-pl-16 dr-pr-8 dr-py-8 dr-h-48 relative overflow-hidden',
          s.button,
          color === 'black' && s.isBlack,
          type === 'secondary' && s.isSecondary,
          snippet && s.isSnippet,
          active && s.isActive,
          className
        )}
        href={href}
        as={as}
        {...props}
      >
        <span className={cn(s.text, 'typo-button text-nowrap z-1')}>
          {buttonText}
        </span>
        <span
          className={cn(
            'dr-w-32 dr-h-32 bg-mint flex items-center justify-center dr-rounded-10 shrink-0 z-1',
            s.arrow
          )}
        >
          <ButtonIcon icon={icon} />
        </span>
        {type !== 'secondary' && (
          <HashPattern
            className={cn('absolute inset-0 text-dark-teal/20', s.hashPattern)}
          />
        )}
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
          <span className="flex items-center justify-between ">
            <span className="typo-label-s text-teal">{snippetEyebrow}</span>
            <span className="relative flex items-center justify-center dt:dr-w-32 dt:dr-h-32 dr-rounded-10 bg-white/10 transition-colors duration-300 hover:bg-white/20">
              <ClipboardSVG
                className={cn(
                  'dt:dr-w-16 dt:dr-h-16 transition-opacity duration-300',
                  copied ? 'opacity-0' : 'opacity-100'
                )}
              />
              <CheckSVG
                className={cn(
                  'dt:dr-w-16 dt:dr-h-16 absolute transition-opacity duration-300 text-teal',
                  copied ? 'opacity-100' : 'opacity-0'
                )}
              />
            </span>
          </span>

          <span ref={contentRef} className="block text-nowrap text-left">
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
      {icon === 'arrow' && <ArrowSVG className="dr-w-16 dr-h-16 z-1" />}
      {icon === 'github' && <GithubSVG className="dr-w-24 dr-h-24 z-1" />}
      {icon === 'discord' && <DiscordSVG className="dr-w-24 dr-h-24 z-1" />}
    </>
  )
}
