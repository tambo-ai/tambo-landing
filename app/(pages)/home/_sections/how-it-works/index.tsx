'use client'

import cn from 'clsx'
// import { useLenisSnap } from '~/app/(pages)/_components/lenis/snap'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import HowItWorksSVG from '~/assets/svgs/how-it-works/how-it-works-diagram-desktop.svg'
import HowItWorksMobileSVG from '~/assets/svgs/how-it-works/how-it-works-diagram-mobile.svg'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'

export function HowItWorks() {
  // const setSnapRef = useLenisSnap('center')

  return (
    <section
      className={cn(
        'dt:dr-p-40 dt:dr-pb-40 dr-px-8 dt:dr-px-40 bg-white z-1 relative'
      )}
    >
      <div className="z-1 overflow-hidden dr-rounded-20 dt:dr-py-80 dr-py-56 dr-px-16 dt:dr-px-0 flex flex-col relative content-max-width">
        <TitleBlock className="dr-mb-56">
          <TitleBlock.LeadIn>how It Works</TitleBlock.LeadIn>
          <TitleBlock.Title level="h2" className="dt:dr-mb-40! dr-mb-32">
            The missing layer <br /> between React and LLMs
          </TitleBlock.Title>
          <CTA href="https://docs.tambo.co" className="w-fit mx-auto">
            learn more
          </CTA>
        </TitleBlock>
        <div className="content-max-width">
          <HowItWorksSVG className="desktop-only dr-w-946 dr-h-430 relative" />
          <HowItWorksMobileSVG className="mobile-only relative" />
        </div>
        <Image
          src={'/assets/how-it-works/how-it-works-bg-desktop.png'}
          alt="how it works background"
          fill
          className="absolute inset-0 -z-1 desktop-only"
        />
        <Image
          src={'/assets/how-it-works/how-it-works-bg-mobile.png'}
          alt="how it works background"
          fill
          className="absolute inset-0 -z-1 mobile-only"
        />
      </div>
    </section>
  )
}
