"use client";

import { useEffect, useState } from "react";
import DiscordSVG from "~/assets/svgs/discord.svg";
import GithubSVG from "~/assets/svgs/github.svg";
import XSVG from "~/assets/svgs/X.svg";
import { Link } from "~/components/link";

const FOOTER_LINKS = [
  { label: "Documentation", href: "/docs" },
  { label: "License", href: "/license" },
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

export function BlogFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-primary dr-py-16">
      <div className="dr-layout-grid-inner">
        <div className="col-span-full flex flex-col-reverse dt:grid dt:grid-cols-3 items-center dr-gap-16 dt:dr-gap-0">
          <span className="typo-label-s dt:typo-label-m text-black/70 dt:justify-self-start">
            Fractal Dynamics Inc © {currentYear ?? 2026}
          </span>

          <div className="flex items-center justify-center dr-gap-13 dt:dr-gap-24 dt:justify-self-center">
            {FOOTER_LINKS.map((link, index) => (
              <Link
                key={link.label + index.toString()}
                href={link.href}
                className="link typo-label-s dt:typo-label-m"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex dr-gap-12 dt:justify-self-end">
            <Link
              href="https://github.com/tambo-ai/tambo"
              className="dr-size-32 rounded-full bg-grey grid place-items-center"
            >
              <GithubSVG className="dr-w-16 dr-h-16" />
            </Link>
            <Link
              href="https://discord.com/invite/dJNvPEHth6"
              className="dr-size-32 rounded-full bg-grey grid place-items-center"
            >
              <DiscordSVG className="dr-w-16 dr-h-16" />
            </Link>
            <Link
              href="https://x.com/tambo_ai"
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
