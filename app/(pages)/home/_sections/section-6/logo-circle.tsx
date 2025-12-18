import cn from 'clsx'
import {
  type ComponentProps,
  useEffectEvent,
  useImperativeHandle,
  useRef,
} from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { Image } from '~/components/image'
import { mapRange, truncate } from '~/libs/utils'

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
    highlight: true,
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

type LogosRingRef = {
  getElement: () => HTMLDivElement | null
  progressHighlight: (progress: number) => void
}

function LogosRing({
  logos,
  size,
  offset = 0,
  ref,
}: {
  ref?: React.RefObject<LogosRingRef | null>
  logos: { src: string; alt: string; highlight?: boolean }[]
  size: 'l' | 'm' | 's'
  offset?: number
}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const highlightRef = useRef<HTMLDivElement | null>(null)
  const highlightItemsRef = useRef<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => ({
    // scrollAnimation: () => {},
    // highlightAnimation: () => {},
    // chatMessagesAnimation: () => {},
    getElement: () => elementRef.current,
    progressHighlight: (progress: number) => {
      // console.log('progressHighlight', progress)
      if (borderRef.current) {
        borderRef.current.style.opacity = `${mapRange(0, 1, progress, 1, 0.25)}`
      }
      itemsRef.current.forEach((item) => {
        if (item) {
          item.style.opacity = `${mapRange(0, 1, progress, 1, 0.25)}`
        }
      })
      if (highlightRef.current) {
        highlightRef.current.style.opacity = `${mapRange(0, 1, progress, 0, 1)}`
        highlightRef.current.style.transform = `scale(${mapRange(0, 1, progress, 0.5, 1)})`
      }
      // if (highlightItemsRef.current) {
      //   highlightItemsRef.current.style.transform = `scale(${mapRange(0, 1, progress, 1, 1.1)})`
      // }
    },
  }))

  return (
    <div
      className={cn(
        'aspect-square rounded-full flex items-center justify-center',
        size === 'l' && 'dr-w-696 z-1',
        size === 'm' && 'dr-w-479 absolute',
        size === 's' && 'dr-w-231 absolute'
      )}
      ref={elementRef}
    >
      <div
        ref={borderRef}
        className="absolute inset-0 border-1 border-dashed border-dark-teal rounded-[inherit]"
      />
      {logos.map((logo, index) => (
        <LogoFrame
          src={logo.src}
          alt={logo.alt}
          size={size}
          key={logo.src}
          style={{
            top: `${truncate((-getRadialPosition(index, logos.length, offset).x + 1) * 50, 2)}%`,
            left: `${truncate((getRadialPosition(index, logos.length, offset).y + 1) * 50, 2)}%`,
            transform: `translate(-50%, -50%) rotate(${truncate(getRadialPosition(index, logos.length, offset).rotate, 2)}deg)`,
          }}
          ref={(node) => {
            if (logo.highlight) {
              highlightItemsRef.current = node
            } else {
              itemsRef.current[index] = node
            }
          }}
        >
          {logo.highlight && <Highlight ref={highlightRef} />}
        </LogoFrame>
      ))}
    </div>
  )
}

