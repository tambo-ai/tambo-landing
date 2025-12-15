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
import type { messages as messagesType } from '~/app/(pages)/home/_sections/section-4/data'
import { CTA } from '~/components/button'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { mapRange } from '~/libs/utils'
import { colors } from '~/styles/colors'

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
  messages,
  title,
  children,
}: {
  messages: typeof messagesType
  title: string
  children?: React.ReactNode
}) {
  const [rectRef, rect] = useRect()
  const [messagesVisible, setMessagesVisible] = useState(0)
  const whiteLineRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const callbacks = useRef<TimelineCallback[]>([])
  const addCallback = useCallback((callback: TimelineCallback) => {
    callbacks.current.push(callback)
  }, [])

  useScrollTrigger({
    rect,
    start: 'top center',
    end: 'bottom bottom',
    onProgress: ({ progress, steps }) => {
      const currentStep = Math.max(0, steps.lastIndexOf(1) + 1)
      setMessagesVisible(currentStep)
      const lineProgress =
        (100 / STEPS) * steps[currentStep] + (100 / STEPS) * currentStep
      console.log('lineProgress', steps[currentStep])
      if (whiteLineRef.current) {
        const mappedLineProgress = mapRange(0, 100, lineProgress, 100, 8)
        whiteLineRef.current.style.translate = `0 -${Math.min(mappedLineProgress, 90)}%`
      }
      if (buttonRef.current) {
        buttonRef.current.style.opacity = `${steps[STEPS - 1] === 1 ? 1 : 0}`
      }
      for (const callback of callbacks.current) {
        callback({ progress, steps, currentStep })
      }
    },
    steps: STEPS,
  })

  return (
    <TimelineSectionContext.Provider value={{ callbacks, addCallback }}>
      <section ref={rectRef} className="h-[200svh] bg-light-gray">
        <div className="sticky top-0 dr-layout-grid-inner h-screen overflow-clip">
          <div className="col-span-4 flex flex-col dr-mt-112">
            <h3 className="typo-h2">{title}</h3>
            <div
              className="relative dr-py-40"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 5%)',
              }}
            >
              <div className="absolute z-15 dr-w-32 inset-y-0 dr-left-27">
                <div
                  ref={whiteLineRef}
                  className="dr-w-8 h-[110%] bg-white rounded-full shadow-xs mx-auto"
                />
              </div>
              <ul className="flex flex-col dr-gap-4 items-start">
                {messages.map((message, idx) => (
                  <TimelineItem
                    key={message.id}
                    message={message}
                    visible={idx < messagesVisible}
                    last={idx === messages.length - 1}
                  />
                ))}
              </ul>
            </div>
            <CTA
              wrapperRef={buttonRef}
              wrapperClassName="opacity-0 transition-opacity duration-300 ease-gleasing"
              color="black"
            >
              Start building
            </CTA>
          </div>
          <div className="col-start-6 col-end-12 flex items-center justify-center">
            {children}
          </div>
        </div>
      </section>
    </TimelineSectionContext.Provider>
  )
}

function TimelineItem({
  message,
  visible,
  last,
}: {
  message: (typeof messagesType)[number]
  visible: boolean
  last: boolean
}) {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const showItem = useEffectEvent(() => {
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

  useEffect(() => (visible ? showItem() : hideItem()), [visible])

  return (
    <li className="relative dr-h-84 dr-p-8 flex dr-gap-4">
      <div
        ref={backgroundRef}
        className={cn(
          'absolute inset-0 border border-dark-grey dr-rounded-20',
          last ? 'bg-white' : 'bg-off-white'
        )}
      />
      <div className="relative z-30 h-full aspect-square grid place-items-center">
        <div
          ref={iconRef}
          className={cn(
            'size-full dr-rounded-12 border border-dark-grey',
            last ? 'bg-ghost-mint' : 'bg-light-gray'
          )}
        >
          {/* TODO: Video here */}
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
