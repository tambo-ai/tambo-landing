'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useTempus } from 'tempus/react'

// Track if GSAP has been initialized (deferred to avoid blocking main thread)
let gsapInitialized = false

function initializeGSAP() {
  if (gsapInitialized) return
  gsapInitialized = true

  gsap.defaults({ ease: 'none' })
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)
}

export function GSAP() {
  const initialized = useRef(false)

  // Defer GSAP initialization to after first paint
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Use requestIdleCallback to initialize during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initializeGSAP(), { timeout: 100 })
    } else {
      // Fallback for Safari
      setTimeout(initializeGSAP, 0)
    }
  }, [])

  useTempus((time) => {
    if (gsapInitialized) {
      gsap.updateRoot(time / 1000)
    }
  })

  return null
}
