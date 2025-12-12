'use client'

import cn from 'clsx'
import { useRect, useWindowSize } from 'hamo'
import { Fragment, useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlaneSVG from '~/assets/svgs/plane.svg'
import SpreadsheetSVG from '~/assets/svgs/spreadsheet.svg'
import StocksSVG from '~/assets/svgs/stocks.svg'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { TamboIntegration } from '~/integrations/tambo'
import { desktopVW, fromTo } from '~/libs/utils'
import s from './section-8.module.css'

export function Section8() {
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
      <section className="flex flex-col dr-gap-20 items-center justify-center h-screen">
        {/* TODO: Dashed border style*/}
        <div className="dr-w-col-8 outline-off-white/80 outline-6 dr-rounded-20 aspect-898/597">
          <div className="relative z-1 size-full dr-rounded-20 border border-forest/50 shadow-m bg-white dr-p-16">
            <TamboIntegration />
          </div>
        </div>
        <div className="relative z-1 dr-rounded-20 border border-dark-grey outline-6 outline-off-white/80 dr-w-col-8 dr-p-8 bg-white">
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
                  defaultChecked={demo.id === 'demo-1'}
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
        </div>
      </section>
    </>
  )
}

const demos = [
  {
    id: 'demo-1',
    label: 'travel assistant',
    icon: PlaneSVG,
  },
  {
    id: 'demo-2',
    label: 'stocks dashboard',
    icon: StocksSVG,
  },
  {
    id: 'demo-3',
    label: 'AI spreadsheet',
    icon: SpreadsheetSVG,
  },
]
