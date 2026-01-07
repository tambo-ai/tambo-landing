'use client'

import { useRect, useWindowSize } from 'hamo'
import { useContext } from 'react'
import { useLenisSnap } from '~/app/(pages)/_components/lenis/snap'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { Image } from '~/components/image'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { TamboIntegration, useAssitant } from '~/integrations/tambo'
import { IntroAssistant } from '~/integrations/tambo/(components)/intro'
import {
  InterctableMap,
  MapAssistant,
} from '~/integrations/tambo/(components)/map'
import { AssistantNotifications } from '~/integrations/tambo/(components)/notifications'
import { SeatAssistant } from '~/integrations/tambo/(components)/seat-selector/index'
import { DEMOS } from '~/integrations/tambo/constants'
import { fromTo } from '~/libs/utils'

export function Section8() {
  const [setRectRef, rect] = useRect()
  const [setTitleBlockRef, titleBlockRect] = useRect()
  const [setTamboRectRef, tamboRect] = useRect({ ignoreTransform: true })

  const { getItems, getBackground } = useContext(BackgroundContext)

  const { width: windowWidth = 0 } = useWindowSize()

  const desktopVW = useDesktopVW()

  const setSnapRef = useLenisSnap('center')

  useScrollTrigger(
    {
      rect,
      start: 'top top',
      end: `${titleBlockRect?.top === undefined || titleBlockRect.height === undefined ? 'bottom' : titleBlockRect.top + titleBlockRect.height * 0.5} center`,
      onProgress: ({ progress, isActive }) => {
        if (!isActive) return

        const background = getBackground()
        if (background && progress >= 0) {
          background.style.opacity = '1'
        }

        const items = getItems()
        fromTo(
          items,
          {
            borderRadius: desktopVW(20),
            width: desktopVW(704, true),
            height: desktopVW(497, true),
            y: 0,
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
          },
          progress,
          {
            ease: 'linear',
            render: (item, { borderRadius, width, height, y }) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              item?.setBorderRadius(`${borderRadius}px`)

              if (element instanceof HTMLElement) {
                element.style.width = `${width}px`
                element.style.height = `${height}px`
                element.style.transform = `translateY(${y}px)`
              }
            },
          }
        )
      },
    },
    []
  )

  useScrollTrigger({
    rect: titleBlockRect,
    start: `${titleBlockRect?.top === undefined || titleBlockRect.height === undefined ? 'bottom' : titleBlockRect.top + titleBlockRect.height * 0.5} center`,
    end: `top top`,
    onProgress: ({ progress, isActive }) => {
      if (!isActive) return

      const items = getItems()
      fromTo(
        items,

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
        },
        {
          borderRadius: desktopVW(20),
          width: (index) => {
            if (index === items.length - 1) {
              return tamboRect?.width ?? 0
            }
            return windowWidth
          },
          height: (index) => {
            if (index === items.length - 1) {
              return tamboRect?.height ?? 0
            }
            return windowWidth
          },
          opacity: (index) => {
            if (index === items.length - 1) {
              return 1
            }
            return 0
          },
          y: 0,
          kinesis: 0,
        },
        progress,
        {
          ease: 'easeOutSine',
          render: (
            item,
            { borderRadius, width, height, y, kinesis, opacity }
          ) => {
            // @ts-expect-error
            const element = item?.getElement()
            // @ts-expect-error
            item?.setBorderRadius(`${borderRadius}px`)
            // @ts-expect-error
            item?.setKinesis(kinesis)

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
  })

  useScrollTrigger({
    rect: tamboRect,
    start: `${titleBlockRect?.top === undefined ? 'bottom' : titleBlockRect.top} top`,
    end: `center center`,
    onProgress: ({ progress, height, isActive }) => {
      if (!isActive) return

      if (tamboRect?.element) {
        tamboRect.element.style.opacity = `${progress}`
        tamboRect.element.style.pointerEvents = isActive ? 'auto' : 'none'
        const y = -height * (1 - progress)
        if (y !== 0) {
          tamboRect.element.style.transform = `translateY(${y}px) translateZ(0)`
        } else {
          tamboRect.element.style.removeProperty('transform')
        }
      }

      const background = getBackground()
      if (background) {
        background.style.opacity = progress === 1 ? '0' : '1'
      }
    },
  })

  return (
    <>
      <section
        className="h-screen flex flex-col items-center justify-end"
        ref={setRectRef}
      >
        <TitleBlock ref={setTitleBlockRef}>
          <TitleBlock.LeadIn>
            {'<'} Live Demo {'>'}
          </TitleBlock.LeadIn>
          <TitleBlock.Title level="h2">
            Enough said.
            <br />
            Just try it yourself.
          </TitleBlock.Title>
        </TitleBlock>
      </section>
      <TamboIntegration>
        <section
          ref={setSnapRef}
          className="dr-layout-grid-inner dr-gap-20 items-center justify-center h-screen"
        >
          <AssistantNotifications className="col-span-2" />
          {/* TODO: Dashed border style*/}
          <div
            ref={setTamboRectRef}
            className="col-start-3 col-end-10 card-outline outline-off-white/80 dr-rounded-20 aspect-898/597 dr-h-597"
          >
            <div className="relative z-1 size-full dr-rounded-20 shadow-m dashed-border bg-white overflow-hidden">
              <InterctableMap
                height={650}
                center={{ lng: -74.00594, lat: 40.71278 }}
                zoom={12}
              />
              <BackgroundAssistant />
              <IntroAssistant />
              <SeatAssistant />
              <MapAssistant />
            </div>
          </div>
        </section>
      </TamboIntegration>
    </>
  )
}

function BackgroundAssistant() {
  const { selectedDemo } = useAssitant()

  if (selectedDemo === DEMOS.MAP) return null

  return (
    <div className="absolute inset-0 w-full h-full">
      <Image src="/images/tmp-demo.png" alt="Intro Background" fill />
    </div>
  )
}
