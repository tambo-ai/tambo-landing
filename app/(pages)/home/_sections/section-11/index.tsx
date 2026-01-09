'use client'

import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useRef, useState } from 'react'
import { SolidBackground } from '~/app/(pages)/home/_components/background'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import PlusSVG from '~/assets/svgs/plus.svg'
import { Button, CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Link } from '~/components/link'
import { Marquee } from '~/components/marquee'
import { Video } from '~/components/video'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { buttons, persons, showcaseCards } from './data'
import s from './section-11.module.css'

type PersonCardProps = {
  person: (typeof persons)[number]
}

function PersonCard({ person }: PersonCardProps) {
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '30%',
    threshold: 0.8,
  })

  const isInViewport = intersection?.isIntersecting

  return (
    <div ref={setIntersectionRef}>
      <Button
        className={cn(
          'dt:dr-w-322 dr-w-327 dt:h-fit dr-p-16 dr-rounded-20 border border-dark-teal/50 flex dr-gap-x-16 bg-black',
          s.personCard,
          isInViewport && s.personInViewport
        )}
        href={person?.url}
      >
        <div className="dr-w-40 dr-h-40 dr-rounded-full relative">
          <Image src={person?.image} alt={person?.name} fill />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center dr-gap-x-4 w-full dr-mb-8">
            <p className="dt:typo-p typo-p-bold text-teal">
              {person?.name ?? ''}
            </p>
            <p className="typo-label-m text-dark-teal/50">
              {person?.account ?? ''}
            </p>
          </div>
          <div className="dr-max-w-234 whitespace-normal">
            <p className="typo-p-s text-dark-teal">{person?.tweet}</p>
          </div>
        </div>
      </Button>
    </div>
  )
}

export function Section11() {
  const { isMobile, isDesktop } = useDeviceDetection()
  const [isOpenCard, setIsOpenCard] = useState<string | null>(null)
  const contentRefs = useRef<HTMLDivElement[]>([])

  return (
    <SolidBackground>
      <section
        className={cn('dt:dr-pt-141 dr-pt-120 dt:dr-pb-203 dr-pb-120 relative')}
      >
        <div className="dr-layout-grid-inner dt:dr-top-141 dt:dr-mb-256 dr-mb-78">
          <TitleBlock className="dt:col-start-4 dt:col-end-10 col-span-full dt:dr-mb-40 dr-mb-56 text-teal">
            <TitleBlock.LeadIn className="text-dark-teal">
              {'<'} SHowcase {'>'}
            </TitleBlock.LeadIn>
            <TitleBlock.Title level="h2" className="dr-mb-8!">
              Built with Tambo
            </TitleBlock.Title>
            <TitleBlock.Subtitle className="dt:dr-mb-40 text-dark-teal typo-p! dt:typo-p-l!">
              Generative UI unlocks new possibilities.
              <br />
              Here are some of the best apps from our developer community.
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
                      'relative border border-dark-teal/50 dr-p-12 dr-pb-56 dt:dr-pb-12 bg-black dr-rounded-20 dt:dr-w-361 w-full dt:dr-max-h-390 dr-max-h-389 block overflow-hidden',
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
                      <p className={cn('typo-h5 w-fit text-teal', s.title)}>
                        {card?.title}
                      </p>

                      <div
                        className={cn(
                          'dr-w-32 dr-h-32 bg-black border border-teal flex items-center justify-center dr-rounded-10 relative',
                          s.button
                        )}
                      >
                        <PlusSVG
                          className={cn(
                            'dr-w-16 dr-h-16 z-1 absolute ',
                            s.plus
                          )}
                        />
                        <ArrowSVG
                          className={cn(
                            'dr-w-16 dr-h-16 z-1 absolute ',
                            s.arrow
                          )}
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
                    <p className={cn('typo-h5 w-fit text-teal', s.title)}>
                      {card?.title}
                    </p>

                    <div
                      className={cn(
                        'dr-w-32 dr-h-32 bg-black border border-teal flex items-center justify-center dr-rounded-10 relative',
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

        {/* Marquee section */}
        <div className="text-center dr-mb-40 ">
          <h3 className="dt:typo-h3 typo-h4 dr-mb-8 text-teal">
            Word is spreading.
          </h3>
          <p className="dt:typo-p-l typo-p text-dark-teal">
            From developers shipping with Tambo.
          </p>
        </div>

        <Marquee
          repeat={2}
          speed={0.3}
          className={cn(s.marquee, 'dt:dr-mb-40 fade-mask')}
        >
          <div className="flex dt:dr-gap-x-24 dr-gap-x-16 dt:dr-mr-24 dr-mr-16">
            {persons?.map((person) => (
              <PersonCard key={person?.name} person={person} />
            ))}
          </div>
        </Marquee>
        <div className="dr-gap-x-16 flex dt:items-center flex-col dr-gap-y-8 dt:flex-row justify-center w-full dt:-dr-mt-40 px-safe dt:px-0">
          {buttons.map((button) => (
            <CTA
              key={button.text}
              icon={button?.icon as 'github' | 'discord'}
              href={button?.href}
              color="black"
            >
              {button?.text}
            </CTA>
          ))}
        </div>
      </section>
    </SolidBackground>
  )
}
