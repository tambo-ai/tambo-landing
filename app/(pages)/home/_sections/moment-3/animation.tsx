import cn from 'clsx'
import gsap from 'gsap'
import Image from 'next/image'
import { use, useEffect, useEffectEvent, useRef } from 'react'
import {
  type TimelineCallback,
  TimelineSectionContext,
} from '~/app/(pages)/home/_components/timeline-section'
import Cursor from '~/assets/svgs/cursor.svg'
import PlusIcon from '~/assets/svgs/plus.svg'
import { mapRange } from '~/libs/utils'
import { colors } from '~/styles/colors'
import {
  ProcessBubble,
  type ProcessBubbleAnimateRef,
} from '../moment-2/animation'
import s from './animation.module.css'
import CalendarIcon from './calendar.svg'
import ClockIcon from './clock.svg'
import { LogoCircle, type LogoCircleRef } from './logo-circle'
import QuestionMarkIcon from './question-mark.svg'

export function Animation() {
  const { addCallback } = use(TimelineSectionContext)

  const containerRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const logoCircleRef = useRef<LogoCircleRef | null>(null)
  const calendarImageRef = useRef<HTMLImageElement>(null)
  const calendarFreeSpotRef = useRef<HTMLParagraphElement>(null)
  const calendarThinkingRef = useRef<HTMLDivElement>(null)
  const freedomTrailRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const sureUpdateCalendarRef = useRef<HTMLDivElement>(null)
  const confirmingBackgroundRef = useRef<HTMLDivElement>(null)
  const confirmingTextRef = useRef<HTMLParagraphElement>(null)
  const confirmingThinkingRef = useRef<HTMLDivElement>(null)
  const addFreedomTrailRef = useRef<HTMLParagraphElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const chatOverlayBackgroundRef = useRef<HTMLDivElement>(null)
  const yesButtonRef = useRef<HTMLParagraphElement>(null)
  const processBubbleRef = useRef<ProcessBubbleAnimateRef>(null)

  const scrollAnimation = useEffectEvent<TimelineCallback>(({ steps }) => {
    // console.log('scrollAnimation', steps)
    // Elements
    const container = containerRef.current
    const chat = chatRef.current
    const chatMessages = chatMessagesRef.current
    const logoCircle = logoCircleRef.current
    const calendarImage = calendarImageRef.current
    const calendarThinking = calendarThinkingRef.current
    const calendarFreeSpot = calendarFreeSpotRef.current
    const freedomTrail = freedomTrailRef.current
    const cursor = cursorRef.current
    const sureUpdateCalendar = sureUpdateCalendarRef.current
    const confirmingBackground = confirmingBackgroundRef.current
    const confirmingText = confirmingTextRef.current
    const confirmingThinking = confirmingThinkingRef.current
    const addFreedomTrail = addFreedomTrailRef.current
    const calendar = calendarRef.current
    const chatOverlayBackground = chatOverlayBackgroundRef.current
    const yesButton = yesButtonRef.current
    const processBubble = processBubbleRef.current

    if (
      !(
        container &&
        chat &&
        chatOverlayBackground &&
        chatMessages &&
        logoCircle &&
        calendarImage &&
        calendarThinking &&
        calendarFreeSpot &&
        freedomTrail &&
        cursor &&
        sureUpdateCalendar &&
        confirmingBackground &&
        confirmingText &&
        confirmingThinking &&
        addFreedomTrail &&
        calendar &&
        yesButton &&
        processBubble
      )
    )
      return

    const safeZoneProgress = mapRange(0, 0.05, steps[0], 0, 1, true)
    const containerProgress = mapRange(0.05, 0.1, steps[0], 0, 1, true)
    const addToCalendarProgress = mapRange(0.5, 1, steps[0], 0, 1, true)
    const thinkingProgress = mapRange(0, 0.4, steps[1], 0, 1, true)
    const circleFocusProgress = mapRange(0.6, 0.8, steps[1], 0, 1, true)
    const highlightProgress = mapRange(0.8, 1, steps[1], 0, 1, true)
    const chatMessagesProgress = mapRange(0.1, 0.5, steps[2], 0, 1, true)
    const freedomTrailProgress = mapRange(0.55, 0.7, steps[2], 0, 1, true)
    const freedomTrailHighlightProgress = mapRange(
      0.7,
      0.9,
      steps[2],
      0,
      1,
      true
    )
    const sureUpdateCalendarProgress = mapRange(0, 0.3, steps[3], 0, 1, true)
    const confirmUpdateCalendarProgress = mapRange(
      0.3,
      0.6,
      steps[3],
      0,
      1,
      true
    )
    const addingToCalendarProgress = mapRange(0.6, 1, steps[3], 0, 1, true)
    const addedToCalendarProgress = mapRange(0.2, 0.6, steps[4], 0, 1, true)
    const exitProgress = mapRange(0.8, 1, steps[4], 0, 1, true)

    const section5Container = document.getElementById('section-5-container')

    if (safeZoneProgress === 1 && section5Container) {
      section5Container.style.display = 'none'
      container.style.display = 'block'
    }

    if (containerProgress === 1) {
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
      addFreedomTrail.style.backgroundColor = gsap.utils.interpolate(
        colors['ghost-mint'],
        colors['off-white'],
        thinkingProgress
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
      calendarImage.style.opacity = `${mapRange(0.4, 1, chatMessagesProgress, 0, 1)}`
      calendarThinking.style.opacity = `${mapRange(0, 0.6, chatMessagesProgress, 1, 0)}`
      calendarFreeSpot.style.opacity = `${chatMessagesProgress}`
      calendarFreeSpot.style.translate = `${mapRange(0, 1, chatMessagesProgress, -50, 0)}% 0`
    }

    if (chatMessagesProgress === 1) {
      chatMessages.style.setProperty(
        '--chat-translate-y',
        `${mapRange(0, 1, freedomTrailProgress, 164, 238, true)}`
      )
      freedomTrail.style.opacity = `${freedomTrailProgress}`
      calendar.style.backgroundColor = gsap.utils.interpolate(
        colors['ghost-mint'],
        colors['light-gray'],
        freedomTrailProgress
      )
      calendarFreeSpot.style.backgroundColor = gsap.utils.interpolate(
        colors['ghost-mint'],
        colors['light-gray'],
        freedomTrailProgress
      )
    }

    if (freedomTrailProgress === 1) {
      cursor.style.opacity = `${freedomTrailHighlightProgress}`
      cursor.style.translate = `${mapRange(0, 1, freedomTrailHighlightProgress, 100, 0)}% ${mapRange(0, 1, freedomTrailHighlightProgress, 200, 0)}%`
      if (freedomTrailHighlightProgress > 0.8) {
        freedomTrail.setAttribute('data-active', 'true')
      } else {
        freedomTrail.removeAttribute('data-active')
      }
    }

    if (freedomTrailHighlightProgress === 1) {
      if (sureUpdateCalendarProgress > 0.4) {
        freedomTrail.removeAttribute('data-active')
      }
      chatMessages.style.setProperty(
        '--chat-translate-y',
        `${mapRange(0, 1, sureUpdateCalendarProgress, 238, 384, true)}`
      )
      cursor.style.opacity = `${1 - sureUpdateCalendarProgress}`
      cursor.style.translate = `${mapRange(0, 1, sureUpdateCalendarProgress, 0, 300)}% ${mapRange(0, 1, sureUpdateCalendarProgress, 0, -100)}%`
      sureUpdateCalendar.style.opacity = `${sureUpdateCalendarProgress}`
    }

    if (sureUpdateCalendarProgress === 1) {
      chatOverlayBackground.style.opacity = `${mapRange(0, 0.3, confirmUpdateCalendarProgress, 0, 1)}`
      cursor.style.opacity = `${confirmUpdateCalendarProgress}`
      cursor.style.translate = `${mapRange(0, 1, confirmUpdateCalendarProgress, 300, 700)}% ${mapRange(0, 1, confirmUpdateCalendarProgress, -100, 650)}%`

      if (confirmUpdateCalendarProgress > 0.7) {
        yesButton.setAttribute('data-hover', 'true')
      } else {
        yesButton.removeAttribute('data-hover')
      }
    }

    if (confirmUpdateCalendarProgress === 1) {
      if (addingToCalendarProgress > 0.2) {
        yesButton.setAttribute('data-active', 'true')
        yesButton.removeAttribute('data-hover')
      } else {
        yesButton.removeAttribute('data-active')
      }

      chatMessages.style.setProperty(
        '--chat-translate-y',
        `${mapRange(0, 1, addingToCalendarProgress, 384, 508, true)}`
      )
      chatOverlayBackground.style.opacity = `${mapRange(0, 0.3, addingToCalendarProgress, 1, 0)}`
      cursor.style.opacity = `${1 - addingToCalendarProgress}`
      cursor.style.translate = `${mapRange(0, 1, addingToCalendarProgress, 700, 900)}% ${mapRange(0, 1, addingToCalendarProgress, 650, 1000)}%`
    }

    if (addingToCalendarProgress === 1) {
      confirmingBackground.style.setProperty(
        '--added-to-calendar-progress',
        `${mapRange(0, 0.5, addedToCalendarProgress, 0, 1, true)}`
      )
      processBubble.animateDetail(addedToCalendarProgress)
      confirmingText.style.opacity = `${mapRange(0.4, 0.8, addedToCalendarProgress, 0, 1)}`
      confirmingThinking.style.opacity = `${mapRange(0, 0.4, addedToCalendarProgress, 1, 0)}`
    }

    if (addedToCalendarProgress === 1) {
      container.style.opacity = `${1 - exitProgress}`
    }
  })

  useEffect(() => {
    addCallback(scrollAnimation)
  }, [addCallback])

  return (
    <div
      id="section-6-container"
      ref={containerRef}
      className={cn('dr-w-668 hidden', s.container)}
    >
      <div ref={chatRef} className={cn('relative w-full dr-h-470', s.chat)}>
        <div
          // ref={chatBackgroundRef}
          className="absolute inset-0 bg-white -z-1 dr-rounded-20 shadow-m"
        />
        <div
          // ref={chatBorderRef}
          className="absolute -inset-[6px] bg-white/80 -z-2 dr-rounded-26"
        />
        <div className="size-full overflow-hidden dr-p-14 dashed-border dr-rounded-20">
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
              <div className="dr-w-173 dr-h-32 border border-grey dr-rounded-12 dr-mb-9 font-geist dr-text-10 flex items-center justify-start">
                <div className="relative flex justify-center items-center dr-size-14 dr-mr-6 dr-ml-8">
                  <svg
                    className="absolute left-0 size-full"
                    viewBox="0 0 13 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Checkmark Icon</title>
                    <path
                      d="M0.75 5.25L4.25 8.75L12.25 0.75"
                      stroke="#7FFFC3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>found some activities for you</span>
              </div>
              <p className="typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey">
                Here are the best-rated activities in that area!
              </p>
            </div>
            <p className="self-start typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey dr-mb-14">
              Great pick for a history buff.
            </p>
            <p
              ref={addFreedomTrailRef}
              className="self-end typo-p bg-ghost-mint dr-rounded-12 dr-p-24 border border-dark-grey dr-mb-14"
            >
              Add the Freedom Trail Tour to my calendar
            </p>
            <div className="self-start dr-mb-6 flex dr-gap-6">
              <div
                ref={calendarRef}
                className="bg-ghost-mint dr-rounded-12 h-full aspect-square border border-dark-grey dr-p-10 relative z-10"
              >
                <Image
                  ref={calendarImageRef}
                  src="/assets/logos/g-cal.svg"
                  alt="Google Calendar"
                  width={200}
                  height={200}
                  className="size-full opacity-0"
                />
                <div
                  ref={calendarThinkingRef}
                  className="absolute left-1/2 top-1/2 -translate-1/2 flex dr-gap-4 items-center"
                >
                  <div className="dr-size-4 rounded-full bg-black" />
                  <div className="dr-size-4 rounded-full bg-black" />
                  <div className="dr-size-4 rounded-full bg-black" />
                </div>
              </div>
              <p
                ref={calendarFreeSpotRef}
                className="typo-p-sentient bg-ghost-mint dr-rounded-12 dr-p-24 border border-dark-grey opacity-0 -translate-x-1/2"
              >
                You have a free spot Tuesday 15:00
              </p>
            </div>
            <div
              ref={freedomTrailRef}
              className="group self-start bg-ghost-mint data-active:bg-black dr-rounded-12 dr-h-67 dr-p-4 dr-pl-8 flex items-center aspect-square border border-dark-grey data-active:border-teal data-active:text-teal transition-all duration-300 dr-mb-6 opacity-0 relative"
            >
              <div className="h-5/6 dr-mx-4 dr-w-2 bg-dark-teal dr-mr-12 group-data-active:bg-teal" />
              <div className="flex flex-col dr-py-8 dr-gap-6 dr-mb-2">
                <p className="font-geist dr-text-16 whitespace-nowrap">
                  Freedom Trail Tour
                </p>
                <div className="flex dr-gap-16">
                  <div className="flex dr-gap-4 items-center">
                    <CalendarIcon className="dr-size-16 group-data-active:opacity-40" />
                    <p className="typo-p font-geist dr-text-12 whitespace-nowrap">
                      Tue, Jan 9
                    </p>
                  </div>
                  <div className="flex dr-gap-4 items-center">
                    <ClockIcon className="dr-size-16 group-data-active:opacity-40" />
                    <p className="typo-p font-geist dr-text-12 whitespace-nowrap">
                      15:00 - 16:00
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-full aspect-4/6 bg-white group-data-active:bg-teal group-data-active:text-black box-border border-2 border-dark-grey group-data-active:border-teal dr-rounded-8 dr-ml-24 grid place-items-center">
                <PlusIcon className="icon dr-size-16" />
              </div>
              <Cursor
                ref={cursorRef}
                className="absolute dr-size-24 right-0 bottom-0 translate-y-[200%] translate-x-full opacity-0 z-50"
              />
            </div>

            <div
              ref={chatOverlayBackgroundRef}
              className={cn(
                'absolute -dr-inset-x-16 h-screen bg-white/60 pointer-events-none z-20 opacity-0',
                s.chatOverlayBackground
              )}
            />
            <div
              ref={sureUpdateCalendarRef}
              className="self-start typo-p-sentient bg-mint dr-rounded-12 dr-py-13 dr-pl-16 dr-pr-24 border border-dark-grey flex dr-gap-16 items-center dr-mb-6 opacity-0 relative z-30"
            >
              <div className="dr-h-40 aspect-square bg-black text-teal rounded-full grid place-items-center">
                <QuestionMarkIcon className="icon dr-size-24" />
              </div>
              <span>Are you sure you want to update your calendar?</span>
            </div>

            <div className="self-end flex dr-gap-8 dr-mb-14 relative z-30">
              <div
                ref={yesButtonRef}
                className="group relative typo-button uppercase dr-p-24 dr-rounded-12 border-2 border-dark-grey data-hover:border-teal bg-white data-hover:bg-black data-hover:text-teal transition-all duration-300 overflow-hidden"
              >
                <div
                  className={cn(
                    'absolute inset-0 pointer-events-none opacity-0 group-data-hover:opacity-20 group-data-active:opacity-100',
                    s.yesButtonBackground
                  )}
                />
                <p className="relative z-10">yes, go ahead!</p>
              </div>
              <p className="typo-button uppercase dr-p-24 dr-rounded-12 border-2 border-dark-grey bg-white">
                no, cancel!
              </p>
            </div>

            <div className="self-start">
              <ProcessBubble
                animateRef={processBubbleRef}
                text1="adding new event in “BostonTrip” calendar..."
                text2="“Boston Trip” calendar updated!"
                width1={239}
                width2={185}
              />
              <div
                ref={confirmingBackgroundRef}
                className={cn(
                  'typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey relative',
                  s.confirmingBackground
                )}
              >
                <p
                  ref={confirmingTextRef}
                  className="whitespace-nowrap opacity-0"
                >
                  You're all set for Tuesday. Enjoy the tour!
                </p>
                <div
                  ref={confirmingThinkingRef}
                  className="absolute dr-left-40 top-1/2 -translate-1/2 flex dr-gap-4 items-center"
                >
                  <div className="dr-size-4 rounded-full bg-black" />
                  <div className="dr-size-4 rounded-full bg-black" />
                  <div className="dr-size-4 rounded-full bg-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoCircle ref={logoCircleRef} />
    </div>
  )
}
