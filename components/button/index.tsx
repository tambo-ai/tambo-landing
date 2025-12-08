import cn from 'clsx'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import { Link } from '~/components/link'
import s from './button.module.css'

type ButtonProps = {
  className?: string
  href?: string
  as?: React.ElementType
  type?: 'primary' | 'secondary'
  disabled?: boolean
  children: React.ReactNode
}

export function Button({
  className,
  href,
  as,
  children,
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
    })
  }

  return (
    <button
      className={baseClassName}
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
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn(
        'dt:dr-rounded-16 flex items-center dt:dr-pl-16 dt:dr-pr-8 dt:dr-py-8 dt:dr-h-52',
        s.button,
        className
      )}
      href={href}
      as={as}
      {...props}
    >
      <span className="typo-button ">{children}</span>
      <span
        className={cn(
          'dt:dr-w-32 dt:dr-h-32 bg-mint flex items-center justify-center dr-rounded-10',
          s.arrow
        )}
      >
        <ArrowSVG className="dt:dr-w-16 dt:dr-h-16 z-1" />
      </span>
    </Button>
  )
}
