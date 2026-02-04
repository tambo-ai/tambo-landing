'use client'

import cn from 'clsx'
import gsap from 'gsap'
import { useRect } from 'hamo'
import { useEffectEvent, useRef } from 'react'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { CTA } from '~/components/button'
import { FooterContent } from '~/components/footer-content'
import { Image } from '~/components/image'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { siteConfig } from '~/libs/config'
import { fromTo, mapRange } from '~/libs/utils'
import Background, {
  type BackgroundRefType,
} from '../../_components/background'

export function Footer() {
  const [setRectRef, rect] = useRect({ ignoreTransform: true })
  const innerRef = useRef<HTMLDivElement>(null)
  const desktopVW = useDesktopVW()
  const backgroundRef = useRef<BackgroundRefType>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useScrollTrigger({
    rect,
    start: `top bottom`,
    end: 'bottom bottom',

    onProgress: ({ progress }) => {
      if (overlayRef.current) {
        overlayRef.current.style.opacity = mapRange(
          0,
          1,
          progress,
          0.25,
          0,
          true
        ).toString()
      }

      if (stickyRef.current) {
        stickyRef.current.style.transform = `translateY(${(1 - progress) * 50}%)`
      }

      const items = backgroundRef.current?.getItems()
      if (!items) return

      fromTo(
        items,
        {
          width: (index) =>
            desktopVW(666 + (items.length - 1 - index) * 344, true),
          y: 0,
        },
        {
          width: (index) =>
            desktopVW(666 + (items.length - 1 - index) * 344, true),
          y: 0,
        },
        progress,
        {
          ease: 'linear',
          render: (item, { width, y }) => {
            // @ts-expect-error
            const element = item?.getElement()

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

  const onMouseEnter = useEffectEvent(() => {
    // return
    const items = backgroundRef.current?.getItems()
    if (!items) return
    items.forEach((item, index) => {
      const element = item?.getElement()
      if (element) {
        const width = desktopVW(596 + (items.length - 1 - index) * 260, true)

        gsap.to(element, {
          width: width,
          height: width,
          duration: 1,
          ease: 'expo.out',
        })
      }
    })
  })

  const onMouseLeave = useEffectEvent(() => {
    const items = backgroundRef.current?.getItems()
    if (!items) return
    items.forEach((item, index) => {
      const element = item?.getElement()

      if (element) {
        const width = desktopVW(666 + (items.length - 1 - index) * 344, true)

        gsap.to(element, {
          width: width,
          height: width,
          duration: 1,
          ease: 'expo.out',
        })
      }
    })
  })

  return (
    <section
      ref={setRectRef}
      className=" relative bg-white dt:bg-transparent dt:h-screen"
    >
      <div className="dt:absolute dt:bottom-0 dt:left-0 dt:right-0 dt:top-[-100vh]">
        <div
          className="dt:h-screen dt:sticky dt:top-0 dt:left-0 dt:right-0 max-dt:transform-[unset]!"
          ref={stickyRef}
        >
          <div
            ref={overlayRef}
            className="bg-black inset-0 absolute z-2 opacity-25 pointer-events-none desktop-only"
          />
          <div
            className={cn(
              'absolute left-0 right-0 top-0 bottom-0 desktop-only'
            )}
          >
            <Background
              ref={backgroundRef}
              className="sticky top-0 h-screen left-0 right-0 bg-white"
            />
          </div>
          <div
            className="relative flex flex-col items-center justify-center dt:h-screen "
            ref={innerRef}
          >
            <div className="mobile-only dr-h-280 w-full relative ">
              <Image
                src="/assets/mobile-background/footer-top-mb.png"
                alt="Footer"
                fill
              />
            </div>
            <div className="text-center flex flex-col items-center relative dr-mb-30 dt:dr-mb-0">
              <div className="dr-w-172 aspect-square relative">
                <Image
                  src="/images/Octo-Sight.png"
                  alt="Octo Sight"
                  mobileSize="50vw"
                  fill
                />
              </div>

              <TitleBlock>
                <TitleBlock.Title level="h2" className="dr-mb-8! typo-h1!">
                  Start for free
                </TitleBlock.Title>
                <TitleBlock.Subtitle className="typo-p! dt:typo-p-l!">
                  Your first agent is only minutes away.
                </TitleBlock.Subtitle>
                <div className="flex dr-gap-8 dt:dr-mt-40 dr-mt-32 dt:flex-row flex-col">
                  <CTA
                    className="bg-black! text-teal border-teal"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    href={siteConfig.links.docs}
                  >
                    START BUILDING
                  </CTA>

                  <CTA
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className="w-full"
                    href="/contact-us"
                  >
                    contact us
                  </CTA>
                </div>
              </TitleBlock>
            </div>
            <div className="mobile-only dr-h-259 w-full relative dr-mb-40">
              <Image
                src="/assets/mobile-background/footer-bottom-mb.png"
                alt="Footer"
                fill
              />
            </div>
            <div className="w-full dt:absolute dt:left-0 dt:right-0 dt:bottom-0">
              <FooterContent />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
