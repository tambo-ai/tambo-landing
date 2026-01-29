'use client'

import cn from 'clsx'
import { useRef, useState } from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import PlusSVG from '~/assets/svgs/plus.svg'
import { Button } from '~/components/button'
import { Image } from '~/components/image'
import { Link } from '~/components/link'
import { Video } from '~/components/video'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { showcaseCards } from './data'
import s from './section-11.module.css'

export function Showcase() {
  const { isMobile, isDesktop } = useDeviceDetection()
  const [isOpenCard, setIsOpenCard] = useState<string | null>(null)
  const contentRefs = useRef<HTMLDivElement[]>([])

  return (
    <section
      className={cn(
        'dt:dr-pt-200 dr-pt-80 dt:dr-pb-200 dr-pb-120 relative content-max-width'
      )}
    >
      <div className="dr-layout-grid-inner">
        <TitleBlock className="dt:col-start-4 dt:col-end-10 col-span-full dr-mb-56">
          <TitleBlock.Title level="h2" className="dr-mb-8!">
            Built with Tambo
          </TitleBlock.Title>
          <TitleBlock.Subtitle className="dt:dr-mb-40 typo-p! dt:typo-p-l! ">
            Try our examples to see what tambo can do. Then build your own and
            share it—we'd love to showcase your app!
          </TitleBlock.Subtitle>
        </TitleBlock>
        {/* SHOWCASE CARDS */}
        <div className="dt:col-start-2 dt:col-end-12 col-span-full dt:dr-max-h-257">
          <div className="dt:dr-grid dt:dr-grid-cols-3 dt:dr-gap-24 flex flex-col dr-gap-y-16 relative items-start">
            {showcaseCards.map((card, i) => (
              <div
                key={`${card?.title}-${i}`}
                className={cn(
                  'relative',
                  s.cardWrapper,
                  isOpenCard === card?.title && s.isOpen
                )}
                style={{
                  '--content-height': `${contentRefs.current[i]?.offsetHeight}px`,
                }}
              >
                {/* Before was not working, div instead */}
                <div className={s.cardRing} />
                <Button
                  key={`${card?.title}-${i}`}
                  href={isDesktop ? card?.href : undefined}
                  className={cn(
                    'relative border border-dark-teal/50 dr-p-12 dr-pb-56 dt:dr-pb-12 bg-off-white dr-rounded-20 dt:dr-w-361 w-full dt:dr-max-h-390 dr-max-h-389 block overflow-hidden',
                    s.card
                  )}
                  onClick={() => {
                    if (isMobile) {
                      setIsOpenCard(
                        isOpenCard === card?.title ? null : card?.title
                      )
                    }
                  }}
                >
                  <div
                    className={cn(
                      'dt:dr-w-337 dt:dr-h-189 dr-h-170 border border-dark-teal/50 dr-rounded-8 aspect-16/9 dt:dr-mb-12 relative z-1 bg-white block',
                      s.cardImage
                    )}
                  >
                    {card?.image.includes('.png') ? (
                      <Image src={card?.image} alt={card?.title} fill />
                    ) : (
                      <Video autoPlay>
                        <source src={card?.image} type="video/webm" />
                      </Video>
                    )}
                  </div>

                  <div className="dt:dr-ml-12 relative z-1 flex items-center justify-between desktop-only">
                    <p className={cn('typo-h5 w-fit', s.title)}>
                      {card?.title}
                    </p>

                    <div
                      className={cn(
                        'dr-w-32 dr-h-32 bg-mint flex items-center justify-center dr-rounded-10 relative',
                        s.button
                      )}
                    >
                      <PlusSVG
                        className={cn('dr-w-16 dr-h-16 z-1 absolute ', s.plus)}
                      />
                      <ArrowSVG
                        className={cn('dr-w-16 dr-h-16 z-1 absolute ', s.arrow)}
                      />
                    </div>
                  </div>

                  <div
                    className={cn(
                      'absolute dt:dr-top-262 dr-top-242 dt:dr-ml-12',
                      s.cardContent
                    )}
                    ref={(el) => {
                      if (el) {
                        contentRefs.current.push(el)
                      }
                    }}
                  >
                    <p className="typo-p text-mint dr-mb-17 dt:dr-w-298 dr-w-263">
                      {card?.paragraph}
                    </p>
                    <p className="typo-label-m text-mint">{card?.user}</p>
                  </div>

                  <HashPattern
                    className={cn(
                      'absolute inset-0 text-dark-teal/20',
                      s.pattern
                    )}
                  />
                </Button>
                <Link
                  className={cn(
                    'absolute dr-top-193 w-full dr-px-12 flex items-center justify-between z-1 mobile-only',
                    isOpenCard === null && 'pointer-events-none'
                  )}
                  href={card?.href}
                >
                  <p className={cn('typo-h5 w-fit', s.title)}>{card?.title}</p>

                  <div
                    className={cn(
                      'dr-w-32 dr-h-32 bg-mint flex items-center justify-center dr-rounded-10 relative',
                      s.button
                    )}
                  >
                    <PlusSVG
                      className={cn('dr-w-16 dr-h-16 z-1 absolute ', s.plus)}
                    />
                    <ArrowSVG
                      className={cn('dr-w-16 dr-h-16 z-1 absolute ', s.arrow)}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
