import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Link } from "~/components/link";
import TamboLogo from "~/assets/svgs/tambo.svg";
import { BlogFooter } from "~/components/blog/blog-footer";
import { siteConfig } from "~/libs/config";

export const metadata: Metadata = {
  title: {
    template: "%s | tambo blog",
    default: "blog",
  },
  description:
    "Latest updates, tutorials, and insights about tambo - the AI orchestration framework for React frontends.",
};

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F2F8F6" }}
    >
      <header className="sticky top-0 z-50 pt-gap dr-layout-grid-inner">
        <div className="col-span-full dt:col-start-3 dt:col-end-11 flex justify-center">
          <div className="w-full flex justify-between items-center border border-dark-grey dr-pl-24 dr-pr-8 rounded-full dr-h-48 bg-white/50 backdrop-blur-[30px]">
            <Link href="/" className="grid place-items-center">
              <TamboLogo className="dr-h-24" />
            </Link>
            <Link
              href={siteConfig.links.dashboard}
              className="dr-px-16 dr-h-32 rounded-full bg-mint grid place-items-center uppercase typo-button"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
