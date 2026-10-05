'use client'

import cn from 'clsx'
import { useIntersectionObserver, useRect } from 'hamo'
import { useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import CheckSVG from '~/assets/svgs/check.svg'
import { CTA } from '~/components/button'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { mapRange } from '~/libs/utils'
import { banner, notice } from './data'
import s from './section-12.module.css'

export function Pricing() {
  const [setRectRef, rect] = useRect()

  const { getSolidBackground } = useContext(BackgroundContext)

  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '-20%',
    threshold: 0.4,
  })
  const isActive = intersection?.isIntersecting

  const desktopVW = useDesktopVW()

  useScrollTrigger(
    {
      rect,
      start: 'bottom bottom',
      end: 'bottom top',
      onProgress: ({ progress, height }) => {
        const solidBackground = getSolidBackground()
        if (solidBackground) {
          const inset = mapRange(0, 1, progress, 0, desktopVW(40, true))
          const radius = mapRange(0, 1, progress, 0, desktopVW(20, true))

          solidBackground.style.clipPath = `inset(0 ${inset}px 0px ${inset}px round ${radius}px)`

          solidBackground.style.transform = `translateY(${-height * progress}px)`
        }
      },
    },
    []
  )

  return (
    <section
      className="dt:dr-pt-65 dr-pt-0 dr-pb-120 dt:dr-pb-200 bg-white scroll-mt-220"
      ref={setRectRef}
      id="pricing"
    >
      <div className="mx-auto dr-layout-grid-inner relative content-max-width">
        <TitleBlock className="dt:col-start-4 dt:col-end-10 dr-mb-56 col-span-full">
          <TitleBlock.LeadIn>PRICING</TitleBlock.LeadIn>
          <TitleBlock.Title level="h2" className="dr-mb-0!">
            New signups <br className="mobile-only" /> are closed
          </TitleBlock.Title>
        </TitleBlock>
        <div className="dt:col-start-2 dt:col-end-12 col-span-full">
          <div className="dt:dr-mb-32 dr-mb-16">
            <ShutdownNotice />
          </div>
          {/* BANNER */}
          <div className={s.cardWrapper}>
            <div className={s.cardRing} />
            <div
              className={cn(
                'w-full dr-p-8 border border-dark-grey dr-rounded-20 relative',
                s.banner,
                isActive && s.active
              )}
              ref={setIntersectionRef}
            >
              <div className="bg-black w-full dr-rounded-12 dr-p-24 relative overflow-hidden flex flex-col dt:flex-row dt:justify-between dt:items-center">
                <div className="absolute inset-0 dark-teal-pattern z-0" />
                <div className="relative text-teal dr-mb-24 dt:dr-mb-0">
                  <h3 className="typo-h3 dr-mb-8">{banner?.title}</h3>
                  <p className="typo-p">{banner?.description}</p>
                </div>
                <ul className="flex flex-col dt:flex-row dt:dr-gap-40 dr-gap-8 relative dr-mb-32 dt:dr-mb-0">
                  {banner?.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center dt:dr-gap-4 dr-gap-8"
                    >
                      <CheckSVG className="dr-size-16 text-teal" />
                      <p className="typo-label-m text-teal">{feature}</p>
                    </li>
                  ))}
                </ul>
                <CTA
                  color="black"
                  icon="github"
                  href={banner?.button?.href}
                  active={isActive}
                >
                  {banner?.button?.text}
                </CTA>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ShutdownNotice() {
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '-20%',
    threshold: 0.4,
  })
  const isActive = intersection?.isIntersecting

  return (
    <div className={s.cardWrapper}>
      <div className={s.cardRing} />

      <div
        ref={setIntersectionRef}
        className={cn(
          'dr-p-8 border border-dark-grey dr-rounded-20 bg-white relative flex flex-col dt:flex-row dt:items-center dr-gap-12 dt:dr-gap-24',
          s.card,
          isActive && s.active
        )}
      >
        <div
          className={cn(
            'dr-p-16 dr-rounded-12 bg-off-white border border-dark-grey grow',
            s.cardHeader
          )}
        >
          <p className="dt:typo-label-m typo-label-s dr-mb-16">
            {notice.label}
          </p>
          <h3 className="dt:typo-h3 typo-h4 dr-mb-8">{notice.title}</h3>
          <p className="dt:typo-p typo-p-s">{notice.description}</p>
        </div>
        <CTA
          className="w-full dt:justify-between"
          wrapperClassName="shrink-0 dt:dr-pr-16"
          href={notice.button.href}
          active={isActive}
        >
          {notice.button.text}
        </CTA>
      </div>
    </div>
  )
}
