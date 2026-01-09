import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import HowItWorksSVG from '~/assets/svgs/how-it-works-desktop.svg'
import HowItWorksMobileSVG from '~/assets/svgs/how-it-works-mobile.svg'

export function HowItWorks() {
  return (
    <section>
      <TitleBlock className="dr-mb-56">
        <TitleBlock.LeadIn>
          {'<'} How It Works {'>'}
        </TitleBlock.LeadIn>
        <TitleBlock.Title level="h2" className="dt:mb-0! dr-mb-8">
          More than a SDK.
          <br /> A complete platform.
        </TitleBlock.Title>
        <TitleBlock.Subtitle className="typo-p! dt:typo-p-l!">
          SDK + UI components, backed by hosted API and dashboard.
          <br className="desktop-only" />
          Everything you need to add AI to your
          <br className="mobile-only" /> app.
        </TitleBlock.Subtitle>
      </TitleBlock>
      <div className="dt:dr-px-40 dr-px-8">
        <div className="dt:dr-py-94 dt:dr-px-145 dr-py-40 dr-px-16 bg-grey dr-rounded-20 flex items-center justify-center">
          <HowItWorksSVG className="desktop-only dr-w-full dr-h-full skew-x-[-10deg] rotate-[5deg]" />
          <HowItWorksMobileSVG className="mobile-only dr-w-full dr-h-662" />
        </div>
      </div>
    </section>
  )
}
