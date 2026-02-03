import cn from 'clsx'
import { Theme } from '~/app/(pages)/_components/theme'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { Wrapper } from '~/app/(pages)/_components/wrapper'
import { BlogFooter } from '~/components/blog/blog-footer'
import { ContactForm } from '~/components/contact-form'
import { getDiscordMembers } from '~/libs/discord'
import { getGitHubStars } from '~/libs/github'
import s from './contact-us.module.css'
import { ScrollToTop } from '~/libs/scroll-to-top'

export default async function ContactUsPage() {
  const [githubStars, discordMembers] = await Promise.all([
    getGitHubStars(),
    getDiscordMembers(),
  ])

  return (
    <Theme theme="light" global>
      <ScrollToTop />
      <div className="min-h-dvh flex flex-col bg-off-white">
        <Wrapper githubStars={githubStars} discordMembers={discordMembers} />
        <main className="flex-1">
          <div
            className={cn(
              'flex items-center justify-center dr-pt-120 dr-px-20 dr-pb-60 dt:dr-pt-160 dt:dr-px-40 dt:dr-pb-80 relative overflow-x-hidden',
              s.container
            )}
          >
            <HashPattern className="absolute inset-0 text-teal opacity-[0.08] pointer-events-none" />

            <div className="w-full dr-max-w-400 dt:dr-max-w-640 mx-auto relative z-10">
              <ContactForm />
            </div>
          </div>
        </main>
        <BlogFooter />
      </div>
    </Theme>
  )
}
