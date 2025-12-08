'use client'

import cn from 'clsx'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import DiscordIcon from '~/assets/svgs/discord.svg'
import GithubIcon from '~/assets/svgs/github.svg'
import TamboLogo from '~/assets/svgs/tambo.svg'
import { Link } from '~/components/link'

const LEFT_LINKS = [
  { href: '/docs', label: 'Docs', external: true },
  { href: '/mcp', label: 'MCP' },
  { href: '/pricing', label: 'sanity' },
] as const

const RIGHT_LINKS = [
  { href: '/blog', label: 'Blog', external: true },
  { href: '/ask', label: 'Ask Tambo' },
] as const

export function Navigation() {
  const [isVisible, setIsVisible] = useState(true)
  const centerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLUListElement>(null)
  const rightRef = useRef<HTMLUListElement>(null)
  const logoRef = useRef<SVGSVGElement>(null)
  const githubRef = useRef<HTMLAnchorElement>(null)
  const discordRef = useRef<HTMLAnchorElement>(null)

  const lenis = useLenis(({ lastVelocity }) => {
    if (lastVelocity === 0) return
    toggleNavigation(lastVelocity > 0 ? 'hide' : 'show')
  })

  function toggleNavigation(action: 'show' | 'hide') {
    if (!lenis) return
    if (lenis.scroll < 100) {
      setIsVisible(true)
    } else {
      setIsVisible(action === 'show')
    }
  }

  const hideNavigation = useEffectEvent(() => {
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
        scale: 0.8,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '-=.3'
    )
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
  })

  useEffect(() => {
    if (isVisible) {
      showNavigation()
    } else {
      hideNavigation()
    }
  }, [isVisible])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 z-2 dr-layout-grid-inner pt-gap pb-safe uppercase',
        isVisible && 'opacity-100'
      )}
      onMouseEnter={() => toggleNavigation('show')}
      onMouseLeave={() => toggleNavigation('hide')}
    >
      <Link
        href="/"
        className="dr-size-48 rounded-full border border-black grid place-items-center"
        ref={githubRef}
      >
        <div className="dr-w-32 aspect-square grid place-items-center">
          <GithubIcon className="dr-w-16" />
        </div>
      </Link>

      <section className="col-start-3 col-end-11 flex justify-center">
        <div
          ref={centerRef}
          className="w-full origin-center flex justify-between items-center border border-black pl-gap dr-pr-8 rounded-full overflow-hidden dr-h-48"
        >
          <ul ref={leftRef} className="flex dr-gap-20">
            {LEFT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <div className="absolute left-1/2 -translate-x-1/2 grid place-items-center">
            <TamboLogo className="dr-h-24" ref={logoRef} />
          </div>
          <ul
            ref={rightRef}
            className="flex items-center justify-end dr-gap-20"
          >
            {RIGHT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="block dr-px-16 dr-h-32 rounded-full bg-black"
              >
                Log in
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <Link
        href="/"
        className="col-start-12 dr-size-48 rounded-full border border-black grid place-items-center"
        ref={discordRef}
      >
        <div className="dr-w-32 aspect-square grid place-items-center">
          <DiscordIcon className="dr-w-16" />
        </div>
      </Link>
    </nav>
  )
}