export function LogoCircle({ ref }: LogoCircleProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const smallCircleRef = useRef<LogosRingRef | null>(null)
  const midCircleRef = useRef<LogosRingRef | null>(null)
  const largeCircleRef = useRef<LogosRingRef | null>(null)

  const scrollAnimation = useEffectEvent((progress: number) => {
    const container = containerRef.current
    const smallCircle = smallCircleRef.current
    const midCircle = midCircleRef.current
    const largeCircle = largeCircleRef.current

    if (!(container && smallCircle && midCircle && largeCircle)) return

    container.style.transform = `scale(${mapRange(0, 1, progress, 0.5, 1)})`
    container.style.opacity = `${progress}`
    smallCircle.getElement()!.style.transform = `rotate(${mapRange(0, 1, progress, -90, 0)}deg)`
    midCircle.getElement()!.style.transform = `rotate(${mapRange(0, 1, progress, 90, 0)}deg)`
    largeCircle.getElement()!.style.transform = `rotate(${mapRange(0, 1, progress, -90, 0)}deg)`
  })

  const highlightAnimation = useEffectEvent((progress: number) => {
    console.log('highlightAnimation', progress)
    const smallCircle = smallCircleRef.current
    const midCircle = midCircleRef.current
    const largeCircle = largeCircleRef.current
    // const largeCircleOtherLogos = largeCircleOtherLogosRef.current
    // const gcalLogo = gcalLogoRef.current

    // if (!(smallCircle && midCircle && largeCircleOtherLogos && gcalLogo)) return

    // smallCircle.style.opacity = `${mapRange(0, 1, progress, 1, 0.3)}`
    // largeCircleOtherLogos.style.opacity = `${mapRange(0, 1, progress, 1, 0.3)}`
    // midCircle.style.opacity = `${mapRange(0, 1, progress, 1, 0.3)}`
    // gcalLogo.style.translate = `${mapRange(0, 1, progress, 0, 40)}%`

    if (smallCircle && midCircle && largeCircle) {
      smallCircle!.progressHighlight(progress)
      midCircle!.progressHighlight(progress)
      largeCircle!.progressHighlight(progress)
    }
  })

  useImperativeHandle(ref, () => ({
    scrollAnimation,
    highlightAnimation,
    chatMessagesAnimation: (progress: number) => {
      scrollAnimation(1 - progress)
      highlightAnimation(1 - progress)
    },
  }))

  return (
    <div className="flex items-center justify-center absolute top-1/2 left-1/2 -translate-1/2">
      <div
        ref={containerRef}
        className="absolute flex items-center justify-center"
      >
        <LogosRing logos={LARGE_CIRCLE_LOGOS} size="l" ref={largeCircleRef} />
        <LogosRing
          logos={MID_CIRCLE_LOGOS}
          size="m"
          offset={0.4}
          ref={midCircleRef}
        />
        <LogosRing logos={SMALL_CIRCLE_LOGOS} size="s" ref={smallCircleRef} />
      </div>
    </div>
  )
}

type LogoFrameProps = ComponentProps<'div'> & {
  src: string
  alt: string
  size?: 'l' | 'm' | 's'
}

function LogoFrame({
  className,
  src,
  alt,
  size,
  children,
  ...props
}: LogoFrameProps & { size?: 'l' | 'm' | 's' }) {
  return (
    <div
      className={cn(
        'absolute bg-white border border-dashed border-forest/30 grid place-items-center aspect-square shadow-m',
        size === 'l' && 'dr-size-120 dr-rounded-20',
        size === 'm' && 'dr-size-100 dr-rounded-17',
        size === 's' && 'dr-size-80 dr-rounded-14',
        className
      )}
      {...props}
    >
      <HashPattern className="absolute inset-0 text-dark-teal/50 opacity-60" />
      <div className="w-[63%] aspect-square relative">
        <Image src={src} alt={alt} fill />
      </div>
      {children}
    </div>
  )
}

function Highlight({ ref }: { ref?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ref}
      className="absolute w-[181%] border border-dashed border-dark-teal rounded-full aspect-square"
    >
      <div className="flex items-center dr-gap-4 rounded-full border-2 border-dark-grey bg-white dr-p-2 dr-pr-12 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute shadow-xs">
        <div className="dr-size-24 bg-mint rounded-full" />
        <p className="typo-button">Prompts</p>
      </div>
      <div className="flex items-center dr-gap-4 rounded-full border-2 border-dark-grey bg-white dr-p-2 dr-pr-12  left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 absolute shadow-xs">
        <div className="dr-size-24 bg-mint rounded-full" />
        <p className="typo-button">Elicitation</p>
      </div>
      <div className="flex items-center dr-gap-4 rounded-full border-2 border-dark-grey bg-white dr-p-2 dr-pr-12  left-1/2 top-full -translate-x-1/2 -translate-y-1/2 absolute shadow-xs">
        <div className="dr-size-24 bg-mint rounded-full" />
        <p className="typo-button">Resources</p>
      </div>
      <div className="flex items-center dr-gap-4 rounded-full border-2 border-dark-grey bg-white dr-p-2 dr-pr-12   left-full top-1/2 -translate-x-1/2 -translate-y-1/2 absolute shadow-xs">
        <div className="dr-size-24 bg-mint rounded-full" />
        <p className="typo-button">Sampling</p>
      </div>
    </div>
  )
}
