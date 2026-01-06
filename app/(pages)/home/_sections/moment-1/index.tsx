'use client'
import { useRect, useWindowSize } from 'hamo'
import { useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TimelineSection } from '~/app/(pages)/home/_components/timeline-section'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'
import { Animation } from './animation'
import { messages } from './data'

export function Moment1() {
  const [setRectRef, rect] = useRect()

  const { getItems, getBackground } = useContext(BackgroundContext)

  const desktopVW = useDesktopVW()

  const { width: windowWidth = 0 } = useWindowSize()

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
          },
          {
            width: desktopVW(668),
            height: desktopVW(470),
            borderRadius: desktopVW(20),
            x: -windowWidth / 2 + (rect?.left ?? 0) + desktopVW(668 / 2),
            kinesis: 0,
          },
          progress,
          {
            ease: 'easeOutSine',
            render: (item, { width, height, borderRadius, kinesis, x }) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              item?.setBorderRadius(`${borderRadius}px`)
              // @ts-expect-error
              item?.setKinesis(kinesis)

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

  return (
    <TimelineSection
      messages={messages}
      title="AI-generated interfaces, powered by your own components."
      zIndex={10}
      proxyChildren={
        <div
          ref={setRectRef}
          className="opacity-0 pointer-events-none dr-w-668 aspect-668/449"
        />
      }
    >
      <Animation />
    </TimelineSection>
  )
}
