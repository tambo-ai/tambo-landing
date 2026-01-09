'use client'
import { useRect, useWindowSize } from 'hamo'
import { useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TimelineSection } from '~/app/(pages)/home/_components/timeline-section'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo, mapRange } from '~/libs/utils'
import { Animation } from './animation'
import { messages } from './data'

export function Moment3() {
  const [setRectRef, rect] = useRect({ ignoreTransform: true })
  const [setTimelineRectRef, timelineRect] = useRect()
  const { isDesktop } = useDeviceDetection()

  const desktopVW = useDesktopVW()
  const { getItems, getBackground } = useContext(BackgroundContext)

  const { width: windowWidth = 0 } = useWindowSize()

  useScrollTrigger(
    {
      rect,
      start: 'center center',
      end: `${timelineRect?.bottom === undefined ? 'bottom' : timelineRect.bottom} center`,
      onProgress: ({ progress: triggerProgress, isActive }) => {
        if (!isActive) return

        const containerExitProgress = mapRange(
          0,
          0.2,
          triggerProgress,
          0,
          1,
          true
        )
        const progress = mapRange(0.2, 1, triggerProgress, 0, 1, true)

        const container = document.getElementById('section-6-container')
        if (container) {
          container.style.opacity = `${1 - containerExitProgress}`
        }

        const background = getBackground()

        if (background && isDesktop) {
          background.style.opacity = containerExitProgress === 0 ? '0' : '1'
        }

        if (rect?.element) {
          rect.element.style.opacity = progress === 0 ? '1' : '0'
        }

        const items = getItems()
        fromTo(
          items,

          {
            borderRadius: desktopVW(20),
            width: rect?.width ?? 0,
            height: rect?.height ?? 0,
            x: -windowWidth / 2 + (rect?.left ?? 0) + desktopVW(668 / 2),
            kinesis: 0,
            opacity: 1,
            boxShadowOpacity: (index) => {
              if (index === items.length - 1) {
                return 1
              }
              return 0
            },
          },
          {
            borderRadius: desktopVW(20),
            width: (index) =>
              desktopVW(704, true) -
              desktopVW((index - (items.length - 1)) * 105 * 2, true),
            height: (index) =>
              desktopVW(497, true) -
              desktopVW((index - (items.length - 1)) * 74 * 2, true),
            x: 0,
            kinesis: 1,
            opacity: 1,
            boxShadowOpacity: 1,
          },
          progress,
          {
            ease: 'easeOutSine',
            render: (
              item,
              {
                borderRadius,
                width,
                height,
                x,
                kinesis,
                opacity,
                boxShadowOpacity,
              }
            ) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              item?.setBorderRadius(`${borderRadius}px`)
              // @ts-expect-error
              item?.setKinesis(kinesis)
              // @ts-expect-error
              const boxShadow = item?.getBoxShadow()
              if (boxShadow) {
                boxShadow.style.opacity = `${boxShadowOpacity}`
              }
              if (element instanceof HTMLElement) {
                element.style.width = `${width}px`
                element.style.height = `${height}px`
                element.style.transform = `translateX(${x}px)`
                element.style.opacity = `${opacity}`
              }
            },
          }
        )
      },
    },
    []
  )

  return (
    <TimelineSection
      ref={setTimelineRectRef}
      messages={messages}
      title="Native MCP support, hard wiring done for you."
      zIndex={3}
      id="moment-3"
      proxyChildren={
        <div
          ref={setRectRef}
          className="pointer-events-none w-full opacity-0 aspect-668/470"
        />
      }
      proxyPosition="end"
    >
      <Animation />
    </TimelineSection>
  )
}
