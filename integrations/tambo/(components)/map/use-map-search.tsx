'use client'

import { useTambo } from '@tambo-ai/react'
import { useEffect, useRef } from 'react'
import { getSafeContent } from '@/lib/thread-hooks'
import { useMap } from './map-context'

/**
 * Hook that listens to user messages and triggers map searches
 * when a query is detected and a bbox is available
 */
export function useMapSearch(contextKey?: string) {
  const { thread } = useTambo()
  const { mapRef } = useMap()
  const lastMessageIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Only process if we have a thread
    if (!thread) {
      return
    }

    const messages = thread.messages ?? []

    // Get the latest user message
    const userMessages = messages.filter((m) => m.role === 'user')
    const latestMessage = userMessages[userMessages.length - 1]

    if (!latestMessage || latestMessage.id === lastMessageIdRef.current) {
      return
    }

    // Skip if no bbox is available
    const bbox = mapRef.current?.getCurrentBBox()
    if (!bbox) {
      console.log(
        '📍 No bbox selected - please draw a rectangle on the map first'
      )
      return
    }

    // Extract query from message content using helper function
    const safeContent = getSafeContent(latestMessage.content)
    const queryText = typeof safeContent === 'string' ? safeContent.trim() : ''

    if (queryText) {
      // Mark this message as processed
      lastMessageIdRef.current = latestMessage.id

      // Normalize query - extract meaningful search terms
      let searchQuery = queryText.toLowerCase()

      // If user asks for "more places" or similar, use a broader search
      if (
        searchQuery.includes('more places') ||
        searchQuery.includes('more options') ||
        searchQuery.includes('show me more') ||
        searchQuery.includes('other places') ||
        searchQuery.includes('more things') ||
        searchQuery.includes('more')
      ) {
        searchQuery = 'entertainment'
      }

      console.log('🔍 Triggering map search for query:', searchQuery)

      // Trigger search
      mapRef.current?.search(searchQuery).catch((error) => {
        console.error('Map search failed:', error)
      })
    }
  }, [thread, mapRef])
}
