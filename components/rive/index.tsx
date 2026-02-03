'use client'

import {
  Alignment,
  Fit,
  Layout,
  RuntimeLoader,
  useRive,
} from '@rive-app/react-webgl2'
import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useEffect, useState } from 'react'

// Configure Rive to use self-hosted WASM (avoids CDN latency)
let wasmConfigured = false
function ensureWasmConfigured() {
  if (wasmConfigured) return
  RuntimeLoader.setWasmUrl('/assets/rive/rive.wasm')
  wasmConfigured = true
}

interface RiveWrapperProps {
  className?: string
  src: string
  alignment?: keyof typeof Alignment
  /** If true, delays loading until element is near viewport */
  lazy?: boolean
}

export function RiveWrapper({
  src,
  className,
  alignment = 'Center',
  lazy = false,
}: RiveWrapperProps) {
  const [setRef, intersection] = useIntersectionObserver({
    threshold: lazy ? 0 : 0.3,
    rootMargin: lazy ? '200px' : '0px',
  })
  const [shouldLoad, setShouldLoad] = useState(!lazy)

  // Configure WASM before first render
  useEffect(() => {
    ensureWasmConfigured()
  }, [])

  // For lazy loading, only load when near viewport
  useEffect(() => {
    if (lazy && intersection?.isIntersecting && !shouldLoad) {
      setShouldLoad(true)
    }
  }, [lazy, intersection, shouldLoad])

  const { RiveComponent, rive } = useRive(
    shouldLoad
      ? {
          src,
          autoplay: false,
          stateMachines: 'MainStateMachine',
          autoBind: true,
          layout: new Layout({
            fit: Fit.FitWidth,
            alignment: Alignment[alignment],
          }),
        }
      : null
  )

  useEffect(() => {
    if (intersection?.isIntersecting) {
      rive?.play()
    } else {
      rive?.pause()
    }
  }, [intersection, rive])

  return (
    <div ref={setRef} className={cn('relative size-full', className)}>
      <div className="absolute inset-0">
        {shouldLoad && RiveComponent && (
          <RiveComponent className="size-full" />
        )}
      </div>
    </div>
  )
}
