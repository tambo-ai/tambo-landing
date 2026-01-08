'use client'

import cn from 'clsx'
import { useIntersectionObserver, useRect } from 'hamo'
import { useLenis } from 'lenis/react'
import { useContext, useState } from 'react'
import { BackgroundContext } from '~/app/(pages)/home/_components/background/context'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import { TitleBlock } from '~/app/(pages)/home/_components/title-block'
import PlusIcon from '~/assets/svgs/plus.svg'
import { Button, CTA } from '~/components/button'
import { Image } from '~/components/image'
import { Marquee } from '~/components/marquee'
import { Video } from '~/components/video'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useDesktopVW } from '~/hooks/use-device-values'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { fromTo } from '~/libs/utils'
import { cards, persons } from './data'
import s from './meet-tambo.module.css'

export function MeetTambo() {
  const [openCardTitle, setOpenCardTitle] = useState<string | null>(null)
  const [setRectRef, rect] = useRect()

  const desktopVW = useDesktopVW()

  const { getItems } = useContext(BackgroundContext)

  useScrollTrigger(
    {
      rect,
      start: '0 0',
      end: 'bottom bottom',
      onProgress: ({ progress, isActive }) => {
        if (!isActive) return

        const items = getItems()

        fromTo(
          items,
          {
            width: (index) =>
              desktopVW(1134 + (items.length - 1 - index) * 240, true),
            y: (index) =>
              -desktopVW(225 + (items.length - 1 - index) * 90, true),
          },
          {
            y: 0,
            width: (index) =>
              desktopVW(1134 + (items.length - 1 - index) * 240, true),
          },
          progress,
          {
            ease: 'easeOutSine',
            render: (item, { y, width }) => {
              // @ts-expect-error
              const element = item?.getElement()
              // @ts-expect-error
              item?.setBorderRadius(`${width * 2}px`)

              if (element instanceof HTMLElement) {
                element.style.width = `${width}px`
                element.style.height = `${width}px`
                element.style.transform = `translateY(${y}px)`
              }
            },
          }
        )
      },
    },
    [getItems]
  )

  return (
    <section
      ref={setRectRef}
      className="dt:dr-pt-188 dr-pt-128 dt:dr-pb-204 dr-pb-200"
    >
      <div className="dt:dr-layout-grid px-safe dt:px-0 dr-mb-120 dt:dr-mb-0">
        <TitleBlock className="dr-mb-56  dt:col-start-3 dt:col-end-11">
          <TitleBlock.LeadIn className="dr-mb-16 dt:dr-mb-24">
            {'<'} Meet tambo {'>'}
          </TitleBlock.LeadIn>
          <TitleBlock.Title level="h2" className="mb-0! desktop-only">
            Tambo bridges your app and LLMs,
            <br />
            so you can ship generative UIs faster, <br /> without the
            boilerplate.
          </TitleBlock.Title>
          <TitleBlock.Title level="h2" className="mb-0! mobile-only typo-h1!">
            Tambo bridges your app <br /> and LLMs, so you can ship <br />{' '}
            generative UIs faster, <br /> without the boilerplate.
          </TitleBlock.Title>
        </TitleBlock>
        <div className="flex flex-col dt:flex-row dr-gap-y-12 dt:dr-gap-y-0 justify-center dt:dr-mb-156 dt:col-start-2 dt:col-end-12">
          {cards.map((card) => (
            <Card
              key={card?.title}
              data={card}
              isOpen={openCardTitle === card?.title}
              onToggle={() => {
                setOpenCardTitle(
                  openCardTitle === card?.title ? null : card?.title
                )
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="dr-mb-40">
          <h3 className="dt:typo-h3 typo-h4 dt:dr-mb-8">Bring our vision.</h3>
          <p className="typo-p-l  text-black/70">
            Trusted by industry leaders in AI, product, and engineering.
          </p>
        </div>

        <Marquee
          className={cn('w-full fade-mask', s.marquee)}
          repeat={3}
          speed={0.3}
        >
          <div className="flex dt:dr-gap-x-24 dr-gap-x-12 dt:dr-mr-24 dr-mr-12">
            {persons.map((person) => (
              <PersonCard key={person?.name} person={person} />
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  )
}

type PersonCardProps = {
  person: (typeof persons)[number]
}

function PersonCard({ person }: PersonCardProps) {
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '30%',
    threshold: 0.8,
  })

  const isInViewport = intersection?.isIntersecting

  return (
    <div
      ref={setIntersectionRef}
      className={cn(
        'flex items-center dr-gap-x-32 dr-w-322 border dr-p-8 dt:dr-py-8 dt:dr-pl-8 bg-white border-dark-grey dr-rounded-20',
        s.person,
        isInViewport && s.personInViewport
      )}
    >
      <div className="dr-w-80 dr-h-80 dr-rounded-12 relative overflow-hidden border border-dark-grey">
        <Image src={person?.image} alt={person?.name} fill />
      </div>

      <div className="flex flex-col dr-gap-y-4 text-left">
        <p className="typo-p-bold">{person?.name}</p>
        <span
          className={cn(
            'dr-py-4 dr-px-8 bg-off-white dr-rounded-16 w-fit',
            s.role
          )}
        >
          <p className="typo-label-s">{person?.roles?.join(', ')}</p>
        </span>
      </div>
    </div>
  )
}

type CardProps = {
  data: (typeof cards)[number]
  isOpen: boolean
  onToggle: () => void
}

function Card({ data, isOpen, onToggle }: CardProps) {
  const { isDesktop, isMobile } = useDeviceDetection()
  const lenis = useLenis()

  return (
    <div
      className={cn(
        'relative dt:dr-px-12 dt:first:dr-pl-0 dt:last:dr-pr-0',
        s.cardWrapper
      )}
    >
      <Button
        // href={isDesktop ? data?.button?.href : undefined}
        className={cn(
          'dt:dr-h-420 dr-h-155 shrink-0 dr-p-8 dr-rounded-20 bg-off-white/80 border border-dark-grey flex flex-col relative overflow-hidden',
          isOpen && s.cardOpen,
          s.card
        )}
        onClick={() => {
          if (isMobile) {
            onToggle()
          }

          if (isDesktop || isOpen) {
            lenis?.scrollTo(`#${data?.anchor}`, {
              // duration: 2,
            })
          }
        }}
      >
        <HashPattern
          className={cn(
            'absolute inset-0 text-dark-teal/20 opacity-0',
            s.hashPattern
          )}
        />
        {/* Card Header */}
        <div
          className={cn(
            'w-full h-full bg-white border border-dark-grey dr-rounded-12 dr-p-16 dr-py-12 dt:dr-py-24 flex flex-col items-center relative z-10',
            s.cardHeader
          )}
        >
          <p className={cn('typo-h5', s.cardTitle)}>
            {'< '}
            {data?.title}
            {' >'}
          </p>
          <div
            className={cn(
              'dt:flex-1 dt:grid dt:place-items-center',
              s.cardVideo
            )}
          >
            <div className="aspect-square dt:dr-w-144 dr-w-80">
              <Video
                autoPlay
                priority
                fallback={
                  <Image
                    src={data?.video?.png}
                    alt={data?.title}
                    unoptimized
                    preload
                  />
                }
              >
                <source
                  src={data?.video?.mp4}
                  type='video/mp4; codecs="hvc1"'
                />
                <source src={data?.video?.webm} type="video/webm" />
              </Video>
            </div>
          </div>
          <div
            className={cn(
              'absolute dr-right-4 dr-top-3 dr-size-32 grid place-items-center dr-rounded-8 bg-black mobile-only opacity-0 transition-opacity duration-300',
              s.crossButton
            )}
          >
            <PlusIcon className="dr-size-16" />
          </div>
        </div>
        {/* Card Content */}
        <div
          className={cn(
            'absolute dt:dr-top-135 dr-top-80 dr-left-32 text-teal',
            s.cardContent
          )}
        >
          <p className="typo-p text-center dr-w-258">{data?.text}</p>
        </div>
        {/* Card Bottom */}
        <div
          className={cn(
            'dr-size-32 grid place-items-center dr-rounded-10 bg-mint z-10',
            s.plusButton
          )}
        >
          <PlusIcon className="dr-size-16 icon" />
        </div>
      </Button>
      <CTA
        type="secondary"
        wrapperClassName={s.cardCTA}
        // onClick={() => {
        //   if (isDesktop || isOpen) {
        //     lenis?.scrollTo(`#${data?.anchor}`)
        //   }
        // }}
      >
        {data?.button?.text}
      </CTA>
    </div>
  )
}
