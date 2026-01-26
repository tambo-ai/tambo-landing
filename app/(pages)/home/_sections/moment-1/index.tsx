'use client'
import { useRect, useWindowSize } from 'hamo'
import { useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TimelineSection } from '~/app/(pages)/home/_components/timeline-section'
import { RiveWrapper } from '~/components/rive'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'
// import { Animation } from './animation'
import { messages } from './data'

export function Moment1() {
  const [setRectRef, rect] = useRect({ ignoreTransform: true })
  const [setTimelineRectRef, timelineRect] = useRect()

  const { getItems, getBackground } = useContext(BackgroundContext)

  const desktopVW = useDesktopVW()

  const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize()

  useScrollTrigger(
    {
      rect,
      start: 'top bottom',
      end: 'center center',
      onProgress: ({ progress, isActive }) => {
        if (!isActive) return

        const background = getBackground()

        if (background) {
          background.style.opacity = progress === 1 ? '0' : '1'
        }

        if (rect?.element) {
          rect.element.style.opacity = progress === 1 ? '1' : '0'
        }

        const items = getItems()

        fromTo(
          items,
          {
            width: (index) =>
              desktopVW(1134 + (items.length - 1 - index) * 240, true),
            height: (index) =>
              desktopVW(1134 + (items.length - 1 - index) * 240, true),
            borderRadius: (index) =>
              desktopVW(1134 + (items.length - 1 - index) * 240, true) / 2,
            x: 0,
            kinesis: 1,
            boxShadowOpacity: 1,
          },
          {
            width: rect?.width ?? 0,
            height: rect?.height ?? 0,
            borderRadius: desktopVW(20),
            x: -windowWidth / 2 + (rect?.left ?? 0) + desktopVW(668 / 2),
            kinesis: 0,
            boxShadowOpacity: (index) => {
              if (index === items.length - 1) {
                return 1
              }
              return 0
            },
          },
          progress,
          {
            ease: 'easeOutSine',
            render: (
              item,
              { width, height, borderRadius, kinesis, x, boxShadowOpacity }
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
              }
            },
          }
        )
      },
    },
    []
  )

  useScrollTrigger(
    {
      rect,
      start: 'center center',
      end: `${timelineRect?.bottom === undefined ? 'bottom' : timelineRect.bottom} center`,
      onProgress: ({ progress, isActive }) => {
        if (!isActive) return

        const background = getBackground()

        if (background) {
          background.style.opacity = progress === 0 ? '0' : '1'
        }

        if (rect?.element) {
          rect.element.style.opacity = progress === 0 ? '1' : '0'
        }

        // Hide the animation container when transition starts
        const section4Container = document.getElementById('section-4-container')
        if (section4Container) {
          section4Container.style.opacity = progress > 0 ? '0' : '1'
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
            width: rect?.width ?? 0,
            height: rect?.height ?? 0,
            x: 0,
            kinesis: 0,
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
                if (progress === 1) {
                  element.style.transform = `translateY(0px)`
                } else {
                  element.style.transform = `translateX(${x}px)`
                }
                element.style.opacity = `${opacity}`
              }
            },
          }
        )
      },
    },
    []
  )

  useScrollTrigger(
    {
      rect,
      start: `${timelineRect?.bottom === undefined ? 'bottom' : timelineRect.bottom} center`,
      end: `${timelineRect?.bottom === undefined ? 'bottom' : timelineRect.bottom + windowHeight * 0.5} center`,
      onProgress: ({ progress, isActive }) => {
        if (!isActive) return

        const items = getItems()
        fromTo(
          items,
          {
            borderRadius: desktopVW(20),
            width: rect?.width ?? 0,
            height: rect?.height ?? 0,
            y: 0,
            kinesis: 0,
            opacity: 1,
            boxShadowOpacity: 1,
          },
          {
            borderRadius: desktopVW(20),
            width: (index) =>
              desktopVW(704, true) -
              desktopVW((index - (items.length - 1)) * 105 * 2, true),
            height: (index) =>
              desktopVW(497, true) -
              desktopVW((index - (items.length - 1)) * 74 * 2, true),
            y: 0,
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
                y,
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
                element.style.transform = `translateY(${y}px)`
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
      id="moment-1"
      messages={messages}
      href="https://docs.tambo.co/concepts/components"
      title="AI-generated interfaces, powered by your own components."
      // zIndex={10}
      proxyChildren={
        <div
          ref={setRectRef}
          className="pointer-events-none w-full opacity-0 aspect-668/470"
        />
      }
      proxyPosition="end"
    >
      <RiveWrapper
        src="/assets/rives/moment-1_loop_1.riv"
        className="dr-w-668 dr-h-472"
      />
      {/* <Animation /> */}
    </TimelineSection>
  )
}
