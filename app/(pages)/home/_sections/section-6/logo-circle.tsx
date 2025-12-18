import cn from 'clsx'
import { type ComponentProps, useImperativeHandle } from 'react'
import { Image } from '~/components/image'
import { useDesktopVW } from '~/hooks/use-device-values'
import { HashPattern } from '../../_components/hash-pattern'
import s from './animation.module.css'

export type LogoCircleRef = {
  scrollAnimation: (progress: number) => void
  highlightAnimation: (progress: number) => void
  chatMessagesAnimation: (progress: number) => void
}

type LogoCircleProps = {
  ref: React.RefObject<LogoCircleRef | null>
}

const LARGE_CIRCLE_LOGOS = [
  {
    src: '/assets/logos/github.svg',
    alt: 'GitHub logo',
  },
  {
    src: '/assets/logos/outlook.svg',
    alt: 'Outlook logo',
  },
  {
    src: '/assets/logos/g-drive.svg',
    alt: 'Google Drive logo',
  },
  {
    src: '/assets/logos/zapier.svg',
    alt: 'Zapier logo',
  },
  {
    src: '/assets/logos/airbnb.svg',
    alt: 'Airbnb logo',
  },
  {
    src: '/assets/logos/notion.svg',
    alt: 'Notion logo',
  },
  {
    src: '/assets/logos/linear.svg',
    alt: 'Linear logo',
  },
  {
    src: 'assets/logos/g-cal.svg',
    alt: 'Google Calendar logo',
  },
]

const MID_CIRCLE_LOGOS = [
  {
    src: '/assets/logos/booking.svg',
    alt: 'Booking.com logo',
  },
  {
    src: '/assets/logos/figma.svg',
    alt: 'Figma logo',
  },
  {
    src: '/assets/logos/g-sheets.svg',
    alt: 'Google Sheets logo',
  },
  {
    src: '/assets/logos/g-mail.svg',
    alt: 'Google Mail logo',
  },
  {
    src: '/assets/logos/stripe.svg',
    alt: 'Stripe logo',
  },
  {
    src: '/assets/logos/airtable.svg',
    alt: 'Airtable logo',
  },
  {
    src: '/assets/logos/hubspot.svg',
    alt: 'Hubspot logo',
  },
  {
    src: '/assets/logos/shopify.svg',
    alt: 'Shopify logo',
  },
]

const SMALL_CIRCLE_LOGOS = [
  {
    src: '/assets/logos/framer.svg',
    alt: 'Framer logo',
  },
  {
    src: '/assets/logos/claude.svg',
    alt: 'Claude logo',
  },
  {
    src: '/assets/logos/youtube.svg',
    alt: 'YouTube logo',
  },
  {
    src: '/assets/logos/ms-teams.svg',
    alt: 'Microsoft Teams logo',
  },
]

function getRadialPosition(index: number, total: number, offset = 0) {
  // const offset = 0
  return {
    x: Math.cos(index * ((2 * Math.PI) / total) + offset),
    y: Math.sin(index * ((2 * Math.PI) / total) + offset),
    rotate: ((index + offset) * ((2 * Math.PI) / total) * 180) / Math.PI,
  }
}

function LogosRing({
  logos,
  size,
  offset = 0,
}: {
  logos: { src: string; alt: string }[]
  size: 'l' | 'm' | 's'
  offset?: number
}) {
  return (
    <div
      className={cn(
        'absolute aspect-square rounded-full flex items-center justify-center',
        size === 'l' && 'dr-w-696',
        size === 'm' && 'dr-w-479',
        size === 's' && 'dr-w-231'
      )}
    >
      <div className="absolute inset-0 border-1 border-dashed border-dark-teal rounded-[inherit]" />
      {logos.map((logo, index) => (
        <LogoFrame
          src={logo.src}
          size={size}
          key={logo.src}
          style={{
            top: `${(-getRadialPosition(index, logos.length, offset).x + 1) * 50}%`,
            left: `${(getRadialPosition(index, logos.length, offset).y + 1) * 50}%`,
            transform: `translate(-50%, -50%) rotate(${getRadialPosition(index, logos.length, offset).rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export function LogoCircle({ ref }: LogoCircleProps) {
  useImperativeHandle(ref, () => ({
    scrollAnimation: () => {},
    highlightAnimation: () => {},
    chatMessagesAnimation: () => {},
  }))

  return (
    <div className=" flex items-center justify-center absolute top-1/2 left-1/2 -translate-1/2">
      <LogosRing logos={LARGE_CIRCLE_LOGOS} size="l" />
      <LogosRing logos={MID_CIRCLE_LOGOS} size="m" offset={0.4} />
      <LogosRing logos={SMALL_CIRCLE_LOGOS} size="s" />
    </div>
  )
}

function SmallLogoFrame({
  alt,
  src,
  rotate,
}: Pick<LogoFrameProps, 'rotate' | 'src' | 'alt'>) {
  return (
    <LogoFrame
      className="dr-size-47"
      rotate={rotate}
      translateY={72}
      src={src}
      alt={alt}
      logoClassName="dr-size-30"
    />
  )
}

function MidLogoFrame({
  alt,
  src,
  rotate,
}: Pick<LogoFrameProps, 'rotate' | 'src' | 'alt'>) {
  return (
    <LogoFrame
      className="absolute dr-size-52"
      rotate={rotate}
      translateY={120}
      src={src}
      alt={alt}
      logoClassName="dr-size-34"
    />
  )
}

function LargeLogoFrame({
  alt,
  src,
  rotate,
  ref,
}: Pick<LogoFrameProps, 'rotate' | 'src' | 'alt'> & {
  ref?: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <LogoFrame
      ref={ref}
      className="absolute dr-size-69"
      rotate={rotate}
      translateY={188}
      src={src}
      alt={alt}
      logoClassName="dr-size-45"
    />
  )
}

type LogoFrameProps = ComponentProps<'div'> & {
  rotate: number
  translateY: number
  src: string
  alt: string
  logoClassName?: string
}

function LogoFrame({
  className,
  rotate,
  translateY,
  src,
  alt,
  logoClassName,
  children,
  size,
  ...props
}: LogoFrameProps & { size?: 'l' | 'm' | 's' }) {
  return (
    <div
      //   style={{
      //     '--logo-translate-y': translateY,
      //     '--logo-rotate': rotate,
      //   }}
      className={cn(
        'absolute bg-white border border-dashed border-forest/30 grid place-items-center aspect-square',
        size === 'l' && 'dr-size-120 dr-rounded-20',
        size === 'm' && 'dr-size-100 dr-rounded-17',
        size === 's' && 'dr-size-80 dr-rounded-14',
        s.logo,
        className
      )}
      {...props}
    >
      <HashPattern className="absolute inset-0 text-dark-teal/50 opacity-60" />
      <div className="w-[63%] aspect-square relative">
        <Image src={src} alt={alt} fill className={logoClassName} />
      </div>
      {children}
    </div>
  )
}
