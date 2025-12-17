import cn from 'clsx'
import { use, useEffect, useEffectEvent, useRef } from 'react'
import {
  type TimelineCallback,
  TimelineSectionContext,
} from '~/app/(pages)/home/_components/timeline-section'
import { mapRange } from '~/libs/utils'
import s from './animation.module.css'

export function Animation() {
  const { addCallback } = use(TimelineSectionContext)

  const containerRef = useRef<HTMLDivElement>(null)

  const scrollAnimation = useEffectEvent<TimelineCallback>(({ steps }) => {
    // Elements
    const container = containerRef.current

    if (!container) return

    const safeZoneProgress = mapRange(0, 0.05, steps[0], 0, 1, true)
  })

  useEffect(() => {
    addCallback(scrollAnimation)
  }, [addCallback])

  return (
    <div ref={containerRef} className={cn('w-full', s.container)}>
      <div className={cn('relative w-full', s.chat)}>
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
            // ref={chatMessagesRef}
            className={cn(
              'size-full flex flex-col justify-end ',
              s.chatMessages
            )}
          >
            <p className="self-start typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey">
              Window seat confirmed. Booking 12F!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
