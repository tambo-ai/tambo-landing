'use client'

import cn from 'clsx'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { showcaseCards } from './data'
import s from './section-11.module.css'

export function Section11() {
  return (
    <section className="dt:dr-pt-141 dt:dr-pb-210 dr-layout-grid-inner">
      <TitleBlock className="col-start-4 col-end-10 dt:dr-mb-56">
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
      <div className="col-start-2 col-end-12">
        <div className="dr-grid dr-grid-cols-3 dr-gap-24 relative items-start">
          {showcaseCards.map((card, i) => (
            <div
              key={`${card?.title}-${i}`}
              className={cn(
                'relative border border-dark-grey dr-p-12 bg-white dr-rounded-20 dt:dr-w-361 overflow-hidden',
                s.card
              )}
            >
              {/* IMAGE WIP */}
              <div
                className={cn(
                  'dt:dr-w-337 dt:dr-h-189 border-2 border-dark-grey dr-rounded-8 aspect-16/9 dt:dr-mb-12',
                  s.cardImage
                )}
              />

              <div className="dt:dr-mb-16 dt:dr-ml-12">
                <p className={cn('typo-h4', s.title)}>{card?.title}</p>
                {/* Icon here */}
              </div>

              <div
                className={cn(
                  'absolute dt:dr-top-262 dt:dr-ml-12',
                  s.cardContent
                )}
              >
                <p className="typo-p text-mint dt:dr-mb-17 dt:dr-w-298">
                  {card?.paragraph}
                </p>
                <p className="typo-label-m text-mint">{card?.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
