'use client'

import { useEffect, useRef } from 'react'
import { useMap } from './map-context'

/**
 * Hook that automatically triggers an initial search when a bbox is selected
 * This runs once when a new area is selected, before user asks questions
 */
export function useAutoSearch(enabled = true, initialQuery = 'entertainment') {
  const { mapRef } = useMap()
  const lastBBoxRef = useRef<string | null>(null)
  const hasSearchedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    if (!mapRef.current) return

    const interval = setInterval(() => {
      const bbox = mapRef.current?.getCurrentBBox()

      if (!bbox) {
        // Reset when bbox is cleared
        lastBBoxRef.current = null
        hasSearchedRef.current = false
        return
      }

      // Create a unique key for this bbox (rounded to avoid floating point issues)
      const bboxKey = `${bbox.west.toFixed(4)}-${bbox.east.toFixed(4)}-${bbox.south.toFixed(4)}-${bbox.north.toFixed(4)}`

      // If this is a new bbox and we haven't searched yet, do initial search
      if (bboxKey !== lastBBoxRef.current && !hasSearchedRef.current) {
        lastBBoxRef.current = bboxKey
        hasSearchedRef.current = true

        console.log(
          '🎯 Auto-searching for initial entertainment options:',
          initialQuery
        )

        // Trigger initial search
        mapRef.current?.search(initialQuery).catch((error) => {
          console.error('Auto-search failed:', error)
          // Reset on error so it can retry
          hasSearchedRef.current = false
          lastBBoxRef.current = null
        })
      }
    }, 500) // Check every 500ms (same as bbox polling)

    return () => clearInterval(interval)
  }, [enabled, mapRef, initialQuery])
}
