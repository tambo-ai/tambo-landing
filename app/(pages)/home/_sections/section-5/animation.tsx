import cn from 'clsx'
import gsap from 'gsap'
import {
  type ComponentProps,
  type RefObject,
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  type TimelineCallback,
  TimelineSectionContext,
} from '~/app/(pages)/home/_components/timeline-section'
import Cursor from '~/assets/svgs/cursor.svg'
import { Image } from '~/components/image'
import { mapRangeWithSnap as mapRange } from '~/libs/utils'
import { colors } from '~/styles/colors'
import { SeatMap } from '../section-4/seat-map'
import s from './animation.module.css'

export function Animation() {
  const { addCallback } = use(TimelineSectionContext)

  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const whatCanIDoRef = useRef<HTMLParagraphElement>(null)
  const seatMapRef = useRef<HTMLDivElement>(null)
  const chatBackgroundRef = useRef<HTMLDivElement>(null)
  const chatBorderRef = useRef<HTMLDivElement>(null)
  const thinkingRef = useRef<HTMLDivElement>(null)
  const mapHighlightRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<SVGSVGElement>(null)
  const mapHighlightImageRef = useRef<HTMLImageElement>(null)
  const mapHighlightBackgroundRef = useRef<HTMLDivElement>(null)
  const whatCanIDoBackgroundRef = useRef<HTMLDivElement>(null)
  const whatCanIDoTextRef = useRef<HTMLParagraphElement>(null)
  const thinkingDotsRef = useRef<HTMLDivElement>(null)
  const thinkingTextRef = useRef<HTMLSpanElement>(null)
  const pin1Ref = useRef<SVGSVGElement>(null)
  const dot1Ref = useRef<HTMLDivElement>(null)
  const pin2Ref = useRef<SVGSVGElement>(null)
  const dot2Ref = useRef<HTMLDivElement>(null)
  const pin3Ref = useRef<SVGSVGElement>(null)
  const dot3Ref = useRef<HTMLDivElement>(null)
  const cursorPinRef = useRef<SVGSVGElement>(null)
  const pinAnimateRef = useRef<PinAnimateRef>(null)
  const greatPickTextRef = useRef<HTMLParagraphElement>(null)

  const scrollAnimation = useEffectEvent<TimelineCallback>(({ steps }) => {
    // Elements
    const container = containerRef.current
    const map = mapRef.current
    const chatMessages = chatMessagesRef.current
    const whatCanIDo = whatCanIDoRef.current
    const seatMap = seatMapRef.current
    const chatBackground = chatBackgroundRef.current
    const chatBorder = chatBorderRef.current
    const thinking = thinkingRef.current
    const mapHighlight = mapHighlightRef.current
    const cursor = cursorRef.current
    const mapHighlightImage = mapHighlightImageRef.current
    const mapHighlightBackground = mapHighlightBackgroundRef.current
    const whatCanIDoBackground = whatCanIDoBackgroundRef.current
    const whatCanIDoText = whatCanIDoTextRef.current
    const thinkingDots = thinkingDotsRef.current
    const thinkingText = thinkingTextRef.current
    const pin1 = pin1Ref.current
    const dot1 = dot1Ref.current
    const pin2 = pin2Ref.current
    const dot2 = dot2Ref.current
    const pin3 = pin3Ref.current
    const dot3 = dot3Ref.current
    const cursorPin = cursorPinRef.current
    const pinAnimate = pinAnimateRef.current
    const greatPickText = greatPickTextRef.current

    if (
      !(
        container &&
        map &&
        chatMessages &&
        whatCanIDo &&
        seatMap &&
        chatBackground &&
        chatBorder &&
        thinking &&
        mapHighlight &&
        cursor &&
        mapHighlightImage &&
        mapHighlightBackground &&
        whatCanIDoBackground &&
        whatCanIDoText &&
        thinkingDots &&
        thinkingText &&
        pin1 &&
        dot1 &&
        pin2 &&
        dot2 &&
        pin3 &&
        dot3 &&
        cursorPin &&
        pinAnimate &&
        greatPickText
      )
    )
      return

    const safeZoneProgress = mapRange(0, 0.05, steps[0], 0, 1, true)
    const transitionProgress = mapRange(0.05, 0.15, steps[0], 0, 1, true)
    const introProgress = mapRange(0.15, 0.5, steps[0], 0, 1, true)
    const whatCanIDoProgress = mapRange(0, 0.5, steps[1], 0, 1, true)
    const thinkingProgress = mapRange(0.5, 1, steps[1], 0, 1, true)
    const highlightProgress = mapRange(0, 0.5, steps[2], 0, 1, true)
    const mergeProgress = mapRange(0.5, 1, steps[2], 0, 1, true)
    const activitiesProgress = mapRange(0, 0.5, steps[3], 0, 1, true)
    const hoverPinProgress = mapRange(0.5, 1, steps[3], 0, 1, true)
    const greatPickProgress = mapRange(0, 0.5, steps[4], 0, 1, true)

    // Transition from section 4
    const section45Trans = document.getElementById('section-4-5-trans')
    if (safeZoneProgress === 1 && section45Trans) {
      section45Trans.style.opacity = `${1 - transitionProgress}`
      container.style.opacity = `${transitionProgress}`
    }

    // Intro
    if (transitionProgress === 1) {
      container.style.setProperty('--intro-progress', `${introProgress}`)
      map.style.opacity = `${introProgress}`

      const mapHighlightProgress = mapRange(0.5, 1, introProgress, 0, 1, true)

      cursor.style.opacity = `${mapHighlightProgress}`
      cursor.style.left = `${100 * mapHighlightProgress}%`
      cursor.style.top = `${100 * mapHighlightProgress}%`
      mapHighlight.style.opacity = `${mapHighlightProgress}`
      mapHighlight.style.scale = `${mapHighlightProgress}`
    }

    if (introProgress === 1) {
      chatMessages.style.setProperty(
        '--chat-translate-y',
        `${mapRange(0, 1, whatCanIDoProgress, 0, 148, true)}`
      )
      whatCanIDo.style.opacity = `${mapRange(0.5, 1, whatCanIDoProgress, 0, 1)}`
    }

    if (whatCanIDoProgress === 1) {
      chatMessages.style.setProperty(
        '--chat-translate-y',
        `${mapRange(0, 1, thinkingProgress, 148, 268, true)}`
      )
      seatMap.style.transform = `translateY(${mapRange(0, 1, thinkingProgress, 0, -100)}%)`
      seatMap.style.opacity = `${mapRange(0, 1, thinkingProgress, 1, 0)}`
      mapHighlight.style.backgroundColor = gsap.utils.interpolate(
        '#B6FFDD80',
        '#F2F8F680',
        thinkingProgress
      )
      cursor.style.opacity = `${1 - thinkingProgress}`
    }

    if (thinkingProgress === 1) {
      container.style.setProperty(
        '--highlight-progress',
        `${highlightProgress}`
      )
      map.style.opacity = `${mapRange(0, 1, highlightProgress, 1, 0.3)}`
      whatCanIDoBackground.style.opacity = `${mapRange(0, 1, highlightProgress, 1, 0.3)}`
      whatCanIDoText.style.transform = `translate(${mapRange(0, 1, highlightProgress, 0, -10, true)}%, ${mapRange(0, 1, highlightProgress, 0, -30, true)}%)`
      chatBackground.style.opacity = `${mapRange(0, 1, highlightProgress, 1, 0.3)}`
      chatBorder.style.opacity = `${mapRange(0, 1, highlightProgress, 1, 0.3)}`
      thinking.style.backgroundColor = `rgba(214, 255, 236, ${1 - highlightProgress})`
      mapHighlightImage.style.transform = `translate(${mapRange(0, 1, highlightProgress, 0, -10, true)}%, ${mapRange(0, 1, highlightProgress, 0, -10, true)}%)`
      mapHighlightImage.style.opacity = `${highlightProgress}`
      mapHighlightBackground.style.opacity = `${mapRange(0, 1, highlightProgress, 1, 0.3)}`
    }

    if (highlightProgress === 1) {
      mapHighlightImage.style.transform = `translate(${mapRange(0, 1, mergeProgress, -10, -150, true)}%, ${mapRange(0, 1, mergeProgress, -10, 220, true)}%) scale(${1 - mergeProgress})`
      whatCanIDoText.style.transform = `translate(${mapRange(0, 1, mergeProgress, -10, -280, true)}%, ${mapRange(0, 1, mergeProgress, -30, 170, true)}%) scale(${1 - mergeProgress})`
      thinking.style.transform = `translate(${mapRange(0, 1, mergeProgress, 0, -10, true)}%, ${mapRange(0, 1, mergeProgress, 0, -40, true)}%)`
      thinking.style.backgroundColor = `rgba(214, 255, 236, ${mergeProgress})`
      map.style.opacity = `${mapRange(0, 1, mergeProgress, 0.3, 1)}`
      mapHighlightBackground.style.opacity = `${mapRange(0, 1, mergeProgress, 0.3, 0)}`
      mapHighlight.style.backgroundColor = gsap.utils.interpolate(
        '#F2F8F680',
        '#F2F8F600',
        mergeProgress
      )
    }

    if (mergeProgress === 1) {
      container.style.setProperty(
        '--highlight-progress',
        `${1 - activitiesProgress}`
      )
      thinking.style.transform = `translate(${mapRange(0, 1, activitiesProgress, -10, 0, true)}%, ${mapRange(0, 1, activitiesProgress, -40, 0, true)}%)`
      thinking.style.backgroundColor = gsap.utils.interpolate(
        colors['ghost-mint'],
        colors['light-gray'],
        activitiesProgress
      )
      thinkingDots.style.opacity = `${mapRange(0, 0.6, activitiesProgress, 1, 0)}`
      container.style.setProperty(
        '--activities-progress',
        `${mapRange(0, 0.6, activitiesProgress, 0, 1, true)}`
      )
      thinkingText.style.opacity = `${mapRange(0.5, 1, activitiesProgress, 0, 1)}`
      dot1.style.scale = `${100 * activitiesProgress}% ${100 * activitiesProgress}%`
      pin1.style.opacity = `${activitiesProgress}`
      pin1.style.translate = `0 ${-300 * (1 - activitiesProgress)}%`
      dot2.style.scale = `${100 * activitiesProgress}% ${100 * activitiesProgress}%`
      pin2.style.opacity = `${activitiesProgress}`
      pin2.style.translate = `0 ${-300 * (1 - activitiesProgress)}%`
      dot3.style.scale = `${100 * activitiesProgress}% ${100 * activitiesProgress}%`
      pin3.style.opacity = `${activitiesProgress}`
      pin3.style.translate = `0 ${-300 * (1 - activitiesProgress)}%`
    }

    if (activitiesProgress === 1) {
      cursorPin.style.opacity = `${hoverPinProgress}`
      cursorPin.style.transform = `translate(${1000 * (1 - hoverPinProgress)}%, ${-200 * (1 - hoverPinProgress)}%)`
      pinAnimate.animateDetail(hoverPinProgress)
    }

    if (hoverPinProgress === 1) {
      chatMessages.style.setProperty(
        '--chat-translate-y',
        `${mapRange(0, 1, greatPickProgress, 268, 344, true)}`
      )
      cursorPin.style.opacity = `${1 - greatPickProgress}`
      cursorPin.style.transform = `translate(${1000 * greatPickProgress}%, ${200 * greatPickProgress}%)`
      greatPickText.style.opacity = `${greatPickProgress}`
    }
  })

  useEffect(() => {
    addCallback(scrollAnimation)
  }, [addCallback])

  return (
    <>
      <div
        id="section-4-5-trans"
        className={cn(
          'fixed top-1/2 -translate-y-1/2 dr-w-670 dr-h-470 z-50 opacity-0 pointer-events-none',
          s.section45Trans
        )}
      >
        <div className="absolute inset-0 bg-white -z-1 dr-rounded-20 shadow-m border border-forest/50 dr-p-14 dr-gap-20 flex flex-col items-start justify-end">
          <SeatMap selected />
          <p className="typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey">
            Window seat confirmed. Booking 12F!
          </p>
        </div>
        <div className="absolute -inset-[6px] bg-white/80 -z-2 dr-rounded-26" />
      </div>
      <div ref={containerRef} className={cn('w-full', s.container)}>
        <div className={cn('relative w-full shadow-m -z-3', s.map)}>
          <div ref={mapRef} className="relative size-full">
            <Image
              src="/images/map.png"
              alt="Map of Boston"
              className="absolute inset-0 object-cover dr-rounded-20 overflow-hidden dashed-border shadow-m"
              fill
            />
            <Pin
              className="absolute dr-left-394 dr-top-76"
              pinRef={pin1Ref}
              dotRef={dot1Ref}
            />
            <Pin
              className="absolute dr-left-480 dr-top-154"
              pinRef={pin2Ref}
              dotRef={dot2Ref}
            />
            <Pin
              className="absolute dr-left-330 dr-top-220"
              pinRef={pin3Ref}
              dotRef={dot3Ref}
              animateRef={pinAnimateRef}
            />
            <Cursor
              ref={cursorPinRef}
              className="absolute dr-left-330 dr-top-220 opacity-0 dr-size-24 translate-full"
            />
            <div className="absolute -inset-[6px] bg-white/80 -z-2 dr-rounded-26" />
          </div>

          <div className="absolute dr-left-320 dr-top-88 dr-w-274 dr-h-190 z-10">
            <div
              ref={mapHighlightRef}
              className="relative size-full origin-top-left z-10"
            >
              <div
                ref={mapHighlightBackgroundRef}
                className="size-full relative bg-[#B6FFDD]/50 border-2 border-forest/50 dr-rounded-12"
              />
              <Image
                ref={mapHighlightImageRef}
                src="/images/map.png"
                alt="Map of Boston"
                objectFit="none"
                fill
                className="object-[82.6%_58.4%] scale-106 opacity-0 dr-rounded-12 border-2 border-forest/50"
              />
            </div>
            <Cursor
              ref={cursorRef}
              className="absolute left-full top-full dr-size-24 -translate-1/3"
            />
          </div>
        </div>
        <div className={cn('relative w-full', s.chat)}>
          <div
            ref={chatBackgroundRef}
            className="absolute inset-0 bg-white -z-1 dr-rounded-20 shadow-m"
          />
          <div
            ref={chatBorderRef}
            className="absolute -inset-[6px] bg-white/80 -z-2 dr-rounded-26"
          />
          <div className="size-full overflow-hidden dr-p-14 dashed-border dr-rounded-20">
            <div
              ref={chatMessagesRef}
              className={cn(
                'size-full flex flex-col justify-end ',
                s.chatMessages
              )}
            >
              <div
                ref={seatMapRef}
                className="self-start flex flex-col items-start justify-end dr-gap-20"
              >
                <SeatMap selected />
                <p className="typo-p-sentient bg-light-gray dr-rounded-12 dr-p-24 border border-dark-grey">
                  Window seat confirmed. Booking 12F!
                </p>
              </div>
              <div
                ref={whatCanIDoRef}
                className="relative typo-p self-end dr-mt-78 opacity-0"
              >
                <div
                  ref={whatCanIDoBackgroundRef}
                  className="absolute inset-0 bg-ghost-mint dr-rounded-12 dr-p-24 border border-dark-grey"
                />
                <p
                  ref={whatCanIDoTextRef}
                  className="bg-ghost-mint dr-rounded-12 dr-p-24 border border-dark-grey"
                >
                  What can I do here?
                </p>
              </div>
              <div className="self-start dr-mt-14">
                <div className="dr-w-306 dr-h-32 border border-grey rounded-full dr-mb-9" />
                <div
                  ref={thinkingRef}
                  className={cn(
                    'dr-rounded-12 bg-ghost-mint border border-dark-grey flex dr-h-67 justify-center items-center',
                    s.thinking
                  )}
                >
                  <div ref={thinkingDotsRef} className="flex dr-gap-4">
                    <div className="dr-size-4 rounded-full bg-black" />
                    <div className="dr-size-4 rounded-full bg-black" />
                    <div className="dr-size-4 rounded-full bg-black" />
                  </div>
                  <span
                    ref={thinkingTextRef}
                    className="absolute typo-p-sentient opacity-0"
                  >
                    Here are the best-rated activities in that area !
                  </span>
                </div>
              </div>
              <p
                ref={greatPickTextRef}
                className="absolute top-full dr-rounded-12 bg-light-gray border border-dark-grey flex dr-h-67 justify-center items-center typo-p-sentient self-start dr-mt-8 dr-px-24 opacity-0"
              >
                Great pick for a history buff.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

type PinAnimateRef = {
  animateDetail: (progress: number) => void
}

type PinProps = ComponentProps<'div'> & {
  pinRef?: RefObject<SVGSVGElement | null>
  dotRef?: RefObject<HTMLDivElement | null>
  animateRef?: RefObject<PinAnimateRef | null>
}

function Pin({ className, pinRef, dotRef, animateRef, ...props }: PinProps) {
  const detailBackgroundRef = useRef<HTMLDivElement>(null)
  const detailTextRef = useRef<HTMLParagraphElement>(null)

  const animateDetail = useCallback((progress: number) => {
    if (
      !(detailBackgroundRef.current && detailTextRef.current && dotRef?.current)
    )
      return
    detailBackgroundRef.current.style.opacity = `${progress}`
    detailBackgroundRef.current.style.clipPath = `inset(0% ${50 * (1 - progress)}% 0% ${50 * (1 - progress)}% round 100px)`
    detailTextRef.current.style.opacity = `${progress}`
    dotRef.current.style.opacity = `${1 - progress}`
  }, [])

  useImperativeHandle(
    animateRef,
    () => ({
      animateDetail,
    }),
    [animateDetail]
  )

  return (
    <div
      className={cn('flex flex-col items-center dr-gap-3', className)}
      {...props}
    >
      <svg
        ref={pinRef}
        className="dr-w-40 shadow-xs -translate-y-[300%] opacity-0"
        viewBox="0 0 40 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Pin</title>
        <path
          d="M20 4C15.758 4.00481 11.6911 5.69207 8.69161 8.69161C5.69207 11.6911 4.00481 15.758 4 20C4 33.6909 18.5455 44.0309 19.1655 44.4636C19.41 44.635 19.7014 44.8633 20 44.8633C20.2986 44.8633 20.59 44.635 20.8345 44.4636C21.4545 44.0309 36 33.6909 36 20C35.9952 15.758 34.3079 11.6911 31.3084 8.69161C28.3089 5.69207 24.242 4.00481 20 4ZM20 14.1818C21.1507 14.1818 22.2756 14.523 23.2324 15.1624C24.1892 15.8017 24.9349 16.7103 25.3753 17.7735C25.8157 18.8366 25.9309 20.0065 25.7064 21.1351C25.4819 22.2637 24.9278 23.3004 24.1141 24.1141C23.3004 24.9278 22.2637 25.4819 21.1351 25.7064C20.0065 25.9309 18.8366 25.8157 17.7735 25.3753C16.7103 24.9349 15.8017 24.1892 15.1624 23.2324C14.523 22.2756 14.1818 21.1507 14.1818 20C14.1818 18.4569 14.7948 16.977 15.8859 15.8859C16.977 14.7948 18.4569 14.1818 20 14.1818Z"
          fill="#D9D9D9"
        />
        <path
          d="M36 20C35.9953 15.8905 34.412 11.9452 31.5859 8.97559L31.3086 8.69141C28.3091 5.69187 24.242 4.00481 20 4C15.758 4.00481 11.6909 5.69187 8.69141 8.69141C5.69187 11.6909 4.00481 15.758 4 20L4.01074 20.6396C4.45155 34.0105 18.5523 44.0362 19.165 44.4639C19.4096 44.6352 19.7014 44.8633 20 44.8633C20.2986 44.8633 20.5904 44.6352 20.835 44.4639C21.4477 44.0362 35.5484 34.0106 35.9893 20.6396L36 20ZM20 14.1816C21.1507 14.1816 22.2756 14.5228 23.2324 15.1621C24.1892 15.8014 24.9346 16.7104 25.375 17.7734C25.8153 18.8365 25.9305 20.0062 25.7061 21.1348C25.4816 22.2634 24.9279 23.3006 24.1143 24.1143L23.959 24.2637C23.1705 24.9958 22.1928 25.4956 21.1348 25.7061C20.0062 25.9305 18.8365 25.8153 17.7734 25.375C16.7767 24.9621 15.9156 24.2811 15.2852 23.4092L15.1621 23.2324C14.5629 22.3356 14.2254 21.2909 14.1855 20.2158L14.1816 20C14.1816 18.4569 14.7946 16.9769 15.8857 15.8857C16.9769 14.7946 18.4569 14.1816 20 14.1816ZM18.1816 20C18.1816 20.3595 18.2886 20.7108 18.4883 21.0098C18.6881 21.3088 18.9725 21.5421 19.3047 21.6797C19.6368 21.8171 20.002 21.8533 20.3545 21.7832C20.7072 21.713 21.0319 21.5404 21.2861 21.2861C21.5404 21.0319 21.713 20.7072 21.7832 20.3545C21.8533 20.002 21.8171 19.6368 21.6797 19.3047C21.5421 18.9725 21.3088 18.6881 21.0098 18.4883C20.7108 18.2886 20.3595 18.1816 20 18.1816C19.5178 18.1816 19.0548 18.3729 18.7139 18.7139C18.3729 19.0548 18.1816 19.5178 18.1816 20ZM40 20C40 28.2407 35.6578 35.1557 31.6924 39.8008C27.6866 44.4932 23.608 47.4044 23.1289 47.7393C23.11 47.7525 23.0969 47.7627 23.0527 47.7939C23.0165 47.8196 22.9636 47.8568 22.9043 47.8975C22.7888 47.9766 22.6073 48.0972 22.3857 48.2207C21.9935 48.4395 21.1393 48.8633 20 48.8633C18.8607 48.8633 18.0065 48.4395 17.6143 48.2207C17.3927 48.0972 17.2112 47.9766 17.0957 47.8975C17.0364 47.8568 16.9835 47.8196 16.9473 47.7939C16.903 47.7626 16.8891 47.7535 16.8701 47.7402V47.7393C16.3879 47.4022 12.3116 44.4911 8.30762 39.8008C4.34224 35.1557 3.3503e-07 28.2407 0 20V19.9951L0.00683594 19.499C0.139559 14.3778 2.23188 9.49468 5.86328 5.86328C9.61177 2.11479 14.694 0.00610505 19.9951 0H20.0049L20.501 0.00683594C25.6222 0.139559 30.5053 2.23188 34.1367 5.86328C37.8852 9.61177 39.9939 14.694 40 19.9951V20Z"
          fill="white"
          fillOpacity="0.8"
        />
        <path
          d="M20 4C15.758 4.00481 11.6911 5.69207 8.69161 8.69161C5.69207 11.6911 4.00481 15.758 4 20C4 33.6909 18.5455 44.0309 19.1655 44.4636C19.41 44.635 19.7014 44.8633 20 44.8633C20.2986 44.8633 20.59 44.635 20.8345 44.4636C21.4545 44.0309 36 33.6909 36 20C35.9952 15.758 34.3079 11.6911 31.3084 8.69161C28.3089 5.69207 24.242 4.00481 20 4ZM20 14.1818C21.1507 14.1818 22.2756 14.523 23.2324 15.1624C24.1892 15.8017 24.9349 16.7103 25.3753 17.7735C25.8157 18.8366 25.9309 20.0065 25.7064 21.1351C25.4819 22.2637 24.9278 23.3004 24.1141 24.1141C23.3004 24.9278 22.2637 25.4819 21.1351 25.7064C20.0065 25.9309 18.8366 25.8157 17.7735 25.3753C16.7103 24.9349 15.8017 24.1892 15.1624 23.2324C14.523 22.2756 14.1818 21.1507 14.1818 20C14.1818 18.4569 14.7948 16.977 15.8859 15.8859C16.977 14.7948 18.4569 14.1818 20 14.1818Z"
          fill="#7FFFC3"
        />
        <path
          d="M20 4C24.242 4.00481 28.3091 5.69187 31.3086 8.69141C34.3081 11.6909 35.9952 15.758 36 20L35.9893 20.6396C35.5484 34.0106 21.4477 44.0362 20.835 44.4639C20.5904 44.6352 20.2986 44.8633 20 44.8633C19.7014 44.8633 19.4096 44.6352 19.165 44.4639C18.5523 44.0362 4.45155 34.0105 4.01074 20.6396L4 20C4.00481 15.758 5.69187 11.6909 8.69141 8.69141C11.6909 5.69187 15.758 4.00481 20 4ZM20 5C16.0232 5.00481 12.2105 6.58642 9.39844 9.39844C6.58619 12.2107 5.00455 16.0239 5 20.001C5.00035 26.4972 8.45957 32.2781 12.1104 36.5547C15.7457 40.8132 19.4601 43.4501 19.7373 43.6436L19.7393 43.6445C19.7726 43.6679 19.8081 43.6935 19.8369 43.7139C19.8678 43.7358 19.8962 43.7552 19.9229 43.7734C19.9519 43.7933 19.9779 43.8084 20 43.8223C20.0221 43.8084 20.0481 43.7933 20.0771 43.7734C20.1038 43.7552 20.1322 43.7358 20.1631 43.7139C20.1919 43.6935 20.2274 43.6679 20.2607 43.6445L20.2627 43.6436C20.5399 43.4501 24.2543 40.8132 27.8896 36.5547C31.5404 32.2781 34.9997 26.4972 35 20.001C34.9954 16.0239 33.4138 12.2107 30.6016 9.39844C27.7895 6.58642 23.9768 5.00481 20 5ZM20 13.1816C21.3485 13.1816 22.6668 13.5819 23.7881 14.3311C24.9092 15.0802 25.7828 16.1449 26.2988 17.3906C26.8149 18.6364 26.9505 20.0075 26.6875 21.3301C26.4244 22.6527 25.7748 23.8678 24.8213 24.8213C23.8677 25.7748 22.6527 26.4244 21.3301 26.6875C20.0075 26.9505 18.6364 26.8149 17.3906 26.2988C16.1449 25.7828 15.0802 24.9092 14.3311 23.7881C13.5819 22.6668 13.1816 21.3485 13.1816 20C13.1816 18.1917 13.9001 16.4574 15.1787 15.1787C16.4574 13.9001 18.1917 13.1816 20 13.1816ZM14.1855 20.2158C14.2254 21.2909 14.5629 22.3356 15.1621 23.2324C15.8014 24.1892 16.7104 24.9346 17.7734 25.375C18.8365 25.8153 20.0062 25.9305 21.1348 25.7061C22.1928 25.4956 23.1705 24.9958 23.959 24.2637L24.1143 24.1143C24.9279 23.3006 25.4816 22.2634 25.7061 21.1348C25.9305 20.0062 25.8153 18.8365 25.375 17.7734C24.9621 16.7767 24.2811 15.9156 23.4092 15.2852L23.2324 15.1621C22.2756 14.5228 21.1507 14.1816 20 14.1816C18.4569 14.1816 16.9769 14.7946 15.8857 15.8857C14.7946 16.9769 14.1816 18.4569 14.1816 20L14.1855 20.2158Z"
          fill="#80C1A2"
        />
      </svg>
      <div className="relative">
        <div
          ref={dotRef}
          className="dr-w-20 dr-h-20 dr-p-2 bg-white rounded-full border border-dark-teal shadow-xs scale-0"
        >
          <div className="size-full bg-black rounded-full" />
        </div>
        <div
          ref={detailBackgroundRef}
          style={{ clipPath: 'inset(0% 50% 0% 50% round 100px)' }}
          className="absolute top-0 left-1/2 -translate-x-1/2 dr-h-20 dr-w-142 rounded-full bg-black dr-p-2 dr-pl-8 text-teal flex items-center justify-between opacity-0"
        >
          <p
            ref={detailTextRef}
            className="typo-label-s whitespace-nowrap opacity-0"
          >
            FREEDOM TRAIL TOUR
          </p>
          <div className="h-full aspect-square rounded-full bg-teal" />
        </div>
      </div>
    </div>
  )
}
