import { ScrollRestoration } from '~/components/scroll-restoration'
import { getGitHubStars } from '~/libs/github'
import { generatePageMetadata } from '~/libs/metadata'
import { Wrapper } from '../_components/wrapper'
import { Community } from './_sections/comunity'
import { Features } from './_sections/features-section'
import { Footer } from './_sections/footer'
import { Hero } from './_sections/hero'
import { HowItWorks } from './_sections/how-it-works'
import { Investors } from './_sections/investors'
import { MeetTambo } from './_sections/meet-tambo'
import { Section12 } from './_sections/section-12'
import { Showcase } from './_sections/showcase'
import { SocialProof } from './_sections/social-proof'
import { TamboSteps } from './_sections/tambo-steps'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'tambo',
    description: 'Build generative UI apps. No PhD required.',
    image: { url: '/opengraph-image.jpg' },
    type: 'website',
    url: `/`,
    siteName: 'tambo',
  })
}

export default async function Home() {
  const githubStars = await getGitHubStars()

  return (
    <>
      {process.env.NODE_ENV === 'production' && (
        <ScrollRestoration type="manual" />
      )}
      <Wrapper
        theme="light"
        lenis={{}}
        className="mx-auto bg-primary max-w-screen dt:max-w-[calc(var(--max-width)*1px)] overflow-x-clip"
        githubStars={githubStars}
      >
        <Hero />
        <TamboSteps />
        <MeetTambo />
        <SocialProof />
        <HowItWorks />
        <Features />
        <Section12 />
        <Investors />
        <Showcase />
        <Community />
        <Footer />
      </Wrapper>
    </>
  )
}
