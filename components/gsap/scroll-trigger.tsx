'use client'

import gsap from 'gsap'
import { ScrollTrigger as GSAPScrollTrigger } from 'gsap/all'
import { useLenis } from 'lenis/react'
import { useEffect, useEffectEvent, useRef } from 'react'

// Track if ScrollTrigger has been initialized (deferred to avoid blocking main thread)
let scrollTriggerInitialized = false

function initializeScrollTrigger() {
  if (scrollTriggerInitialized) return
  scrollTriggerInitialized = true

  gsap.registerPlugin(GSAPScrollTrigger)
  GSAPScrollTrigger.clearScrollMemory('manual')
  GSAPScrollTrigger.defaults({
    markers: process.env.NODE_ENV === 'development',
  })
}

// Export for other components to check initialization state
export function isScrollTriggerReady() {
  return scrollTriggerInitialized
}

export function ScrollTrigger() {
  const initialized = useRef(false)

  const handleUpdate = useEffectEvent(() => {
    if (scrollTriggerInitialized) {
      GSAPScrollTrigger.update()
    }
  })

  const handleRefresh = useEffectEvent(() => {
    if (scrollTriggerInitialized) {
      GSAPScrollTrigger.refresh()
    }
  })

  // Defer ScrollTrigger initialization
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Use requestIdleCallback to initialize during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initializeScrollTrigger(), { timeout: 100 })
    } else {
      // Fallback for Safari
      setTimeout(initializeScrollTrigger, 0)
    }
  }, [])

  const lenis = useLenis(handleUpdate)

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleRefresh is useEffectEvent
  useEffect(() => {
    if (lenis && scrollTriggerInitialized) {
      handleRefresh()
    }
  }, [lenis])

  return null
}
