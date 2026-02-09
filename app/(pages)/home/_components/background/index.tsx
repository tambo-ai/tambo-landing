'use client'

import cn from 'clsx'
import { useImperativeHandle, useRef } from 'react'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { DashedBorder } from '../dashed-border'
import s from './background.module.css'

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

  const { dpr, isSafari } = useDeviceDetection()

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
      <div
        className={cn(
          'absolute inset-0 rounded-[inherit]',
          outerBorder && 'card-outline'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 rounded-[inherit] shadow-m',
            isSafari && 'will-change-transform'
          )}
          ref={boxShadowRef}
        />

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
        <DashedBorder
          ref={dashedBorderRef}
          className={cn('absolute inset-0', s.border)}
          style={{
            opacity: borderOpacity,
          }}
        />
      </div>
    </div>
  )
}

export type BackgroundRefType = {
  getItems: () => BackgroundItemRef[] | null[]
  getElement: () => HTMLDivElement | null
}

export default function Background({
  className,
  ref,
}: {
  className?: string
  ref?: React.Ref<BackgroundRefType>
}) {
  const itemsRef = useRef<BackgroundItemRef[] | null[]>([])
  const solidBackgroundRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getItems: () => itemsRef.current,
    getElement: () => elementRef.current,
  }))

  return (
    <div className={cn('desktop-only', className)} ref={elementRef}>
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
          // Values comming from older intro animation
          style={{
            width: 'calc(1854 / 1440 * 100vw)',
            height: 'calc(1854 / 1440 * 100vw)',
            transform: 'translateY(calc(-495 / 1440 * 100vw))',
          }}
        />
        <BackgroundItem
          opacity={0.6}
          borderOpacity={0.2}
          ref={(node) => {
            itemsRef.current[1] = node
          }}
          index={12.5}
          style={{
            width: 'calc(1614 / 1440 * 100vw)',
            height: 'calc(1614 / 1440 * 100vw)',
            transform: 'translateY(calc(-405 / 1440 * 100vw))',
          }}
        />
        <BackgroundItem
          opacity={0.8}
          borderOpacity={0.3}
          hashed={true}
          ref={(node) => {
            itemsRef.current[2] = node
          }}
          index={25}
          style={{
            width: 'calc(1374 / 1440 * 100vw)',
            height: 'calc(1374 / 1440 * 100vw)',
            transform: 'translateY(calc(-315 / 1440 * 100vw))',
          }}
        />
        <BackgroundItem
          opacity={1}
          outerBorder
          borderOpacity={0.5}
          ref={(node) => {
            itemsRef.current[3] = node
          }}
          index={50}
          style={{
            width: 'calc(1134 / 1440 * 100vw)',
            height: 'calc(1134 / 1440 * 100vw)',
            transform: 'translateY(calc(-225 / 1440 * 100vw))',
          }}
        />
      </div>
      <div
        className={cn('absolute inset-0 opacity-0')}
        ref={solidBackgroundRef}
      />
    </div>
  )
}
