"use client";

import { Github, Twitter } from "lucide-react";
import { useState } from "react";

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: hovered ? "#1a2e28" : "#5d7a72",
        transition: "color 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <a
      href={href}
      style={{
        color: hovered ? "#1a2e28" : "#5d7a72",
        textDecoration: "none",
        transition: "color 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}

export function BlogFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#f4f9f7",
        borderTop: "1px solid #e5ebe8",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Social Icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            <SocialLink href="https://github.com/tambo-ai/tambo">
              <Github style={{ width: "1.375rem", height: "1.375rem" }} />
            </SocialLink>
            <SocialLink href="https://x.com/tambo_ai">
              <Twitter style={{ width: "1.375rem", height: "1.375rem" }} />
            </SocialLink>
            <SocialLink href="https://discord.gg/dJNvPEHth6">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: "1.5rem", height: "1.5rem" }}
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </SocialLink>
          </div>

          {/* Links */}
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem 1.5rem",
              fontSize: "0.875rem",
            }}
          >
            <FooterLink href="/docs" label="Documentation" />
            <FooterLink href="/license" label="License" />
            <FooterLink href="/privacy" label="Privacy Notice" />
            <FooterLink href="/terms" label="Terms of Use" />
          </nav>

          {/* Copyright - use static year to avoid prerender issues */}
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#8aa8a0",
              marginTop: "0.5rem",
            }}
          >
            Fractal Dynamics Inc © 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
