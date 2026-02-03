import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Wrapper } from "~/app/(pages)/_components/wrapper";
import { BlogFooter } from "~/components/blog/blog-footer";
import { Theme } from "~/app/(pages)/_components/theme";
import { getGitHubStars } from "~/libs/github";
import { getDiscordMembers } from "~/libs/discord";
import { ScrollToTop } from "~/libs/scroll-to-top";

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

export default async function BlogLayout({ children }: BlogLayoutProps) {
  const [githubStars, discordMembers] = await Promise.all([
    getGitHubStars(),
    getDiscordMembers(),
  ])
  return (
    <Theme theme="light" global>
      <ScrollToTop />
      <div className="min-h-dvh flex flex-col bg-white">
        <Wrapper githubStars={githubStars} discordMembers={discordMembers} />
        <main className="flex-1 dr-pt-80">{children}</main>
        <BlogFooter />
      </div>
    </Theme>
  );
}
