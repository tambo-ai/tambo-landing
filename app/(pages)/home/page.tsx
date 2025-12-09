import { Wrapper } from '../_components/wrapper'
import Background from './_components/background'
import { Section1 } from './_sections/section-1'
import { Section2 } from './_sections/section-2'

export default function Home() {
  return (
    <Wrapper
      theme="light"
      lenis={{}}
      className="mx-auto"
      style={{
        maxWidth: `calc(var(--max-width) * 1px)`,
      }}
    >
      <Background>
        <Section1 />
        <Section2 />
        <div className="h-[300vh]" />
      </Background>
    </Wrapper>
  )
}
