import type { ReactNode } from 'react'
import { Theme } from '~/app/(pages)/_components/theme'
import { Wrapper } from '~/app/(pages)/_components/wrapper'
import { FooterContent } from '~/components/footer-content'
import { getDiscordMembers } from '~/libs/discord'
import { getGitHubStars } from '~/libs/github'
import { ScrollToTop } from '~/libs/scroll-to-top'
import s from './legal.module.css'

interface LegalLayoutProps {
  children: ReactNode
}

export default async function LegalLayout({ children }: LegalLayoutProps) {
    const [githubStars, discordMembers] = await Promise.all([
      getGitHubStars().catch(() => null),
      getDiscordMembers().catch(() => null),
    ])
  
    return (
      <Theme theme="light" global>
        <ScrollToTop />
        <div className="min-h-dvh flex flex-col bg-white">
          <Wrapper githubStars={githubStars ?? '2.5k'} discordMembers={discordMembers ?? '8.2k'} />
        <main className="flex-1 dr-pt-80">
          <div className="dr-layout-grid-inner dr-py-64">
            <article className={`col-span-full dt:col-start-4 dt:col-end-10 ${s.prose}`}>
              {children}
            </article>
          </div>
        </main>
        <FooterContent />
      </div>
    </Theme>
  )
}
