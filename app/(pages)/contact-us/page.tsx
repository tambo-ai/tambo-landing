import cn from 'clsx'
import { Handshake, Shield } from 'lucide-react'
import { Theme } from '~/app/(pages)/_components/theme'
import { Wrapper } from '~/app/(pages)/_components/wrapper'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { SocialCard } from '~/app/(pages)/home/_sections/social-proof'
import { socials } from '~/app/(pages)/home/_sections/social-proof/data'
import { ContactForm } from '~/components/contact-form'
import { FooterContent } from '~/components/footer-content'
import { getDiscordMembers } from '~/libs/discord'
import { getGitHubStars } from '~/libs/github'
import { ScrollToTop } from '~/libs/scroll-to-top'
import s from './contact-us.module.css'
import { contactPageContent, type ValuePropIconKey, valueProps } from './data'

const valuePropIcons: Record<ValuePropIconKey, typeof Handshake> = {
  handshake: Handshake,
  shield: Shield,
}

export default async function ContactUsPage() {
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
          <div
            className={cn(
              'dr-pt-80 dr-px-20 dr-pb-80 dt:dr-pt-120 dt:dr-px-40 dt:dr-pb-60 relative overflow-x-hidden',
              s.container
            )}
          >
            <HashPattern className="absolute inset-0 text-teal opacity-[0.06] pointer-events-none" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10 dt:grid dt:grid-cols-[1fr_minmax(0,480px)] dt:dr-gap-100 dt:items-center">
              {/* Left Column - Value Props */}
              <div className="dt:dr-max-w-500">
                {/* Mobile: Centered header */}
                <div className="text-center dr-mb-48 dr-mt-48 dt:hidden">
                  <h1 className="typo-h3 text-black dr-mb-20">
                    {contactPageContent.title}
                  </h1>
                  <p className="typo-p-l text-black dr-max-w-340 mx-auto leading-[1.6]">
                    {contactPageContent.subtitle}
                  </p>
                </div>

                {/* Desktop: Full value props */}
                <div className="hidden dt:block">
                  <h1 className="typo-h1 text-black dr-mb-32">
                    {contactPageContent.title}
                  </h1>

                  <div className="dr-mb-40">
                    {valueProps.map((prop, index) => {
                      const Icon = valuePropIcons[prop.icon]

                      return (
                        <div
                          key={prop.title}
                          className={cn(
                            'flex items-start dr-gap-16',
                            index < valueProps.length - 1 && 'dr-mb-24'
                          )}
                        >
                          <Icon className="dr-w-24 dr-h-24 flex-shrink-0 dr-mt-4 text-forest" />
                          <div>
                            <span className="typo-p-bold text-black">
                              {prop.title}
                            </span>{' '}
                            <span className="typo-p text-black opacity-80">
                              {prop.description}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Solink Quote Card */}
                  <SocialCard
                    className="[&>div:first-child]:dr-p-24 [&_p]:typo-p [&_.typo-p-bold]:dr-text-16"
                    social={socials[0]}
                  />
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="w-full dr-max-w-480 dt:max-w-full mx-auto dt:mx-0">
                <ContactForm />
              </div>
            </div>
          </div>
        </main>
        <FooterContent />
      </div>
    </Theme>
  )
}
