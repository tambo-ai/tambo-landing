import posthog from "posthog-js";

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ph",
    ui_host: "https://us.posthog.com",
    cross_subdomain_cookie: true,
    persistence: "localStorage+cookie",
    defaults: "2025-11-30",
  });
}
