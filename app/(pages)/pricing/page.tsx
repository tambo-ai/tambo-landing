import type { Metadata } from 'next'
import { Theme } from '~/app/(pages)/_components/theme'
import { Wrapper } from '~/app/(pages)/_components/wrapper'
import { Pricing } from '~/app/(pages)/home/_sections/pricing'
import { FooterContent } from '~/components/footer-content'
import { getDiscordMembers } from '~/libs/discord'
import { getGitHubStars } from '~/libs/github'
import { ScrollToTop } from '~/libs/scroll-to-top'

export const metadata: Metadata = {
  title: 'Pricing | Tambo',
  description:
    'Free to start, simple to scale. Explore Tambo pricing plans for generative UI.',
}

export default async function PricingPage() {
  const [githubStars, discordMembers] = await Promise.all([
    getGitHubStars(),
    getDiscordMembers(),
  ])

  return (
    <Theme theme="light" global>
      <ScrollToTop />
      <div className="min-h-dvh flex flex-col bg-white">
        <Wrapper githubStars={githubStars} discordMembers={discordMembers} />
        <main className="flex-1">
          <div className="dr-pt-80 dt:dr-pt-120">
            <Pricing />
          </div>
        </main>
        <FooterContent />
      </div>
    </Theme>
  )
}
