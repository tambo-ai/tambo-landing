import cn from 'clsx'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { investors } from './data'
import PartnershipSVG from './icons/partnership.svg'
import s from './investors.module.css'

export function Investors() {
  return (
    <section className="dt:dr-px-271 dt:dr-pb-200 dr-pb-120 px-safe">
      <h2 className="typo-h2 text-center dt:dr-mb-56 dr-mb-40">
        Backed by top investors and builders
      </h2>
      <div
        className={cn(
          s.mainInvestor,
          'border border-dark-grey dr-rounded-20 w-full dr-p-8 bg-white dt:dr-mb-24 dr-mb-16'
        )}
      >
        <div
          className={cn(
            s.mainContent,
            'relative overflow-hidden border border-dark-grey dr-rounded-12 flex items-center justify-center bg-white'
          )}
        >
          <HashPattern className="absolute inset-0 text-dark-grey z-0" />
          <PartnershipSVG className="dr-w-353 relative z-1" />
        </div>
      </div>
      <div className="dt:grid dt:grid-cols-3 dt:dr-gap-24 flex flex-col dr-gap-16">
        {investors.map((investor) => (
          <div key={investor?.name} className={cn(s.wrapper, 'relative z-0')}>
            <div className={s.rim} />
            <div
              className={cn(
                s.investor,
                'flex dr-gap-32 border border-dark-grey dr-rounded-20 dr-p-8 bg-white items-center'
              )}
            >
              <div className="dr-size-80 dr-rounded-12 border border-dark-grey grid place-items-center relative overflow-hidden">
                <HashPattern className="absolute inset-0 text-dark-grey z-0" />
                {investor?.icon}
              </div>

              <div className="flex flex-col dr-gap-4">
                <p className="typo-p-bold">{investor.name}</p>
                <span
                  className={cn(
                    'typo-label-s dr-px-8 dr-py-4 dr-rounded-16 bg-off-white w-fit',
                    s.position
                  )}
                >
                  {investor?.position}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
