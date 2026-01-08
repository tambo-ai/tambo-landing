import { Wrapper } from '../_components/wrapper'
import Background from './_components/background'
import { Footer } from './_sections/footer'
import { Hero } from './_sections/hero'
import { HowItWorks } from './_sections/how-it-works'
import { MeetTambo } from './_sections/meet-tambo'
import { Moments } from './_sections/moments'
import { Section8 } from './_sections/section-8'
import { Section10 } from './_sections/section-10'
import { Section11 } from './_sections/section-11'
import { Section12 } from './_sections/section-12'

export default function Home() {
  return (
    <Wrapper
      theme="light"
      lenis={{}}
      className="mx-auto bg-primary max-w-screen dt:max-w-[calc(var(--max-width)*1px)] overflow-x-clip"
    >
      <Background>
        <Hero />
        <MeetTambo />
        <Moments />
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
