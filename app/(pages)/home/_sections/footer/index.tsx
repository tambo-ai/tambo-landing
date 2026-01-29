'use client'

import cn from 'clsx'
import gsap from 'gsap'
import { useRect } from 'hamo'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import DiscordSVG from '~/assets/svgs/discord.svg'
import GithubSVG from '~/assets/svgs/github.svg'
import XSVG from '~/assets/svgs/X.svg'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Kinesis } from '~/components/kinesis'
import { Link } from '~/components/link'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo, mapRange } from '~/libs/utils'
import Background, {
  type BackgroundRefType,
} from '../../_components/background'

const BOTTOM_LINKS = [
  {
    label: 'Documentation',
    href: 'https://docs.tambo.ai',
  },
  {
    label: 'License',
    href: 'https://docs.tambo.ai',
  },
  {
    label: 'Privacy notice',
    href: 'https://docs.tambo.ai',
  },
  {
    label: 'Terms of use',
    href: 'https://docs.tambo.ai',
  },
]

export function Footer() {
  const [setRectRef, rect] = useRect({ ignoreTransform: true })

  const innerRef = useRef<HTMLDivElement>(null)

  const [currentYear, setCurrentYear] = useState<number | null>(2026)

  // const { getItems, getBackground } = useContext(BackgroundContext)

  // const { height: windowHeight = 0 } = useWindowSize()

  const desktopVW = useDesktopVW()

  const backgroundRef = useRef<BackgroundRefType>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  useScrollTrigger({
    rect,
    start: `top bottom`,
    end: 'bottom bottom',
    onEnter: () => {
      // const items = backgroundRef.current?.getItems()
      // if (!items) return
      // items.forEach((item, index) => {
      //   const width = desktopVW(666 + (items.length - 1 - index) * 260, true)
      //   const boxShadow = item?.getBoxShadow()
      //   if (boxShadow) {
      //     boxShadow.style.opacity = '0'
      //   }
      //   item?.setBorderRadius(`${width * 2}px`)
      //   const element = item?.getElement()
      //   if (element) {
      //     element.style.width = `${width}px`
      //     element.style.height = `${width}px`
      //     element.style.transform = `translateY(0px)`
      //     element.style.opacity = `1`
      //   }
      //   const greyBackground = item?.getGreyBackground()
      //   if (greyBackground) {
      //     greyBackground.style.opacity = '1'
      //   }
      // })
    },
    onLeave: () => {
      // const items = getItems()
      // items.forEach((item) => {
      //   const greyBackground = item?.getGreyBackground()
      //   if (greyBackground) {
      //     greyBackground.style.opacity = '0'
      //   }
      //   const element = item?.getElement()
      //   if (element) {
      //     element.style.opacity = `0`
      //   }
      // })
    },
    onProgress: ({ progress }) => {
      // if (!isActive) return

      // const background = backgroundRef.current?.getBackground()

      // if (innerRef.current && background) {
      //   if (progress === 0) {
      //     innerRef.current.style.transform =
      //       background.style.transform = `translateY(0px)`
      //   } else {
      //     innerRef.current.style.transform =
      //       background.style.transform = `translateY(${-windowHeight * 0.5 * (1 - progress)}px)`
      //   }
      // }

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
      // const boxShadow = item?.getBoxShadow()
      // if (boxShadow) {
      //   gsap.to(boxShadow, {
      //     opacity: 1,
      //     duration: 1,
      //     ease: 'expo.out',
      //   })
      // }

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

      // const greyBackground = item?.getGreyBackground()
      // if (greyBackground) {
      //   gsap.to(greyBackground, {
      //     opacity: 0,
      //     duration: 1,
      //     ease: 'expo.out',
      //   })
      // }
    })
  })

  const onMouseLeave = useEffectEvent(() => {
    // return
    const items = backgroundRef.current?.getItems()
    if (!items) return
    items.forEach((item, index) => {
      // const boxShadow = item?.getBoxShadow()
      // if (boxShadow) {
      //   gsap.to(boxShadow, {
      //     opacity: 0,
      //     duration: 1,
      //     ease: 'expo.out',
      //   })
      // }

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

      // const greyBackground = item?.getGreyBackground()
      // if (greyBackground) {
      //   gsap.to(greyBackground, {
      //     opacity: 1,
      //     duration: 1,
      //     ease: 'expo.out',
      //   })
      // }
    })
  })

  return (
    <section
      ref={setRectRef}
      className="overflow-clip relative bg-white dt:bg-transparent dt:h-screen"
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
            <Kinesis
              getIndex={() => 50}
              className="text-center flex flex-col items-center relative dr-mb-30 dt:dr-mb-0"
            >
              <div className="dr-w-172 aspect-square">
                <Image
                  src="/images/Octo-Sight.png"
                  alt="Octo Sight"
                  unoptimized
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
                    href="https://docs.tambo.co/"
                  >
                    START BUILDING
                  </CTA>

                  <CTA
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className="w-full"
                    href="https://cal.com/michaelmagan/chat?duration=30"
                  >
                    contact us
                  </CTA>
                </div>
              </TitleBlock>
            </Kinesis>
            <div className="mobile-only dr-h-259 w-full relative dr-mb-40">
              <Image
                src="/assets/mobile-background/footer-bottom-mb.png"
                alt="Footer"
                fill
              />
            </div>
            <div className="mobile-only flex dr-gap-12 dr-mb-32">
              <Link
                href="https://github.com/tambo-ai/tambo"
                className="dr-size-32 rounded-full bg-grey grid place-items-center"
              >
                <GithubSVG className="dr-w-16 dr-h-16" />
              </Link>
              <Link
                href="https://discord.com/invite/dJNvPEHth6"
                className="dr-size-32 rounded-full bg-grey grid place-items-center"
              >
                <DiscordSVG className="dr-w-16 dr-h-16" />
              </Link>
              <Link
                href="https://x.com/tambo_ai"
                className="dr-size-32 rounded-full bg-grey grid place-items-center"
              >
                <XSVG className="dr-w-16 dr-h-16" />
              </Link>
            </div>

            <div className="dt:absolute dt:dr-layout-grid-inner dr-px-0 flex flex-col-reverse w-full dr-bottom-16 typo-label-m dr-mb-16 dt:dr-mb-0">
              <span className="dt:col-span-2 typo-label-s dt:typo-label-m text-center dt:text-left text-black/70">
                Fractal Dynamics Inc © {currentYear ?? 2025}
              </span>
              <div className="dt:col-[3/-3] flex items-center justify-center dt:dr-gap-24 dr-gap-13 dr-mb-16 dt:mb-0">
                {BOTTOM_LINKS.map((link, index) => (
                  <Link
                    key={link.label + index.toString()}
                    href={link.href}
                    className="link typo-label-s dt:typo-label-m"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="https://x.com/tambo_ai"
                className="col-span-2 justify-self-end link desktop-only"
              >
                <XSVG className="dr-w-16 dr-h-16" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
