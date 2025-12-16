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

export function Section4() {
  const [setRectRef, rect] = useRect()

  const { getItems } = useContext(BackgroundContext)

  const { width: windowWidth = 0 } = useWindowSize()

  const desktopVW = useDesktopVW()

  useScrollTrigger(
    {
      rect,
      start: 'top bottom',
      end: 'top top',
      onProgress: ({ progress }) => {
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
            kinesis: 1,
          },
          {
            width: desktopVW(668),
            height: desktopVW(470),
            borderRadius: desktopVW(20),
            kinesis: 0,
          },
          progress,
          {
            ease: 'linear',
            render: (item, { width, height, borderRadius, kinesis }) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              item?.setBorderRadius(`${borderRadius}px`)
              // @ts-expect-error
              item?.setKinesis(kinesis)

              if (element instanceof HTMLElement) {
                element.style.width = `${width}px`
                element.style.height = `${height}px`
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
      ref={setRectRef}
      messages={messages}
      title="AI-generated interfaces, powered by your own components."
    >
      <Animation />
    </TimelineSection>
  )
}
