import cn from 'clsx'
import Image from 'next/image'
import {
  type ComponentProps,
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  type TimelineCallback,
  TimelineSectionContext,
} from '~/app/(pages)/home/_components/timeline-section'
import { mapRange } from '~/libs/utils'
import s from './animation.module.css'
import { LogoCircle, type LogoCircleRef } from './logo-circle'

export function Animation() {
  const { addCallback } = use(TimelineSectionContext)

  const containerRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const logoCircleRef = useRef<LogoCircleRef | null>(null)

  const scrollAnimation = useEffectEvent<TimelineCallback>(({ steps }) => {
    // Elements
    const container = containerRef.current
    const chat = chatRef.current
    const chatMessages = chatMessagesRef.current
    const logoCircle = logoCircleRef.current

    if (!(container && chat && chatMessages && logoCircle)) return

    const safeZoneProgress = mapRange(0, 0.05, steps[0], 0, 1, true)
    const addToCalendarProgress = mapRange(0.1, 1, steps[0], 0, 1, true)
    const thinkingProgress = mapRange(0, 0.5, steps[1], 0, 1, true)
    const circleFocusProgress = mapRange(0.5, 1, steps[1], 0, 1, true)
    const highlightProgress = mapRange(0, 0.5, steps[2], 0, 1, true)
    const chatMessagesProgress = mapRange(0.5, 1, steps[2], 0, 1, true)

    if (safeZoneProgress === 1) {
      chatMessages.style.setProperty(
        '--chat-translate-y',
        `${mapRange(0, 1, addToCalendarProgress, 0, 84, true)}`
      )
    }

    if (addToCalendarProgress === 1) {
      chatMessages.style.setProperty(
        '--chat-translate-y',
        `${mapRange(0, 1, thinkingProgress, 84, 164, true)}`
      )
    }

    if (thinkingProgress === 1) {
      logoCircle.scrollAnimation(circleFocusProgress)
      container.style.setProperty(
        '--highlight-progress',
        `${circleFocusProgress}`
      )
      chat.style.scale = `${1 - circleFocusProgress * 0.2}`
      chat.style.opacity = `${mapRange(0, 1, circleFocusProgress, 1, 0.3)}`
    }

    if (circleFocusProgress === 1) {
      logoCircle.highlightAnimation(highlightProgress)
    }

    if (highlightProgress === 1) {
      logoCircle.chatMessagesAnimation(chatMessagesProgress)
      container.style.setProperty(
        '--highlight-progress',
        `${1 - chatMessagesProgress}`
      )
      chat.style.scale = `${mapRange(0, 1, chatMessagesProgress, 0.8, 1)}`
      chat.style.opacity = `${mapRange(0, 1, chatMessagesProgress, 0.3, 1)}`
    }
  })

  useEffect(() => {
    addCallback(scrollAnimation)
  }, [addCallback])

  return (
    <div ref={containerRef} className={cn('w-full', s.container)}>
      <div ref={chatRef} className={cn('relative w-full dr-h-470', s.chat)}>
        <div
          // ref={chatBackgroundRef}
          className="absolute inset-0 bg-white -z-1 dr-rounded-20 shadow-m"
        />
        <div
          // ref={chatBorderRef}
          className="absolute -inset-[6px] bg-white/80 -z-2 dr-rounded-26"
        />
        <div className="size-full overflow-hidden dr-p-14 border border-forest/50 dr-rounded-20">
          <div
            ref={chatMessagesRef}
            className={cn(
              'size-full flex flex-col justify-end ',
              s.chatMessages
            )}
          >
            <p className="self-end typo-p bg-off-white dr-rounded-12 dr-p-24 border border-dark-grey dr-mb-14">
              What can I do here?
            </p>
            <div className="self-start dr-mb-6">
              <div className="dr-w-306 dr-h-32 border border-grey dr-rounded-12 dr-mb-9" />
              <p className="typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey">
                Here are the best-rated activities in that area!
              </p>
            </div>
            <p className="self-start typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey dr-mb-14">
              Great pick for a history buff.
            </p>
            <p className="self-end typo-p bg-off-white dr-rounded-12 dr-p-24 border border-dark-grey dr-mb-14">
              Add the Freedom Trail Tour to my calendar
            </p>
            <div className="self-start dr-mb-6 flex dr-gap-6">
              <div className="bg-ghost-mint dr-rounded-12 h-full aspect-square border border-dark-grey" />
              <p className="typo-p-sentient bg-ghost-mint dr-rounded-12 dr-p-24 border border-dark-grey">
                You have a free spot Tuesday 15:00
              </p>
            </div>
            <div className="self-start bg-ghost-mint dr-rounded-12 dr-h-67 dr-p-4 dr-pl-8 flex items-center aspect-square border border-dark-grey dr-mb-6 opacity-0">
              <div className="h-5/6 dr-mx-4 dr-w-2 bg-dark-teal dr-mr-12" />
              <div className="flex flex-col dr-py-8 dr-gap-8">
                <p className="font-geist dr-text-16 whitespace-nowrap">
                  Freedom Trail Tour
                </p>
                <div className="flex dr-gap-16">
                  <p className="typo-p font-geist dr-text-12 whitespace-nowrap">
                    Tue, Jan 9
                  </p>
                  <p className="typo-p font-geist dr-text-12 whitespace-nowrap">
                    15:00 - 16:00
                  </p>
                </div>
              </div>
              <div className="h-full aspect-4/6 bg-white box-border border-2 border-dark-grey dr-rounded-8 dr-ml-24" />
            </div>
            <div className="self-start typo-p-sentient bg-mint dr-rounded-12 dr-py-13 dr-pl-16 dr-pr-24 border border-dark-grey flex dr-gap-16 items-center dr-mb-6">
              <div className="dr-h-40 aspect-square bg-black rounded-full" />
              <span>Are you sure you want to update your calendar?</span>
            </div>

            <div className="self-end flex dr-gap-8 dr-mb-14">
              <p className="typo-button uppercase dr-p-24 dr-rounded-12 border-2 border-dark-grey">
                yes, go ahead!
              </p>
              <p className="typo-button uppercase dr-p-24 dr-rounded-12 border-2 border-dark-grey bg-white">
                no, cancel!
              </p>
            </div>

            <div className="self-start">
              <div className="dr-w-306 dr-h-32 border border-grey dr-rounded-12 dr-mb-9" />
              <p className="typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey">
                Here are the best-rated activities in that area!
              </p>
            </div>
          </div>
        </div>
      </div>
      <LogoCircle ref={logoCircleRef} />

      {/* <div className="absolute top-0 -translate-y-full dr-pb-8 flex justify-start dr-gap-12 uppercase">
        <div className="flex items-center dr-gap-4 rounded-full border-2 border-dark-grey dr-p-2 dr-pr-12">
          <div className="dr-size-24 bg-off-white rounded-full" />
          <p className="typo-button">Prompts</p>
        </div>
        <div className="flex items-center dr-gap-4 rounded-full border-2 border-dark-grey dr-p-2 dr-pr-12">
          <div className="dr-size-24 bg-off-white rounded-full" />
          <p className="typo-button">Elicitation</p>
        </div>
        <div className="flex items-center dr-gap-4 rounded-full border-2 border-dark-grey dr-p-2 dr-pr-12">
          <div className="dr-size-24 bg-off-white rounded-full" />
          <p className="typo-button">Resources</p>
        </div>
        <div className="flex items-center dr-gap-4 rounded-full border-2 border-dark-grey dr-p-2 dr-pr-12">
          <div className="dr-size-24 bg-off-white rounded-full" />
          <p className="typo-button">Sampling</p>
        </div>
      </div> */}
    </div>
  )
}

