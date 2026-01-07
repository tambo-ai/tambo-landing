'use client'

import cn from 'clsx'
import { useRect } from 'hamo'
import { useContext, useImperativeHandle, useRef } from 'react'
import { Kinesis } from '~/components/kinesis'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { mapRange } from '~/libs/utils'
import { DashedBorder } from '../dashed-border'
import s from './background.module.css'
import { BackgroundContext } from './context'

// function BoxShadow({
//   x = 0,
//   y = 0,
//   blur: _blur = 0,
//   opacity: _opacity = 1,
// }: {
//   x?: number
//   y?: number
//   blur?: number
//   opacity?: number
// }) {
//   return (
//     <>
//       <div
//         className={cn('absolute inset-[-5%] rounded-[inherit]', s.boxShadow)}
//         style={{
//           transform: `translate(${x}%, ${y}%)`,
//           // filter: `blur(${blur}px)`,
//           // filter: `blur(${blur}px)`,
//           // opacity: opacity * 2,
//           // backgroundColor: `rgba(127, 255, 195, 1)`,
//           backgroundImage: `radial-gradient(circle at center, rgba(127, 255, 195, 1) 50%, rgba(127, 255, 195, 0) 70%)`,
//         }}
//       />
//       {/* <div
//         className={cn('absolute inset-[-5%] rounded-[inherit]')}
//         style={{
//           transform: `translate(${x}%, ${y}%)`,
//           // filter: `blur(${50}px)`,
//           backgroundImage: `linear-gradient(to top, rgba(127, 255, 195, 1) 50%, rgba(127, 255, 195, 0) 70%)`,
//         }}
//       /> */}
//     </>
//   )
// }

export type BackgroundItemRef = {
  getElement: () => HTMLDivElement | null
  getBoxShadow: () => HTMLDivElement | null
  getGreyBackground: () => HTMLDivElement | null
  setBorderRadius: (borderRadius: string) => void
  setKinesis: (value: number) => void
}

export function BackgroundItem({
  opacity = 1,
  hashed,
  style,
  borderOpacity,
  outerBorder,
  index = 1,
  ref,
}: {
  opacity?: number
  hashed?: boolean
  style?: React.CSSProperties
  borderOpacity?: number
  outerBorder?: boolean
  index?: number
  ref?: React.Ref<BackgroundItemRef>
}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const boxShadowRef = useRef<HTMLDivElement>(null)
  const dashedBorderRef = useRef<SVGRectElement>(null)
  const greyBackgroundRef = useRef<HTMLDivElement>(null)
  const kinesisRef = useRef<number>(1)

  const { dpr, isWindows } = useDeviceDetection()

  useImperativeHandle(ref, () => ({
    getElement: () => elementRef.current,
    getBoxShadow: () => boxShadowRef.current,
    getGreyBackground: () => greyBackgroundRef.current,
    setBorderRadius: (borderRadius: string) => {
      if (elementRef.current) {
        elementRef.current.style.borderRadius = borderRadius
      }
      if (dashedBorderRef.current) {
        dashedBorderRef.current.style.rx = borderRadius
        dashedBorderRef.current.style.ry = borderRadius
      }
    },
    setKinesis: (value: number) => {
      kinesisRef.current = value
    },
  }))

  return (
    <div
      className={cn(
        'absolute rounded-full left-[50%]top-[50%] desktop-only',
        s.item
      )}
      style={style}
      ref={elementRef}
    >
      <Kinesis
        className={cn(
          'absolute inset-0 rounded-[inherit]',
          outerBorder && 'card-outline'
        )}
        getIndex={() => index * kinesisRef.current}
      >
        <div
          className="absolute inset-0 rounded-[inherit] shadow-m"
          ref={boxShadowRef}
        >
          {/* <BoxShadow y={36} blur={231} opacity={0.02} />
        <BoxShadow y={20} blur={195} opacity={0.07} />
        <BoxShadow y={9} blur={145} opacity={0.12} />
        <BoxShadow y={2} blur={79} opacity={0.14} /> */}

          {/* <BoxShadow y={4} blur={56} opacity={0.25} /> */}
        </div>
        <div
          className={cn('absolute inset-0 rounded-[inherit] bg-white')}
          style={{ opacity: opacity }}
        />
        <div
          className={cn('absolute inset-0 rounded-[inherit] bg-light-gray')}
          ref={greyBackgroundRef}
          style={{ opacity: 0 }}
        />
        {hashed && (
          <div
            className={cn(
              'absolute inset-0 rounded-[inherit] opacity-50',
              s.hashed,
              dpr === 1 && s.dpr1
            )}
            style={{ opacity: `${opacity * 0.5}` }}
          />
        )}
        {isWindows ? (
          <DashedBorder
            ref={dashedBorderRef}
            className={cn('absolute inset-0', s.border)}
            style={{
              opacity: borderOpacity,
            }}
          />
        ) : (
          <div
            className={cn(
              'absolute inset-0 rounded-[inherit] border-dashed border-forest border',
              s.border
            )}
            style={{
              opacity: borderOpacity,
            }}
          />
        )}

        {/* <div
        className={cn(
          'absolute inset-0 rounded-[inherit] translate-z-0',
          s.border
        )}
        style={{
          opacity: borderOpacity,
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100%' ry='100%' stroke='%23333' stroke-width='1' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          borderRadius: '100%',
        }}
      /> */}
      </Kinesis>
    </div>
  )
}

