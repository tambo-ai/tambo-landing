import cn from 'clsx'
import gsap from 'gsap'
import {
  type ComponentProps,
  use,
  useEffect,
  useEffectEvent,
  useRef,
} from 'react'
import {
  type TimelineCallback,
  TimelineSectionContext,
} from '~/app/(pages)/home/_components/timeline-section'
import Cursor from '~/assets/svgs/cursor.svg'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { mapRangeWithSnap as mapRange } from '~/libs/utils'
import { colors } from '~/styles/colors'
import s from './animation.module.css'
import Package from './package.svg'
import { SeatMap, type SeatMapRef } from './seat-map'
import Selection from './selection.svg'

export function Animation({
  ref,
}: {
  ref?: React.RefCallback<HTMLDivElement>
}) {
  const { addCallback } = use(TimelineSectionContext)
  const { isDesktop } = useDeviceDetection()

  const containerRef = useRef<HTMLDivElement>(null)
  const introCardRef = useRef<HTMLDivElement>(null)
  const seatsQuestionRef = useRef<HTMLParagraphElement>(null)
  const seatsThinkingRef = useRef<HTMLDivElement>(null)
  const selectionCardRef = useRef<HTMLDivElement>(null)
  const yourAppRef = useRef<HTMLDivElement>(null)
  const emptyCardRef = useRef<HTMLDivElement>(null)
  const backgroundCardRef = useRef<HTMLDivElement>(null)
  const seatMapContainerRef = useRef<HTMLDivElement>(null)
  const seatMapComponentRef = useRef<SeatMapRef>(null)
  const selectionRef = useRef<SVGSVGElement>(null)
  const availableSeatsRef = useRef<HTMLParagraphElement>(null)
  const bookingConfirmedRef = useRef<HTMLParagraphElement>(null)
  const cursorRef = useRef<SVGSVGElement>(null)

  const scrollAnimation = useEffectEvent<TimelineCallback>(({ steps }) => {
    // Elements
    const container = containerRef.current
    const introCard = introCardRef.current
    const seatsQuestion = seatsQuestionRef.current
    const seatsThinking = seatsThinkingRef.current
    const selectionCard = selectionCardRef.current
    const yourApp = yourAppRef.current
    const emptyCard = emptyCardRef.current
    const backgroundCard = backgroundCardRef.current
    const seatMapContainer = seatMapContainerRef.current
    const selection = selectionRef.current
    const availableSeats = availableSeatsRef.current
    const bookingConfirmed = bookingConfirmedRef.current
    const cursor = cursorRef.current
    const seatMapComponent = seatMapComponentRef.current

    if (
      !(
        container &&
        introCard &&
        seatsQuestion &&
        seatsThinking &&
        selectionCard &&
        yourApp &&
        emptyCard &&
        backgroundCard &&
        seatMapContainer &&
        selection &&
        availableSeats &&
        bookingConfirmed &&
        cursor &&
        seatMapComponent
      )
    )
      return

    const containerProgress = mapRange(0, 0.1, steps[0], 0, 1, true)
    const seatsQuestionProgress = mapRange(0.2, 0.98, steps[0], 0, 1, true)
    const seatsThinkingProgress = mapRange(0.02, 0.5, steps[1], 0, 1, true)
    const skewProgress = mapRange(0.6, 1, steps[1], 0, 1, true)
    const highlightProgress = mapRange(0, 0.5, steps[2], 0, 1, true)
    const swapProgress = mapRange(0.5, 1, steps[2], 0, 1, true)
    const selectProgress = mapRange(0.3, 1, steps[3], 0, 1, true)

    const momentsTopGradient = document.getElementById('moments-top-gradient')
    const momentsBottomGradient = document.getElementById(
      'moments-bottom-gradient'
    )
    if (momentsTopGradient && momentsBottomGradient) {
      momentsTopGradient.style.opacity = `${containerProgress}`
      momentsBottomGradient.style.opacity = `${containerProgress}`
    }

    // Intro
    container.style.opacity = `${
      // biome-ignore lint/style/noNestedTernary: needed
      isDesktop ? (containerProgress > 0 ? 1 : 0) : 1
    }`

    // Seats Question
    seatsQuestion.style.setProperty(
      '--sq-transform-intro',
      `${mapRange(0, 1, seatsQuestionProgress, 150, 0)}`
    )
    seatsQuestion.style.opacity = `${mapRange(0, 1, seatsQuestionProgress, 0, 1)}`

    // Seats Thinking
    seatsThinking.style.transform = `translateY(${mapRange(0, 1, seatsThinkingProgress, 150, 0)}%)`
    seatsThinking.style.opacity = `${mapRange(0, 1, seatsThinkingProgress, 0, 1)}`
    seatsQuestion.style.setProperty(
      '--sq-transform-seats-thinking',
      `${mapRange(0, 1, seatsThinkingProgress, 0, -100)}`
    )
    seatsQuestion.style.backgroundColor = gsap.utils.interpolate(
      colors['ghost-mint'],
      colors['off-white'],
      seatsThinkingProgress
    )

    // Skew
    container.style.setProperty('--skew-progress', `${skewProgress}`)
    container.style.setProperty('--deg-progress', `${skewProgress * -10}deg`)
    yourApp.style.transform = `translateY(${mapRange(0, 1, skewProgress, 100, 0)}%)`
    backgroundCard.style.opacity = `${mapRange(0, 1, skewProgress, 1, 0.2)}`

    // Skew and swap affected elements
    yourApp.style.opacity = `${skewProgress - swapProgress}`
    introCard.style.opacity = `${mapRange(0, 1, skewProgress, 1, 0.2) - mapRange(0, 1, swapProgress, 0, 0.2)}`
    emptyCard.style.opacity = `${mapRange(0, 1, skewProgress, 1, 0.2) - mapRange(0, 1, swapProgress, 0, 0.2)}`

    // Highlight
    selectionCard.style.setProperty(
      '--highlight-progress',
      `${highlightProgress - swapProgress}`
    )
    seatMapContainer.style.opacity = `${mapRange(0, 1, highlightProgress, 0, 1)}`
    seatMapComponent.highlightTitleAnimation(highlightProgress)

    // Swap
    container.style.setProperty('--deskew-progress', `${swapProgress}`)
    container.style.setProperty('--dedeg-progress', `${swapProgress * -10}deg`)
    selection.style.opacity = `${mapRange(0, 1, swapProgress, 1, 0)}`
    seatMapContainer.style.scale = `${mapRange(0, 1, swapProgress, 0.65, 1)}`
    seatMapComponent.highlightSeatsAnimation(swapProgress)

    // Swap and select affected elements
    seatMapContainer.style.transform = `translate(${mapRange(0, 1, swapProgress, 1.2, 0)}%, ${mapRange(0, 1, swapProgress, 0.2, 26) - mapRange(0.6, 1, selectProgress, 0, 24, true)}%)`
    availableSeats.style.opacity = `${mapRange(0.6, 1, swapProgress, 0, 1) - mapRange(0.6, 1, selectProgress, 0, 1)}`

    // Select
    cursor.style.transform = `translate(${mapRange(0, 0.5, selectProgress, 150, 0, true) + mapRange(0.6, 1, selectProgress, 0, 150, true)}px, ${mapRange(0, 0.5, selectProgress, 150, 0, true) + mapRange(0.6, 1, selectProgress, 0, 150, true)}px)`
    cursor.style.opacity = `${mapRange(0, 0.5, selectProgress, 0, 1, true) - mapRange(0.6, 1, selectProgress, 0, 1, true)}`
    bookingConfirmed.style.opacity = `${mapRange(0.6, 1, selectProgress, 0, 1)}`
    seatMapComponent.highlightSeatAnimation(
      mapRange(0.48, 0.6, selectProgress, 0, 1, true)
    )

    // EXIT
    const section5Container = document.getElementById('section-5-container')
    if (swapProgress === 1 && section5Container) {
      section5Container.style.display = 'none'
      container.style.display = 'grid'
    }
  })

  useEffect(() => {
    addCallback(scrollAnimation)
  }, [addCallback])

  return (
    <div
      id="section-4-container"
      ref={(el) => {
        containerRef.current = el
        ref?.(el)
      }}
      className={cn(
        'w-full aspect-668/470 dr-rounded-20 typo-p grid grid-cols-1 grid-rows-1 opacity-0',
        s.container
      )}
    >
      <Card
        ref={introCardRef}
        className={cn(
          'z-50 flex flex-col justify-end dr-gap-14 overflow-hidden shadow-m',
          s.card
        )}
      >
        <p
          ref={seatsQuestionRef}
          className={cn(
            'absolute dr-p-24 dr-rounded-12 bg-ghost-mint border border-dark-grey self-end opacity-0',
            s.seatsQuestion
          )}
        >
          What seats are available on my flight to Boston?
        </p>
        <div
          ref={seatsThinkingRef}
          className="absolute dr-p-24 dr-rounded-12 bg-ghost-mint border border-dark-grey self-start flex dr-gap-4 dr-h-67 items-center opacity-0"
        >
          <div className="dr-size-4 rounded-full bg-black" />
          <div className="dr-size-4 rounded-full bg-black" />
          <div className="dr-size-4 rounded-full bg-black" />
        </div>
      </Card>

      <Card ref={emptyCardRef} className="z-40" />

      <Card
        ref={selectionCardRef}
        className="relative z-30 outline-7 outline-white/80"
      >
        <div
          ref={yourAppRef}
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-3/4 rounded-full bg-white shadow-xs opacity-0 flex dr-p-2 dr-pr-12 dr-gap-8 items-center border-2 border-dark-grey"
        >
          <div className="dr-size-24 bg-black rounded-full grid place-items-center">
            <Package className="dr-size-16" />
          </div>
          <p className="typo-button uppercase">your app/components</p>
        </div>
        <Selection ref={selectionRef} />
        <div
          ref={seatMapContainerRef}
          className={cn(
            'absolute dr-w-340 dr-h-344 dr-left-14 dr-top-16 opacity-0 origin-top-left scale-65',
            s.seatMap
          )}
        >
          <p
            ref={availableSeatsRef}
            className="absolute left-0 -translate-y-full -dr-top-20 typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey opacity-0 whitespace-nowrap"
          >
            Here are the available seats on your flight!
          </p>

          <SeatMap ref={seatMapComponentRef} />
          <Cursor
            ref={cursorRef}
            className="absolute dr-size-24 dr-right-6 dr-top-223 opacity-0"
          />
          <p
            ref={bookingConfirmedRef}
            className="absolute left-0 -dr-bottom-20 translate-y-full typo-p-sentient bg-ghost-mint dr-rounded-12 dr-p-24 border border-dark-grey opacity-0"
          >
            Window seat confirmed. Booking 12F!
          </p>
        </div>
      </Card>

      <Card ref={backgroundCardRef} className="z-20" />
    </div>
  )
}

function Card({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative z-20 size-full col-start-1 col-end-1 row-start-1 row-end-1 dashed-border bg-white dr-p-16 dr-rounded-20',
        s.card,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
