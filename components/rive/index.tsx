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
  try {
    RuntimeLoader.setWasmUrl('/assets/rive/rive.wasm')
    wasmConfigured = true
  } catch {
    // Silently fail - Rive will use default CDN
  }
}

// Check if WebGL2 is available (Lighthouse's emulated environment may not support it)
function isWebGL2Available(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    return gl !== null
  } catch {
    return false
  }
}

// Check for reduced motion preference
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  const [shouldLoad, setShouldLoad] = useState(false)
  const [canUseWebGL, setCanUseWebGL] = useState(true)

  // Check WebGL2 support and configure WASM on mount
  useEffect(() => {
    // Skip Rive entirely if reduced motion is preferred or WebGL2 unavailable
    if (prefersReducedMotion()) {
      setCanUseWebGL(false)
      return
    }

    if (!isWebGL2Available()) {
      setCanUseWebGL(false)
      return
    }

    ensureWasmConfigured()

    // For non-lazy, start loading immediately
    if (!lazy) {
      setShouldLoad(true)
    }
  }, [lazy])

  // For lazy loading, only load when near viewport
  useEffect(() => {
    if (lazy && canUseWebGL && intersection?.isIntersecting && !shouldLoad) {
      setShouldLoad(true)
    }
  }, [lazy, canUseWebGL, intersection, shouldLoad])

  const { RiveComponent, rive } = useRive(
    shouldLoad && canUseWebGL
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

  // If WebGL2 not available, render nothing (graceful degradation)
  if (!canUseWebGL) {
    return <div ref={setRef} className={cn('relative size-full', className)} />
  }

  return (
    <div ref={setRef} className={cn('relative size-full', className)}>
      <div className="absolute inset-0">
        {shouldLoad && RiveComponent && <RiveComponent className="size-full" />}
      </div>
    </div>
  )
}
