'use client'

import gsap from 'gsap'
import { useRect, useWindowSize } from 'hamo'
import { useContext, useEffect, useEffectEvent, useRef, useState } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
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
import { fromTo } from '~/libs/utils'

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

  const { getItems, getBackground } = useContext(BackgroundContext)

  const { height: windowHeight = 0 } = useWindowSize()

  const desktopVW = useDesktopVW()

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  useScrollTrigger({
    rect,
    start: `top bottom`,
    end: 'bottom bottom',
    onEnter: () => {
      const items = getItems()
      items.forEach((item, index) => {
        const width = desktopVW(666 + (items.length - 1 - index) * 260, true)

        const boxShadow = item?.getBoxShadow()
        if (boxShadow) {
          boxShadow.style.opacity = '0'
        }

        item?.setBorderRadius(`${width * 2}px`)

        const element = item?.getElement()
        if (element) {
          element.style.width = `${width}px`
          element.style.height = `${width}px`
          element.style.transform = `translateY(0px)`
          element.style.opacity = `1`
        }

        const greyBackground = item?.getGreyBackground()
        if (greyBackground) {
          greyBackground.style.opacity = '1'
        }
      })
    },
    onLeave: () => {
      const items = getItems()
      items.forEach((item) => {
        const greyBackground = item?.getGreyBackground()
        if (greyBackground) {
          greyBackground.style.opacity = '0'
        }

        const element = item?.getElement()
        if (element) {
          element.style.opacity = `0`
        }
      })
    },
    onProgress: ({ progress, height, isActive }) => {
      if (!isActive) return

      const background = getBackground()

      if (innerRef.current && background) {
        if (progress === 0) {
          innerRef.current.style.transform =
            background.style.transform = `translateY(0px)`
        } else {
          innerRef.current.style.transform =
            background.style.transform = `translateY(${-windowHeight * 0.5 * (1 - progress)}px)`
        }
      }

      const items = getItems()

      fromTo(
        items,
        {
          y: height,
        },
        {
          y: 0,
        },
        progress,
        {
          ease: 'linear',
          render: (item, { y }) => {
            // @ts-expect-error
            const element = item?.getElement()

            if (element instanceof HTMLElement) {
              element.style.transform = `translateY(${y}px)`
            }
          },
        }
      )
    },
  })

  const onMouseEnter = useEffectEvent(() => {
    const items = getItems()
    items.forEach((item, index) => {
      const boxShadow = item?.getBoxShadow()
      if (boxShadow) {
        gsap.to(boxShadow, {
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
        })
      }

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

      const greyBackground = item?.getGreyBackground()
      if (greyBackground) {
        gsap.to(greyBackground, {
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
        })
      }
    })
  })

  const onMouseLeave = useEffectEvent(() => {
    const items = getItems()
    items.forEach((item, index) => {
      const boxShadow = item?.getBoxShadow()
      if (boxShadow) {
        gsap.to(boxShadow, {
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
        })
      }

      const element = item?.getElement()

      if (element) {
        const width = desktopVW(666 + (items.length - 1 - index) * 260, true)

        gsap.to(element, {
          width: width,
          height: width,
          duration: 1,
          ease: 'expo.out',
        })
      }

      const greyBackground = item?.getGreyBackground()
      if (greyBackground) {
        gsap.to(greyBackground, {
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
        })
      }
    })
  })

  return (
    <section ref={setRectRef} className="overflow-clip relative bg-white">
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
            <Image src="/images/Octo-Sight.png" alt="Octo Sight" unoptimized />
          </div>

          <TitleBlock>
            <TitleBlock.Title level="h2" className="dr-mb-8! typo-h1!">
              Ready to get started?
            </TitleBlock.Title>
            <TitleBlock.Subtitle className="typo-p! dt:typo-p-l! text-black/70">
              Ship an ai assistant with generative UI{' '}
              <br className="mobile-only" /> in minutes.
            </TitleBlock.Subtitle>
            <div className="flex dr-gap-8 dr-mt-40 dt:flex-row flex-col">
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
                href="https://ui.tambo.co/"
              >
                components
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
            Twitter
          </Link>
        </div>
      </div>
    </section>
  )
}
