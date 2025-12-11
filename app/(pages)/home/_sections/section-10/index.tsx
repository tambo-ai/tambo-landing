'use client'

import { useRect } from 'hamo'
import { useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'

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
          width: (index) => 125 - index * 15,
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

  return (
    <section
      ref={setRectRef}
      className="h-screen flex flex-col items-center justify-center"
    >
      <div className="text-center flex flex-col items-center dr-gap-24">
        <div className="dr-w-172 aspect-square">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="/videos/Octo-Juggle-compressed.mov"
              type='video/mp4; codecs="hvc1"'
            />
            <source src="/videos/Octo-Juggle.webm" type="video/webm" />
          </video>
        </div>
        <h3 className="typo-surtitle">{'< features >'}</h3>
        <h2 className="typo-h1">
          One SDK,
          <br />
          orchestrating <br /> everything
        </h2>
      </div>
    </section>
  )
}
