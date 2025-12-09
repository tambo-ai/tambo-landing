import { CTA } from '~/components/button'
import { Wrapper } from '../_components/wrapper'

export default function StyleGuide() {
  return (
    <Wrapper theme="light" lenis={{}} className="h-[200vh]">
      <div className="dr-pt-120 px-safe flex flex-col dr-gap-15">
        <h1 className="typo-h1">Heading 1</h1>
        <h2 className="typo-h2">Heading 2</h2>
        <h3 className="typo-h3">Heading 3</h3>
        <h4 className="typo-h4">Heading 4</h4>
        <p className="typo-p">Paragraph</p>
        <p className="typo-p-s">Paragraph Small</p>
        <p className="typo-p-l">Paragraph Large</p>
        <p className="typo-code-snippet">Code Snippet</p>
        <p className="typo-label-m">Label Medium</p>
        <p className="typo-label-s">Label Small</p>
        <p className="typo-button">Button</p>
        <p className="typo-link">Link</p>
        <p className="typo-surtitle">Surtitle</p>
        {/* COLORS */}
        <div className="dr-grid dr-grid-cols-4 dr-gap-4 dr-mb-50">
          <div className="dr-h-50 w-full bg-ghost-mint">
            <p className="typo-p">Ghost Mint</p>
          </div>
          <div className="dr-h-50 w-full bg-mint">
            <p className="typo-p">Mint</p>
          </div>
          <div className="dr-h-50 w-full bg-teal">
            <p className="typo-p">Teal</p>
          </div>
          <div className="dr-h-50 w-full bg-dark-teal">
            <p className="typo-p">Dark Teal</p>
          </div>
          <div className="dr-h-50 w-full bg-off-white">
            <p className="typo-p">Off White</p>
          </div>
          <div className="dr-h-50 w-full bg-light-gray">
            <p className="typo-p">Light Gray</p>
          </div>
          <div className="dr-h-50 w-full bg-grey">
            <p className="typo-p">Grey</p>
          </div>
          <div className="dr-h-50 w-full bg-dark-grey">
            <p className="typo-p">Dark Grey</p>
          </div>
          <div className="dr-h-50 w-full bg-white">
            <p className="typo-p">White</p>
          </div>
          <div className="dr-h-50 w-full bg-white-80">
            <p className="typo-p">White 80</p>
          </div>
          <div className="dr-h-50 w-full bg-white-60">
            <p className="typo-p">White 60</p>
          </div>
          <div className="dr-h-50 w-full bg-white-50">
            <p className="typo-p">White 50</p>
          </div>
          <div className="dr-h-50 w-full bg-black">
            <p className="typo-p text-white">Black</p>
          </div>
          <div className="dr-h-50 w-full bg-black-70">
            <p className="typo-p">Black 70</p>
          </div>
          <div className="dr-h-50 w-full bg-black-50">
            <p className="typo-p">Black 50</p>
          </div>
          <div className="dr-h-50 w-full bg-forest">
            <p className="typo-p">Forest</p>
          </div>
          <div className="dr-h-50 w-full bg-forest-50">
            <p className="typo-p">Forest 50</p>
          </div>
          <div className="dr-h-50 w-full bg-forest-30">
            <p className="typo-p">Forest 30</p>
          </div>
          <div className="dr-h-50 w-full bg-forest-20">
            <p className="typo-p">Forest 20</p>
          </div>
          <div className="dr-h-50 w-full bg-forest-10">
            <p className="typo-p">Forest 10</p>
          </div>
        </div>
      </div>
      <div className="px-safe flex items-center w-full justify-center dr-gap-20">
        <CTA>White CTA</CTA>
        <CTA color="black">Black CTA</CTA>
        <CTA type="secondary">Secondary CTA</CTA>
        <CTA snippet>
          Snippet CTA
          <span className="typo-code-snippet">
            <span className="text-pink">{'<TamboProvider'} </span>
            <span className="text-teal">
              {'components='}
              <span className="text-pink">{'{components}'}</span>
            </span>
            <br />
            <span className="text-white dt:dr-ml-16">{'<YourApp />'}</span>
            <br />
            <span className="text-pink">{'</TamboProvider>'}</span>
          </span>
        </CTA>
      </div>
    </Wrapper>
  )
}
