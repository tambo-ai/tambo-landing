'use client'

import cn from 'clsx'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import CloseIcon from '~/assets/svgs/close.svg'
import DiscordIcon from '~/assets/svgs/discord.svg'
import GithubIcon from '~/assets/svgs/github.svg'
import NavMobile from '~/assets/svgs/nav-mobile.svg'
import TamboLogo from '~/assets/svgs/tambo.svg'
import XIcon from '~/assets/svgs/X.svg'
import { Button, CTA } from '~/components/button'
import { Link } from '~/components/link'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useStore } from '~/libs/store'
import { siteConfig } from '~/libs/config'
import s from './navigation.module.css'

const LEFT_LINKS = [
  { href: '/docs', label: 'Docs', external: true },
  { href: '#moment-3', label: 'MCP' },
  { href: '#section-12', label: 'Sanity' },
] as const

const RIGHT_LINKS = [
  { href: '/blog', label: 'Blog', external: true },
  { href: '/ask', label: 'Ask Tambo' },
] as const

export function Navigation() {
  // const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const isMobileNavOpened = useStore((state) => state.isMobileNavOpened)
  const setIsMobileNavOpened = useStore((state) => state.setIsMobileNavOpened)
  const [hasScrolledUpwards, setHasScrolledUpwards] = useState(false)
  const [hasReachedLimits, setHasReachedLimits] = useState(false)
  // const [isFirstScroll, setIsFirstScroll] = useState(false)
  const hasAppeared = useStore((state) => state.hasAppeared)
  const { isDesktop } = useDeviceDetection()

  const centerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLUListElement>(null)
  const rightRef = useRef<HTMLUListElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const githubRef = useRef<HTMLAnchorElement>(null)
  const discordRef = useRef<HTMLAnchorElement>(null)

  useLenis(({ lastVelocity, progress, scroll }) => {
    // if (lastVelocity === 0) return
    // toggleNavigation(lastVelocity > 0 && progress < 0.99 ? 'hide' : 'show')
    // console.log('lastVelocity', lastVelocity)
    if (lastVelocity !== 0) setHasScrolledUpwards(lastVelocity < 0)

    setHasReachedLimits(scroll < 100 || progress > 0.99)
  })

  const isVisible =
    hasAppeared && (hasScrolledUpwards || hasReachedLimits || isHovered)

  // useEffect(() => {
  //   console.log('isVisible', isVisible)
  // }, [isVisible])

  // function toggleNavigation(action: 'show' | 'hide') {
  //   if (!lenis) return
  //   if (lenis.scroll < 100) {
  //     setIsVisible(true)
  //   } else {
  //     setIsVisible(action === 'show')
  //   }
  // }

  const hideNavigation = useEffectEvent(() => {
    // if (isHovered) return
    const tl = gsap.timeline()

    tl.to(centerRef.current, {
      width: '11.1vw',
      duration: 0.5,
      ease: 'power2.inOut',
    })

    tl.to(
      leftRef.current,
      {
        x: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      },
      '<'
    )

    tl.to(
      rightRef.current,
      {
        x: -100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      },
      '<'
    )

    tl.to(
      githubRef.current,
      {
        x: '100%',
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      },
      '<'
    )

    tl.to(
      discordRef.current,
      {
        x: '-100%',
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      },
      '<'
    )

    tl.to(
      logoRef.current,
      {
        scale: isDesktop ? 0.8 : 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '-=.3'
    )

    return () => {
      tl.kill()
    }
  })

  const showNavigation = useEffectEvent(() => {
    const tl = gsap.timeline()

    tl.to(centerRef.current, {
      width: '100%',
      duration: 0.5,
      ease: 'power2.inOut',
    })

    tl.to(
      logoRef.current,
      {
        scale: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )

    tl.to(
      leftRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '-=.4'
    )

    tl.to(
      rightRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )

    tl.to(
      githubRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )

    tl.to(
      discordRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )

    return () => {
      tl.kill()
    }
  })

  useEffect(() => {
    if (isVisible) {
      return showNavigation()
    }
    return hideNavigation()
  }, [isVisible])

  return (
    <nav
      className={cn(
        'fixed top-0 z-100 dr-layout-grid-inner pt-gap uppercase typo-button dt:left-1/2 dt:-translate-x-1/2',
        !hasAppeared && 'dt:opacity-0',
        'transition-opacity duration-600 ease-out-expo'
      )}
      style={{
        maxWidth: `calc(var(--max-width) * 1px)`,
      }}
      onMouseEnter={() => {
        setIsHovered(true)
        // toggleNavigation('show')
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        // toggleNavigation('hide')
      }}
    >
      <Link
        href={siteConfig.links.githubOrg}
        className="desktop-only dr-size-48 rounded-full border border-dark-grey grid place-items-center bg-white/50 backdrop-blur-[30px]"
        ref={githubRef}
      >
        <div
          className={cn(
            'group dr-w-32 aspect-square grid place-items-center bg-teal rounded-full',
            s.iconWrapper
          )}
        >
          <GithubIcon className="dr-w-16 icon" />
        </div>
      </Link>

      <section className="col-span-full dt:col-start-3 dt:col-end-11 flex justify-center">
        {/* Desktop Nav */}
        <div
          ref={centerRef}
          className="w-full dt:origin-center flex justify-between items-center  border border-dark-grey dt:pl-gap  dt:dr-pr-8  dt:rounded-full overflow-hidden dr-h-48  bg-white/50 backdrop-blur-[30px] desktop-only"
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
            <TamboLogo className="dr-h-24" ref={logoRef} />
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
            <TamboLogo className="dr-h-24" ref={logoRef} />
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
                <Link key={link.href} href={link.href} className="link">
                  {link.label}
                  {'external' in link && ' ↗'}
                </Link>
              ))}
            </div>
            <div className="flex dr-gap-x-12 dr-mb-40">
              <Link
                href={siteConfig.links.githubOrg}
                className={cn(
                  'rounded-full bg-mint grid place-items-center dr-h-32 dr-w-32',
                  s.loginButton
                )}
              >
                <GithubIcon className="dr-w-16 icon" />
              </Link>
              <Link
                href={siteConfig.links.discord}
                className={cn(
                  'rounded-full bg-mint grid place-items-center dr-h-32 dr-w-32',
                  s.loginButton
                )}
              >
                <DiscordIcon className="dr-w-16 icon" />
              </Link>
              <Link
                href={siteConfig.links.twitter}
                className={cn(
                  'rounded-full bg-mint grid place-items-center dr-h-32 dr-w-32',
                  s.loginButton
                )}
              >
                <XIcon className="dr-w-16 icon" />
              </Link>
            </div>

            <CTA className={s.ctaMobile} href={siteConfig.links.dashboard}>
              Sign In
            </CTA>
          </div>
        </div>
      </section>

      <Link
        href={siteConfig.links.discord}
        className="desktop-only col-start-12 dr-size-48 rounded-full border border-dark-grey grid place-items-center bg-white/50 backdrop-blur-[30px] justify-self-end"
        ref={discordRef}
      >
        <div
          className={cn(
            'group dr-w-32 aspect-square grid place-items-center bg-teal rounded-full',
            s.iconWrapper
          )}
        >
          <DiscordIcon className="dr-w-16 icon" />
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
