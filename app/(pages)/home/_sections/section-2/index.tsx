'use client'

import cn from 'clsx'
// import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { useRect } from 'hamo'
import { useContext, useEffect } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlusIcon from '~/assets/svgs/plus.svg'
import { CTA } from '~/components/button'
import { cards } from './data'
import s from './section-2.module.css'

export function Section2() {
  const { getItems } = useContext(BackgroundContext)

  useEffect(() => {
    const items = getItems()
    console.log(items)
  }, [getItems])

  const [setRectRef, rect] = useRect()

  //   useScrollTrigger({
  //     rect,
  //     start: 'top bottom',
  //     end: 'bottom bottom',
  //     onProgress: ({ progress }) => {
  //       console.log('section2', progress)
  //     },
  //   })

  return (
    <section
      ref={setRectRef}
      className="dr-layout-block-inner dt:dr-layout-grid-inner dt:h-screen"
    >
      <TitleBlock className="dr-mb-56 dt:mb-0 col-start-4 col-end-10">
        <TitleBlock.LeadIn>
          {'<'} Meet tambo {'>'}
        </TitleBlock.LeadIn>
        <TitleBlock.Title level="h2">
          Tambo is the React SDK that lets users control your app through
          natural language.
        </TitleBlock.Title>
        <TitleBlock.Button>Read Documentation</TitleBlock.Button>
      </TitleBlock>
      <ul className="col-start-1 col-end-4 dt:col-start-2 dt:col-end-12 flex flex-col dt:flex-row gap-gap justify-center">
        {cards.map((card) => (
          <Card key={card.title} data={card} />
        ))}
      </ul>
    </section>
  )
}

type CardProps = {
  data: (typeof cards)[number]
}

function Card({ data }: CardProps) {
  return (
    <li
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
        <p className="typo-h4">
          {'< '}
          {data.title}
          {' >'}
        </p>
        <div className="flex-1 grid place-items-center">
          {/* TODO: Video here */}
        </div>
        <div className="max-dt:absolute dr-top-4 dr-right-4 dr-size-32 max-dt:group-hover:text-teal max-dt:group-hover:bg-black grid place-items-center dr-rounded-10 bg-mint dt:group-hover:opacity-0 dt:group-hover:translate-y-full transition-all duration-200">
          <PlusIcon className="dr-size-16 icon max-dt:group-hover:rotate-45 transition-all duration-200" />
        </div>
      </div>
      <div className="flex-1 grid place-items-center relative">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-between dr-py-16">
          <div className="dr-h-28" />
          <p className="typo-p text-center dr-w-258 mx-auto">{data.text}</p>
          <CTA type="secondary" color="black" href={data.button.href}>
            {data.button.text}
          </CTA>
        </div>
      </div>
    </li>
  )
}
