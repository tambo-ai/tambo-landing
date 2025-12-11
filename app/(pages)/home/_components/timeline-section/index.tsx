'use client'
import cn from 'clsx'
import gsap from 'gsap'
import { useRect } from 'hamo'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { messages as messagesType } from '~/app/(pages)/home/_sections/section-4/data'
import { CTA } from '~/components/button'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { mapRange } from '~/libs/utils'

export function TimelineSection({
  messages,
  title,
}: {
  messages: typeof messagesType
  title: string
}) {
  const [rectRef, rect] = useRect()
  const [messagesVisible, setMessagesVisible] = useState(0)
  const whiteLineRef = useRef<HTMLDivElement>(null)

  useScrollTrigger({
    rect,
    start: 'top center',
    end: 'bottom bottom',
    onProgress: ({ progress }) => {
      const scrollProgress = mapRange(0, 0.75, progress - 0.25, 0, 1)
      const translateProgress = mapRange(0.1, 1, scrollProgress, 0, 100)
      const visibleProgress = mapRange(
        0,
        1,
        scrollProgress,
        0,
        messages.length + 1
      )
      const visible = Math.floor(visibleProgress)
      setMessagesVisible(visible)
      if (whiteLineRef.current) {
        whiteLineRef.current.style.translate = `0 ${-Math.min(100 - translateProgress, 90)}%`
      }
    },
  })

  return (
    <section ref={rectRef} className="h-[300svh]">
      <div className="sticky top-0 dr-layout-grid-inner h-screen">
        <div className="col-span-4 flex flex-col dr-mt-112">
          <h3 className="typo-h2">{title}</h3>
          <div
            className="relative dr-py-40"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%)',
            }}
          >
            <div className="absolute z-15 inset-y-0 dr-left-38 overflow-hidden">
              <div
                ref={whiteLineRef}
                className="dr-w-8 h-[110%] bg-white rounded-full shadow-xs"
              />
              <div className="absolute inset-y-0 w-px left-1/2 -translate-x-1/2 bg-dark-grey" />
            </div>
            <ul className="flex flex-col dr-gap-4 items-start">
              {messages.map((message, idx) => (
                <TimelineItem
                  key={message.id}
                  message={message}
                  visible={idx < messagesVisible}
                  last={idx === messages.length - 1}
                />
              ))}
            </ul>
          </div>
          <CTA>Get Started</CTA>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({
  message,
  visible,
  last,
}: {
  message: (typeof messagesType)[number]
  visible: boolean
  last: boolean
}) {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const showItem = useEffectEvent(() => {
    const tl = gsap.timeline()
    tl.to(
      backgroundRef.current,
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      iconRef.current,
      {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderColor: '#cbe2db',
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      textRef.current,
      {
        clipPath: 'inset(0 0% 0 0)',
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

  const hideItem = useEffectEvent(() => {
    const tl = gsap.timeline()
    tl.to(
      backgroundRef.current,
      {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      backgroundRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      iconRef.current,
      {
        width: '1vw',
        height: '1vw',
        backgroundColor: 'transparent',
        borderColor: '#79B599',
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      textRef.current,
      {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
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
    if (visible) {
      return showItem()
    }
    return hideItem()
  }, [visible])

  return (
    <li className="relative dr-h-84 dr-p-8 flex dr-gap-4">
      <div
        ref={backgroundRef}
        className={cn(
          'absolute inset-0 border border-dark-grey dr-rounded-20',
          last ? 'bg-white' : 'bg-off-white'
        )}
      />
      <div className="relative z-30 h-full aspect-square grid place-items-center">
        <div
          ref={iconRef}
          className={cn(
            'size-full dr-rounded-12 border border-dark-grey',
            last ? 'bg-ghost-mint' : 'bg-light-gray'
          )}
        >
          {/* TODO: Video here */}
        </div>
      </div>
      <div ref={textRef} className="relative z-10 dr-p-4">
        <div className="flex justify-between typo-label-s text-black/70 dr-mb-8">
          <p>
            {'<'}
            {message.tag}
            {'>'}
          </p>
          <p>{'< >'}</p>
        </div>
        <p className="typo-p text-black">{message.message}</p>
      </div>
    </li>
  )
}