// function LogoCircle({ ref }: LogoCircleProps) {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const smallCircleRef = useRef<HTMLDivElement>(null)
//   const midCircleRef = useRef<HTMLDivElement>(null)
//   const largeCircleRef = useRef<HTMLDivElement>(null)
//   const gcalLogoRef = useRef<HTMLDivElement>(null)
//   const largeCircleOtherLogosRef = useRef<HTMLDivElement>(null)

//   const scrollAnimation = useCallback((progress: number) => {
//     const container = containerRef.current
//     const smallCircle = smallCircleRef.current
//     const midCircle = midCircleRef.current
//     const largeCircle = largeCircleRef.current

//     if (!(container && smallCircle && midCircle && largeCircle)) return

//     container.style.scale = `${1 + progress * 0.5}`
//     container.style.opacity = `${progress}`
//     smallCircle.style.transform = `rotate(${progress * -90}deg)`
//     midCircle.style.transform = `rotate(${progress * 90}deg)`
//     largeCircle.style.transform = `rotate(${progress * -90}deg)`
//   }, [])

//   const highlightAnimation = useCallback((progress: number) => {
//     const smallCircle = smallCircleRef.current
//     const midCircle = midCircleRef.current
//     const largeCircleOtherLogos = largeCircleOtherLogosRef.current
//     const gcalLogo = gcalLogoRef.current

//     if (!(smallCircle && midCircle && largeCircleOtherLogos && gcalLogo)) return

//     smallCircle.style.opacity = `${mapRange(0, 1, progress, 1, 0.3)}`
//     largeCircleOtherLogos.style.opacity = `${mapRange(0, 1, progress, 1, 0.3)}`
//     midCircle.style.opacity = `${mapRange(0, 1, progress, 1, 0.3)}`
//     // gcalLogo.style.translate = `${mapRange(0, 1, progress, 0, 40)}%`
//   }, [])

//   const chatMessagesAnimation = useCallback((progress: number) => {
//     const container = containerRef.current
//     const smallCircle = smallCircleRef.current
//     const midCircle = midCircleRef.current
//     const largeCircle = largeCircleRef.current
//     const gcalLogo = gcalLogoRef.current

//     if (!(container && smallCircle && midCircle && largeCircle && gcalLogo))
//       return

