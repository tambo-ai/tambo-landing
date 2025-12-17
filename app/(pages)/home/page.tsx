import { Wrapper } from '../_components/wrapper'
import Background from './_components/background'
import { Footer } from './_sections/footer'
import { HowItWorks } from './_sections/how-it-works'
import { Section1 } from './_sections/section-1'
import { Section2 } from './_sections/section-2'
import { Section4 } from './_sections/section-4'
import { Section5 } from './_sections/section-5'
import { Section6 } from './_sections/section-6'
import { Section8 } from './_sections/section-8'
import { Section10 } from './_sections/section-10'
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
        <Section4 />
        <Section5 />
        <Section6 />
        <Section8 />
        <Section10 />
        <HowItWorks />
        <Section11 />
        <Section12 />
        <Footer />
      </Background>
    </Wrapper>
  )
}
