'use client'

import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { Image } from '~/components/image'
import { investors } from './data'
import s from './investors.module.css'

type ActiveCard = 'main' | number | null

export function Investors() {
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
    <section className="dt:dr-px-271 dt:dr-pb-200 dr-pb-120 px-safe bg-white section-rounded-bottom section-shadow-bottom">
      <div className="dt:dr-max-w-900 mx-auto">
        <h2 className=" typo-h1 text-center dt:dr-mb-56 dr-mb-40">
          Backed by top investors and builders
        </h2>
        <MainInvestorCard
          isActive={activeCard === 'main'}
          onIntersect={handleIntersect}
        />
        <div className="dt:grid dt:grid-cols-3 dt:dr-gap-24 flex flex-col dr-gap-16 ">
          {investors.map((investor, index) => (
            <InvestorCard
              key={investor?.name}
              investor={investor}
              index={index}
              isActive={activeCard === index}
              onIntersect={handleIntersect}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function MainInvestorCard({
  isActive,
  onIntersect,
}: {
  isActive: boolean
  onIntersect: (id: ActiveCard, isIntersecting: boolean) => void
}) {
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0,
  })
  const prevIntersecting = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    const isIntersecting = intersection?.isIntersecting
    if (
      isIntersecting !== undefined &&
      isIntersecting !== prevIntersecting.current
    ) {
      prevIntersecting.current = isIntersecting
      onIntersect('main', isIntersecting)
    }
  }, [intersection, onIntersect])

  return (
    <div
      ref={setIntersectionRef}
      className={cn(
        s.mainInvestor,
        isActive && s.active,
        'border border-dark-grey dr-rounded-20 w-full dr-p-8 bg-white dt:dr-mb-24 dr-mb-16'
      )}
    >
      <div
        className={cn(
          s.mainContent,
          'relative overflow-hidden border border-dark-grey dr-rounded-12 flex items-center justify-center bg-white dt:dr-h-160 dr-h-104'
        )}
      >
        <HashPattern className="absolute inset-0 text-dark-grey z-0" />
        <div className="dt:dr-w-353 dr-w-254">
          <Image
            block
            src="/images/TheGeneralPartnership_Logo.svg"
            alt="Partnership"
            className="relative z-1 min-w-full"
          />
        </div>
      </div>
    </div>
  )
}

function InvestorCard({
  investor,
  index,
  isActive,
  onIntersect,
}: {
  investor: (typeof investors)[number]
  index: number
  isActive: boolean
  onIntersect: (id: ActiveCard, isIntersecting: boolean) => void
}) {
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0,
  })
  const prevIntersecting = useRef<boolean | undefined>(undefined)

  useEffect(() => {
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
    <div className={cn(s.wrapper, 'relative z-0')}>
      <div className={s.rim} />
      <div
        ref={setIntersectionRef}
        className={cn(
          s.investor,
          isActive && s.active,
          'flex dr-gap-32 border border-dark-grey dr-rounded-20 dr-p-8 bg-white items-center'
        )}
      >
        <div className="dr-size-80 dr-rounded-12 border border-dark-grey grid place-items-center relative overflow-hidden">
          {investor?.image}
        </div>

        <div className="flex flex-col dr-gap-8">
          <p className="typo-p-bold">{investor.name}</p>
          <span
            className={cn(
              'typo-label-s dr-px-12 dr-h-28 dr-rounded-8 bg-off-white w-fit flex dr-gap-8 items-center',
              s.position
            )}
          >
            {investor?.position} {investor?.companyIcon}
          </span>
        </div>
      </div>
    </div>
  )
}
