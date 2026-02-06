'use client'

import DiscordSVG from '~/assets/svgs/discord.svg'
import GithubSVG from '~/assets/svgs/github.svg'
import XSVG from '~/assets/svgs/X.svg'
import { Link } from '~/components/link'
import { CURRENT_YEAR, siteConfig } from '~/libs/config'

export function FooterContent() {
  return (
    <footer>
      {/* Mobile only social icons */}
      <div className="mobile-only flex dr-gap-12 dr-mb-32 justify-center">
        <Link
          href={siteConfig.links.github}
          className="dr-size-32 rounded-full bg-grey grid place-items-center"
        >
          <GithubSVG className="dr-w-16 dr-h-16" />
        </Link>
        <Link
          href={siteConfig.links.discord}
          className="dr-size-32 rounded-full bg-grey grid place-items-center"
        >
          <DiscordSVG className="dr-w-16 dr-h-16" />
        </Link>
        <Link
          href={siteConfig.links.twitter}
          className="dr-size-32 rounded-full bg-grey grid place-items-center"
        >
          <XSVG className="dr-w-16 dr-h-16" />
        </Link>
      </div>

      {/* Bottom footer with grid layout */}
      <div className="dt:dr-layout-grid-inner dr-px-0 flex flex-col-reverse w-full typo-label-m dr-mb-16 dt:dr-mb-16">
        <span className="dt:col-span-2 typo-label-s dt:typo-label-m text-center dt:text-left text-black/70">
          Fractal Dynamics Inc © {CURRENT_YEAR ?? 2025}
        </span>
        <div className="dt:col-[3/-3] flex items-center justify-center dt:dr-gap-24 dr-gap-13 dr-mb-16 dt:mb-0">
          {siteConfig.footer.links.map((link, index) => (
            <Link
              key={link.text + index.toString()}
              href={link.url}
              className="link typo-label-s dt:typo-label-m"
            >
              {link.text}
            </Link>
          ))}
        </div>
        <Link
          href={siteConfig.links.twitter}
          className="col-span-2 justify-self-end link desktop-only"
        >
          <XSVG className="dr-w-16 dr-h-16" />
        </Link>
      </div>
    </footer>
  )
}
