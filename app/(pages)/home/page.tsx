import { Wrapper } from '../_components/wrapper'
import Background from './_components/background'
import { Section1 } from './_sections/section-1'
import { Section2 } from './_sections/section-2'
import { Section3 } from './_sections/section-3'
import { Section8 } from './_sections/section-8'
import { Section11 } from './_sections/section-11'
import { Section12 } from './_sections/section-12'

export default function Home() {
  return (
    <Wrapper
      theme="light"
      lenis={{}}
      className="mx-auto bg-primary"
      style={{
        maxWidth: `calc(var(--max-width) * 1px)`,
      }}
    >
      <Background>
        <Section1 />
        <Section2 />
        <Section3 />
        <Section8 />
        <Section11 />
        <Section12 />
        <div className="h-[300vh]" />
      </Background>
    </Wrapper>
  )
}
