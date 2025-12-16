'use client'

import cn from 'clsx'
import gsap from 'gsap'
import { useRect, useWindowSize } from 'hamo'
import { useContext, useEffect, useEffectEvent, useRef } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { DashedBorder } from '~/app/(pages)/home/_components/dashed-border'
import ArrowDownSVG from '~/assets/svgs/arrow-down.svg'
import TamboLetters from '~/assets/svgs/tambo-letters.svg'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { desktopVW, fromTo } from '~/libs/utils'
import s from './section1.module.css'
// @refresh reset

export function Section1() {
  const { getItems } = useContext(BackgroundContext)

  useEffect(() => {
    const items = getItems()
    console.log(items)
  }, [getItems])

  const [setRectRef, rect] = useRect()

  const { width: windowWidth = 0 } = useWindowSize()

  const videoRef = useRef<HTMLDivElement>(null)
  const subVideoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const arrowDownRef = useRef<HTMLDivElement>(null)

  const appear = useEffectEvent(() => {
    console.log('appear', windowWidth)
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
              // width: (index) => 25 + (items.length - 1 - index) * 10,
              width: (index) =>
                desktopVW(
                  windowWidth,
                  310 + (items.length - 1 - index) * 160,
                  true
                ),
              // height: (index) => 25 + (items.length - 1 - index) * 10,
              boxShadowOpacity: 0,
              y: 0,
            },
            {
              y: 0,
              boxShadowOpacity: 1,
              // width: (index) => 35 + (items.length - 1 - index) * 8,
              width: (index) =>
                desktopVW(
                  windowWidth,
                  480 + (items.length - 1 - index) * 100,
                  true
                ),
            },
            proxy.progress1,
            {
              ease: 'easeOutQuad',
              render: (item, { width, y, boxShadowOpacity }) => {
                // @ts-expect-error
                const element = item?.getElement()
                // @ts-expect-error
                const boxShadow = item?.getBoxShadow()

                if (boxShadow) {
                  boxShadow.style.opacity = `${boxShadowOpacity}`
                }

                // @ts-expect-error
                item?.setBorderRadius(`${width * 2}px`)

                if (element instanceof HTMLElement) {
                  element.style.width = `${width}px`
                  element.style.height = `${width}px`
                  element.style.transform = `translateY(${y}px)`
                }
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

          fromTo(
            items,
            {
              width: (index) =>
                desktopVW(
                  windowWidth,
                  480 + (items.length - 1 - index) * 100,
                  true
                ),
              y: 0,
            },
            {
              // width: (index) => 125 - index * 15,
              width: (index) =>
                desktopVW(
                  windowWidth,
                  1134 + (items.length - 1 - index) * 240,
                  true
                ),
              // y: (index) => -15 - (items.length - 1 - index) * 1.8,
              y: (index) =>
                -desktopVW(
                  windowWidth,
                  225 + (items.length - 1 - index) * 90,
                  true
                ),
            },
            proxy.progress2,
            {
              ease: 'easeOutQuad',
              render: (item, { width, y }) => {
                // @ts-expect-error
                const element = item?.getElement()
                // @ts-expect-error
                item?.setBorderRadius(`${width * 2}px`)

                if (element instanceof HTMLElement) {
                  element.style.width = `${width}px`
                  element.style.height = `${width}px`
                  element.style.transform = `translateY(${y}px)`
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
  })

  useEffect(() => {
    setTimeout(() => {
      appear()
    }, 0)
  }, [])

  useScrollTrigger(
    {
      rect,
      start: 'top top',
      end: 'bottom top',
      onProgress: ({ progress }) => {
        const items = getItems()

        fromTo(
          items,
          {
            width: (index) =>
              desktopVW(
                windowWidth,
                1134 + (items.length - 1 - index) * 240,
                true
              ),
            y: (index) =>
              -desktopVW(
                windowWidth,
                225 + (items.length - 1 - index) * 90,
                true
              ),
          },
          {
            y: 0,
            width: (index) =>
              desktopVW(
                windowWidth,
                1134 + (items.length - 1 - index) * 240,
                true
              ),
          },
          progress,
          {
            ease: 'linear',
            render: (item, { y, width }) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              item?.setBorderRadius(`${width * 2}px`)

              if (element instanceof HTMLElement) {
                element.style.width = `${width}px`
                element.style.height = `${width}px`
                element.style.transform = `translateY(${y}px)`
              }
            },
          }
        )
      },
    },
    [getItems, windowWidth]
  )

  useScrollTrigger({
    rect,
    start: 'top top',
    end: 'bottom center',
    onProgress: ({ progress }) => {
      fromTo(
        arrowDownRef.current,
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },
        progress,
        {
          ease: 'linear',
          render: (element, { opacity }) => {
            if (element instanceof HTMLElement) {
              element.style.opacity = `${opacity}`
            }
          },
        }
      )
    },
  })

  return (
    <section
      ref={setRectRef}
      className="flex flex-col items-center justify-center h-screen relative"
    >
      <div className="dr-w-480 aspect-square border-1 border-[red] rounded-full absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]" />
      <div className="dr-w-col-8 flex flex-col dr-gap-8 text-center items-center relative top-[-2%]">
        <div className="relative">
          <div
            className={cn(
              '-dr-mb-60 dr-w-300 aspect-square scale-[0.25]',
              s.video
            )}
            ref={videoRef}
          >
            <Video
              autoPlay
              priority
              fallback={
                <Image
                  src="/videos/Octo-Juggle.png"
                  alt="Octo Juggle"
                  unoptimized
                />
              }
            >
              <source
                src="/videos/Octo-Juggle-compressed.mov"
                type='video/mp4; codecs="hvc1"'
              />
              <source
                src="/videos/Octo-Juggle-compressed.webm"
                type="video/webm"
              />
            </Video>
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
          <h1 className="typo-h1">
            You shouldn&apos;t need a PhD
            <br />
            to add AI to your app.
          </h1>
          <p className="typo-p-l text-black/70">
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
                <span className="text-pink">{'>'}</span>
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
      <div
        ref={arrowDownRef}
        className="dr-w-136 aspect-square bg-white bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%] rounded-full fixed"
      >
        <DashedBorder className="absolute inset-0" />
        <ArrowDownSVG className="dr-w-32 absolute left-[50%] translate-x-[-50%] dr-top-24" />
      </div>
    </section>
  )
}
