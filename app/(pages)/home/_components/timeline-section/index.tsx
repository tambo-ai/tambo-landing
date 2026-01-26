'use client'
import cn from 'clsx'
import gsap from 'gsap'
import {
  createContext,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { messages as messagesType } from '~/app/(pages)/home/_sections/moment-1/data'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { colors } from '~/styles/colors'
import CursorClickIcon from './cursor-click.svg'
import SealCheckIcon from './seal-check.svg'
import s from './timeline-section.module.css'

export const TimelineSectionContext = createContext<{
  callbacks: RefObject<TimelineCallback[]>
  addCallback: (callback: TimelineCallback) => void
}>({
  callbacks: { current: [] },
  addCallback: () => {
    /* NO OP */
  },
})

const STEPS = 5
type CallbackParams = {
  progress: number
  steps: number[]
  currentStep: number
}
export type TimelineCallback = (params: CallbackParams) => void

export function TimelineSection({
  id,
  messages,
  title,
  children,
  ref,
  proxyChildren,
  proxyPosition = 'start',
  href,
}: {
  id: string
  messages: typeof messagesType
  title: string
  children?: React.ReactNode
  ref?: React.RefCallback<HTMLElement | null>
  proxyChildren?: React.ReactNode
  proxyPosition?: 'start' | 'end'
  href?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [messagesVisible, setMessagesVisible] = useState(0)
  const whiteLineRef = useRef<HTMLDivElement>(null)
  const callbacks = useRef<TimelineCallback[]>([])
  const addCallback = useCallback((callback: TimelineCallback) => {
    callbacks.current.push(callback)
  }, [])
  const messagesRef = useRef<HTMLUListElement>(null)
  const { isDesktop } = useDeviceDetection()
  const hasPlayed = useRef(false)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const STEP_DURATION = 1 // 1 second per step

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true

          // Create GSAP timeline
          const tl = gsap.timeline()
          timelineRef.current = tl

          // Animate through each step
          for (let step = 1; step <= STEPS; step++) {
            tl.call(
              () => {
                setMessagesVisible(step)

                // Update white line progress
                if (whiteLineRef.current) {
                  const lineProgress = (100 / STEPS) * step
                  const mappedLineProgress = 100 - lineProgress * 0.82
                  whiteLineRef.current.style.translate = `0 -${Math.max(mappedLineProgress, 8)}%`
                }

                // Call registered callbacks
                const steps = Array.from({ length: STEPS }, (_, i) =>
                  i < step ? 1 : 0
                )
                for (const callback of callbacks.current) {
                  callback({ progress: step / STEPS, steps, currentStep: step })
                }

                // Mobile horizontal scroll
                if (messagesRef.current && !isDesktop) {
                  messagesRef.current.style.transform = `translateX(${(-messagesRef.current.scrollWidth / 4) * Math.min(3, Math.max(0, step - 1))}px)`
                }
              },
              [],
              step === 1 ? 0 : `+=${STEP_DURATION}`
            )
          }
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      timelineRef.current?.kill()
    }
  }, [isDesktop])

  return (
    <TimelineSectionContext.Provider value={{ callbacks, addCallback }}>
      <section
        id={id}
        ref={(node) => {
          sectionRef.current = node
          ref?.(node)
        }}
      >
        <div className="dr-layout-grid-inner h-screen">
          <div className="col-span-4 flex flex-col dr-pt-80 dt:dr-pt-112 max-dt:dr-pb-16 max-dt:h-screen">
            <div className="relative">
              <h3 className="relative typo-h1 dt:typo-h2 text-center dt:text-left z-10">
                {title}
              </h3>
              <div
                className="hidden dt:block absolute -dr-inset-y-12 dr-left-40 dr-w-4"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 0%, #E5F0ED 10%, #E5F0ED 90%, transparent 97%)',
                }}
              />
            </div>
            <div className="relative dr-py-40 max-dt:mt-auto dt:mask-[linear-gradient(to_bottom,transparent_0%,black_5%)]">
              <div className="absolute z-15 dr-w-32 dt:inset-y-0 max-dt:h-[102vw] max-dt:-dr-mt-6 max-dt:-rotate-90 max-dt:-dr-top-40 left-[calc(var(--safe)+32vw)]  dt:dr-left-26">
                <div
                  className="absolute inset-y-0 dr-left-16 w-px z-1"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg,#80C1A2 0 8px,#0000 0 14px)',
                  }}
                />
                <div
                  ref={whiteLineRef}
                  className="dr-w-9 h-[110%] bg-white rounded-full shadow-xs mx-auto"
                  style={{
                    translate: '0px -90%',
                  }}
                />
                <div className="dt:hidden absolute inset-0 flex flex-col justify-around items-center dr-py-16 z-10">
                  <div className="dr-size-10 rounded-full border border-dark-teal bg-light-gray" />
                  <div className="dr-size-10 rounded-full border border-dark-teal bg-light-gray" />
                  <div className="dr-size-10 rounded-full border border-dark-teal bg-light-gray" />
                  <div className="dr-size-10 rounded-full border border-dark-teal bg-light-gray" />
                </div>
              </div>
              <div>
                <ul
                  ref={messagesRef}
                  className="flex dt:flex-col dr-gap-4 dt:items-start transition-transform duration-300 ease-gleasing"
                >
                  {messages.map((message, idx) => {
                    const isLast = idx === messages.length - 1
                    const isActive =
                      idx === messagesVisible - 1 ||
                      (isLast && messagesVisible >= messages.length)
                    return (
                      <TimelineItem
                        key={message.id}
                        message={message}
                        isActive={isActive}
                        idx={idx}
                      />
                    )
                  })}
                </ul>
              </div>
            </div>
            <div
              className={cn(
                'hidden dt:block absolute inset-y-0 dr-left-82 w-px -z-1',
                id === 'moment-1' && 'dr-top-120 dr-bottom-378'
              )}
              style={{
                background:
                  'repeating-linear-gradient(0deg,#80C1A2 0 8px,#0000 0 14px)',
              }}
            />
            <CTA
              snippet
              className="bg-black! text-teal border-teal w-full dt:w-auto"
              href={href}
              wrapperClassName="w-fit"
            >
              START BUILDING
              <span className="typo-code-snippet dr-pt-12 block">
                <span className="text-pink">{'<TamboProvider'} </span>
                <span className="text-teal">
                  {'components='}
                  <span className="text-pink">{'{components}'}</span>
                </span>
                <span className="text-pink">{'>'}</span>
                <br />
                <span className="text-white dt:dr-ml-16">{'<YourApp />'}</span>
                <br />
                <span className="text-pink">{'</TamboProvider>'}</span>
              </span>
            </CTA>
          </div>
          <div
            className={cn(
              'col-start-6 col-end-12 max-dt:col-span-full flex items-center justify-center',
              s.dynamicScale
            )}
          >
            {children}
          </div>
        </div>
        {proxyChildren && (
          <div
            className={cn(
              'absolute h-svh left-0 right-0 dr-layout-grid-inner pointer-events-none',
              proxyPosition === 'start' ? 'top-0' : 'bottom-0'
            )}
          >
            <div
              data-proxy-children
              className={cn(
                'absolute dt:relative col-start-6 col-end-12 max-dt:col-span-full flex items-center justify-center',
                s.dynamicScale
              )}
            >
              {proxyChildren}
            </div>
          </div>
        )}
      </section>
    </TimelineSectionContext.Provider>
  )
}

