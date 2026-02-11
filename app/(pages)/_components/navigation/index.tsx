'use client'

import cn from 'clsx'
import { useCallback, useRef } from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import CloseIcon from '~/assets/svgs/close.svg'
import DiscordIcon from '~/assets/svgs/discord.svg'
import GithubIcon from '~/assets/svgs/github.svg'
import NavMobile from '~/assets/svgs/nav-mobile.svg'
import XIcon from '~/assets/svgs/X.svg'
import { Button, CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Link } from '~/components/link'
import { siteConfig } from '~/libs/config'
import { useStore } from '~/libs/store'
import s from './navigation.module.css'

const LEFT_LINKS = [
  { href: '/docs', label: 'Docs', external: true },
  { href: '/blog', label: 'Blog' },
] as const

const RIGHT_LINKS = [
  { href: '/#pricing', label: 'Pricing' },
  { href: '/contact-us', label: 'Contact Us' },
] as const

interface NavigationProps {
  githubStars?: string
  discordMembers?: string
}

export function Navigation({
  githubStars = '2.8k',
  discordMembers = '1.6k',
}: NavigationProps) {
  const isMobileNavOpened = useStore((state) => state.isMobileNavOpened)
  const setIsMobileNavOpened = useStore((state) => state.setIsMobileNavOpened)
  const hasAppeared = useStore((state) => state.hasAppeared)
  const centerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLUListElement>(null)
  const rightRef = useRef<HTMLUListElement>(null)
  const githubRef = useRef<HTMLAnchorElement>(null)
  const discordRef = useRef<HTMLAnchorElement>(null)

  const handleMobileLinkClick = useCallback(
    (href: string) => {
      setIsMobileNavOpened(false)

      // Handle anchor links
      const hashIndex = href.indexOf('#')
      if (hashIndex !== -1) {
        const hash = href.slice(hashIndex + 1)
        // Small delay to let the menu close animation start
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            const mobileNavOffset = 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition =
              elementPosition + window.scrollY - mobileNavOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            })
          }
        }, 100)
      }
    },
    [setIsMobileNavOpened]
  )

  return (
    <nav
      className={cn(
        'fixed top-0 z-100 dr-layout-grid-inner pt-gap uppercase typo-button dt:left-1/2 dt:-translate-x-1/2',
        !hasAppeared && 'dt:opacity-0',
        'transition-opacity duration-600 ease-out-expo'
      )}
    >
      <Link
        href={siteConfig.links.discord}
        className={cn(
          s.linkWrapper,
          'desktop-only dr-size-48 dr-w-99 dr-pl-8 flex items-center dr-gap-x-8 rounded-full border border-dark-grey bg-white/50 backdrop-blur-[30px]'
        )}
        ref={discordRef}
      >
        <div
          className={cn(
            'group dr-w-32 aspect-square grid place-items-center bg-teal rounded-full',
            s.icon
          )}
        >
          <DiscordIcon className="dr-w-16 icon" />
        </div>
        <span>{discordMembers}</span>
      </Link>
      <section className="col-span-full dt:col-start-3 dt:col-end-11 flex justify-center ">
        {/* Desktop Nav */}
        <div
          ref={centerRef}
          className="w-full dt:dr-max-w-1440 dt:origin-center flex justify-between items-center  border border-dark-grey dt:pl-gap  dt:dr-pr-8  dt:rounded-full overflow-hidden dr-h-48  bg-white/50 backdrop-blur-[30px] desktop-only"
        >
          <ul ref={leftRef} className=" flex dr-gap-20">
            {LEFT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link">
                  {link.label}
                  {'external' in link && ' ↗'}
                </Link>
              </li>
            ))}
          </ul>
          <div className="dt:absolute dt:left-1/2 dt:-translate-x-1/2 dt:grid dt:place-items-center">
            <div className="dr-h-24 dr-w-89 relative">
              <Link href="/">
                <Image
                  fill
                  src="/images/tambo.png"
                  alt="Tambo Logo"
                  desktopSize="25vw"
                  preload
                />
              </Link>
            </div>
          </div>
          <ul
            ref={rightRef}
            className="flex items-center justify-end dr-gap-20"
          >
            {RIGHT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={siteConfig.links.dashboard}
                className={cn(
                  'dr-px-16 dr-h-32 rounded-full bg-mint grid place-items-center',
                  s.loginButton
                )}
              >
                Log in
              </Link>
            </li>
          </ul>
        </div>
        {/* Mobile Nav */}
        <div
          className={cn(
            'mobile-only border border-dark-grey w-full dr-h-48 dr-rounded-24 relative overflow-hidden bg-white/80 backdrop-blur-[30px]',
            s.mobileNavContainer,
            isMobileNavOpened && s.mobileNavOpened
          )}
        >
          <div className="absolute dr-h-48 dr-pl-24 dr-pr-20  flex justify-between items-center w-full ">
            <div className="dr-h-24 relative">
              <Link href="/" onClick={() => setIsMobileNavOpened(false)}>
                <Image
                  block
                  src="/images/tambo.png"
                  alt="Tambo Logo"
                  className="min-h-full"
                  mobileSize="25vw"
                  preload
                />
              </Link>
            </div>
            <Button
              onClick={() => {
                setIsMobileNavOpened(!isMobileNavOpened)
              }}
              className="flex dr-gap-4"
            >
              {isMobileNavOpened ? 'Close' : 'Menu'}
              {isMobileNavOpened ? (
                <CloseIcon className="dr-w-16" />
              ) : (
                <NavMobile className="dr-w-16" />
              )}
            </Button>
          </div>
          {/* Mobile content */}
          <div
            className={cn(
              'absolute dr-top-80 dr-px-24 transition-opacity duration-300 ease-in-expo w-full',
              isMobileNavOpened ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="flex flex-col dr-gap-y-16 dr-mb-40">
              {[...LEFT_LINKS, ...RIGHT_LINKS].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn('link')}
                  onClick={() => handleMobileLinkClick(link.href)}
                >
                  {link.label}
                  {'external' in link && ' ↗'}
                </Link>
              ))}
            </div>
            <div className="flex dr-gap-x-12 dr-mb-40">
              <Link
                href={siteConfig.links.github}
                className={cn(
                  'rounded-full border border-dark-grey flex items-center dr-gap-x-4 dr-pl-4 dr-h-32 dr-w-79',
                  s.loginButton
                )}
                onClick={() => setIsMobileNavOpened(false)}
              >
                <div className="dr-size-24 bg-mint grid place-items-center rounded-full">
                  <GithubIcon className="dr-w-16 icon" />
                </div>
                <span>{githubStars}</span>
              </Link>
              <Link
                href={siteConfig.links.discord}
                className={cn(
                  'rounded-full border border-dark-grey flex items-center dr-gap-x-4 dr-pl-4 dr-h-32 dr-w-79',
                  s.loginButton
                )}
                onClick={() => setIsMobileNavOpened(false)}
              >
                <div className="dr-size-24 bg-mint grid place-items-center rounded-full">
                  <DiscordIcon className="dr-w-16 icon" />
                </div>
                <span>{discordMembers}</span>
              </Link>
              <Link
                href={siteConfig.links.twitter}
                className={cn(
                  'rounded-full border border-dark-grey flex items-center dr-gap-x-4 dr-pl-4 dr-h-32 dr-w-79',
                  s.loginButton
                )}
                onClick={() => setIsMobileNavOpened(false)}
              >
                <div className="dr-size-24 bg-mint grid place-items-center rounded-full">
                  <XIcon className="dr-w-16 icon" />
                </div>
                <span>1.6k</span>
              </Link>
            </div>

            <CTA
              className={s.ctaMobile}
              href={siteConfig.links.dashboard}
              onClick={() => setIsMobileNavOpened(false)}
            >
              Sign In
            </CTA>
          </div>
        </div>
      </section>
      <Link
        href={siteConfig.links.github}
        className={cn(
          s.linkWrapper,
          'desktop-only col-start-12 dr-size-48 dr-w-99 dr-pr-8 flex justify-end items-center dr-gap-x-8 rounded-full border border-dark-grey bg-white/50 backdrop-blur-[30px] justify-self-end'
        )}
        ref={githubRef}
      >
        <span>{githubStars}</span>
        <div
          className={cn(
            'group dr-w-32 aspect-square grid place-items-center bg-teal rounded-full',
            s.icon
          )}
        >
          <GithubIcon className="dr-w-16 icon" />
        </div>
      </Link>

      <div
        className={cn(
          'mobile-only h-screen w-full  absolute inset -z-1 bg-ghost-mint/80 opacity-0 transition-opacity duration-300 ease-in-out pointer-events-none',
          isMobileNavOpened && 'opacity-100'
        )}
      >
        <HashPattern className="absolute inset-0 text-dark-teal/50" />
      </div>
    </nav>
  )
}
