'use client'

import type { LenisOptions } from 'lenis'
import 'lenis/dist/lenis.css'
import type { LenisRef, LenisProps as ReactLenisProps } from 'lenis/react'
import { ReactLenis, useLenis } from 'lenis/react'
import Snap from 'lenis/snap'
import { useEffect, useRef } from 'react'
import { useTempus } from 'tempus/react'
import { useStore } from '~/libs/store'

interface LenisProps extends Omit<ReactLenisProps, 'ref'> {
  root: boolean
  options: LenisOptions
}

export function Lenis({ root, options }: LenisProps) {
  const lenisRef = useRef<LenisRef>(null)
  const snapRef = useRef<Snap | null>(null)
  const setLenisSnap = useStore((state) => state.setLenisSnap)
  const isNavOpened = useStore((state) => state.isNavOpened)
  const isMobileNavOpened = useStore((state) => state.isMobileNavOpened)
  const hasAppeared = useStore((state) => state.hasAppeared)

  useTempus((time: number) => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.raf(time)
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle(
      'overflow-hidden',
      isNavOpened ||
        isMobileNavOpened ||
        (process.env.NODE_ENV === 'development' ? false : !hasAppeared)
    )
  }, [isNavOpened, isMobileNavOpened, hasAppeared])

  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const snap = new Snap(lenis, {
      type: 'lock',
      lerp: 0.05,
      debounce: 150,
    })
    snapRef.current = snap
    setLenisSnap(snap)

    return () => {
      snap.destroy()
      snapRef.current = null
      setLenisSnap(null)
    }
  }, [lenis, setLenisSnap])

  return (
    <ReactLenis
      ref={lenisRef}
      root={root}
      options={{
        ...options,
        lerp: options?.lerp ?? 0.125,
        autoRaf: false,
        anchors: {
          offset: -70,
        },
        autoToggle: true,
        prevent: (node: Element | null) =>
          node?.nodeName === 'VERCEL-LIVE-FEEDBACK' ||
          node?.id === 'theatrejs-studio-root',
      }}
    />
  )
}
