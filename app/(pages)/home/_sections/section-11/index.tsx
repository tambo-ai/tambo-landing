'use client'

import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useEffect, useState } from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import PlusSVG from '~/assets/svgs/plus.svg'
import { Button, CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Marquee } from '~/components/marquee'
import { Video } from '~/components/video'
import { buttons, persons, showcaseCards } from './data'
import s from './section-11.module.css'

export function Section11() {
  const [isInViewport, setIsInViewport] = useState(false)
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '0px',
  })

  useEffect(() => {
    setIsInViewport(intersection?.isIntersecting ?? false)
  }, [intersection])

  return (
    <section
      ref={setIntersectionRef}
      className={cn(
        'dt:dr-pt-847 dt:dr-pb-203 relative',
        isInViewport && s.inViewport
      )}
    >
      <div className="dt:dr-layout-grid-inner absolute dt:dr-top-141">
        <TitleBlock className="dt:col-start-4 dt:col-end-10 dt:dr-mb-56 text-teal">
          <TitleBlock.LeadIn className="text-teal">
            {'<'} SHowcase {'>'}
          </TitleBlock.LeadIn>
          <TitleBlock.Title level="h2" className="dt:dr-mb-8!">
            Built with Tambo
          </TitleBlock.Title>
          <TitleBlock.Subtitle className="dt:dr-mb-40 text-dark-teal">
            Generative UI unlocks new possibilities.
            <br />
            Here are some of the best apps from our developer community.
          </TitleBlock.Subtitle>
          <TitleBlock.Button href="/" color="black">
            Start Building
          </TitleBlock.Button>
        </TitleBlock>
        {/* SHOWCASE CARDS */}
        <div className="dt:col-start-2 dt:col-end-12">
          <div className="dt:dr-grid dt:dr-grid-cols-3 dt:dr-gap-24 relative items-start">
            {showcaseCards.map((card, i) => (
              <Button
                key={`${card?.title}-${i}`}
                href={card?.href}
                className={cn(
                  'relative border-2 border-teal dt:dr-p-12 bg-black dt:dr-rounded-20 dt:dr-w-361 dt:dr-max-h-371 overflow-hidden',
                  s.card
                )}
              >
                <HashPattern
                  className={cn(
                    'absolute inset-0 text-dark-teal/20',
                    s.pattern
                  )}
                />

                <div
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
                </div>

                <div className="dt:dr-ml-12 relative z-1 flex items-center justify-between">
                  <p className={cn('typo-h5 w-fit text-teal', s.title)}>
                    {card?.title}
                  </p>

                  <div
                    className={cn(
                      'dt:dr-w-32 dt:dr-h-32 bg-black border border-teal flex items-center justify-center dr-rounded-10 relative',
                      s.button
                    )}
                  >
                    <PlusSVG
                      className={cn(
                        'dt:dr-w-16 dt:dr-h-16 z-1 absolute ',
                        s.plus
                      )}
                    />
                    <ArrowSVG
                      className={cn(
                        'dt:dr-w-16 dt:dr-h-16 z-1 absolute ',
                        s.arrow
                      )}
                    />
                  </div>
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
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee section */}
      <div className="text-center dt:dr-mb-40 text-teal">
        <h3 className="typo-h3">Backing our vision.</h3>
        <p className="typo-p-l ">
          Trusted by industry leaders in AI, product, and engineering.
        </p>
      </div>

      <Marquee repeat={2} speed={0.3} className="dt:dr-mb-56 ">
        <div className="flex dr-gap-x-24 dr-mr-24">
          {persons?.map((person) => (
            <Button
              key={person?.name}
              className={cn(
                'dt:dr-w-322 dt:h-fit dt:dr-p-16 dt:dr-rounded-20 border border-dark-grey flex dr-gap-x-16 bg-white',
                s.personCard
              )}
              href={person?.url}
            >
              <div className="dt:dr-w-40 dt:dr-h-40 dt:dr-rounded-full relative">
                <Image src={person?.image} alt={person?.name} fill />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center dr-gap-x-4 w-full dr-mb-8">
                  <p className="typo-p">{person?.name ?? ''}</p>
                  <p className="typo-label-m text-black/50">
                    {person?.account ?? ''}
                  </p>
                </div>
                <div className="dt:dr-max-w-234 whitespace-normal">
                  <p className="typo-p-s ">
                    {(person?.tweet ?? '').split(' ').map((word, index) => (
                      <span
                        key={`${index}-${person?.name}`}
                        className={word.startsWith('@') ? 'text-[#1D9BF0]' : ''}
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Marquee>
      <div className="dr-gap-x-16 flex items-center justify-center w-full">
        {buttons.map((button) => (
          <CTA
            key={button.text}
            icon={button?.icon as 'github' | 'discord'}
            href={button?.href}
            color="black"
          >
            {button.text}
          </CTA>
        ))}
      </div>
    </section>
  )
}
