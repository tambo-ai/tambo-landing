'use client'
import cn from 'clsx'
import gsap from 'gsap'
import { useRect } from 'hamo'
import {
  createContext,
  type RefObject,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react'
import type { messages as messagesType } from '~/app/(pages)/home/_sections/moment-1/data'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { mapRange } from '~/libs/utils'
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
  zIndex: number
  proxyChildren?: React.ReactNode
  proxyPosition?: 'start' | 'end'
  href?: string
}) {
  const [rectRef, rect] = useRect()
  const [messagesVisible, setMessagesVisible] = useState(0)
  const whiteLineRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const callbacks = useRef<TimelineCallback[]>([])
  const addCallback = useCallback((callback: TimelineCallback) => {
    callbacks.current.push(callback)
  }, [])
  const messagesRef = useRef<HTMLUListElement>(null)
  const { isDesktop } = useDeviceDetection()

  useScrollTrigger({
    rect,
    start: 'top top',
    end: `${(rect?.bottom ?? 0) * (isDesktop ? 0.95 : 0.99)} bottom`,
    onProgress: ({ progress, steps }) => {
      const currentStep = Math.max(0, steps.lastIndexOf(1) + 1)
      setMessagesVisible(currentStep)
      const lineProgress =
        (100 / STEPS) * steps[currentStep] + (100 / STEPS) * currentStep
      if (whiteLineRef.current) {
        const mappedLineProgress = mapRange(0, 100, lineProgress, 100, 8)
        whiteLineRef.current.style.translate = `0 -${Math.min(mappedLineProgress, 90)}%`
      }
      if (buttonRef.current && isDesktop) {
        buttonRef.current.style.opacity = `${steps[STEPS - 1] === 1 ? 1 : 0}`
      }
      for (const callback of callbacks.current) {
        callback({ progress, steps, currentStep })
      }
      if (messagesRef.current) {
        if (!isDesktop) {
          messagesRef.current.style.transform = `translateX(${(-messagesRef.current.scrollWidth / 4) * Math.min(3, Math.max(0, currentStep - 1))}px)`
        } else {
          messagesRef.current.style.transform = `none`
        }
      }
    },
    steps: STEPS,
  })

  return (
    <TimelineSectionContext.Provider value={{ callbacks, addCallback }}>
      <section
        id={id}
        ref={(node) => {
          rectRef(node)
          if (ref) {
            ref?.(node)
          }
        }}
        className="h-[10000px]"
      >
        <div className="sticky top-0 dr-layout-grid-inner h-screen">
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
                  {messages.map((message, idx) => (
                    <TimelineItem
                      key={message.id}
                      message={message}
                      visible={idx < messagesVisible}
                      idx={idx}
                      last={idx === messages.length - 1}
                    />
                  ))}
                </ul>
              </div>
            </div>
            <div
              className={cn(
                'hidden dt:block absolute inset-y-0 dr-left-82 w-px -z-1',
                id === 'moment-1' && 'dr-top-120 bottom-0',
                id === 'moment-2' && 'inset-y-0',
                id === 'moment-3' && 'top-0 dr-bottom-378'
              )}
              style={{
                background:
                  'repeating-linear-gradient(0deg,#80C1A2 0 8px,#0000 0 14px)',
              }}
            />
            <CTA
              snippet
              className="bg-black! text-teal border-teal w-full dt:w-auto"
              wrapperRef={buttonRef}
              href={href}
              wrapperClassName="dt:opacity-0 transition-opacity duration-300 ease-gleasing dt:dr-max-w-321"
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
            className="absolute dt:fixed left-0 dt:left-1/2 dt:-translate-x-1/2 top-0 dr-layout-grid-inner w-full h-screen pointer-events-none max-dt:scale-90 origin-top"
            style={{
              maxWidth: `calc(var(--max-width) * 1px)`,
            }}
          >
            <div
              className={cn(
                'col-start-6 col-end-12 max-dt:col-span-full flex items-center justify-center',
                s.dynamicScale
              )}
            >
              {children}
            </div>
          </div>
        </div>
        {proxyChildren && (
          <div
            className={cn(
              'absolute h-svh left-0 right-0 dr-layout-grid-inner',
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
  visible,
  idx,
  last,
}: {
  message: (typeof messagesType)[number]
  visible: boolean
  idx: number
  last: boolean
}) {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const iconContentRef = useRef<HTMLDivElement>(null)

  const { isDesktop } = useDeviceDetection()

  const showItem = useEffectEvent(() => {
    if (!isDesktop) return
    const tl = gsap.timeline()
    tl.to(
      backgroundRef.current,
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      iconRef.current,
      {
        width: '100%',
        height: '100%',
        backgroundColor: last ? colors['ghost-mint'] : colors['light-gray'],
        borderColor: colors['dark-grey'],
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      iconContentRef.current,
      {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      textRef.current,
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )

    return () => {
      tl.kill()
    }
  })

  const hideItem = useEffectEvent(() => {
    if (!isDesktop) return
    const tl = gsap.timeline()
    tl.to(
      backgroundRef.current,
      {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      backgroundRef.current,
      {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      iconRef.current,
      {
        width: '1vw',
        height: '1vw',
        backgroundColor: colors['light-gray'],
        borderColor: '#79B599',
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      iconContentRef.current,
      {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      textRef.current,
      {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      },
      '<'
    )

    return () => {
      tl.kill()
    }
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to re-run the effect when the desktop state changes
  useEffect(() => (visible ? showItem() : hideItem()), [visible, isDesktop])

  return (
    <li className="relative dr-w-328 shrink-0 dt:w-auto dr-h-84 dr-p-8 flex dr-gap-4">
      <div
        ref={backgroundRef}
        className={cn(
          'absolute inset-0 border border-dark-grey dr-rounded-20',
          last ? 'bg-white' : 'bg-off-white'
        )}
      />
      <div className="relative z-30 h-full aspect-53/66 dt:aspect-square grid place-items-center">
        <div
          ref={iconRef}
          className={cn(
            'size-full overflow-hidden dr-rounded-12 border border-dark-grey dr-p-4',
            last ? 'bg-ghost-mint' : 'bg-light-gray'
          )}
        >
          <div
            ref={iconContentRef}
            className="size-full grid place-items-center"
          >
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
      <div ref={textRef} className="relative z-10 dr-p-4">
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
