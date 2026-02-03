'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useTempus } from 'tempus/react'

// Defer GSAP setup to reduce TBT - don't block main thread at module load
let gsapInitialized = false

export function GSAP() {
  const initialized = useRef(false)

  // Initialize GSAP on first render, not at module load
  useEffect(() => {
    if (!initialized.current && !gsapInitialized) {
      initialized.current = true
      gsapInitialized = true
      gsap.defaults({ ease: 'none' })
      gsap.ticker.lagSmoothing(0)
      gsap.ticker.remove(gsap.updateRoot)
    }
  }, [])

  useTempus((time) => {
    gsap.updateRoot(time / 1000)
  })

  return null
}
