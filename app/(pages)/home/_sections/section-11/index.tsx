'use client'

import cn from 'clsx'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import PlusSVG from '~/assets/svgs/plus.svg'
import { Button } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { showcaseCards } from './data'
import s from './section-11.module.css'

export function Section11() {
  return (
    <section className="dt:dr-pt-141 dt:dr-pb-210 dt:dr-layout-grid-inner">
      <TitleBlock className="dt:col-start-4 dt:col-end-10 dt:dr-mb-56">
        <TitleBlock.LeadIn>
          {'<'} SHowcase {'>'}
        </TitleBlock.LeadIn>
        <TitleBlock.Title level="h2" className="dt:dr-mb-8!">
          Built with Tambo
        </TitleBlock.Title>
        <TitleBlock.Subtitle className="text-black/70 dt:dr-mb-40">
          Generative UI unlocks new possibilities.
          <br />
          Here are some of the best apps from our developer community.
        </TitleBlock.Subtitle>
        <TitleBlock.Button href="/">Start Building</TitleBlock.Button>
      </TitleBlock>
      {/* SHOWCASE CARDS */}
      <div className="dt:col-start-2 dt:col-end-12">
        <div className="dt:dr-grid dt:dr-grid-cols-3 dt:dr-gap-24 relative items-start">
          {showcaseCards.map((card, i) => (
            <Button
              key={`${card?.title}-${i}`}
              href={card?.href}
              className={cn(
                'relative border-2 border-dark-grey dt:dr-p-12 bg-white dt:dr-rounded-20 dt:dr-w-361 dt:dr-max-h-371 overflow-hidden',
                s.card
              )}
            >
              <HashPattern
                className={cn('absolute inset-0 text-dark-teal/20', s.pattern)}
              />

              <span
                className={cn(
                  'dt:dr-w-337 dt:dr-h-189 border-2 border-dark-grey dt:dr-rounded-8 aspect-16/9 dt:dr-mb-12 relative z-1 bg-white block',
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
              </span>

              <span className="dt:dr-ml-12 relative z-1 flex items-center justify-between">
                <p className={cn('typo-h4 w-fit', s.title)}>{card?.title}</p>

                <span
                  className={cn(
                    'dt:dr-w-32 dt:dr-h-32 bg-mint flex items-center justify-center dr-rounded-10 relative',
                    s.button
                  )}
                >
                  <PlusSVG
                    className={cn('dt:dr-w-16 dt:dr-h-16 z-1 absolute', s.plus)}
                  />
                  <ArrowSVG
                    className={cn(
                      'dt:dr-w-16 dt:dr-h-16 z-1 absolute',
                      s.arrow
                    )}
                  />
                </span>
              </span>

              <span
                className={cn(
                  'absolute dt:dr-top-262 dt:dr-ml-12',
                  s.cardContent
                )}
              >
                <p className="typo-p text-mint dt:dr-mb-17 dt:dr-w-298">
                  {card?.paragraph}
                </p>
                <p className="typo-label-m text-mint">{card?.user}</p>
              </span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
