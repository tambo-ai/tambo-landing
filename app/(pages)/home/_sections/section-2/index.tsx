'use client'

import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useState } from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlusIcon from '~/assets/svgs/plus.svg'
import { Button, CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Marquee } from '~/components/marquee'
import { Video } from '~/components/video'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { cards, persons } from './data'
import s from './section-2.module.css'

export function Section2() {
  const [openCardTitle, setOpenCardTitle] = useState<string | null>(null)

  return (
    <section className="dt:dr-pt-188 dr-pt-128 dt:dr-pb-204 dr-pb-200">
      <div className="dt:dr-layout-grid-inner px-safe dt:px-0">
        <TitleBlock className="dr-mb-56  dt:col-start-4 dt:col-end-10">
          <TitleBlock.LeadIn className="dr-mb-16 dt:dr-mb-24">
            {'<'} Meet tambo {'>'}
          </TitleBlock.LeadIn>
          <TitleBlock.Title level="h2" className="dr-mb-0! dt:dr-mb-40!">
            Tambo is the React SDK that lets users control your app through
            natural language.
          </TitleBlock.Title>
          <TitleBlock.Button
            href="https://docs.tambo.co/"
            className="desktop-only"
          >
            Read Documentation
          </TitleBlock.Button>
        </TitleBlock>
        <div className="flex flex-col dt:flex-row gap-gap justify-center dt:dr-mb-156 dt:col-start-2 dt:col-end-12">
          {cards.map((card) => (
            <Card
              key={card?.title}
              data={card}
              isOpen={openCardTitle === card?.title}
              onToggle={() => {
                setOpenCardTitle(
                  openCardTitle === card?.title ? null : card?.title
                )
              }}
            />
          ))}
        </div>
        <CTA
          href="https://docs.tambo.co/"
          className="mobile-only place-self-center dr-mt-56 dr-mb-80"
        >
          Read Documentation
        </CTA>
      </div>

      <div className="text-center">
        <div className="dr-mb-40">
          <h3 className="dt:typo-h3 typo-h4 dt:dr-mb-8">Bring our vision.</h3>
          <p className="typo-p-l  text-black/70">
            Trusted by industry leaders in AI, product, and engineering.
          </p>
        </div>

        <Marquee
          className={cn('w-full fade-mask', s.marquee)}
          repeat={3}
          speed={0.3}
        >
          <div className="flex dt:dr-gap-x-24 dr-gap-x-12 dt:dr-mr-24 dr-mr-12">
            {persons.map((person) => (
              <PersonCard key={person?.name} person={person} />
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  )
}

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
    <div
      ref={setIntersectionRef}
      className={cn(
        'flex items-center dr-gap-x-32 dr-w-322 border dr-p-8 dt:dr-py-8 dt:dr-pl-8 bg-white border-dark-grey dr-rounded-20',
        s.person,
        isInViewport && s.personInViewport
      )}
    >
      <div className="dr-w-80 dr-h-80 dr-rounded-12 relative overflow-hidden border border-dark-grey">
        <Image src={person?.image} alt={person?.name} fill />
      </div>

      <div className="flex flex-col dr-gap-y-4 text-left">
        <p className="typo-p-bold">{person?.name}</p>
        <span
          className={cn(
            'dr-py-4 dr-px-8 bg-off-white dr-rounded-16 w-fit',
            s.role
          )}
        >
          <p className="typo-label-s">{person?.roles?.join(', ')}</p>
        </span>
      </div>
    </div>
  )
}

type CardProps = {
  data: (typeof cards)[number]
  isOpen: boolean
  onToggle: () => void
}

function Card({ data, isOpen, onToggle }: CardProps) {
  const { isDesktop, isMobile } = useDeviceDetection()

  return (
    <div className={cn('relative', s.cardWrapper)}>
      <Button
        href={isDesktop ? data?.button?.href : undefined}
        className={cn(
          'dt:dr-h-420 dr-h-155 shrink-0 dr-p-8 dr-rounded-20 bg-off-white/80 border border-dark-grey flex flex-col relative',
          isOpen && s.cardOpen,
          s.card
        )}
        onClick={() => {
          if (isMobile) {
            onToggle()
          }
        }}
      >
        <HashPattern
          className={cn(
            'absolute inset-0 text-dark-teal/20 opacity-0',
            s.hashPattern
          )}
        />
        <div
          className={cn(
            'w-full h-full bg-white border border-dark-grey dr-rounded-12 dr-p-16 dr-py-12 dt:dr-py-24 flex flex-col items-center  relative z-10 ',
            s.cardHeader
          )}
        >
          <p className={cn('typo-h5', s.cardTitle)}>
            {'< '}
            {data?.title}
            {' >'}
          </p>
          <div
            className={cn(
              'dt:flex-1 dt:grid dt:place-items-center',
              s.cardVideo
            )}
          >
            <div className="aspect-square dt:dr-w-144 dr-w-80">
              <Video
                autoPlay
                priority
                fallback={
                  <Image
                    src="/videos/Octo-Juggle.png"
                    alt="Octo Juggle"
                    unoptimized
                    preload
                  />
                }
              >
                <source
                  src={data?.video?.mp4}
                  type='video/mp4; codecs="hvc1"'
                />
                <source src={data?.video?.webm} type="video/webm" />
              </Video>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'absolute dt:dr-top-135 dr-top-80 dr-left-32 text-teal',
            s.cardContent
          )}
        >
          <p className="typo-p text-center dr-w-258">{data?.text}</p>
        </div>
        <div
          className={cn(
            'dr-size-32 grid place-items-center dr-rounded-10 bg-mint z-10',
            s.plusButton
          )}
        >
          <PlusIcon className="dr-size-16 icon" />
        </div>
      </Button>
      <CTA
        type="secondary"
        wrapperClassName={s.cardCTA}
        href={data?.button?.href}
      >
        {data?.button?.text}
      </CTA>
    </div>
  )
}
