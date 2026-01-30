import { getGitHubStars } from '~/libs/github'
import { Wrapper } from '../_components/wrapper'
import { Community } from './_sections/comunity'
import { Features } from './_sections/features-section'
import { Footer } from './_sections/footer'
import { Hero } from './_sections/hero'
import { HowItWorks } from './_sections/how-it-works'
import { Investors } from './_sections/investors'
import { MeetTambo } from './_sections/meet-tambo'
import { Pricing } from './_sections/pricing'
import { Showcase } from './_sections/showcase'
import { SocialProof } from './_sections/social-proof'
import { TamboSteps } from './_sections/tambo-steps'

export default async function Home() {
  const githubStars = await getGitHubStars()

  return (
    <Wrapper
      theme="light"
      lenis={{}}
      className="mx-auto bg-primary max-w-screen overflow-x-clip"
      githubStars={githubStars}
    >
      <Hero />
      <TamboSteps />
      <MeetTambo />
      <SocialProof />
      <HowItWorks />
      <Features />
      <Pricing />
      <Investors />
      <Showcase />
      <Community />
      <Footer />
    </Wrapper>
  )
}
