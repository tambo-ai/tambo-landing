import dynamic from 'next/dynamic'
import { getDiscordMembers } from '~/libs/discord'
import { getGitHubStars } from '~/libs/github'
import { Wrapper } from '../_components/wrapper'
// Above-fold: static imports
import { Hero } from './_sections/hero'
// Server Components (no client JS)
import { HowItWorks } from './_sections/how-it-works'
import { MeetTambo } from './_sections/meet-tambo'
import { TamboSteps } from './_sections/tambo-steps'

// Below-fold: dynamic imports to reduce initial JS and TBT

const SocialProof = dynamic(() =>
  import('./_sections/social-proof').then((mod) => mod.SocialProof)
)
const Features = dynamic(() =>
  import('./_sections/features-section').then((mod) => mod.Features)
)
const Pricing = dynamic(() =>
  import('./_sections/pricing').then((mod) => mod.Pricing)
)
const Investors = dynamic(() =>
  import('./_sections/investors').then((mod) => mod.Investors)
)
const Showcase = dynamic(() =>
  import('./_sections/showcase').then((mod) => mod.Showcase)
)
const Community = dynamic(() =>
  import('./_sections/comunity').then((mod) => mod.Community)
)
const Footer = dynamic(() =>
  import('./_sections/footer').then((mod) => mod.Footer)
)

export default async function Home() {
  const [githubStars, discordMembers] = await Promise.all([
    getGitHubStars(),
    getDiscordMembers(),
  ])

  return (
    <Wrapper
      theme="light"
      lenis={{}}
      className="mx-auto bg-primary max-w-screen overflow-x-clip"
      githubStars={githubStars}
      discordMembers={discordMembers}
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
