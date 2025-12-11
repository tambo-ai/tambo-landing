'use client'

import { useRect, useWindowSize } from 'hamo'
import { useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { CTA } from '~/components/button'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'

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
  const [setRectRef, rect] = useRect()

  const { getItems } = useContext(BackgroundContext)

  useScrollTrigger({
    rect,
    start: 'top center',
    end: 'top top',
    onProgress: ({ progress }) => {
      const elements = getItems()
        .map((item) => item?.getElement())
        .filter(Boolean)
      fromTo(
        elements,
        {
          width: (index) => 125 + (elements.length - 1 - index) * 5,
        },
        {
          width: (index) => 35 + (elements.length - 1 - index) * 20,
        },
        progress,
        {
          ease: 'linear',
          render: (element, { width }) => {
            if (element instanceof HTMLElement) {
              element.style.width = `${width}%`
            }
          },
        }
      )
    },
  })

  const { height: windowHeight = 0 } = useWindowSize()

  useScrollTrigger({
    rect,
    start: 'top top',
    end: `${rect?.top === undefined || rect?.height === undefined ? 'bottom' : rect?.top + rect?.height + windowHeight * 0.5} top`,
    onProgress: ({ progress, height }) => {
      const elements = getItems()
        .map((item) => item?.getElement())
        .filter(Boolean)
      fromTo(
        elements,
        {
          y: 0,
        },
        {
          y: -height,
        },
        progress,
        {
          ease: 'linear',
          render: (element, { y }) => {
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
      className="h-screen flex flex-col items-center justify-center relative"
    >
      <div className="text-center flex flex-col items-center relative -dr-top-48">
        <div className="dr-w-172 aspect-square">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="/videos/Octo-Wave-compressed.mov"
              type='video/mp4; codecs="hvc1"'
            />
            <source src="/videos/Octo-Wave.webm" type="video/webm" />
          </video>
        </div>
        <div className="text-center flex flex-col items-center dr-gap-24">
          <h3 className="typo-surtitle text-black/70">{'< features >'}</h3>
          <h2 className="typo-h1">
            One SDK,
            <br />
            orchestrating <br /> everything
          </h2>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {BUTTONS.map((button) => (
          <div
            className="absolute pointer-events-auto"
            style={{ top: `${button.top}%`, left: `${button.left}%` }}
            key={button.title}
          >
            <CTA href={button.href}>{button.title}</CTA>
          </div>
        ))}
      </div>
    </section>
  )
}
