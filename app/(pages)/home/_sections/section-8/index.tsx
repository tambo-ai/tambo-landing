'use client'

import cn from 'clsx'
import { useRect, useWindowSize } from 'hamo'
import { Fragment, useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlaneSVG from '~/assets/svgs/plane.svg'
import StocksSVG from '~/assets/svgs/stocks.svg'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import {
  AssistantNotifications,
  MapAssistantWrapper,
  TamboIntegration,
  TravelAssistant,
  useAssitant,
} from '~/integrations/tambo'
import { InterctableMap } from '~/integrations/tambo/(components)/map'
import { fromTo } from '~/libs/utils'
import s from './section-8.module.css'

const demos = [
  {
    id: 'travel',
    label: 'travel assistant',
    icon: PlaneSVG,
  },
  {
    id: 'map',
    label: 'map assistant',
    icon: StocksSVG,
  },
]

export function Section8() {
  const [setRectRef, rect] = useRect()
  const [setTitleBlockRef, titleBlockRect] = useRect()
  const [setTamboRectRef, tamboRect] = useRect()

  const { getItems, getBackground } = useContext(BackgroundContext)

  const { width: windowWidth = 0 } = useWindowSize()

  const desktopVW = useDesktopVW()

  useScrollTrigger(
    {
      rect,
      start: 'top top',
      end: `${titleBlockRect?.top === undefined || titleBlockRect.height === undefined ? 'bottom' : titleBlockRect.top + titleBlockRect.height * 0.5} center`,
      onProgress: ({ progress }) => {
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
    onProgress: ({ progress }) => {
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
          ease: 'linear',
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
    onProgress: ({ progress }) => {
      if (tamboRect.element) {
        tamboRect.element.style.opacity = `${progress}`
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
        <section className="dr-layout-grid-inner dr-gap-20 items-center justify-center h-screen">
          <AssistantNotifications className="col-span-2" />
          {/* TODO: Dashed border style*/}
          <div
            ref={setTamboRectRef}
            className="col-start-3 col-end-10 outline-off-white/80 outline-6 dr-rounded-20 aspect-898/597 dr-h-597"
          >
            <div className="relative z-1 size-full dr-rounded-20 border border-forest/50 shadow-m bg-white overflow-hidden">
              <InterctableMap height={650} />
              <TravelAssistant />
              <MapAssistantWrapper />
            </div>
          </div>
          {/* <div className="relative z-1 dr-rounded-20 border border-dark-grey outline-6 outline-off-white/80 dr-p-8 bg-white">
            <ThreadsOptions
            />
          </div> */}
        </section>
      </TamboIntegration>
    </>
  )
}

export function ThreadsOptions() {
  const {
    selectedDemo,
    setSelectedDemo,
    switchToTravelThread,
    switchToMapThread,
  } = useAssitant()

  return (
    <div
      className={cn(
        s.tabs,
        'relative grid grid-flow-col dr-rounded-12 typo-h5 uppercase bg-off-white'
      )}
    >
      {demos.map((demo) => (
        <Fragment key={demo.id}>
          <input
            name="demo"
            type="radio"
            id={demo.id}
            value={demo.id}
            checked={selectedDemo === demo.id}
            onChange={() => {
              setSelectedDemo(demo.id as 'travel' | 'map')

              // Switch to the travel thread if it exists
              if (demo.id === 'travel') {
                switchToTravelThread()
              }

              // Switch to the map thread if it exists
              if (demo.id === 'map') {
                switchToMapThread()
              }
            }}
          />
          <label
            htmlFor={demo.id}
            className="flex dr-gap-16 items-center justify-center dr-h-60"
          >
            <div className="dr-size-32 grid place-items-center rounded-full">
              <demo.icon className="dr-size-16 icon text-black" />
            </div>
            <span className="block typo-h5">{demo.label}</span>
          </label>
        </Fragment>
      ))}
    </div>
  )
}
