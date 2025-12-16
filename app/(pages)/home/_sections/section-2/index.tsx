'use client'

import cn from 'clsx'
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
          <TitleBlock.Button>Read Documentation</TitleBlock.Button>
        </TitleBlock>
        <div className="flex flex-col dt:flex-row gap-gap justify-center dt:dr-mb-156 dt:col-start-2 dt:col-end-12">
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
        'dt:dr-h-420 dr-h-158 max-dt:hover:dr-h-327 shrink-0  dt:aspect-264/420 dr-p-8 dr-rounded-20 overflow-hidden bg-off-white/80 border border-dark-grey flex flex-col group transition-all duration-200 hover:aspect-square dt:hover:aspect-3/4 hover:border-mint hover:bg-black hover:text-mint relative',
        s.card
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark-teal-pattern" />
      <div
        className={cn(
          'w-full h-full bg-white border border-dark-grey dr-rounded-12 dr-p-16 dr-py-12 dt:dr-py-24 flex flex-col items-center overflow-hidden transition-all duration-250 ease-gleasing group-hover:dr-h-42 dt:group-hover:dr-h-50 dt:group-hover:dr-py-16 group-hover:border-teal group-hover:bg-teal group-hover:text-black relative z-10',
          s.cardHeader
        )}
      >
        <p className="typo-h5">
          {'< '}
          {data.title}
          {' >'}
        </p>
        <div className="flex-1 grid place-items-center">
          {/* TODO: Video here */}
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
              <source
                src="/videos/Octo-Juggle-compressed.mov"
                type='video/mp4; codecs="hvc1"'
              />
              <source
                src="/videos/Octo-Juggle-compressed.webm"
                type="video/webm"
              />
            </Video>
          </div>
        </div>
        <div className="max-dt:absolute dr-top-4 dr-right-4 dr-size-32 max-dt:group-hover:text-teal max-dt:group-hover:bg-black grid place-items-center dr-rounded-10 bg-mint dt:group-hover:opacity-0 dt:group-hover:translate-y-full transition-all duration-200">
          <PlusIcon className="dr-size-16 icon max-dt:group-hover:rotate-45 transition-all duration-200" />
        </div>
      </div>
      <div className="flex-1 grid place-items-center relative">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-between dr-py-16">
          <div className="dr-h-28" />
          <p className="typo-p text-center dr-w-258 mx-auto">{data.text}</p>
          <CTA type="secondary">{data.button.text}</CTA>
        </div>
      </div>
    </Button>
  )
}
