'use client'

import { useTamboThread } from '@tambo-ai/react'
import cn from 'clsx'
import { useRect, useWindowSize } from 'hamo'
import { Fragment, useContext, useEffect, useState } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlaneSVG from '~/assets/svgs/plane.svg'
import StocksSVG from '~/assets/svgs/stocks.svg'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import {
  MapAssistant,
  TamboIntegration,
  TravelAssistant,
} from '~/integrations/tambo'
import { desktopVW, fromTo } from '~/libs/utils'
import s from './section-8.module.css'

type Demo = 'travel' | 'map'
type Threads = [string | null, string | null]

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
  const [selectedDemo, setSelectedDemo] = useState<Demo>('travel')
  const [threads, setThreads] = useState<Threads>([null, null])
  const [setRectRef, rect] = useRect()
  const [setTitleBlockRef, titleBlockRect] = useRect()
  const [setTamboRectRef, tamboRect] = useRect()

  const { getItems, getBackground } = useContext(BackgroundContext)

  const { width: windowWidth = 0 } = useWindowSize()

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
            borderRadius: desktopVW(windowWidth, 20, true),
            width: desktopVW(windowWidth, 704, true),
            height: desktopVW(windowWidth, 497, true),
            y: 0,
          },
          {
            borderRadius: desktopVW(windowWidth, 20, true),
            width: (index) =>
              desktopVW(windowWidth, 704, true) -
              desktopVW(
                windowWidth,
                (index - (items.length - 1)) * 105 * 2,
                true
              ),
            height: (index) =>
              desktopVW(windowWidth, 497, true) -
              desktopVW(
                windowWidth,
                (index - (items.length - 1)) * 74 * 2,
                true
              ),
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
    [windowWidth]
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
          borderRadius: desktopVW(windowWidth, 20, true),
          width: (index) =>
            desktopVW(windowWidth, 704, true) -
            desktopVW(
              windowWidth,
              (index - (items.length - 1)) * 105 * 2,
              true
            ),
          height: (index) =>
            desktopVW(windowWidth, 497, true) -
            desktopVW(windowWidth, (index - (items.length - 1)) * 74 * 2, true),
          y: 0,
          kinesis: 1,
          opacity: 1,
        },
        {
          borderRadius: desktopVW(windowWidth, 20, true),
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
        <section className="flex flex-col dr-gap-20 items-center justify-center h-screen">
          {/* TODO: Dashed border style*/}
          <div
            ref={setTamboRectRef}
            className="dr-w-col-8 outline-off-white/80 outline-6 dr-rounded-20 aspect-898/597 dr-h-597"
          >
            <div className="relative z-1 size-full dr-rounded-20 border border-forest/50 shadow-m bg-white overflow-hidden">
              <TravelAssistant selectedDemo={selectedDemo} />
              <MapAssistant selectedDemo={selectedDemo} />
            </div>
          </div>
          <div className="relative z-1 dr-rounded-20 border border-dark-grey outline-6 outline-off-white/80 dr-p-8 bg-white">
            <ThreadsOptions
              selectedDemo={selectedDemo}
              threads={threads}
              setThreads={setThreads}
              onSelect={setSelectedDemo}
            />
          </div>
        </section>
      </TamboIntegration>
    </>
  )
}

function ThreadsOptions({
  selectedDemo,
  threads,
  setThreads,
  onSelect,
}: {
  selectedDemo: Demo
  threads: Threads
  setThreads: React.Dispatch<React.SetStateAction<Threads>>
  onSelect: (demo: Demo) => void
}) {
  const { thread, startNewThread, switchCurrentThread } = useTamboThread()

  useEffect(() => {
    setThreads((prev: Threads) => {
      // On first render, save the travel thread
      if (prev[0] === null || prev[0] === 'placeholder') {
        return [thread.id, null]
      }

      // If the map thread is created, save it
      if (
        prev[1] === null &&
        thread.id !== prev[0] &&
        thread.id !== 'placeholder'
      ) {
        return [prev[0], thread.id]
      }

      return prev
    })
  }, [thread?.id, setThreads])

  return (
    <div
      className={cn(
        s.tabs,
        'relative grid grid-flow-col dr-rounded-12 typo-h4 uppercase bg-off-white'
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
              onSelect(demo.id as 'travel' | 'map')

              // If the map thread is not created, create it
              if (threads[1] === null) {
                startNewThread()
              }

              // Switch to the travel thread if it exists
              if (demo.id === 'travel' && threads[0] !== null) {
                switchCurrentThread(threads[0])
              }

              // Switch to the map thread if it exists
              if (demo.id === 'map' && threads[1] !== null) {
                switchCurrentThread(threads[1])
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
