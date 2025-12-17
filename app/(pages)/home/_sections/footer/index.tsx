'use client'

import gsap from 'gsap'
import { useRect, useWindowSize } from 'hamo'
import { useContext, useEffectEvent, useRef } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
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
  const [setRectRef, rect] = useRect()

  const innerRef = useRef<HTMLDivElement>(null)

  const { getItems, getBackground } = useContext(BackgroundContext)

  const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize()

  const desktopVW = useDesktopVW()

  useScrollTrigger({
    rect,
    start: 'top bottom',
    end: 'bottom bottom',
    onProgress: ({ progress }) => {
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
    },
  })

  useScrollTrigger({
    rect,
    start: `${rect?.top === undefined || rect?.height === undefined ? 'top' : rect?.top - windowHeight} bottom`,
    end: 'top top',
    onProgress: ({ progress, height }) => {
      const items = getItems()

      if (progress === 0) {
        items.forEach((item, index) => {
          const width = desktopVW(666 + (items.length - 1 - index) * 260, true)

          const element = item?.getElement()

          const boxShadow = item?.getBoxShadow()
          if (boxShadow) {
            boxShadow.style.opacity = '0'
          }

          item?.setBorderRadius(`${width * 2}px`)

          if (element instanceof HTMLElement) {
            element.style.width = `${width}px`
            element.style.height = `${width}px`
            element.style.transform = `translateY(0px)`
          }
        })
      }

      fromTo(
        items,
        {
          y: height,
          // width: (index) =>
          //   desktopVW(496 + (items.length - 1 - index) * 260, true),
        },
        {
          y: 0,
          // width: (index) =>
          //   desktopVW(496 + (items.length - 1 - index) * 260, true),
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

  // useTempus(() => {
  //   const items = getItems()
  //   items.forEach((item) => {
  //     const boxShadow = item?.getBoxShadow()
  //     if (boxShadow) {
  //       boxShadow.style.opacity = `${hoverProgressRef.current}`
  //     }
  //   })
  // })

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
      if (element instanceof HTMLElement) {
        const width = desktopVW(596 + (items.length - 1 - index) * 260, true)

        gsap.to(element, {
          width: width,
          height: width,
          duration: 1,
          ease: 'expo.out',
        })
      }
    })

    // gsap.to(hoverProgressRef, {
    //   current: 1,
    //   duration: 1,
    //   ease: 'expo.out',
    // })
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
      if (element instanceof HTMLElement) {
        const width = desktopVW(666 + (items.length - 1 - index) * 260, true)

        gsap.to(element, {
          width: width,
          height: width,
          duration: 1,
          ease: 'expo.out',
        })
      }
    })
    // gsap.to(hoverProgressRef, {
    //   current: 0,
    //   duration: 1,
    //   ease: 'expo.out',
    // })
  })

  return (
    <section ref={setRectRef} className="overflow-clip">
      <div
        className="relative flex flex-col items-center justify-center h-screen"
        ref={innerRef}
      >
        <div className="text-center flex flex-col items-center relative -dr-top-48">
          <div className="dr-w-172 aspect-square">
            {/* <Video
            autoPlay
            fallback={
              <Image src="/videos/Octo-Wave.png" alt="Octo Wave" unoptimized />
            }
          >
            <source
              src="/videos/Octo-Wave-compressed.mov"
              type='video/mp4; codecs="hvc1"'
            />
            <source src="/videos/Octo-Wave-compressed.webm" type="video/webm" />
          </Video> */}
            <Image src="/images/Octo-Sight.png" alt="Octo Sight" unoptimized />
          </div>

          <TitleBlock>
            <TitleBlock.Title level="h2" className="dt:dr-mb-8!">
              Ready to get started?
            </TitleBlock.Title>
            <TitleBlock.Subtitle>
              Ship an ai assistant with generative ui in minutes.
            </TitleBlock.Subtitle>
            <div className="flex dr-gap-8 dr-mt-40">
              <CTA
                snippet
                className="bg-black! text-teal border-teal"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                START BUILDING
                <span className="typo-code-snippet">
                  <span className="text-pink">{'<TamboProvider'} </span>
                  <span className="text-teal">
                    {'components='}
                    <span className="text-pink">{'{components}'}</span>
                  </span>
                  <span className="text-pink">{'>'}</span>
                  <br />
                  <span className="text-white dt:dr-ml-16">
                    {'<YourApp />'}
                  </span>
                  <br />
                  <span className="text-pink">{'</TamboProvider>'}</span>
                </span>
              </CTA>
              <CTA onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                Try Live Demo
              </CTA>
            </div>
          </TitleBlock>
        </div>
        <div className="absolute dr-layout-grid-inner w-full dr-bottom-16 typo-label-m">
          <span className="col-span-2">
            Fractal Dynamics Inc © {new Date().getFullYear()}
          </span>
          <div className="col-[3/-3] flex items-center justify-center dr-gap-24">
            {BOTTOM_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="link">
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="https://x.com/tambo_ai"
            className="col-span-2 justify-self-end link"
          >
            Twitter
          </Link>
        </div>
      </div>
    </section>
  )
}
