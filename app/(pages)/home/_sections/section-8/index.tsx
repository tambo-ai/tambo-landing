'use client'

import { useTamboThread } from '@tambo-ai/react'
import cn from 'clsx'
import { useRect, useWindowSize } from 'hamo'
import { Fragment, useContext, useEffect, useState } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlaneSVG from '~/assets/svgs/plane.svg'
import SpreadsheetSVG from '~/assets/svgs/spreadsheet.svg'
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

export function Section8() {
  const [selectedDemo, setSelectedDemo] = useState<Demo>('travel')
  const [threads, setThreads] = useState<Threads>([null, null])
  const [setRectRef, rect] = useRect()
  const [setTitleBlockRef, titleBlockRect] = useRect()

  const { getItems } = useContext(BackgroundContext)

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
            borderRadius: desktopVW(windowWidth, 20),
            width: desktopVW(windowWidth, 704),
            height: desktopVW(windowWidth, 497),
            y: 0,
          },
          {
            borderRadius: desktopVW(windowWidth, 20),
            width: (index) =>
              desktopVW(windowWidth, 704) -
              desktopVW(windowWidth, (index - (items.length - 1)) * 105 * 2),
            height: (index) =>
              desktopVW(windowWidth, 497) -
              desktopVW(windowWidth, (index - (items.length - 1)) * 74 * 2),
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

  return (
    <TamboIntegration>
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
      <section className="flex flex-col dr-gap-20 items-center justify-center h-screen">
        {/* TODO: Dashed border style*/}
        <div className="dr-w-col-8 outline-off-white/80 outline-6 dr-rounded-20 aspect-898/597">
          <div className="relative z-1 size-full dr-rounded-20 border border-forest/50 shadow-m bg-white dr-p-16">
            <TravelAssistant selectedDemo={selectedDemo} />
            <MapAssistant selectedDemo={selectedDemo} />
          </div>
        </div>
        <div className="relative z-1 dr-rounded-20 border border-dark-grey outline-6 outline-off-white/80 dr-w-col-8 dr-p-8 bg-white">
          <ThreadsOptions
            threads={threads}
            setThreads={setThreads}
            onSelect={setSelectedDemo}
          />
        </div>
      </section>
    </TamboIntegration>
  )
}

function ThreadsOptions({
  threads,
  setThreads,
  onSelect,
}: {
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
        'h-full relative grid grid-flow-col dr-rounded-12 typo-h4 uppercase bg-off-white'
      )}
    >
      {demos.map((demo) => (
        <Fragment key={demo.id}>
          <input
            type="radio"
            id={demo.id}
            name="demo"
            value={demo.id}
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
            <span className="block">{demo.label}</span>
          </label>
        </Fragment>
      ))}
    </div>
  )
}

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
  {
    id: 'demo-3',
    label: 'AI spreadsheet',
    icon: SpreadsheetSVG,
  },
]
