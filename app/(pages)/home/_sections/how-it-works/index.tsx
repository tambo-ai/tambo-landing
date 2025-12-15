import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import HowItWorksSVG from '~/assets/svgs/how-it-works.svg'

export function HowItWorks() {
  return (
    <section>
      <TitleBlock className="dr-mb-56">
        <TitleBlock.LeadIn>
          {'<'} How It Works {'>'}
        </TitleBlock.LeadIn>
        <TitleBlock.Title level="h2">
          More than a SDK.
          <br /> A complete platform.
        </TitleBlock.Title>
        <TitleBlock.Subtitle>
          SDK + UI components, backed by hosted API and dashboard.
          <br />
          Everything you need to add AI to your app.
        </TitleBlock.Subtitle>
      </TitleBlock>
      <div className="dr-px-40 dr-pb-40">
        <div className="aspect-[1360/790] bg-grey dr-rounded-20">
          <HowItWorksSVG className="dr-w-full dr-h-full" />
        </div>
      </div>
    </section>
  )
}
