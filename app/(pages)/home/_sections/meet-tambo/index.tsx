import cn from 'clsx'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Video } from '~/components/video'
import { cards } from './data'
import s from './meet-tambo.module.css'

export function MeetTambo() {
  return (
    <section className="content-max-width dt:dr-pt-106 dr-pt-120 dt:dr-pb-220 dr-pb-120">
      <div className="dr-layout-grid">
        <div className="dt:col-start-1 dt:col-end-5 col-span-full dr-mb-56 dt:dr-mb-0">
          <TitleBlock className="dt:items-start dt:dr-mb-40 dr-mb-32">
            <TitleBlock.LeadIn className="dr-mb-16 dt:dr-mb-24">
              Why Tambo
            </TitleBlock.LeadIn>
            <TitleBlock.Title
              level="h2"
              className="dt:dr-mb-16 dr-mb-8 dt:text-left"
            >
              From zero to agent
              <br />
              in a weekend
            </TitleBlock.Title>
            <TitleBlock.Subtitle className="dt:text-left dr-w-180 dt:dr-w-350">
              Everything you need to add AI <br className="desktop-only" /> to
              your React app.
            </TitleBlock.Subtitle>
          </TitleBlock>
          <CTA href="https://docs.tambo.co" className="w-fit mx-auto dt:mx-0">
            learn more
          </CTA>
        </div>

        <div className="grid dt:grid-cols-2 grid-cols-1 dt:dr-gap-x-24 dt:dr-gap-y-56 dr-gap-y-40 dt:dr-pt-56 dt:col-start-6 dt:col-end-12 col-span-full dr-px-40 dt:px-0">
          {cards.map((card) => (
            <Card key={card?.title} data={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

type CardProps = {
  data: (typeof cards)[number]
}

function Card({ data }: CardProps) {
  return (
    <div
      className={cn(
        'flex dt:flex-row flex-col items-center dt:items-start dr-gap-12 dt:dr-h-91',
        s.cardWrapper
      )}
    >
      <div className="dr-size-64 dr-p-4 dr-rounded-20 border border-dark-grey bg-off-white overflow-hidden shrink-0 grid place-items-center">
        <div className="dr-size-50">
          <Video
            autoPlay
            priority
            fallback={<Image src={data?.video?.png} alt={data?.title} />}
          >
            <source src={data?.video?.mp4} type='video/mp4; codecs="hvc1"' />
            <source src={data?.video?.webm} type="video/webm" />
          </Video>
        </div>
      </div>
      <div className="flex flex-col dr-gap-8">
        <h4 className="typo-h4 dt:typo-h3 dt:w-fit text-nowrap text-center dt:text-left">
          {data?.title}
        </h4>
        <p className="typo-p text-black/50 text-center dt:text-left">
          {data?.text}
        </p>
      </div>
    </div>
  )
}
