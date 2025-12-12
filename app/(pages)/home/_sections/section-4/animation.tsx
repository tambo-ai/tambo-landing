import cn from 'clsx'
import {
  type ComponentProps,
  use,
  useEffect,
  useEffectEvent,
  useRef,
} from 'react'
import { TimelineSectionContext } from '~/app/(pages)/home/_components/timeline-section'
import s from './animation.module.css'
import Selection from './selection.svg'

export function Animation() {
  const { addCallback } = use(TimelineSectionContext)

  const introRef = useRef<HTMLDivElement>(null)
  const seatsQuestionRef = useRef<HTMLParagraphElement>(null)

  const scrollAnimation = useEffectEvent((progress: number) => {
    console.log('scrollAnimation', progress)
  })

  useEffect(() => {
    addCallback(scrollAnimation)
  }, [addCallback])

  return (
    <div className="w-full aspect-668/470 dr-rounded-20 outline-7 outline-white/80 typo-p grid grid-cols-1 grid-rows-1 scale-90">
      <Card
        ref={introRef}
        className={cn('z-50 flex flex-col justify-end dr-gap-14', s.card)}
      >
        <p
          ref={seatsQuestionRef}
          className="dr-p-24 dr-rounded-12 bg-ghost-mint border border-dark-grey self-end"
        >
          What seats are available on my flight to Boston?
        </p>
        <div className="dr-p-24 dr-rounded-12 bg-ghost-mint border border-dark-grey self-start flex dr-gap-4 dr-h-67 items-center">
          <div className="dr-size-4 rounded-full bg-black" />
          <div className="dr-size-4 rounded-full bg-black" />
          <div className="dr-size-4 rounded-full bg-black" />
        </div>
      </Card>

      <Card className="z-40" />

      <Card className="z-30">
        <Selection />
      </Card>

      <Card className="z-20" />
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
