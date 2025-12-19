import cn from 'clsx'
import { use, useEffect, useEffectEvent, useRef } from 'react'
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
    // console.log('scrollAnimation', steps)
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

    logoCircle.scrollAnimation(circleFocusProgress)

    if (thinkingProgress === 1) {
      container.style.setProperty(
        '--highlight-progress',
        `${circleFocusProgress}`
      )
      chat.style.scale = `${1 - circleFocusProgress * 0.2}`
      chat.style.opacity = `${mapRange(0, 1, circleFocusProgress, 1, 0.3)}`
    }

    // if (circleFocusProgress === 1) {
    logoCircle.highlightAnimation(highlightProgress)
    // }

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
        <div className="size-full overflow-hidden dr-p-16 dashed-border dr-rounded-20">
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
