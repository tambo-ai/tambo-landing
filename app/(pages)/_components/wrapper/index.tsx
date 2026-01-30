import cn from 'clsx'
import type { LenisOptions } from 'lenis'
import type { ThemeName } from '~/styles/config'
import { Lenis } from '../lenis'
import { Navigation } from '../navigation'
import { Theme } from '../theme'

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: ThemeName
  lenis?: boolean | LenisOptions
  githubStars?: string
}

export function Wrapper({
  children,
  theme = 'light',
  className,
  lenis = true,
  githubStars,
  ...props
}: WrapperProps) {
  const content = (
    <>
      <Navigation githubStars={githubStars} />
      <main
        className={cn('relative flex flex-col grow w-full', className)}
        {...props}
      >
        {children}
      </main>
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </>
  )

  return (
    <Theme theme={theme} global>
      {content}
    </Theme>
  )
}
