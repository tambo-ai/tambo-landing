'use client'

import { useIntersectionObserver, useRect, useWindowSize } from 'hamo'
import { useEffect, useRef } from 'react'
import { useLenisSnap } from '~/app/(pages)/_components/lenis/snap'
import Background, {
  type BackgroundRefType,
} from '~/app/(pages)/home/_components/background'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { cn } from '~/integrations/tambo/(components)/lib/utils'
import { siteConfig } from '~/libs/config'
import { fromTo } from '~/libs/utils'
import { featureButtons } from './data'
import s from './features.module.css'

export function Features() {
  const buttonsRefs = useRef<(HTMLDivElement | null)[]>([])
  const buttonsWrapperRef = useRef<HTMLDivElement | null>(null)
  const [setRectRef, rect] = useRect()
  const desktopVW = useDesktopVW()
  const hasAnimated = useRef(false)
  const [setAnimationTriggerRef, intersection] = useIntersectionObserver({
    threshold: 0.5,
  })
  const setSnapRef = useLenisSnap('center')
  const { isDesktop } = useDeviceDetection()

  const backgroundRef = useRef<BackgroundRefType>(null)

  useScrollTrigger({
    rect,
    start: 'top center',
    end: 'center center',
    onProgress: ({ progress }) => {
      if (!backgroundRef.current) return

      const element = backgroundRef.current?.getElement?.()
      if (element) {
        element.style.visibility = progress === 0 ? 'hidden' : 'visible'
      }

      const items = backgroundRef.current?.getItems()
      fromTo(
        items,
        {
          width: (index) =>
            desktopVW(1440 * 1.5 + (items.length - 1 - index) * 100, true),
          opacity: 1,
          kinesis: 1,
          boxShadowOpacity: 1,
          y: 0,
        },
        {
          width: (index) =>
            desktopVW(496 + (items.length - 1 - index) * 260, true),
          opacity: 1,
          kinesis: 1,
          boxShadowOpacity: 1,
          y: 0,
        },
        progress,
        {
          ease: 'easeOutSine',
          render: (item, { width, opacity, kinesis, boxShadowOpacity, y }) => {
            // @ts-expect-error
            const element = item?.getElement()
            // @ts-expect-error
            item?.setBorderRadius(`${width * 2}px`)
            // @ts-expect-error
            item?.setKinesis(kinesis)

            // @ts-expect-error
            const boxShadow = item?.getBoxShadow()
            if (boxShadow) {
              boxShadow.style.opacity = `${boxShadowOpacity}`
            }

            if (element instanceof HTMLElement) {
              element.style.width = `${width}px`
              element.style.height = `${width}px`
              element.style.transform = `translateY(${y}px)`
              element.style.opacity = `${opacity}`
            }
          },
        }
      )
    },
  })

  // Trigger animation once when title block is 50% visible
  useEffect(() => {
    if (intersection?.isIntersecting && !hasAnimated.current) {
      hasAnimated.current = true
      buttonsRefs.current.forEach((button) => {
        if (button) {
          button.style.opacity = '1'
          button.style.transform = 'scale(1)'
        }
      })
    }
  }, [intersection?.isIntersecting])

  const { height: windowHeight } = useWindowSize()

  useScrollTrigger({
    rect,
    start: 'center center',
    end: `${rect?.top === undefined || rect?.height === undefined || windowHeight === undefined ? 'bottom' : rect?.top + rect?.height + windowHeight * 0.5} top`,
    onProgress: ({ progress, height }) => {
      const items = backgroundRef.current?.getItems()
      if (!items) return

      fromTo(
        items,
        {
          y: 0,
          boxShadowOpacity: 1,
          opacity: 1,
        },
        {
          y: (index) => {
            if (index === items.length - 1) return 0

            return -(items.length - index * 1.2) * height * 0.1
          },
          boxShadowOpacity: 1,
          opacity: 1,
        },
        progress,
        {
          ease: 'linear',
          render: (item, { y, boxShadowOpacity, opacity }) => {
            // @ts-expect-error
            const boxShadow = item?.getBoxShadow()
            if (boxShadow) {
              boxShadow.style.opacity = `${boxShadowOpacity}`
            }
            // @ts-expect-error
            const element = item?.getElement()
            if (element instanceof HTMLElement) {
              element.style.transform = `translateY(${y}px)`
              element.style.opacity = `${opacity}`
            }
          },
        }
      )
    },
  })

  return (
    <div
      className={cn('dt:dr-py-200 bg-white relative', s.section)}
      ref={isDesktop ? setSnapRef : undefined}
    >
      <section
        ref={(node) => {
          setRectRef(node)
          setAnimationTriggerRef(node)
        }}
        className="relative flex flex-col items-center justify-center"
      >
        <div
          className={cn(
            'absolute left-0 right-0 top-[-50vh] bottom-0 desktop-only',
            s.background
          )}
        >
          <Background
            ref={backgroundRef}
            className="sticky top-0 h-screen left-0 right-0 bg-white visibility-hidden"
          />
        </div>
        <div className="mobile-only w-full dr-h-280 relative">
          <Image
            src="/assets/mobile-background/section-10Top.png"
            alt="Section 10 Background"
            fill
          />
        </div>
        <div className="dt:h-screen w-full flex flex-col items-center justify-center dt:bg-transparent bg-white ">
          <div className="text-center flex flex-col items-center relative dt:-dr-top-48">
            <div
              ref={setAnimationTriggerRef}
              className="flex flex-col items-center justify-center"
            >
              <div className="dr-w-172 aspect-square">
                <Video
                  autoPlay
                  fallback={
                    <Image
                      src="/videos/Octo-Juggle.png"
                      alt="Octo Wave"
                      mobileSize="50vw"
                      fill
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

              <TitleBlock className="dt:dr-mb-40">
                <TitleBlock.LeadIn>FEATURES</TitleBlock.LeadIn>
                <TitleBlock.Title level="h2" className="dt:typo-h2! typo-h1!">
                  What Tambo <br /> solves for you
                </TitleBlock.Title>
              </TitleBlock>
              <CTA
                className="bg-black! text-teal border-teal w-full dt:w-auto desktop-only"
                href={siteConfig.links.docs}
              >
                Start building
              </CTA>
            </div>
          </div>
          <div className="w-full px-safe mobile-only flex flex-col dr-gap-y-8 dr-mt-56">
            {featureButtons.map((button, index) => (
              <div className="w-full " key={button.title + index.toString()}>
                <CTA className="flex! justify-between" href={button.href}>
                  {button.title}
                </CTA>
              </div>
            ))}
            <CTA
              color="black"
              className="mobile-only w-full dr-mt-24 dr-mb-80"
              href={siteConfig.links.docs}
            >
              Start building
            </CTA>
          </div>

          <div className="mobile-only w-full  dr-h-280 relative">
            <div className="absolute  bottom-0 left-0 right-0  dr-h-280 w-full mobile-only dr-mb-[-1]" />
            <Image
              src="/assets/mobile-background/section-10Bottom.png"
              alt="Section 10 Background"
              fill
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none desktop-only"
            ref={buttonsWrapperRef}
          >
            {featureButtons.map((button, index) => (
              <div
                className="absolute pointer-events-auto"
                style={{
                  ...(button.right
                    ? { top: `${button.top}%`, right: `${button.right}%` }
                    : { top: `${button.top}%`, left: `${button.left}%` }),
                  opacity: 0,
                  transform: 'scale(1.1)',
                  transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                  transitionDelay: `${index * 150}ms`,
                }}
                key={button.title + index.toString()}
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
    </div>
  )
}
