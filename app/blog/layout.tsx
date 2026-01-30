import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BlogFooter } from "~/components/blog/blog-footer";

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
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f4f9f7",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: "4rem",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(212, 229, 223, 0.6)",
          backgroundColor: "rgba(244, 249, 247, 0.9)",
        }}
      >
        <div
          style={{
            maxWidth: "64rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#1a2e28",
              textDecoration: "none",
              letterSpacing: "-0.02em",
            }}
          >
            tambo
          </Link>
          <span style={{ marginLeft: "1rem", color: "#8aa8a0" }}>/</span>
          <Link
            href="/blog"
            style={{
              marginLeft: "1rem",
              color: "#5d7a72",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.15s",
            }}
          >
            blog
          </Link>
        </div>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <BlogFooter />
    </div>
  );
}
