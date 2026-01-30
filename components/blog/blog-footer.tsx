"use client";

import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "~/libs/config";

// Computed at build time to avoid prerender issues with new Date()
const CURRENT_YEAR = new Date().getFullYear();

export function BlogFooter() {

  return (
    <footer
      className="bg-[#f4f9f7] border-t border-[#e5ebe8]"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5d7a72] hover:text-[#1a2e28] transition-colors duration-150"
            >
              <Github className="w-[1.375rem] h-[1.375rem]" />
            </a>
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5d7a72] hover:text-[#1a2e28] transition-colors duration-150"
            >
              <Twitter className="w-[1.375rem] h-[1.375rem]" />
            </a>
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5d7a72] hover:text-[#1a2e28] transition-colors duration-150"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-y-2 gap-x-6 text-sm">
            {siteConfig.footer.links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-[#5d7a72] hover:text-[#1a2e28] no-underline transition-colors duration-150"
              >
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[0.8125rem] text-[#8aa8a0] mt-2">
            Fractal Dynamics Inc © {CURRENT_YEAR}
          </p>
        </div>
      </div>
    </footer>
  );
}
