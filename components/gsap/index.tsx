'use client'

import gsap from 'gsap'
import { useTempus } from 'tempus/react'

gsap.defaults({ ease: 'none' })
gsap.ticker.lagSmoothing(0)
gsap.ticker.remove(gsap.updateRoot)

export function GSAP() {
  useTempus((time) => {
    gsap.updateRoot(time / 1000)
  })

  return null
}
