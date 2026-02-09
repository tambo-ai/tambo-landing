# Changelog

## [1.3.1](https://github.com/tambo-ai/tambo-landing/compare/tambo-website-v1.3.0...tambo-website-v1.3.1) (2026-02-09)


### Bug Fixes

* update bun.lock format ([#45](https://github.com/tambo-ai/tambo-landing/issues/45)) ([631e592](https://github.com/tambo-ai/tambo-landing/commit/631e592dc0c89a5e0f9d44c22af5cecb0b312e44))

## [1.3.0](https://github.com/tambo-ai/tambo-landing/compare/tambo-website-v1.2.0...tambo-website-v1.3.0) (2026-02-07)


### Features

* **seo:** add JSON-LD structured data and improve metadata ([#33](https://github.com/tambo-ai/tambo-landing/issues/33)) ([078d552](https://github.com/tambo-ai/tambo-landing/commit/078d552aca79f98b247a667dd0c66cf82dcbe00c))
* update llms.txt copy and add testimonials ([#35](https://github.com/tambo-ai/tambo-landing/issues/35)) ([5300501](https://github.com/tambo-ai/tambo-landing/commit/53005016c25d7dec6a43346b1d90dd95d58006c1))


### Bug Fixes

* move Turnstile script to client component for Next.js 16 compat ([#41](https://github.com/tambo-ai/tambo-landing/issues/41)) ([658c42e](https://github.com/tambo-ai/tambo-landing/commit/658c42e46a3e4636eb74b415b31698bd68e12683))


### Miscellaneous Chores

* add layered spam protection to contact form ([#40](https://github.com/tambo-ai/tambo-landing/issues/40)) ([f1b954c](https://github.com/tambo-ai/tambo-landing/commit/f1b954cc4b38b9e549b20de42bbaf70c48803bf6))

## [1.2.0](https://github.com/tambo-ai/tambo-landing/compare/tambo-website-v1.1.0...tambo-website-v1.2.0) (2026-02-06)


### Features

* add RSS feed for blog ([#15](https://github.com/tambo-ai/tambo-landing/issues/15)) ([e609ace](https://github.com/tambo-ai/tambo-landing/commit/e609acee125d5d376c29380997e2ed2cd6531b25))
* **ci:** add label automation workflow ([#29](https://github.com/tambo-ai/tambo-landing/issues/29)) ([1ef3eb0](https://github.com/tambo-ai/tambo-landing/commit/1ef3eb07d34965fd2bb281ba5f3ab5ed9c47e289))
* navigation improvements, investor updates, and typography refinements ([#37](https://github.com/tambo-ai/tambo-landing/issues/37)) ([05e9153](https://github.com/tambo-ai/tambo-landing/commit/05e9153f6f93829ad5741db1fa2e3b240e83dc0e)), closes [#36](https://github.com/tambo-ai/tambo-landing/issues/36)
* update showcase and social proof sections with new content ([#13](https://github.com/tambo-ai/tambo-landing/issues/13)) ([000320e](https://github.com/tambo-ai/tambo-landing/commit/000320ed036d45c47a69ecb72187d3cc8c965c58))


### Miscellaneous Chores

* remove unused integrations, fix lint/typecheck errors, re-enable CI checks ([#38](https://github.com/tambo-ai/tambo-landing/issues/38)) ([75364e8](https://github.com/tambo-ai/tambo-landing/commit/75364e8eb593687a6ed47a45da55868b8e308e85))


### Documentation

* add AGENTS.md and CLAUDE.md for AI coding assistants ([#32](https://github.com/tambo-ai/tambo-landing/issues/32)) ([2c84917](https://github.com/tambo-ai/tambo-landing/commit/2c8491753e875e4b31f78acedd6fadc4d9bed159))
* simplify README and remove PROD-README ([#31](https://github.com/tambo-ai/tambo-landing/issues/31)) ([7ef53b4](https://github.com/tambo-ai/tambo-landing/commit/7ef53b4648b0a8b94da44279f98e462f0f56ece6))

## [1.1.0](https://github.com/tambo-ai/tambo-landing/compare/tambo-website-v1.0.0...tambo-website-v1.1.0) (2026-02-05)


### Features

* add /contact-us page with lead capture form ([#5](https://github.com/tambo-ai/tambo-landing/issues/5)) ([ef952e8](https://github.com/tambo-ai/tambo-landing/commit/ef952e834ddd292afbd145b7289a86b26709d0ee))
* **analytics:** add PostHog integration with cross-subdomain tracking ([#1](https://github.com/tambo-ai/tambo-landing/issues/1)) ([52f45fa](https://github.com/tambo-ai/tambo-landing/commit/52f45fa371757a8f4afa0722083893ae32cc57fc))
* **blog:** port blog system from monorepo with MDX setup ([#3](https://github.com/tambo-ai/tambo-landing/issues/3)) ([50d6ca1](https://github.com/tambo-ai/tambo-landing/commit/50d6ca1edcc8b81ad6fc290020851f1933cc3519))
* **legal:** add pages for License, Privacy, and Terms of Use ([#14](https://github.com/tambo-ai/tambo-landing/issues/14)) ([f244336](https://github.com/tambo-ai/tambo-landing/commit/f24433633e4caf6951d414d86e0ca7505356ff6d))


### Bug Fixes

* restore blog system that was accidentally deleted ([#9](https://github.com/tambo-ai/tambo-landing/issues/9)) ([e86c6d7](https://github.com/tambo-ai/tambo-landing/commit/e86c6d7bff981f065ac8ad8def09b3059680c8aa))


### Miscellaneous Chores

* add .claude/ and tsconfig.tsbuildinfo to gitignore ([#7](https://github.com/tambo-ai/tambo-landing/issues/7)) ([cd62ac6](https://github.com/tambo-ai/tambo-landing/commit/cd62ac65d93fb8db8b0cf5a374519e3ddced80c9))
* add defineConfig and swap to inputSchema/outputSchema ([bb60e04](https://github.com/tambo-ai/tambo-landing/commit/bb60e042769f22d2dd8734a4df064a2b66b50a5b))
* add defineConfig and swap to inputSchema/outputSchema ([15d11d5](https://github.com/tambo-ai/tambo-landing/commit/15d11d5a73e3b4fb009fe8410a968610f9824bf0))


### Continuous Integration

* add GitHub workflows, labels, dependabot, and release-please ([#16](https://github.com/tambo-ai/tambo-landing/issues/16)) ([0e9883c](https://github.com/tambo-ai/tambo-landing/commit/0e9883c5afd645e7dcf8086940ba756ff67fe477))
