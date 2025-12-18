'use client'

import cn from 'clsx'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlusIcon from '~/assets/svgs/plus.svg'
import { Button, CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Marquee } from '~/components/marquee'
import { Video } from '~/components/video'
import { cards, persons } from './data'
import s from './section-2.module.css'

export function Section2() {
  return (
    <section className="dt:dr-pt-188 dt:dr-pb-204">
      <div className="dt:dr-layout-grid-inner ">
        <TitleBlock className="dt:dr-mb-56 dt:col-start-4 dt:col-end-10">
          <TitleBlock.LeadIn>
            {'<'} Meet tambo {'>'}
          </TitleBlock.LeadIn>
          <TitleBlock.Title level="h2">
            Tambo is the React SDK that lets users control your app through
            natural language.
          </TitleBlock.Title>
          <TitleBlock.Button href="https://docs.tambo.co/">
            Read Documentation
          </TitleBlock.Button>
        </TitleBlock>
        <div className="flex flex-col dt:flex-row gap-gap justify-center dt:dr-mb-156 dt:col-start-2 dt:col-end-12 ">
          {cards.map((card) => (
            <Card key={card.title} data={card} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="dt:dr-mb-40">
          <h3 className="typo-h3 ">Bring our vision.</h3>
          <p className="typo-p-l text-black/70">
            Trusted by industry leaders in AI, product, and engineering.
          </p>
        </div>

        <Marquee
          className={cn('w-full fade-mask', s.marquee)}
          repeat={3}
          speed={0.3}
        >
          <div className="flex dt:dr-gap-x-24 dr-mr-24">
            {persons.map((person) => (
              <div
                key={person?.name}
                className={cn(
                  'flex items-center dt:dr-gap-x-32 dt:dr-w-322 border w-fit dt:dr-py-8 dt:dr-pl-8 bg-white border-dark-grey dt:dr-rounded-20',
                  s.person
                )}
              >
                <div className="dt:dr-w-80 dt:dr-h-80 dr-rounded-12 relative overflow-hidden border border-dark-grey">
                  <Image src={person?.image} alt={person?.name} fill />
                </div>

                <div className="flex flex-col dt:dr-gap-y-4 text-left">
                  <p className="typo-p-bold">{person?.name}</p>
                  <span
                    className={cn(
                      'dt:dr-py-4 dt:dr-px-8 bg-off-white dt:dr-rounded-16 w-fit',
                      s.role
                    )}
                  >
                    <p className="typo-label-s">{person?.roles?.join(', ')}</p>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  )
}

type CardProps = {
  data: (typeof cards)[number]
}

function Card({ data }: CardProps) {
  return (
    <Button
      href={data.button.href}
      className={cn(
        'dt:dr-h-420 dr-h-158 shrink-0 dr-p-8 dr-rounded-20 bg-off-white/80 border border-dark-grey flex flex-col relative',
        s.card
      )}
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
          {data.title}
          {' >'}
        </p>
        <div className={cn('flex-1 grid place-items-center', s.cardVideo)}>
          <div className="aspect-square w-144">
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
              <source src={data?.video?.mp4} type='video/mp4; codecs="hvc1"' />
              <source src={data?.video?.webm} type="video/webm" />
            </Video>
          </div>
        </div>
      </div>
      <div
        className={cn(
          'absolute dt:dr-top-135 dt:dr-left-32 text-teal',
          s.cardContent
        )}
      >
        <p className="typo-p text-center dr-w-258">{data.text}</p>
      </div>
      <div
        className={cn(
          'dr-size-32 grid place-items-center dr-rounded-10 bg-mint z-10',
          s.plusButton
        )}
      >
        <PlusIcon className="dr-size-16 icon" />
      </div>
      <CTA type="secondary" wrapperClassName={s.cardCTA}>
        {data?.button?.text}
      </CTA>
    </Button>
  )
}
