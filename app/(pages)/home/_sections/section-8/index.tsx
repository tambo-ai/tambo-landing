import cn from 'clsx'
import { Fragment } from 'react'
import PlaneSVG from '~/assets/svgs/plane.svg'
import SpreadsheetSVG from '~/assets/svgs/spreadsheet.svg'
import StocksSVG from '~/assets/svgs/stocks.svg'
import { TamboIntegration } from '~/integrations/tambo'
import s from './section-8.module.css'

export function Section8() {
  return (
    <section className="flex flex-col dr-gap-20 items-center justify-center h-screen">
      {/* TODO: Dashed border style*/}
      <div className="dr-w-col-8 outline-off-white/80 outline-6 dr-rounded-20 aspect-898/597">
        <div className="relative z-1 size-full dr-rounded-20 border border-forest/50 shadow-m bg-white dr-p-16">
          <TamboIntegration />
        </div>
      </div>
      <div className="relative z-1 dr-rounded-20 border border-dark-grey outline-6 outline-off-white/80 dr-w-col-8 dr-p-8 bg-white">
        <div
          className={cn(
            s.tabs,
            'h-full relative grid grid-flow-col dr-rounded-12 typo-h4 uppercase bg-off-white'
          )}
        >
          {demos.map((demo) => (
            <Fragment key={demo.id}>
              <input
                type="radio"
                id={demo.id}
                name="demo"
                value={demo.id}
                defaultChecked={demo.id === 'demo-1'}
              />
              <label
                htmlFor={demo.id}
                className="flex dr-gap-16 items-center justify-center dr-h-60"
              >
                <div className="dr-size-32 grid place-items-center rounded-full">
                  <demo.icon className="dr-size-16 icon text-black" />
                </div>
                <span className="block">{demo.label}</span>
              </label>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

const demos = [
  {
    id: 'demo-1',
    label: 'travel assistant',
    icon: PlaneSVG,
  },
  {
    id: 'demo-2',
    label: 'stocks dashboard',
    icon: StocksSVG,
  },
  {
    id: 'demo-3',
    label: 'AI spreadsheet',
    icon: SpreadsheetSVG,
  },
]
