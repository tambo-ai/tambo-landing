'use client'

import cn from 'clsx'
import { useImperativeHandle, useRef } from 'react'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import s from './background.module.css'
import { BackgroundContext } from './context'

function BoxShadow({
  x = 0,
  y = 0,
  blur = 0,
  opacity = 1,
}: {
  x?: number
  y?: number
  blur?: number
  opacity?: number
}) {
  return (
    <div
      className={cn('absolute inset-[-5%] rounded-[inherit]', s.boxShadow)}
      style={{
        transform: `translate(${x}%, ${y}%)`,
        // filter: `blur(${blur}px)`,
        // filter: `blur(${blur}px)`,
        // opacity: opacity * 2,
        // backgroundColor: `rgba(127, 255, 195, 1)`,
        backgroundImage: `radial-gradient(circle at center, rgba(127, 255, 195, 1) 50%, rgba(127, 255, 195, 0) 70%)`,
      }}
    />
  )
}

export type BackgroundItemRef = {
  getElement: () => HTMLDivElement | null
  getBoxShadow: () => HTMLDivElement | null
}

export function BackgroundItem({
  opacity,
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
  ref?: React.Ref<BackgroundItemRef>
}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const boxShadowRef = useRef<HTMLDivElement>(null)

  const { dpr } = useDeviceDetection()
  //   const backgroundItemRef = useRef<BackgroundItemRef>()

  useImperativeHandle(ref, () => ({
    getElement: () => elementRef.current,
    getBoxShadow: () => boxShadowRef.current,
  }))

  return (
    <div
      className={cn(
        'absolute aspect-[1/1] rounded-full left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]',
        s.item
      )}
      style={style}
      ref={elementRef}
    >
      <div className="absolute inset-0 rounded-[inherit]" ref={boxShadowRef}>
        {/* <BoxShadow y={36} blur={231} opacity={0.02} />
        <BoxShadow y={20} blur={195} opacity={0.07} />
        <BoxShadow y={9} blur={145} opacity={0.12} />
        <BoxShadow y={2} blur={79} opacity={0.14} /> */}

        <BoxShadow y={4} blur={56} opacity={0.25} />
      </div>
      <div
        className={cn(
          'absolute inset-0 rounded-[inherit] bg-[white]',
          s.opacity
        )}
        style={{ opacity: opacity }}
      />
      {hashed && (
        <div
          className={cn(
            'absolute inset-0 rounded-[inherit] opacity-50',
            s.hashed,
            dpr === 1 && s.dpr1
          )}
          style={{ opacity: opacity }}
        />
      )}
      {outerBorder && (
        <div
          className="absolute inset-[-10] rounded-[inherit] border-solid border-[#ffffff] border-10"
          style={{
            opacity: borderOpacity,
          }}
        />
      )}
      <div
        className={cn(
          'absolute inset-0 rounded-[inherit] border border-[#008346] border-1',
          s.border
        )}
        style={{
          opacity: borderOpacity,
        }}
      />
    </div>
  )
}

export default function Background({
  children,
}: {
  children?: React.ReactNode
}) {
  const itemsRef = useRef<BackgroundItemRef[] | null[]>([])

  return (
    <BackgroundContext
      value={{
        getItems: () => itemsRef.current,
      }}
    >
      <div className="fixed inset-0 -z-1">
        <div className="absolute inset-0">
          <BackgroundItem
            opacity={0.4}
            borderOpacity={0.1}
            hashed={true}
            // style={{ height: '80%' }}
            ref={(node) => {
              itemsRef.current[0] = node
            }}
          />
          <BackgroundItem
            opacity={0.6}
            borderOpacity={0.2}
            // style={{ height: '70%' }}
            ref={(node) => {
              itemsRef.current[1] = node
            }}
          />
          <BackgroundItem
            opacity={0.8}
            borderOpacity={0.3}
            hashed={true}
            // style={{ height: '60%' }}
            ref={(node) => {
              itemsRef.current[2] = node
            }}
          />
          <BackgroundItem
            opacity={1}
            outerBorder
            borderOpacity={0.5}
            // style={{ height: '50%' }}
            ref={(node) => {
              itemsRef.current[3] = node
            }}
          />

          {/* <BackgroundItem />
        <BackgroundItem />
        <BackgroundItem /> */}
        </div>
      </div>
      {children}
    </BackgroundContext>
  )
}