export default function Background({
  children,
}: {
  children?: React.ReactNode
}) {
  const itemsRef = useRef<BackgroundItemRef[] | null[]>([])
  const solidBackgroundRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  return (
    <BackgroundContext
      value={{
        getItems: () => itemsRef.current,
        getSolidBackground: () => solidBackgroundRef.current,
        getBackground: () => backgroundRef.current,
      }}
    >
      <div className="fixed inset-0">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          ref={backgroundRef}
        >
          <BackgroundItem
            opacity={0.4}
            borderOpacity={0.1}
            hashed={true}
            ref={(node) => {
              itemsRef.current[0] = node
            }}
            index={6}
          />
          <BackgroundItem
            opacity={0.6}
            borderOpacity={0.2}
            ref={(node) => {
              itemsRef.current[1] = node
            }}
            index={12.5}
          />
          <BackgroundItem
            opacity={0.8}
            borderOpacity={0.3}
            hashed={true}
            ref={(node) => {
              itemsRef.current[2] = node
            }}
            index={25}
          />
          <BackgroundItem
            opacity={1}
            outerBorder
            borderOpacity={0.5}
            ref={(node) => {
              itemsRef.current[3] = node
            }}
            index={50}
          />
        </div>
        <div
          className={cn('absolute inset-0 opacity-0')}
          ref={solidBackgroundRef}
        />
      </div>

      <div className="relative">{children}</div>
    </BackgroundContext>
  )
}

export function SolidBackground({ children }: { children?: React.ReactNode }) {
  const [setRectRef, rect] = useRect()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { getSolidBackground } = useContext(BackgroundContext)

  useScrollTrigger({
    rect,
    start: 'bottom bottom',
    end: 'bottom center',
    onProgress: ({ progress }) => {
      const solidBackground = getSolidBackground()
      if (solidBackground) {
        const r = mapRange(0, 1, progress, 15, 255)
        const g = mapRange(0, 1, progress, 26, 255)
        const b = mapRange(0, 1, progress, 23, 255)
        const bgColor = `rgba(${r}, ${g}, ${b}, ${1})`
        solidBackground.style.backgroundColor = bgColor
      }
    },
  })

  useScrollTrigger({
    rect,
    start: 'top bottom',
    end: 'top center',
    onProgress: ({ progress }) => {
      const solidBackground = getSolidBackground()
      if (solidBackground) {
        const bgColor = `rgba(15, 26, 23, ${progress})`
        solidBackground.style.backgroundColor = bgColor
        solidBackground.style.opacity = '1'
      }
    },
  })

  return (
    <div
      className="relative"
      ref={(el) => {
        setRectRef(el)
        wrapperRef.current = el
      }}
    >
      {children}
    </div>
  )
}
