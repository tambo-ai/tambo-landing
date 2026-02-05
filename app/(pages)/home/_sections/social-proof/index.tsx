'use client'

import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { type Social, type SocialIconKey, socials } from './data'
import s from './social.module.css'
import SolinkSocialIcon from './social-proof-icons/solink-social.svg'

const socialIcons: Record<SocialIconKey, React.ReactNode> = {
  solink: <SolinkSocialIcon className="dr-h-15" />,
}

type ActiveCard = number | null

export function SocialProof() {
  const [activeCard, setActiveCard] = useState<ActiveCard>(null)

  const handleIntersect = useCallback(
    (id: ActiveCard, isIntersecting: boolean) => {
      setActiveCard((prev) => {
        if (isIntersecting) return id
        if (prev === id) return null
        return prev
      })
    },
    []
  )

  return (
    <section className="dt:dr-py-200 dr-py-120 dr-pt-80 dt:dr-pt-200 bg-white section-rounded-top section-shadow-top">
      <h2 className="dt:typo-h2 typo-h1 text-center dr-mb-56 px-safe">
        Product engineers love Tambo
      </h2>
      {/* Social Proof */}

      <div className="dt:grid dt:grid-cols-3 dt:dr-gap-24 flex flex-col dr-gap-16  content-max-width dt:dr-px-155 px-safe">
        {socials?.map((social, index) => (
          <SocialCard
            key={social?.author + index?.toString()}
            social={social}
            index={index}
            isActive={activeCard === index}
            onIntersect={handleIntersect}
          />
        ))}
      </div>
    </section>
  )
}

export function SocialCard({
  social,
  className,
  index,
  isActive,
  onIntersect,
}: {
  social: Social
  className?: string
  index?: number
  isActive?: boolean
  onIntersect?: (id: ActiveCard, isIntersecting: boolean) => void
}) {
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0,
  })
  const prevIntersecting = useRef<boolean | undefined>(undefined)

  // Only run intersection logic when onIntersect is provided
  useEffect(() => {
    if (!onIntersect || index === undefined) return
    const isIntersecting = intersection?.isIntersecting
    if (
      isIntersecting !== undefined &&
      isIntersecting !== prevIntersecting.current
    ) {
      prevIntersecting.current = isIntersecting
      onIntersect(index, isIntersecting)
    }
  }, [intersection, onIntersect, index])

  return (
    <div
      ref={onIntersect ? setIntersectionRef : undefined}
      className={cn(
        s.social,
        isActive && s.active,
        'bg-white dr-rounded-20 border border-dark-grey dr-p-8 dr-pb-16',
        onIntersect && 'dt:dr-h-258',
        className
      )}
    >
      <div
        className={cn(
          s.text,
          'dr-p-24 bg-off-white dr-rounded-12 dr-mb-16',
          onIntersect && 'dt:dr-h-162'
        )}
      >
        <p className="typo-p">{social?.text}</p>
      </div>
      <div className="flex items-center dr-gap-12 justify-between dr-px-8 w-full!">
        <div className="flex flex-col">
          <span className="typo-p-bold dr-mb-6">{social?.author}</span>
          <span
            className={cn(
              s.position,
              'typo-label-s dr-px-8 dr-py-4 dr-rounded-16 bg-off-white w-fit'
            )}
          >
            {social?.position}
          </span>
        </div>
        {socialIcons[social.icon] ?? null}
      </div>
    </div>
  )
}
