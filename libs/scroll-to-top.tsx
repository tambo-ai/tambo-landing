'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ScrollToTop() {
  const pathname = usePathname()

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally scroll on pathname change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
