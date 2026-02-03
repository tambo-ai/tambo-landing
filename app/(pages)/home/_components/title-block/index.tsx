import cn from 'clsx'
import type { ComponentProps } from 'react'
import { CTA } from '~/components/button'

function TitleBlockRoot({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col items-center h-min', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function TitleBlockLeadIn({
  children,
  className,
  ...props
}: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'typo-label-m dt:typo-surtitle uppercase dr-mb-24 text-black/50',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function TitleBlockTitle({
  children,
  className,
  level: Tag = 'h2',
  ...props
}: ComponentProps<'h2'> & { level: 'h2' | 'h3' | 'h4' }) {
  return (
    <Tag
      className={cn('typo-h3 dt:typo-h2 text-center :last:dr-mb-40', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

function TitleBlockSubtitle({
  children,
  className,
  ...props
}: ComponentProps<'p'>) {
  return (
    <p className={cn('typo-p text-center text-black/50', className)} {...props}>
      {children}
    </p>
  )
}

function TitleBlockButton({ children, ...props }: ComponentProps<typeof CTA>) {
  return <CTA {...props}>{children}</CTA>
}

export const TitleBlock = TitleBlockRoot as typeof TitleBlockRoot & {
  LeadIn: typeof TitleBlockLeadIn
  Title: typeof TitleBlockTitle
  Button: typeof TitleBlockButton
  Subtitle: typeof TitleBlockSubtitle
}
TitleBlock.LeadIn = TitleBlockLeadIn
TitleBlock.Title = TitleBlockTitle
TitleBlock.Button = TitleBlockButton
TitleBlock.Subtitle = TitleBlockSubtitle
