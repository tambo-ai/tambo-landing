'use client'

import cn from 'clsx'
import { useRect } from 'hamo'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { DashedBorder } from '~/app/(pages)/home/_components/dashed-border'
import ArrowDownSVG from '~/assets/svgs/arrow-down.svg'
import LinesBg from '~/assets/svgs/hero-line-bg.svg'
import MobileLinesBg from '~/assets/svgs/hero-line-bg-mobile.svg'
import { CTA } from '~/components/button'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { siteConfig } from '~/libs/config'
import { fromTo } from '~/libs/utils'
import s from './hero.module.css'

const RiveWrapper = dynamic(
  () => import('~/components/rive').then((mod) => mod.RiveWrapper),
  {
    ssr: false,
  }
)

export function Hero() {
  const [setRectRef, rect] = useRect()
  const { isMobile, isDesktop } = useDeviceDetection()

  const titleRef = useRef<HTMLDivElement>(null)
  const arrowDownRef = useRef<HTMLDivElement>(null)

  useScrollTrigger({
    rect,
    start: 'top top',
    end: 'bottom center',
    onProgress: ({ progress }) => {
      fromTo(
        arrowDownRef.current,
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
      className={cn(
        s.wrapper,
        'relative dt:dr-p-40 dr-p-24  dr-mb-10 dt:dr-mb-0 bg-white section-rounded-bottom section-shadow-bottom overflow-hidden z-1'
      )}
    >
      <LinesBg
        className={
          'absolute desktop-only top-0 dr-inset-24 left-1/2 -translate-x-1/2 dt:w-screen dt:h-screen h-full section-rounded-bottom'
        }
      />
      <MobileLinesBg
        className={
          'absolute mobile-only top-0 dr-inset-24 left-1/2 -translate-x-1/2 h-full section-rounded-bottom'
        }
      />
      <div
        className={cn(
          s.inner,
          'flex bg-white dr-rounded-20 relative dt:dr-pl-64 dr-pb-24 dt:dr-pb-0'
        )}
      >
        <div className="flex dt:flex-row flex-col-reverse items-center content-max-width w-full">
          <div
            className="dt:dr-w-col-5 flex flex-col dr-gap-16 text-center items-start z-1 columns-1"
            ref={titleRef}
          >
            <h1 className="dt:typo-hero-title typo-h3 dt:text-start ">
              Build agents
              <br className="mobile-only" /> that{' '}
              <br className="desktop-only" /> speak your UI
            </h1>
            <p className=" typo-p text-black/50 dt:dr-w-489 dr-w-263 dt:text-start">
              An open-source toolkit for adding agents to your React app.
              Connect your existing components—Tambo handles streaming, state
              management, and MCP.
            </p>
            <div className="dr-mt-24">
              <CTA
                snippet
                href={siteConfig.links.docs}
                snippetEyebrow="NPM"
                className="bg-black! text-teal border-teal"
              >
                get started for free
                <span className="typo-code-snippet">
                  <span className="text-white">npm create tambo-app</span>
                </span>
              </CTA>
            </div>
          </div>
          {/* Mobile Rive - only renders on mobile devices */}
          {isMobile && (
            <div className="w-full grow min-h-0">
              <RiveWrapper
                src="/assets/rives/Mobile_hero_loop_1.riv"
                className="size-full pointer-events-none"
                alignment="Center"
                fit="Contain"
              />
            </div>
          )}
        </div>
      </div>
      {isDesktop && (
        <div
          ref={arrowDownRef}
          className={cn(
            s.arrowDown,
            'dt:dr-w-136 dt:aspect-square dt:bottom-0 left-[50%] rounded-full fixed z-10'
          )}
        >
          <DashedBorder className="absolute inset-0 " />
          <ArrowDownSVG className="dr-w-32 absolute left-[50%] translate-x-[-50%] dr-top-24" />
        </div>
      )}
      {/* Desktop Rive - only renders on desktop devices */}
      {isDesktop && (
        <div className="absolute inset-0 content-max-width">
          <RiveWrapper
            src="/assets/rives/hero_loop_1.riv"
            className="size-full pointer-events-none"
          />
        </div>
      )}
    </section>
  )
}
