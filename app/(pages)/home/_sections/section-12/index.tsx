'use client'

import cn from 'clsx'
import { useRect } from 'hamo'
import { useContext } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import CheckSVG from '~/assets/svgs/check.svg'
import { CTA } from '~/components/button'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { mapRange } from '~/libs/utils'
import { banner, pricingCards } from './data'
import s from './section-12.module.css'

export function Section12() {
  const [setRectRef, rect] = useRect()

  const { getSolidBackground } = useContext(BackgroundContext)

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
    <section className="dt:dr-pt-65 dt:dr-pb-137" ref={setRectRef}>
      {/* <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-white" /> */}
      <div
        style={{ maxWidth: `calc(var(--max-width) * 1px)` }}
        className="mx-auto dt:dr-layout-grid-inner relative"
      >
        <TitleBlock className="dt:col-start-4 dt:col-end-10 dt:dr-mb-56">
          <TitleBlock.LeadIn>
            {'<'} PRICING {'>'}
          </TitleBlock.LeadIn>
          <TitleBlock.Title level="h2" className="dt:dr-mb-8!">
            Simple pricing
            <br />
            from hobbyists to enterprise
          </TitleBlock.Title>
        </TitleBlock>
        <div className="dt:col-start-2 dt:col-end-12">
          <div className="dt:grid dt:grid-cols-3 dt:dr-gap-24 dt:dr-mb-32">
            {pricingCards.map((card, i) => (
              <div
                key={`${card?.plan}-${i}`}
                className={cn(
                  'dt:dr-p-8 border border-dark-grey dt:dr-rounded-20 bg-white dt:dr-h-497 dt:flex dt:flex-col dt:justify-between',
                  s.card
                )}
              >
                <div>
                  <div
                    className={cn(
                      'dt:dr-p-16 dt:dr-rounded-12 bg-off-white border border-dark-grey dt:dr-mb-32',
                      s.cardHeader
                    )}
                  >
                    <p className="typo-label-m dt:dr-mb-16">
                      {'< '}
                      {card?.plan}
                      {' >'}
                    </p>
                    <h2 className="typo-h3 dt:dr-mb-8">{card?.title}</h2>
                    <p className="typo-p">{card?.description}</p>
                  </div>
                  <ul className="dt:flex dt:flex-col dt:dr-gap-12">
                    {card?.features.map((feature) => (
                      <li
                        key={feature}
                        className="dt:flex dt:items-center dt:dr-gap-4"
                      >
                        <CheckSVG className="dr-size-16 text-teal" />
                        <p className="typo-label-s">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <CTA
                  className="w-full dt:justify-between"
                  href={card?.button?.href}
                >
                  {card?.button?.text}
                </CTA>
              </div>
            ))}
          </div>
          {/* BANNER */}
          <div
            className={cn(
              'w-full dt:dr-p-8 border border-dark-grey  dt:dr-rounded-20',
              s.banner
            )}
          >
            <div className="bg-black w-full dt:dr-rounded-12 dt:dr-p-24 relative overflow-hidden dt:flex dt:justify-between">
              <div className="absolute inset-0 dark-teal-pattern z-0" />
              <div className="relative text-teal">
                <h3 className="typo-h3 dt:dr-mb-8">{banner?.title}</h3>
                <p className="typo-p">{banner?.description}</p>
              </div>
              <ul className="dt:flex dt:dr-gap-40 relative">
                {banner?.features.map((feature) => (
                  <li key={feature} className="dt:flex items-center dr-gap-4">
                    <CheckSVG className="dr-size-16 text-teal" />
                    <p className="typo-label-s text-teal">{feature}</p>
                  </li>
                ))}
              </ul>
              <CTA color="black" icon="github" href={banner?.button?.href}>
                {banner?.button?.text}
              </CTA>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
