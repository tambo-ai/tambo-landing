'use client'

import { useRect } from 'hamo'
import { useContext, useEffect } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'

export function Section1() {
  const { getItems } = useContext(BackgroundContext)

  useEffect(() => {
    const items = getItems()
    console.log(items)
  }, [getItems])

  const [setRectRef, rect] = useRect()

  useScrollTrigger(
    {
      rect,
      start: 'top top',
      end: 'bottom top',
      onProgress: ({ progress }) => {
        const items = getItems()
        const elements = items.map((item) => item?.getElement()).filter(Boolean)

        fromTo(
          elements,
          {
            width: (index) => 125 - index * 15,
            y: (index) => -25 - (elements.length - index) * 1.8,
          },
          {
            y: 0,
            width: (index) => 125 - index * 15,
          },
          progress,
          {
            ease: 'linear',
            render: (element, { y, width }) => {
              if (element instanceof HTMLElement) {
                element.style.width = `${width}%`
                element.style.transform = `translateY(${y}%)`
              }
            },
          }
        )
      },
    },
    [getItems]
  )

  return (
    <section
      ref={setRectRef}
      className="flex flex-col items-center justify-center h-screen"
    >
      <div className="dr-w-col-6 flex flex-col dr-gap-8 text-center">
        <h1 className="typo-h1">
          You shouldn&apos;t need a PhD
          <br />
          to add AI to your app
        </h1>
        <p className="typo-p-l">
          Turn any React app into an AI-powered experience in minutes
        </p>
      </div>
      <div className="flex dr-gap-16 dr-mt-40">
        {/* TODO: Add Buttons here */}
      </div>
    </section>
  )
}