//     // container.style.scale = `${1.5 - progress * 0.5}`
//     // smallCircle.style.transform = `rotate(${-90 - progress * 90}deg)`
//     // midCircle.style.transform = `rotate(${90 + progress * 90}deg)`
//     // largeCircle.style.transform = `rotate(${-90 - progress * 90}deg)`
//     // gcalLogo.style.translate = `${mapRange(0, 1, progress, 40, 150)}%`
//   }, [])

//   useImperativeHandle(ref, () => ({
//     scrollAnimation,
//     highlightAnimation,
//     chatMessagesAnimation,
//   }))

//   return (
//     <div
//       ref={containerRef}
//       className="absolute top-1/2 left-1/2 -translate-1/2 dr-size-470 flex items-center justify-center opacity-0"
//     >
//       <div
//         ref={smallCircleRef}
//         className="absolute dr-size-136 rounded-full border border-dark-grey flex items-center justify-center"
//       >
//         <SmallLogoFrame
//           rotate={0}
//           src="/assets/logos/ms-teams.svg"
//           alt="Microsoft Teams logo"
//         />
//         <SmallLogoFrame
//           rotate={90}
//           src="/assets/logos/framer.svg"
//           alt="Framer logo"
//         />
//         <SmallLogoFrame
//           rotate={180}
//           src="/assets/logos/claude.svg"
//           alt="Claude logo"
//         />
//         <SmallLogoFrame
//           rotate={270}
//           src="/assets/logos/youtube.svg"
//           alt="YouTube logo"
//         />
//       </div>
//       <div
//         ref={midCircleRef}
//         className="absolute dr-size-250 rounded-full border border-dark-grey flex items-center justify-center -rotate-22"
//       >
//         <MidLogoFrame
//           rotate={45 * 1}
//           src="/assets/logos/g-sheets.svg"
//           alt="Google Sheets logo"
//         />
//         <MidLogoFrame
//           rotate={45 * 2}
//           src="/assets/logos/g-mail.svg"
//           alt="Google Mail logo"
//         />
//         <MidLogoFrame
//           rotate={45 * 3}
//           src="/assets/logos/stripe.svg"
//           alt="Stripe logo"
//         />
//         <MidLogoFrame
//           rotate={45 * 4}
//           src="/assets/logos/airtable.svg"
//           alt="Airtable logo"
//         />
//         <MidLogoFrame
//           rotate={45 * 5}
//           src="/assets/logos/hubspot.svg"
//           alt="Hubspot logo"
//         />
//         <MidLogoFrame
//           rotate={45 * 6}
//           src="/assets/logos/shopify.svg"
//           alt="Shopify logo"
//         />
//         <MidLogoFrame
//           rotate={45 * 7}
//           src="/assets/logos/booking.svg"
//           alt="Booking.com logo"
//         />
//         <MidLogoFrame
//           rotate={45 * 8}
//           src="/assets/logos/figma.svg"
//           alt="Figma logo"
//         />
//       </div>
//       <div
//         ref={largeCircleRef}
//         className="absolute dr-size-400 flex items-center justify-center"
//       >
//         <LargeLogoFrame
//           ref={gcalLogoRef}
//           rotate={45 * 1}
//           src="/assets/logos/g-cal.svg"
//           alt="Google Calendar logo"
//         />
//         <div
//           ref={largeCircleOtherLogosRef}
//           className="size-full translate-[40%] -z-1"
//         >
//           <div className="absolute inset-0 rounded-full border border-dark-grey -translate-[40%]" />
//           <LargeLogoFrame
//             rotate={45 * 0}
//             src="/assets/logos/linear.svg"
//             alt="Linear logo"
//           />
//           <LargeLogoFrame
//             rotate={45 * 2}
//             src="/assets/logos/github.svg"
//             alt="GitHub logo"
//           />
//           <LargeLogoFrame
//             rotate={45 * 3}
//             src="/assets/logos/outlook.svg"
//             alt="Outlook logo"
//           />
//           <LargeLogoFrame
//             rotate={45 * 4}
//             src="/assets/logos/g-drive.svg"
//             alt="Google Drive logo"
//           />
//           <LargeLogoFrame
//             rotate={45 * 5}
//             src="/assets/logos/zapier.svg"
//             alt="Zapier logo"
//           />
//           <LargeLogoFrame
//             rotate={45 * 6}
//             src="/assets/logos/airbnb.svg"
//             alt="Airbnb logo"
//           />
//           <LargeLogoFrame
//             rotate={45 * 7}
//             src="/assets/logos/notion.svg"
//             alt="Notion logo"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

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
  ...props
}: LogoFrameProps) {
  return (
    <div
      style={{
        '--logo-translate-y': translateY,
        '--logo-rotate': rotate,
      }}
      className={cn(
        'absolute bg-white/80 border border-forest/30 grid place-items-center',
        s.logo,
        className
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        width={45}
        height={45}
        className={logoClassName}
      />
      {children}
    </div>
  )
}
