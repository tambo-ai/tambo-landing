'use client'
import cn from 'clsx'
import gsap from 'gsap'
import { useIntersectionObserver } from 'hamo'
import {
  createContext,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { messages as messagesType } from '~/app/(pages)/home/_sections/tambo-steps/data'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { colors } from '~/styles/colors'
import CursorClickIcon from './cursor-click.svg'
import SealCheckIcon from './seal-check.svg'

export const TimelineSectionContext = createContext<{
  callbacks: RefObject<TimelineCallback[]>
  addCallback: (callback: TimelineCallback) => void
}>({
  callbacks: { current: [] },
  addCallback: () => {
    /* NO OP */
  },
})

const STEPS = 6
// Mobile scale values to align with the 4 dots
const MOBILE_SCALE_VALUES = [0, 0.17, 0.39, 0.62, 0.85, 1]

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
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    threshold: 0.3,
  })
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

  // Duration in seconds for each step (index 0 = step 1, etc.)
  const STEP_DURATIONS = [2.5, 4.5, 6, 2, 2, 2]

  const animateStep = useCallback(
    (step: number) => {
      setMessagesVisible(step)

      // Use different scale for mobile vs desktop
      const scaleValue = isDesktop
        ? step / STEPS
        : (MOBILE_SCALE_VALUES[step] ?? 0.875)

      if (whiteLineRef.current) {
        whiteLineRef.current.style.transform = `scaleY(${scaleValue})`

        // Pink shadow for steps 2 & 3 (idx 1 & 2), green for others
        const isPinkStep = step === 2 || step === 3
        const boxShadow = isPinkStep
          ? '0 0 16px 0 rgba(255, 196, 235, 0.70)'
          : '0 0 16px 0 rgba(127, 255, 195, 0.70)'
        whiteLineRef.current.style.boxShadow = boxShadow
      }

      const steps = Array.from({ length: STEPS }, (_, i) => (i < step ? 1 : 0))
      for (const callback of callbacks.current) {
        callback({ progress: step / STEPS, steps, currentStep: step })
      }

      if (messagesRef.current && !isDesktop) {
        const offset =
          (-messagesRef.current.scrollWidth / 4) *
          Math.min(3, Math.max(0, step - 1))
        messagesRef.current.style.transform = `translateX(${offset}px)`
      }
    },
    [isDesktop]
  )

  useEffect(() => {
    if (intersection?.isIntersecting) {
      if (!hasPlayed.current) {
        hasPlayed.current = true

        const tl = gsap.timeline({ repeat: -1 })
        timelineRef.current = tl

        tl.call(() => animateStep(0), [], 0)

        for (let step = 1; step <= STEPS; step++) {
          tl.call(() => animateStep(step), [], `+=${STEP_DURATIONS[step - 1]}`)
        }
      } else {
        timelineRef.current?.resume()
      }
    } else {
      timelineRef.current?.pause()
    }
  }, [intersection, animateStep])

  useEffect(() => {
    return () => {
      timelineRef.current?.kill()
    }
  }, [])

  return (
    <TimelineSectionContext.Provider value={{ callbacks, addCallback }}>
      <section
        id={id}
        ref={(node) => {
          setIntersectionRef(node)
          ref?.(node)
        }}
        className="content-max-width z-0"
      >
        <div className="dr-layout-grid-inner dt:h-screen dt:dr-max-h-900 relative ">
          <div className="col-span-4 flex flex-col dr-pt-80 dt:dr-pt-165 max-dt:dr-pb-16 max-dt:h-screen z-1">
            <div className="relative">
              <h3 className="relative typo-h1 dt:typo-h2 text-center dt:text-left z-10">
                {title}
              </h3>
            </div>
            <div className="relative dr-py-40 max-dt:mt-auto ">
              <div className="absolute z-15 dr-w-32 dt:top-0 dt:-bottom-[120px] max-dt:h-[102vw] max-dt:-dr-mt-6 max-dt:-rotate-90 max-dt:-dr-top-40 left-[calc(var(--safe)+32vw)]  dt:dr-left-26 dt:mask-[linear-gradient(to_bottom,transparent_0%,black_5%)]">
                <div
                  className="absolute dt:h-[80%] h-full inset-y-0 dr-left-16 w-px z-1"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg,#80C1A2 0 8px,#0000 0 14px)',
                  }}
                />
                <div
                  ref={whiteLineRef}
                  className="dr-w-9 h-full bg-white rounded-full mx-auto transition-transform duration-500 ease-out origin-top"
                  style={{
                    transform: 'scaleY(0)',
                  }}
                />
                <div className="dt:hidden absolute inset-0 flex flex-col justify-around items-center dr-py-16 z-10">
                  <div className="dr-size-10 rounded-full border border-dark-teal bg-light-gray" />
                  <div className="dr-size-10 rounded-full border border-dark-teal bg-light-gray" />
                  <div className="dr-size-10 rounded-full border border-dark-teal bg-light-gray" />
                  <div className="dr-size-10 rounded-full border border-dark-teal bg-light-gray" />
                </div>
              </div>

              {/* Left side */}

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

            <CTA
              snippet
              className="bg-black! text-teal border-teal w-full dt:w-auto"
              href={href}
              wrapperClassName="dt:w-[80%] relative z-20"
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
          {/* Right side */}

          <div className={cn('absolute w-full h-full')}>{children}</div>
        </div>
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

    const activeColor =
      idx === 1 || idx === 2 ? colors['light-pink'] : colors['ghost-mint']
    const activeBorderColor = idx === 1 || idx === 2 ? colors.pink : colors.teal
    const activeBoxShadow =
      idx === 1 || idx === 2
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
      borderColor: isActive ? activeBorderColor : colors['dark-grey'],
      backgroundColor: isActive ? colors.white : colors['off-white'],
      duration: 0.35,
      ease: 'power2.inOut',
    })
  }, [isActive, idx])

  return (
    <li
      ref={liRef}
      className="relative dr-w-328 shrink-0 dt:w-auto dt:dr-max-w-393 dr-h-85 dr-p-8 flex dt:dr-gap-4 dr-gap-12 dr-rounded-20 bg-off-white border border-dark-grey"
    >
      <div className="relative z-30 h-full aspect-53/66 dt:aspect-square grid place-items-center">
        <div
          ref={iconRef}
          className="size-full overflow-hidden dr-rounded-12 border border-dark-grey dr-p-4 bg-light-gray"
        >
          <div className="size-full grid place-items-center ">
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
                    mobileSize="20vw"
                    fill
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
          <p>{message.tag}</p>
        </div>
        <p className="typo-p text-black">{message.message}</p>
      </div>
    </li>
  )
}
