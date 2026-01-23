'use client'

import cn from 'clsx'
// import gsap from 'gsap'
import { useRect } from 'hamo'
import { useLenis } from 'lenis/react'
// import { useContext, useEffect, useEffectEvent, useRef } from 'react'
import { useRef } from 'react'
// import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { DashedBorder } from '~/app/(pages)/home/_components/dashed-border'
import ArrowDownSVG from '~/assets/svgs/arrow-down.svg'
import HeroVisualMobileSVG from '~/assets/svgs/hero-bg-visual-mobile.svg'
import TamboLetters from '~/assets/svgs/tambo-letters.svg'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Kinesis } from '~/components/kinesis'
import { Video } from '~/components/video'
// import { useDeviceDetection } from '~/hooks/use-device-detection'
// import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { useStore } from '~/libs/store'
import { fromTo } from '~/libs/utils'
import s from './hero.module.css'

export function Hero() {
  // const { getItems } = useContext(BackgroundContext)

  const [setRectRef, rect] = useRect()

  const videoRef = useRef<HTMLDivElement>(null)
  const subVideoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const arrowDownRef = useRef<HTMLDivElement>(null)
  const mobileArrowDownRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)

  const lenis = useLenis()

  // const desktopVW = useDesktopVW()

  // const setHasAppeared = useStore((state) => state.setHasAppeared)

  // const { isDesktop } = useDeviceDetection()

  /*
  const appear = useEffectEvent(() => {
    const proxy = {
      progress1: 0,
      progress2: 0,
    }

    const timeline1 = gsap.to(proxy, {
      progress1: 1,
      duration: 1,
      ease: 'linear',
      onUpdate: () => {
        const items = getItems()
        // console.log('update', proxy.progress1, items, desktopVW(310))
        // const elements = items.map((item) => item?.getElement()).filter(Boolean)

        fromTo(
          items,
          {
            // width: (index) => 25 + (items.length - 1 - index) * 10,
            width: (index) =>
              desktopVW(310 + (items.length - 1 - index) * 160, false),
            // height: (index) => 25 + (items.length - 1 - index) * 10,
            boxShadowOpacity: 0,
            y: 0,
            greyBackgroundOpacity: 1,
          },
          {
            y: 0,
            boxShadowOpacity: 1,
            // width: (index) => 35 + (items.length - 1 - index) * 8,
            width: (index) =>
              desktopVW(480 + (items.length - 1 - index) * 100, true),
            greyBackgroundOpacity: 0,
          },
          proxy.progress1,
          {
            ease: 'easeInOutQuad',
            render: (
              item,
              { width, y, boxShadowOpacity, greyBackgroundOpacity }
            ) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              const boxShadow = item?.getBoxShadow()

              if (boxShadow) {
                boxShadow.style.opacity = `${boxShadowOpacity}`
              }

              // @ts-expect-error
              item?.setBorderRadius(`${width * 2}px`)

              if (element) {
                element.style.width = `${width}px`
                element.style.height = `${width}px`
                element.style.transform = `translateY(${y}px)`
              }

              //@ts-expect-error
              const greyBackground = item?.getGreyBackground()
              if (greyBackground) {
                greyBackground.style.opacity = `${greyBackgroundOpacity}`
              }
            },
          }
        )
      },
    })
    timeline1.pause().progress(0)

    const timeline = gsap.timeline({
      // delay:2
    })

    // return

    timeline
      .add(timeline1.play(), '<1')
      .to(
        proxy,
        {
          progress2: 1,
          duration: 1,
          ease: 'linear',
          onUpdate: () => {
            const items = getItems()

            fromTo(
              items,
              {
                width: (index) =>
                  desktopVW(480 + (items.length - 1 - index) * 100, true),
                y: 0,
              },
              {
                // width: (index) => 125 - index * 15,
                width: (index) =>
                  desktopVW(1134 + (items.length - 1 - index) * 240, true),
                // y: (index) => -15 - (items.length - 1 - index) * 1.8,
                y: (index) =>
                  -desktopVW(225 + (items.length - 1 - index) * 90, true),
              },
              proxy.progress2,
              {
                ease: 'easeInOutQuad',
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
        },
        '<1'
      )
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
          ease: 'expo.out',
          duration: 1,
        },
        '<0'
      )
      .fromTo(
        arrowDownRef.current,
        {
          opacity: 0,
          y: '100%',
        },
        {
          opacity: 1,
          y: '50%',
          ease: 'expo.out',
          duration: 1,
        },
        '<0'
      )
      .fromTo(
        [titleRef.current, visualRef.current],
        {
          opacity: 0,
        },
        {
          opacity: 1,
          ease: 'expo.out',
          duration: 1,
        }
      )
      .call(() => {
        setHasAppeared(true)
      })

    return timeline
  })

  useEffect(() => {
    if (isDesktop === false) setHasAppeared(true)
    if (!isDesktop) return

    let timeline: gsap.core.Timeline | null = null
    setTimeout(() => {
      timeline = appear()
    }, 0)

    return () => {
      timeline?.kill()
    }
  }, [isDesktop, setHasAppeared])
  */

  useScrollTrigger({
    rect,
    start: 'top top',
    end: 'bottom center',
    onProgress: ({ progress }) => {
      const hasAppeared = useStore.getState().hasAppeared
      if (!hasAppeared) return

      fromTo(
        [arrowDownRef.current, mobileArrowDownRef.current],
        {
          translate: 0,
        },
        {
          translate: 100,
        },
        progress,
        {
          ease: 'linear',
          render: (element, { translate }) => {
            if (element instanceof HTMLElement) {
              element.style.transform = `translate(-50%, 0%) translate(0px, 50%) translateY(${translate}%)`
            }
          },
        }
      )
    },
  })

  return (
    <section
      ref={setRectRef}
      className="flex flex-col items-center justify-center h-screen relative dt:px-0 max-dt:bg-white"
    >
      {/* <div className="dt:dr-w-480 dt:aspect-square dt:border dt:border-[red] dt:rounded-full dt:absolute dt:left-[50%] dt:translate-x-[-50%] dt:top-[50%] dt:translate-y-[-50%]" /> */}
      <Kinesis
        getIndex={() => 50}
        className="dt:dr-w-col-8 flex flex-col dt:dr-gap-8 text-center items-center relative dt:top-[-2%] z-1"
      >
        <HeroVisualMobileSVG
          ref={visualRef}
          className="dr-w-517 dr-h-178 dt:dr-w-1035 dt:dr-h-356 absolute -dr-top-32 dt:-dr-top-96 left-[50%] translate-x-[-50%]"
        />
        <div className="relative">
          <div
            className={cn(
              'dt:-dr-mb-60 -dr-mb-20 dt:dr-w-300 dr-w-181 aspect-square',
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
                  preload
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
            className="absolute left-[50%] translate-x-[-50%] top-full desktop-only opacity-0"
            ref={subVideoRef}
          >
            <div className="dr-h-26 dr-mb-8">
              <TamboLetters className="h-full" />
            </div>
            <div className="whitespace-nowrap typo-surtitle">
              {'< REACT SDK >'}
            </div>
          </div>
        </div>
        <div
          className="dt:dr-w-col-8 flex flex-col dr-gap-8 text-center items-center z-1"
          ref={titleRef}
        >
          <h1 className="dt:typo-h1 typo-h3">
            Build generative UI apps.
            <br />
            No PhD required.
          </h1>
          <p className="dt:typo-p-l typo-p text-black/70 ">
            Tambo is the full-stack solution handling{' '}
            <br className="mobile-only" /> AI orchestration,
            <br className="desktop-only" />
            so you don't have to.
          </p>
          <div className="flex dt:flex-row flex-col dt:dr-gap-16 dr-gap-12 dt:dr-mt-40 dr-mt-24 place-items-center">
            <CTA
              snippet
              href="https://docs.tambo.co/"
              snippetEyebrow="NPM"
              className="bg-black! text-teal border-teal"
            >
              START BUILDING
              <span className="typo-code-snippet">
                <span className="text-white">npm create tambo-app</span>
              </span>
            </CTA>
            <CTA
              className={cn(s.arrowCTA, 'desktop-only')}
              onClick={() => lenis?.scrollTo('#demo', { lerp: 0.2 })}
            >
              Try Live Demo
            </CTA>
          </div>
        </div>
      </Kinesis>

      <div
        ref={mobileArrowDownRef}
        className={cn(
          s.arrowDown,
          'mobile-only aspect-square bg-white bottom-0 dr:dr-mt-100  rounded-full z-1 left-[50%]  fixed'
        )}
      >
        <DashedBorder className="aspect-square dr-w-104 " />
        <ArrowDownSVG className="dr-w-32 absolute left-[50%] translate-x-[-50%] dr-top-16" />
      </div>

      <div
        ref={arrowDownRef}
        className={cn(
          s.arrowDown,
          'desktop-only dt:dr-w-136 dt:aspect-square bg-white dt:bottom-0 left-[50%] rounded-full fixed z-10'
        )}
      >
        <DashedBorder className="absolute inset-0 " />
        <ArrowDownSVG className="dr-w-32 absolute left-[50%] translate-x-[-50%] dr-top-24" />
      </div>
      <div className="mobile-only absolute -dr-bottom-100 dr-h-280 w-full  dr-mt-250">
        <Image
          src="/assets/mobile-background/hero-mobile.png"
          alt="Footer"
          fill
        />
      </div>
    </section>
  )
}
