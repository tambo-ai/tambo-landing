'use client'

import DiscordSVG from '~/assets/svgs/discord.svg'
import GithubSVG from '~/assets/svgs/github.svg'
import XSVG from '~/assets/svgs/X.svg'
import { Link } from '~/components/link'
import { siteConfig } from '~/libs/config'

export function BlogFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="dr-py-16 dr-layout-grid-inner">
      <div className="col-span-full dt:col-start-4 dt:col-end-10 flex flex-col-reverse dt:flex-row dt:items-center dt:justify-between dr-gap-16 dt:dr-gap-0">
        <span className="typo-label-s dt:typo-label-m text-center dt:text-left text-black/70">
          Fractal Dynamics Inc © {currentYear}
        </span>

        <div className="flex items-center justify-center dr-gap-13 dt:dr-gap-24">
          {siteConfig.footer.links.map(
            (link: { text: string; url: string }, index: number) => (
              <Link
                key={link.text + index.toString()}
                href={link.url}
                className="link typo-label-s dt:typo-label-m whitespace-nowrap"
              >
                {link.text}
              </Link>
            )
          )}
        </div>

        <div className="flex dr-gap-12 justify-center dt:justify-end">
          <Link
            href={siteConfig.links.github}
            className="dr-size-32 rounded-full bg-grey grid place-items-center"
          >
            <GithubSVG className="dr-size-16" />
          </Link>
          <Link
            href={siteConfig.links.discord}
            className="dr-size-32 rounded-full bg-grey grid place-items-center"
          >
            <DiscordSVG className="dr-size-16" />
          </Link>
          <Link
            href={siteConfig.links.twitter}
            className="dr-size-32 rounded-full bg-grey grid place-items-center"
          >
            <XSVG className="dr-size-16" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
