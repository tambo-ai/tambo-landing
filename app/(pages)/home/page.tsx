import { Wrapper } from '../_components/wrapper'
import Background from './_components/background'
import { Footer } from './_sections/footer'
import { Hero } from './_sections/hero'
import { HowItWorks } from './_sections/how-it-works'
import { MeetTambo } from './_sections/meet-tambo'
import { Moment1 } from './_sections/moment-1'
import { Moment2 } from './_sections/moment-2'
import { Moment3 } from './_sections/moment-3'
// import { Section8 } from './_sections/section-8'
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
        <Hero />
        <MeetTambo />
        <Moment1 />
        <Moment2 />
        <Moment3 />
        {/* <Section8 /> */}
        <Section10 />
        <HowItWorks />
        <Section11 />
        <Section12 />
        <Footer />
      </Background>
    </Wrapper>
  )
}
