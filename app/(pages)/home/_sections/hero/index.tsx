'use client'

import { Alignment } from '@rive-app/react-webgl2'
import cn from 'clsx'
import { useRect } from 'hamo'
import { useRef } from 'react'
import { DashedBorder } from '~/app/(pages)/home/_components/dashed-border'
import ArrowDownSVG from '~/assets/svgs/arrow-down.svg'
import LinesBg from '~/assets/svgs/hero-line-bg.svg'
import { CTA } from '~/components/button'
import { RiveWrapper } from '~/components/rive'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { useStore } from '~/libs/store'
import { fromTo } from '~/libs/utils'
import s from './hero.module.css'

export function Hero() {
  const [setRectRef, rect] = useRect()

  const titleRef = useRef<HTMLDivElement>(null)
  const arrowDownRef = useRef<HTMLDivElement>(null)
  const mobileArrowDownRef = useRef<HTMLDivElement>(null)

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
      className={cn(
        s.wrapper,
        'relative dt:dr-p-40 dr-p-24  dr-mb-10 dt:dr-mb-0 bg-white section-rounded-bottom section-shadow-bottom overflow-hidden z-1'
      )}
    >
      <LinesBg
        className={
          'absolute top-0 dr-inset-24 left-1/2 -translate-x-1/2 dt:w-screen dt:h-screen h-full section-rounded-bottom'
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
            className="dt:dr-w-col-4 flex flex-col dr-gap-16 text-center items-start z-1 columns-1"
            ref={titleRef}
          >
            <h1 className="dt:typo-h1 typo-h3 dt:text-start ">
              Build agents
              <br className="mobile-only" /> that{' '}
              <br className="desktop-only" /> speak your UI
            </h1>
            <p className=" typo-p text-black/50 dt:dr-w-322 dr-w-263 dt:text-start">
              An open-source toolkit for adding agents <br /> to your React app.
              Connect your existing components—Tambo handles streaming, state
              management, and MCP.
            </p>
            <div className="dr-mt-24">
              <CTA
                snippet
                href="https://docs.tambo.co/"
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
          <div className="mobile-only w-full h-full top-0 left-0 absolute">
            <RiveWrapper
              src="/assets/rives/Mobile_hero_loop_1.riv"
              className="size-full pointer-events-none"
              alignment={Alignment.TopCenter}
            />
          </div>
        </div>
      </div>
      <div
        ref={arrowDownRef}
        className={cn(
          s.arrowDown,
          'desktop-only dt:dr-w-136 dt:aspect-square dt:bottom-0 left-[50%] rounded-full fixed z-10'
        )}
      >
        <DashedBorder className="absolute inset-0 " />
        <ArrowDownSVG className="dr-w-32 absolute left-[50%] translate-x-[-50%] dr-top-24" />
      </div>
      <div className="desktop-only absolute inset-0 content-max-width">
        <RiveWrapper
          src="/assets/rives/hero_loop_1.riv"
          className="size-full pointer-events-none"
        />
      </div>
    </section>
  )
}
