'use client'

import { useEffect } from 'react'
import { Navigation } from '~/app/(pages)/_components/navigation'
import { useStore } from '~/libs/store'

export function BlogNavWrapper() {
  const setHasAppeared = useStore((state) => state.setHasAppeared)

  useEffect(() => {
    setHasAppeared(true)
  }, [setHasAppeared])

  return <Navigation />
}
