'use client'

// Split GSAP runtimes out of the main bundle and ensure client-only execution
import { GSAP } from './index'

// const ScrollTrigger = dynamic(
//   () => import('./scroll-trigger').then((m) => m.ScrollTrigger),
//   { ssr: false }
// )

export function GSAPRuntime() {
  return (
    <>
      <GSAP />
      {/* <ScrollTrigger /> */}
    </>
  )
}
