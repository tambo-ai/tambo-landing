'use client'

// import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { useRect } from 'hamo'
import { useContext, useEffect } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlusIcon from '~/assets/svgs/plus.svg'
import { cards } from './data'

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
    <section ref={setRectRef} className="dr-layout-grid-inner h-screen">
      <TitleBlock className="col-start-4 col-end-10">
        <TitleBlock.LeadIn>
          {'<'} Meet tambo {'>'}
        </TitleBlock.LeadIn>
        <TitleBlock.Title level="h2">
          Tambo is the React SDK that lets users control your app through
          natural language.
        </TitleBlock.Title>
        <TitleBlock.Button>Read Documentation</TitleBlock.Button>
      </TitleBlock>
      <ul className="col-start-2 col-end-12 flex gap-gap">
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
    <li className="dr-h-420 flex-1 dr-p-8 dr-rounded-20 overflow-hidden bg-off-white border border-dark-grey flex flex-col group transition-all duration-200 hover:flex-[1.35] hover:border-mint hover:bg-black hover:text-mint relative">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark-teal-pattern" />
      <div className="w-full dr-h-206 bg-white border border-dark-grey dr-rounded-12 dr-p-16 flex flex-col items-center overflow-hidden transition-all duration-300 group-hover:dr-h-50 group-hover:bg-black group-hover:border-mint relative z-10">
        <p className="typo-h4">{data.title}</p>
      </div>
      <div className="flex-1 grid place-items-center relative">
        <div className="dr-size-32 grid place-items-center dr-rounded-10 border border-dark-grey bg-mint group-hover:opacity-0">
          <PlusIcon className="dr-size-16" />
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center">
          <p className="typo-p text-center dr-w-258 mx-auto">{data.text}</p>
          {/* TODO: Button here */}
        </div>
      </div>
    </li>
  )
}
