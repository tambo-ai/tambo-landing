import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import CheckSVG from '~/assets/svgs/check.svg'
import { CTA } from '~/components/button'
import { banner, pricingCards } from './data'

export function Section12() {
  return (
    <section className="dr-layout-grid-inner  dt:dr-pt-122 dt:dr-pb-137">
      <TitleBlock className="col-start-4 col-end-10 dt:dr-mb-56">
        <TitleBlock.LeadIn>
          {'<'} PRICING {'>'}
        </TitleBlock.LeadIn>
        <TitleBlock.Title level="h2" className="dt:dr-mb-8!">
          Simple pricing
          <br />
          from hobbyists to enterprise
        </TitleBlock.Title>
      </TitleBlock>
      <div className="col-start-2 col-end-12">
        <div className="grid grid-cols-3 dr-gap-24 dt:dr-mb-32">
          {pricingCards.map((card, i) => (
            <div
              key={`${card?.plan}-${i}`}
              className="dt:dr-p-8 border border-dark-grey dr-rounded-20 bg-white dt:dr-h-497 flex flex-col justify-between"
            >
              <div>
                <div className="dr-p-16 dr-rounded-12 bg-off-white border border-dark-grey dt:dr-mb-32">
                  <p className="typo-label-m dt:dr-mb-16">
                    {'< '}
                    {card?.plan}
                    {' >'}
                  </p>
                  <h2 className="typo-h3 dt:dr-mb-8">{card?.title}</h2>
                  <p className="typo-p">{card?.description}</p>
                </div>
                <ul className="flex flex-col dr-gap-12">
                  {card?.features.map((feature) => (
                    <li key={feature} className="flex items-center dr-gap-4">
                      <CheckSVG className="dr-size-16 text-teal" />
                      <p className="typo-label-s">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <CTA className="w-full justify-between" href={card?.button?.href}>
                {card?.button?.text}
              </CTA>
            </div>
          ))}
        </div>
        {/* BANNER */}
        <div className="w-full dt:dr-p-8 border border-dark-grey dr-rounded-20">
          <div className="border bg-black w-full dr-rounded-12 dr-p-24 relative overflow-hidden flex  justify-between">
            <div className="absolute inset-0 dark-teal-pattern z-0" />
            <div className="relative text-teal">
              <h3 className="typo-h3 dt:dr-mb-8">{banner?.title}</h3>
              <p className="typo-p">{banner?.description}</p>
            </div>
            <ul className="flex dr-gap-40 relative">
              {banner?.features.map((feature) => (
                <li key={feature} className="flex items-center dr-gap-4">
                  <CheckSVG className="dr-size-16 text-teal" />
                  <p className="typo-label-s text-teal">{feature}</p>
                </li>
              ))}
            </ul>
            <CTA color="black" icon="github" href={banner?.button?.href}>
              {banner?.button?.text}
            </CTA>
          </div>
        </div>
      </div>
    </section>
  )
}
