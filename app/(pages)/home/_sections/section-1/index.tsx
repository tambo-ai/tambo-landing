'use client'

import cn from 'clsx'
import gsap from 'gsap'
import { useRect } from 'hamo'
import { useContext, useEffect, useRef } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { DashedBorder } from '~/app/(pages)/home/_components/dashed-border'
import ArrowDownSVG from '~/assets/svgs/arrow-down.svg'
import TamboLetters from '~/assets/svgs/tambo-letters.svg'
import { CTA } from '~/components/button'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'
import s from './section1.module.css'
// @refresh reset

export function Section1() {
  const { getItems } = useContext(BackgroundContext)

  useEffect(() => {
    const items = getItems()
    console.log(items)
  }, [getItems])

  const [setRectRef, rect] = useRect()

  const videoRef = useRef<HTMLDivElement>(null)
  const subVideoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

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
              y: (index) => -15 - (elements.length - index) * 1.8,
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
      .fromTo(
        videoRef.current,
        {
          scale: 0.25,
        },
        {
          scale: 1,
          duration: 1,
          ease: 'expo.out',
        },
        '<0'
      )
      .fromTo(
        subVideoRef.current,
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },
        '<0'
      )
      .fromTo(
        titleRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
        }
      )
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
            y: (index) => -15 - (elements.length - index) * 1.8,
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
      className="flex flex-col items-center justify-center h-screen relative"
    >
      <div className="dr-w-480 aspect-[1/1] border-1 border-[red] rounded-full absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]" />
      <div className="dr-w-col-8 flex flex-col dr-gap-8 text-center items-center">
        <div className="relative">
          <div
            className={cn('-dr-mb-90 dr-w-416 scale-[0.25]', s.video)}
            ref={videoRef}
          >
            <video
              src="/videos/Octo-Juggle.webm"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="/videos/Octo-Juggle.mov"
                type='video/mp4; codecs="hvc1"'
              />
              <source src="/videos/Octo-Juggle.webm" type="video/webm" />
            </video>
          </div>
          <div
            className="absolute left-[50%] translate-x-[-50%] top-[100%]"
            ref={subVideoRef}
          >
            <div className="dr-h-26 dr-mb-8">
              <TamboLetters className="h-full" />
            </div>
            <div className="typo-surtitle">{'< REACT SDK >'}</div>
          </div>
        </div>
        <div
          className="dr-w-col-8 flex flex-col dr-gap-8 text-center items-center"
          ref={titleRef}
        >
          <h1 className="typo-hero-title">
            You shouldn&apos;t need a PhD
            <br />
            to add AI to your app.
          </h1>
          <p className="typo-p-l text-black-70">
            Turn any React app into an AI-powered experience in minutes
          </p>
          <div className="flex dr-gap-16 dr-mt-40">
            <CTA snippet className="bg-black! text-teal border-teal">
              START BUILDING
              <span className="typo-code-snippet">
                <span className="text-pink">{'<TamboProvider'} </span>
                <span className="text-teal">
                  {'components='}
                  <span className="text-pink">{'{components}'}</span>
                </span>
                <br />
                <span className="text-white dt:dr-ml-16">{'<YourApp />'}</span>
                <br />
                <span className="text-pink">{'</TamboProvider>'}</span>
              </span>
            </CTA>
            <CTA>Try Live Demo</CTA>
          </div>
        </div>
      </div>
      <div className="dr-w-136 aspect-square bg-white absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%] rounded-full">
        <DashedBorder className="absolute inset-0" />
        <ArrowDownSVG className="dr-w-32 absolute left-[50%] translate-x-[-50%] dr-top-24" />
      </div>
    </section>
  )
}
