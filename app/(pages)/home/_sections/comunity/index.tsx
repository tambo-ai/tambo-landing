'use client'

import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import { Button, CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Marquee } from '~/components/marquee'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import s from './community.module.css'
import { buttons, persons } from './data'

type ActiveCard = number | null

export function Community() {
  return (
    <section className="dt:dr-pt-132 dt:dr-pb-200 dr-pb-120 section-rounded-bottom section-shadow-bottom z-1">
      <div className="flex flex-col items-center dr-mb-56 dt:dr-px-0 mx-auto px-safe">
        <TitleBlock className="dr-mb-32 dt:mb-0">
          <TitleBlock.Title
            level="h2"
            className="dr-mb-8! dt:typo-h2! typo-h1!"
          >
            Join the Tambo community
          </TitleBlock.Title>
          <TitleBlock.Subtitle className="dt:dr-mb-40 typo-p! dt:typo-p-l! text-black/50 dt:dr-w-550!">
            Build with us! <br className="mobile-only" /> Get help in our
            Discord, contribute on GitHub,
            <br className="mobile-only" /> and shape what comes next.
          </TitleBlock.Subtitle>
        </TitleBlock>

        <div className="flex dt:dr-gap-16 dr-gap-8 dt:flex-row flex-col items-center">
          {buttons[0] && (
            <CTA
              key={buttons[0]?.text}
              href={buttons[0]?.href}
              icon={buttons[0]?.icon as 'github' | 'discord'}
              className="bg-black! text-teal border-teal w-fit "
            >
              {buttons[0]?.text}
            </CTA>
          )}
          {buttons[1] && (
            <CTA
              key={buttons[1]?.text}
              href={buttons[1]?.href}
              color="white"
              icon={buttons[1]?.icon as 'github' | 'discord'}
              className="w-fit"
            >
              {buttons[1]?.text}
            </CTA>
          )}
        </div>
      </div>
      <DesktopGrid />
      <MobileMarquee />
    </section>
  )
}

function DesktopGrid() {
  return (
    <div className="dt:grid dt:grid-cols-4 dt:grid-rows-2 dt:dr-gap-24 desktop-only content-max-width dt:dr-px-155">
      {persons.map((person, index) => (
        <Card key={person?.name + index?.toString()} person={person} />
      ))}
    </div>
  )
}

function MobileMarquee() {
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
    <Marquee speed={0.3} className="mobile-only">
      <div className="flex dr-gap-16">
        {persons.map((person, index) => (
          <Card
            key={person?.name + index?.toString()}
            person={person}
            index={index}
            isActive={activeCard === index}
            onIntersect={handleIntersect}
          />
        ))}
      </div>
    </Marquee>
  )
}

function Card({
  person,
  index,
  isActive,
  onIntersect,
}: {
  person: (typeof persons)[number]
  index?: number
  isActive?: boolean
  onIntersect?: (id: ActiveCard, isIntersecting: boolean) => void
}) {
  const { isMobile } = useDeviceDetection()
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '0px -40% 0px -40%',
    threshold: 0,
  })
  const prevIntersecting = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    if (!(isMobile || onIntersect) || index === undefined) return
    const isIntersecting = intersection?.isIntersecting
    if (
      isIntersecting !== undefined &&
      isIntersecting !== prevIntersecting.current
    ) {
      prevIntersecting.current = isIntersecting
      onIntersect?.(index, isIntersecting)
    }
  }, [intersection, onIntersect, index, isMobile])

  return (
    <Button
      ref={isMobile && onIntersect ? setIntersectionRef : undefined}
      className={cn(
        'border border-dark-grey dr-rounded-20 dr-p-8 dr-pb-16 bg-off-white dt:typo-p dt:dr-w-264 dt:dr-h-228 dr-w-311 dr-h-194',
        s.card,
        isActive && s.active
      )}
      href={person?.url}
    >
      <div
        className={cn(
          'dr-p-24 dr-pt-16 border border-dark-grey dr-rounded-12 bg-white dr-mb-16 dt:dr-h-144 dr-h-110',
          s.tweetContent
        )}
      >
        <span className="typo-label-s dr-mb-8 text-black/50 block">
          {person?.account}
        </span>
        <p className={cn(s.tweet, 'dt:typo-p typo-p-s whitespace-normal')}>
          {person?.tweet?.split(' ').map((word, i) => (
            <span
              key={`word-${i}-${word}`}
              className={cn(
                word.startsWith('@') ? 'text-[#1d9bf0]' : undefined,
                'inline'
              )}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
      <div className="flex dr-gap-16 dr-px-8">
        <div className="relative dr-size-44 dr-rounded-8 overflow-hidden">
          <Image src={person?.image} alt={person?.name} fill />
        </div>

        <div className="flex flex-col dr-gap-6">
          <h4 className="typo-p-bold">{person?.name}</h4>
          <span
            className={cn(
              'typo-label-s dr-px-8 dr-py-4 dr-rounded-16 bg-light-gray w-fit',
              s.position
            )}
          >
            {person?.position}
          </span>
        </div>
      </div>
    </Button>
  )
}
