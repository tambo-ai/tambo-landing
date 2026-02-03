import type { Metadata } from "next";
import { BlogPage as BlogPageComponent } from "~/components/blog/blog-page";
import { getPostListItems } from "~/libs/get-posts";

export const metadata: Metadata = {
  title: "blog",
  description:
    "Tutorials, updates, and ideas from the Tambo team—building the open-source generative UI toolkit for React.",
  openGraph: {
    title: "blog",
    description:
      "Tutorials, updates, and ideas from the Tambo team—building the open-source generative UI toolkit for React.",
    type: "website",
    siteName: "blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "blog",
    description:
      "Tutorials, updates, and ideas from the Tambo team—building the open-source generative UI toolkit for React.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const allPosts = await getPostListItems();
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const baseUrl = (rawBaseUrl || "https://tambo.co").replace(/\/+$/, "");

  return <BlogPageComponent posts={allPosts} baseUrl={baseUrl} />;
}
