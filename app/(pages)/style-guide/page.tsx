import { Wrapper } from '../_components/wrapper'

export default function StyleGuide() {
  return (
    <Wrapper theme="light" lenis={{}}>
      <div className="dr-pt-120 px-safe flex flex-col dr-gap-15 h-screen">
        <h1 className="h1">Heading 1</h1>
        <h2 className="h2">Heading 2</h2>
        <h3 className="h3">Heading 3</h3>
        <h4 className="h4">Heading 4</h4>
        <p className="p">Paragraph</p>
        <p className="p-s">Paragraph Small</p>
        <p className="p-l">Paragraph Large</p>
        <p className="code-snippet">Code Snippet</p>
        <p className="label-m">Label Medium</p>
        <p className="label-s">Label Small</p>
        <p className="button">Button</p>
        <p className="link">Link</p>
        <p className="surtitle">Surtitle</p>
      </div>
    </Wrapper>
  )
}
