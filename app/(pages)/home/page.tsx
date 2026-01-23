import { ScrollRestoration } from "~/components/scroll-restoration";
import { getGitHubStars } from "~/libs/github";
import { generatePageMetadata } from "~/libs/metadata";
import { Wrapper } from "../_components/wrapper";
import { Footer } from "./_sections/footer";
import { Hero } from "./_sections/hero";
import { HowItWorks } from "./_sections/how-it-works";
import { Investors } from "./_sections/investors";
import { MeetTambo } from "./_sections/meet-tambo";
import { Moments } from "./_sections/moments";
import { Section10 } from "./_sections/section-10";
import { Section11 } from "./_sections/section-11";
import { Section12 } from "./_sections/section-12";
import { SocialProof } from "./_sections/social-proof";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "tambo",
    description: "Build generative UI apps. No PhD required.",
    image: { url: "/opengraph-image.jpg" },
    type: "website",
    url: `/`,
    siteName: "tambo",
  });
}

export default async function Home() {
  const githubStars = await getGitHubStars();

  return (
    <>
      {process.env.NODE_ENV === "production" && (
        <ScrollRestoration type="manual" />
      )}
      <Wrapper
        theme="light"
        lenis={{}}
        className="mx-auto bg-primary max-w-screen dt:max-w-[calc(var(--max-width)*1px)] overflow-x-clip"
        githubStars={githubStars}
      >
        <Hero />
        <Moments />
        <MeetTambo />
        <SocialProof />
        <Section10 />
        <HowItWorks />
        <Section11 />
        <Section12 />
        <Investors />
        <Footer />
      </Wrapper>
    </>
  );
}
