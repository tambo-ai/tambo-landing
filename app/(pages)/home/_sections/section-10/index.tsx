'use client'

import { useRect, useWindowSize } from 'hamo'
import { useContext, useRef } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo, mapRange } from '~/libs/utils'

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
  {
    title: 'streaming',
    href: 'https://docs.tambo.co/concepts/streaming',
    top: 80,
    left: 10,
  },
  {
    title: 'state management',
    href: 'https://docs.tambo.co/',
    top: 10,
    left: 80,
  },
]

export function Section10() {
  const buttonsRefs = useRef<(HTMLDivElement | null)[]>([])

  const [setRectRef, rect] = useRect()

  const { getItems, getBackground } = useContext(BackgroundContext)

  const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize()

  const desktopVW = useDesktopVW()

  useScrollTrigger(
    {
      rect,
      start: 'top center',
      end: 'top top',
      onProgress: ({ progress }) => {
        const background = getBackground()
        if (progress > 0 && background) {
          background.style.opacity = '1'
        }

        const items = getItems()
        fromTo(
          items,
          {
            width: (index) =>
              desktopVW(
                windowWidth * 1.5 + (items.length - 1 - index) * 100,
                true
              ),
            opacity: 1,
            kinesis: 1,
          },
          {
            width: (index) =>
              desktopVW(496 + (items.length - 1 - index) * 260, true),
            opacity: 1,
            kinesis: 1,
          },
          progress,
          {
            ease: 'easeOutSine',
            render: (item, { width, opacity, kinesis }) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              item?.setBorderRadius(`${width * 2}px`)
              // @ts-expect-error
              item?.setKinesis(kinesis)

              if (element instanceof HTMLElement) {
                element.style.width = `${width}px`
                element.style.height = `${width}px`
                element.style.opacity = `${opacity}`
              }
            },
          }
        )
      },
    },
    [windowWidth]
  )

  useScrollTrigger({
    rect,
    start: 'top top',
    end: 'bottom bottom',
    steps: BUTTONS.length,
    onProgress: ({ steps }) => {
      for (const [index, button] of buttonsRefs.current.entries()) {
        if (button) {
          button.style.opacity = `${steps[index]}`
          button.style.transform = `scale(${mapRange(0, 1, steps[index], 1.1, 1)})`
        }
      }
    },
  })

  useScrollTrigger({
    rect,
    start: 'bottom bottom',
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
      className="relative overflow-x-clip h-[200vh] dr-mb-400"
    >
      <div className="h-screen sticky top-0 w-full flex flex-col items-center justify-center">
        <div className="text-center flex flex-col items-center relative -dr-top-48">
          <div className="dr-w-172 aspect-square">
            <Video
              autoPlay
              fallback={
                <Image
                  src="/videos/Octo-Wave.png"
                  alt="Octo Wave"
                  unoptimized
                />
              }
            >
              <source
                src="/videos/Octo-Wave-compressed.mov"
                type='video/mp4; codecs="hvc1"'
              />
              <source
                src="/videos/Octo-Wave-compressed.webm"
                type="video/webm"
              />
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
        <div className="absolute inset-0 pointer-events-none">
          {BUTTONS.map((button, index) => (
            <div
              className="absolute pointer-events-auto"
              style={{ top: `${button.top}%`, left: `${button.left}%` }}
              key={button.title}
              ref={(node) => {
                buttonsRefs.current[index] = node
              }}
            >
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <CTA href={button.href}>{button.title}</CTA>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
