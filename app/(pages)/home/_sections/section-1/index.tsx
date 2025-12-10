'use client'

import gsap from 'gsap'
import { useRect } from 'hamo'
import { useContext, useEffect } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { CTA } from '~/components/button'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'

// @refresh reset

export function Section1() {
  const { getItems } = useContext(BackgroundContext)

  useEffect(() => {
    const items = getItems()
    console.log(items)
  }, [getItems])

  const [setRectRef, rect] = useRect()

  useEffect(() => {
    const proxy = {
      progress1: 0,
      progress2: 0,
    }

    const timeline = gsap.timeline({
      // delay:2
    })

    timeline
      .to(proxy, {
        progress1: 1,
        duration: 1,
        ease: 'linear',
        onUpdate: () => {
          const items = getItems()
          // const elements = items.map((item) => item?.getElement()).filter(Boolean)

          fromTo(
            items,
            {
              width: (index) => 25 + (items.length - 1 - index) * 10,
              boxShadowOpacity: 0,
              y: 0,
            },
            {
              y: 0,
              boxShadowOpacity: 1,
              width: (index) => 35 + (items.length - 1 - index) * 8,
            },
            proxy.progress1,
            {
              ease: 'easeOutQuad',
              render: (item, { width, y, boxShadowOpacity }) => {
                // if (item instanceof BackgroundItem) {
                // if (item instanceof BackgroundItemRef) {
                // @ts-expect-error
                const element = item?.getElement()
                // @ts-expect-error
                const boxShadow = item?.getBoxShadow()

                if (boxShadow) {
                  boxShadow.style.opacity = `${boxShadowOpacity}`
                }

                element.style.width = `${width}%`
                // element.style.opacity = `${opacity}`
                element.style.transform = `translateY(${y}%)`
                // }
              },
            }
          )
        },
      })
      .to(proxy, {
        progress2: 1,
        duration: 1,
        ease: 'linear',
        onUpdate: () => {
          const items = getItems()
          const elements = items
            .map((item) => item?.getElement())
            .filter(Boolean)

          fromTo(
            elements,
            {
              width: (index) => 35 + (items.length - 1 - index) * 8,
              y: 0,
            },
            {
              width: (index) => 125 - index * 15,
              y: (index) => -25 - (elements.length - index) * 1.8,
            },
            proxy.progress2,
            {
              ease: 'easeOutQuad',
              render: (element, { width, y }) => {
                if (element instanceof HTMLElement) {
                  element.style.width = `${width}%`
                  element.style.transform = `translateY(${y}%)`
                }
              },
            }
          )
        },
      })

    return () => {
      timeline.kill()
      proxy.progress1 = 0
      proxy.progress2 = 0
    }
  }, [getItems])

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
      <div className="dr-w-col-8 flex flex-col dr-gap-8 text-center items-center">
        <div className="-dr-mb-90 dr-w-416">
          <video
            src="/videos/Octo-Juggle.webm"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="typo-hero-title">
          You shouldn&apos;t need a PhD
          <br />
          to add AI to your app
        </h1>
        <p className="typo-p-l text-black-70">
          Turn any React app into an AI-powered experience in minutes
        </p>
      </div>
      <div className="flex dr-gap-16 dr-mt-40">
        <CTA color="black">START BUILDING</CTA>
        <CTA>Try Live Demo</CTA>
      </div>
    </section>
  )
}
