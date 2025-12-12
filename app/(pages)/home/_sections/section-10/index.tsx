'use client'

import { useRect, useWindowSize } from 'hamo'
import { useContext, useRef } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { desktopVW, fromTo } from '~/libs/utils'

const BUTTONS = [
  {
    title: 'streaming',
    href: 'https://docs.tambo.co/concepts/streaming',
    top: 10,
    left: 10,
  },
  {
    title: 'state management',
    href: 'https://docs.tambo.co/',
    top: 80,
    left: 80,
  },
]

export function Section10() {
  const buttonsRef = useRef<HTMLDivElement>(null)

  const [setRectRef, rect] = useRect()

  const { getItems } = useContext(BackgroundContext)

  const { width: windowWidth = 0 } = useWindowSize()

  useScrollTrigger(
    {
      rect,
      start: 'top center',
      end: 'top top',
      onProgress: ({ progress }) => {
        fromTo(
          buttonsRef.current,
          {
            opacity: 0,
            scale: 1.2,
          },
          {
            opacity: 1,
            scale: 1,
          },
          progress,
          {
            ease: 'linear',
            render: (element, { opacity, scale }) => {
              if (element instanceof HTMLElement) {
                element.style.opacity = `${opacity}`
                element.style.transform = `scale(${scale})`
              }
            },
          }
        )

        const items = getItems()
        fromTo(
          items,
          {
            width: (index) =>
              desktopVW(
                windowWidth,
                windowWidth * 1.5 + (items.length - 1 - index) * 100
              ),
          },
          {
            width: (index) =>
              desktopVW(windowWidth, 496 + (items.length - 1 - index) * 260),
          },
          progress,
          {
            ease: 'linear',
            render: (item, { width }) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              item?.setBorderRadius(`${width * 2}px`)

              if (element instanceof HTMLElement) {
                element.style.width = `${width}px`
                element.style.height = `${width}px`
              }
            },
          }
        )
      },
    },
    [windowWidth]
  )

  const { height: windowHeight = 0 } = useWindowSize()

  useScrollTrigger({
    rect,
    start: 'top top',
    end: `${rect?.top === undefined || rect?.height === undefined ? 'bottom' : rect?.top + rect?.height + windowHeight * 0.5} top`,
    onProgress: ({ progress, height }) => {
      const items = getItems()
      fromTo(
        items,
        {
          y: 0,
        },
        {
          y: -height,
        },
        progress,
        {
          ease: 'linear',
          render: (item, { y }) => {
            // @ts-expect-error
            const element = item?.getElement()

            // item?.setBorderRadius(`${width * 2}px`)

            if (element instanceof HTMLElement) {
              element.style.transform = `translateY(${y}px)`
            }
          },
        }
      )
    },
  })

  return (
    <section
      ref={setRectRef}
      className="h-screen flex flex-col items-center justify-center relative overflow-x-clip"
    >
      <div className="text-center flex flex-col items-center relative -dr-top-48">
        <div className="dr-w-172 aspect-square">
          <Video
            autoPlay
            fallback={
              <Image src="/videos/Octo-Wave.png" alt="Octo Wave" unoptimized />
            }
          >
            <source
              src="/videos/Octo-Wave-compressed.mov"
              type='video/mp4; codecs="hvc1"'
            />
            <source src="/videos/Octo-Wave-compressed.webm" type="video/webm" />
          </Video>
        </div>
        {/* <div className="text-center flex flex-col items-center dr-gap-24">
          <h3 className="typo-surtitle text-black/70">{'< features >'}</h3>
          <h2 className="typo-h1">
            One SDK,
            <br />
            orchestrating <br /> everything
          </h2>
        </div> */}
        <TitleBlock>
          <TitleBlock.LeadIn>
            {'<'} FEATURES {'>'}
          </TitleBlock.LeadIn>
          <TitleBlock.Title level="h2" className="dt:dr-mb-8!">
            One SDK,
            <br />
            orchestrating <br /> everything
          </TitleBlock.Title>
        </TitleBlock>
      </div>
      <div className="absolute inset-0 pointer-events-none" ref={buttonsRef}>
        {BUTTONS.map((button) => (
          <div
            className="absolute pointer-events-auto"
            style={{ top: `${button.top}%`, left: `${button.left}%` }}
            key={button.title}
          >
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              <CTA href={button.href}>{button.title}</CTA>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
