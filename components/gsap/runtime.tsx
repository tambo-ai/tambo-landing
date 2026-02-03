'use client'

// Split GSAP runtimes out of the main bundle and ensure client-only execution
import { GSAP } from './index'

export function GSAPRuntime() {
  return <GSAP />
}
