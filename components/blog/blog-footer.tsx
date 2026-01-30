"use client";

import XSVG from "~/assets/svgs/X.svg";
import DiscordSVG from "~/assets/svgs/discord.svg";
import GithubSVG from "~/assets/svgs/github.svg";
import { Link } from "~/components/link";
import { siteConfig } from "~/libs/config";

export function BlogFooter() {
  return (
    <footer className="dr-py-16 dr-layout-grid-inner" style={{ backgroundColor: "#F2F8F6" }}>
      <div className="col-span-full dt:col-start-3 dt:col-end-11">
        <div className="flex flex-col-reverse dt:grid dt:grid-cols-3 items-center dr-gap-16 dt:dr-gap-0">
          <span className="typo-label-s dt:typo-label-m text-black/70 dt:justify-self-start">
            {siteConfig.footer.bottomText}
          </span>

          <div className="flex items-center justify-center dr-gap-13 dt:dr-gap-24 dt:justify-self-center">
            {siteConfig.footer.links.map((link: { text: string; url: string }, index: number) => (
              <Link
                key={link.text + index.toString()}
                href={link.url}
                className="link typo-label-s dt:typo-label-m whitespace-nowrap"
              >
                {link.text}
              </Link>
            ))}
          </div>

          <div className="flex dr-gap-12 dt:justify-self-end">
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
        </div>
      </div>
    </footer>
  );
}