function TimelineItem({
  message,
  isActive,
  idx,
}: {
  message: (typeof messagesType)[number]
  isActive: boolean
  idx: number
}) {
  const liRef = useRef<HTMLLIElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  // Background color and box-shadow animation
  useEffect(() => {
    if (!(iconRef.current && liRef.current)) return

    const activeColor = idx === 1 ? colors['light-pink'] : colors['ghost-mint']
    const activeBorderColor =
      idx === 1 ? colors['dark-pink'] : colors['dark-grey']
    const activeBoxShadow =
      idx === 1
        ? '0 0 16px 0 rgba(255, 196, 235, 0.70)'
        : '0 0 16px 0 rgba(127, 255, 195, 0.70)'

    gsap.to(iconRef.current, {
      backgroundColor: isActive ? activeColor : colors['light-gray'],
      borderColor: isActive ? activeBorderColor : colors['dark-grey'],
      duration: 0.35,
      ease: 'power2.inOut',
    })

    gsap.to(liRef.current, {
      boxShadow: isActive ? activeBoxShadow : 'none',
      duration: 0.35,
      ease: 'power2.inOut',
    })
  }, [isActive, idx])

  return (
    <li
      ref={liRef}
      className="relative dr-w-328 shrink-0 dt:w-auto dr-h-84 dr-p-8 flex dr-gap-4 dr-rounded-20"
    >
      <div className="absolute inset-0 border border-dark-grey dr-rounded-20 bg-off-white" />
      <div className="relative z-30 h-full aspect-53/66 dt:aspect-square grid place-items-center">
        <div
          ref={iconRef}
          className="size-full overflow-hidden dr-rounded-12 border border-dark-grey dr-p-4 bg-light-gray"
        >
          <div className="size-full grid place-items-center">
            {idx === 0 && <CursorClickIcon className="dr-size-24" />}
            {idx === 3 && <SealCheckIcon className="dr-size-24" />}
            {idx !== 0 && idx !== 3 && (
              <Video
                autoPlay
                priority
                fallback={
                  <Image
                    src={`/videos/${message.video}.png`}
                    alt={message.video}
                    unoptimized
                    preload
                  />
                }
              >
                <source
                  src={`/videos/${message.video}-compressed.mov`}
                  type='video/mp4; codecs="hvc1"'
                />
                <source
                  src={`/videos/${message.video}-compressed.webm`}
                  type="video/webm"
                />
              </Video>
            )}
          </div>
        </div>
      </div>
      <div className="relative z-10 dr-p-4">
        <div className="flex justify-between typo-label-s text-black/70 dr-mb-8">
          <p>
            {'<'}
            {message.tag}
            {'>'}
          </p>
          <p>{'< >'}</p>
        </div>
        <p className="typo-p text-black">{message.message}</p>
      </div>
    </li>
  )
}
