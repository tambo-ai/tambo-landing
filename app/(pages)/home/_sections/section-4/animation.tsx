import cn from 'clsx'
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
import { mapRange } from '~/libs/utils'
import s from './animation.module.css'
import Selection from './selection.svg'

export function Animation() {
  const { addCallback } = use(TimelineSectionContext)

  const containerRef = useRef<HTMLDivElement>(null)
  const introCardRef = useRef<HTMLDivElement>(null)
  const seatsQuestionRef = useRef<HTMLParagraphElement>(null)
  const seatsThinkingRef = useRef<HTMLDivElement>(null)
  const selectionCardRef = useRef<HTMLDivElement>(null)
  const yourAppRef = useRef<HTMLDivElement>(null)
  const emptyCardRef = useRef<HTMLDivElement>(null)
  const backgroundCardRef = useRef<HTMLDivElement>(null)
  const seatMapRef = useRef<HTMLDivElement>(null)
  const seatMapTitleRef = useRef<HTMLParagraphElement>(null)
  const selectionRef = useRef<SVGSVGElement>(null)

  const scrollAnimation = useEffectEvent<TimelineCallback>(
    ({ progress, steps, currentStep }) => {
      // Elements
      const container = containerRef.current
      const introCard = introCardRef.current
      const seatsQuestion = seatsQuestionRef.current
      const seatsThinking = seatsThinkingRef.current
      const selectionCard = selectionCardRef.current
      const yourApp = yourAppRef.current
      const emptyCard = emptyCardRef.current
      const backgroundCard = backgroundCardRef.current
      const seatMap = seatMapRef.current
      const seatMapTitle = seatMapTitleRef.current
      const selection = selectionRef.current
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
          seatMap &&
          seatMapTitle &&
          selection
        )
      )
        return
      const seatsQuestionProgress = mapRange(0, 0.98, steps[0], 0, 1, true)
      const seatsThinkingProgress = mapRange(0.02, 0.5, steps[1], 0, 1, true)
      const skewProgress = mapRange(0.6, 1, steps[1], 0, 1, true)
      const highlightProgress = mapRange(0, 0.5, steps[2], 0, 1, true)
      const swapProgress = mapRange(0.5, 1, steps[2], 0, 1, true)

      if (seatsQuestionProgress < 1) {
        seatsQuestion.style.transform = `translateY(${mapRange(0, 1, seatsQuestionProgress, 150, 0)}%)`
        seatsQuestion.style.opacity = `${mapRange(0, 1, seatsQuestionProgress, 0, 1)}`
        return
      }

      if (seatsThinkingProgress < 1) {
        seatsThinking.style.transform = `translateY(${mapRange(0, 1, seatsThinkingProgress, 150, 0)}%)`
        seatsThinking.style.opacity = `${mapRange(0, 1, seatsThinkingProgress, 0, 1)}`
        seatsQuestion.style.transform = `translateY(${mapRange(0, 1, seatsThinkingProgress, 0, -100)}%)`
        return
      }

      if (skewProgress < 1) {
        container.style.setProperty('--skew-progress', `${skewProgress}`)
        container.style.setProperty('--deg', `${skewProgress * -10}deg`)
        yourApp.style.transform = `translateY(${mapRange(0, 1, skewProgress, 100, 25)}%)`
        yourApp.style.opacity = `${mapRange(0, 1, skewProgress, 0, 1)}`
        introCard.style.opacity = `${mapRange(0, 1, skewProgress, 1, 0.2)}`
        emptyCard.style.opacity = `${mapRange(0, 1, skewProgress, 1, 0.2)}`
        backgroundCard.style.opacity = `${mapRange(0, 1, skewProgress, 1, 0.2)}`
        return
      }

      if (highlightProgress < 1) {
        selectionCard.style.setProperty(
          '--highlight-progress',
          `${highlightProgress}`
        )
        seatMap.style.opacity = `${mapRange(0, 1, highlightProgress, 0, 1)}`
        seatMapTitle.style.transform = `translateY(${mapRange(0, 1, highlightProgress, 50, 0)}%)`
        seatMapTitle.style.opacity = `${mapRange(0, 1, highlightProgress, 0, 1)}`
        return
      }

      if (swapProgress < 1) {
        container.style.setProperty('--skew-progress', `${1 - swapProgress}`)
        selectionCard.style.setProperty(
          '--highlight-progress',
          `${1 - swapProgress}`
        )
        container.style.setProperty('--deg', `${(1 - swapProgress) * -10}deg`)
        introCard.style.opacity = `${mapRange(0, 1, swapProgress, 0.2, 0)}`
        emptyCard.style.opacity = `${mapRange(0, 1, swapProgress, 0.2, 0)}`
        selection.style.opacity = `${mapRange(0, 1, swapProgress, 1, 0)}`
        seatMap.style.transform = `scale(${mapRange(0, 1, swapProgress, 1, 1.7)}) translateY(${mapRange(0, 1, swapProgress, 0, 14)}%)`
        seatMap.style.outlineWidth = `${mapRange(0, 1, swapProgress, 4, 0)}px`
        yourApp.style.opacity = `${mapRange(0, 1, swapProgress, 1, 0)}`
        return
      }
    }
  )

  useEffect(() => {
    addCallback(scrollAnimation)
  }, [addCallback])

  return (
    <div
      ref={containerRef}
      className="w-full aspect-668/470 dr-rounded-20 typo-p grid grid-cols-1 grid-rows-1 scale-90"
    >
      <Card
        ref={introCardRef}
        className={cn('z-50 flex flex-col justify-end dr-gap-14', s.card)}
      >
        <p
          ref={seatsQuestionRef}
          className="absolute dr-p-24 dr-rounded-12 bg-ghost-mint border border-dark-grey self-end opacity-0"
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
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-3/4 dr-w-190 dr-h-25 rounded-full bg-white shadow-xs opacity-0"
        />
        <Selection ref={selectionRef} />
        <div
          ref={seatMapRef}
          className="absolute dr-left-16 dr-top-16 dr-rounded-8 dr-w-222 dr-h-226 outline-4 outline-mint bg-red shadow-xs opacity-0 origin-top-left"
        >
          <p
            ref={seatMapTitleRef}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 typo-p-s bg-mint dr-px-16 dr-py-6 rounded-full shadow-xs translate-full"
          >
            {'<'}SeatMap{'>'}
          </p>
          <div className="size-full dr-p-24" />
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
        'relative z-20 size-full col-start-1 col-end-1 row-start-1 row-end-1 border border-dark-grey bg-white dr-p-16 dr-rounded-20',
        s.card,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
