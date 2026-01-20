'use client'

import { useIntersectionObserver, useRect, useWindowSize } from 'hamo'
import { useContext, useEffect, useRef, useState } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
// import { Kinesis } from '~/components/kinesis'
import { Video } from '~/components/video'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'

const BUTTONS = [
  {
    title: 'Generative UI Components',
    href: ' https://docs.tambo.co/concepts/components',
    top: 15,
    left: 33,
  },
  {
    title: 'Interactable Components',
    href: 'https://docs.tambo.co/concepts/components/interactable-components',
    top: 20,
    right: 12,
  },
  {
    title: 'MCP-Native',
    href: 'https://docs.tambo.co/concepts/model-context-protocol',
    top: 30,
    left: 10,
  },
  {
    title: 'Local Tools',
    href: 'https://docs.tambo.co/concepts/tools/adding-tools',
    top: 45,
    left: 25,
  },
  {
    title: 'Streaming Support',
    href: 'https://docs.tambo.co/concepts/streaming',
    top: 60,
    right: 90,
  },
  {
    title: 'Message History',
    href: 'https://docs.tambo.co/concepts/message-threads',
    top: 40,
    left: 80,
  },
  {
    title: 'State Management',
    href: ' https://docs.tambo.co/api-reference/react-hooks',
    top: 60,
    left: 85,
  },
  {
    title: 'Suggested Actions',
    href: 'https://docs.tambo.co/concepts/suggestions',
    top: 75,
    right: 33,
  },
  {
    title: 'Tool Orchestration',
    href: 'Ahttps://docs.tambo.co/#why-tambo',
    top: 80,
    left: 40,
  },
  {
    title: 'Model Flexibility',
    href: ' https://docs.tambo.co/models',
    top: 90,
    right: 23,
  },
  {
    title: 'Component Library ',
    href: 'https://ui.tambo.co/',
    top: 85,
    left: 15,
  },
]

export function Section10() {
  const buttonsRefs = useRef<(HTMLDivElement | null)[]>([])
  const buttonsWrapperRef = useRef<HTMLDivElement | null>(null)

  const [setRectRef, rect] = useRect()

  const { getItems, getBackground, getElement } = useContext(BackgroundContext)

  const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize()

  const desktopVW = useDesktopVW()

  const [isVisible, setIsVisible] = useState(false)

  useScrollTrigger({
    rect,
    start: 'top center',
    end: 'top top',
    onProgress: ({ progress, isActive }) => {
      if (!isActive) return

      const backgroundElement = getElement()
      if (backgroundElement) {
        backgroundElement.style.backgroundColor = `rgba(255, 255, 255, ${1 - progress})`
      }

      const background = getBackground()
      if (progress > 0 && background) {
        background.style.opacity = '1'
      }

      const items = getItems()
      fromTo(
        items,
        {
          width: (index) =>
            desktopVW(
              windowWidth * 1.5 + (items.length - 1 - index) * 100,
              true
            ),
          opacity: 1,
          kinesis: 1,
          boxShadowOpacity: 1,
        },
        {
          width: (index) =>
            desktopVW(496 + (items.length - 1 - index) * 260, true),
          opacity: 1,
          kinesis: 1,
          boxShadowOpacity: 1,
        },
        progress,
        {
          ease: 'easeOutSine',
          render: (item, { width, opacity, kinesis, boxShadowOpacity }) => {
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
              element.style.opacity = `${opacity}`
            }
          },
        }
      )
    },
  })

  // Trigger animation when title block is 50% visible
  const [setAnimationTriggerRef, intersection] = useIntersectionObserver({
    threshold: 0.5,
  })

  useEffect(() => {
    if (intersection?.isIntersecting !== undefined) {
      setIsVisible(intersection.isIntersecting)
    }
  }, [intersection?.isIntersecting])

  // Staggered button animation (handles both enter and exit)
  useEffect(() => {
    buttonsRefs.current.forEach((button) => {
      if (button) {
        button.style.opacity = isVisible ? '1' : '0'
        button.style.transform = isVisible ? 'scale(1)' : 'scale(1.1)'
      }
    })
  }, [isVisible])

  useScrollTrigger({
    rect,
    start: 'bottom bottom',
    end: `${rect?.top === undefined || rect?.height === undefined ? 'bottom' : rect?.top + rect?.height + windowHeight * 0.5} top`,
    onProgress: ({ progress, height, isActive }) => {
      if (!isActive) return

      // if (buttonsWrapperRef.current) {
      //   buttonsWrapperRef.current.style.transform = `translateY(${-height * progress * 0.5}px)`
      // }

      const items = getItems()
      fromTo(
        items,
        {
          y: 0,
          boxShadowOpacity: 1,
          opacity: 1,
        },
        {
          y: (index) => {
            if (index === items.length - 1) return -height

            return -height - (items.length - index) * height * 0.15
            // (items.length - index) * -height
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

            // item?.setBorderRadius(`${width * 2}px`)

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
    <section
      ref={setRectRef}
      className="relative overflow-x-clip dt:dr-mb-256 max-dt:bg-white"
      // style={{
      //   height: isDesktop ? `${BUTTONS.length * 500}px` : 'auto',
      // }}
    >
      <div className="mobile-only w-full dr-h-280 relative">
        <Image
          src="/assets/mobile-background/section-10Top.png"
          alt="Section 10 Background"
          fill
        />
      </div>
      <div className="dt:h-screen w-full flex flex-col items-center justify-center dt:bg-transparent bg-white ">
        <div
          // getIndex={() => 50}
          className="text-center flex flex-col items-center relative dt:-dr-top-48"
        >
          <div
            ref={setAnimationTriggerRef}
            className="flex flex-col items-center justify-center"
          >
            <div className="dr-w-172 aspect-square">
              <Video
                autoPlay
                fallback={
                  <Image
                    src="/videos/Octo-Catch.png"
                    alt="Octo Wave"
                    unoptimized
                  />
                }
              >
                <source
                  src="/videos/Octo-Catch-compressed.mov"
                  type='video/mp4; codecs="hvc1"'
                />
                <source
                  src="/videos/Octo-Catch-compressed.webm"
                  type="video/webm"
                />
              </Video>
            </div>

            <TitleBlock>
              <TitleBlock.LeadIn>
                {'<'} FEATURES {'>'}
              </TitleBlock.LeadIn>
              <TitleBlock.Title
                level="h2"
                className="dt:dr-mb-8! mb-0! typo-h1!"
              >
                <span className="desktop-only">
                  One SDK,
                  <br />
                  orchestrating <br /> everything
                </span>
                <span className="mobile-only">
                  One SDK,
                  <br />
                  orchestrating everything
                </span>
              </TitleBlock.Title>
            </TitleBlock>
          </div>
        </div>
        <div className="w-full dr-p-24 mobile-only flex flex-col dr-gap-y-8">
          {BUTTONS.map((button, index) => (
            <div className="w-full " key={button.title + index.toString()}>
              <CTA className="flex! justify-between" href={button.href}>
                {button.title}
              </CTA>
            </div>
          ))}
        </div>
        <div className="mobile-only w-full  dr-h-280 relative">
          <div className="absolute bottom-0 left-0 right-0 bg-light-gray dr-h-280 w-full mobile-only dr-mb-[-1]" />
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
          {BUTTONS.map((button, index) => (
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
  )
}
