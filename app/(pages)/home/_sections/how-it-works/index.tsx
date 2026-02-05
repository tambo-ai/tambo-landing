import cn from 'clsx'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { CTA } from '~/components/button'
import { Image } from '~/components/image'
import { siteConfig } from '~/libs/config'
import { howItWorksContent } from './data'

export function HowItWorks() {
  return (
    <section
      className={cn(
        'dt:dr-p-40 dr-px-8 dt:dr-px-40 dt:dr-py-0 bg-white z-1 relative'
      )}
    >
      <div className="z-1 overflow-hidden dr-rounded-20 dt:dr-py-80 dr-py-56 dr-px-16 dt:dr-px-0 flex flex-col relative content-max-width">
        <TitleBlock className="dr-mb-56">
          <TitleBlock.LeadIn>{howItWorksContent.leadIn}</TitleBlock.LeadIn>
          <TitleBlock.Title level="h2" className="dt:dr-mb-40! dr-mb-32">
            {howItWorksContent.title.line1} <br />{' '}
            {howItWorksContent.title.line2}
          </TitleBlock.Title>
          <CTA href={siteConfig.links.docs} className="w-fit mx-auto">
            {howItWorksContent.cta.text}
          </CTA>
        </TitleBlock>
        <div className="content-max-width">
          <div className="desktop-only relative dr-w-946 aspect-946/431">
            <Image
              block
              src="/images/how-it-works/how-it-works-diagram-desktop.svg"
              alt="how it works diagram desktop"
              className="min-w-full min-h-full"
            />
          </div>
          <div className="mobile-only relative aspect-327/466">
            <Image
              block
              src="/images/how-it-works/how-it-works-diagram-mobile.svg"
              alt="how it works diagram mobile"
              className="min-w-full min-h-full"
            />
          </div>
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
