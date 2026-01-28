import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import HowItWorksSVG from '~/assets/svgs/how-it-works/how-it-works-diagram-desktop.svg'
import HowItWorksMobileSVG from '~/assets/svgs/how-it-works/how-it-works-diagram-mobile.svg'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'

export function HowItWorks() {
  return (
    <section className="bg-white dt:dr-pb-200 dt:dr-px-40 dr-px-8 ">
      <TitleBlock className="dr-mb-56">
        <TitleBlock.LeadIn>how It Works</TitleBlock.LeadIn>
        <TitleBlock.Title level="h2" className="dt:mb-0! dr-mb-8">
          The missing layer <br /> between React and LLMs
        </TitleBlock.Title>
        <CTA
          href="https://docs.tambo.co"
          className="w-fit mx-auto dt:dr-mt-40 dr-mt-32"
        >
          learn more
        </CTA>
      </TitleBlock>
      <div className="content-max-width dr-px-16 dr-py-56 dt:dr-py-0 dr-rounded-20 flex overflow-hidden items-center justify-center relative w-full h-full">
        <Image
          src={'/assets/how-it-works/how-it-works-bg-desktop.png'}
          alt="how it works background"
          fill
        />
        <HowItWorksSVG className="desktop-only dr-w-1180 dr-h-804 relative" />
        <HowItWorksMobileSVG className="mobile-only relative" />
      </div>
    </section>
  )
}
