'use client'

import { useTamboContextHelpers, useTamboThread } from '@tambo-ai/react'
import { useEffect, useState } from 'react'
import { DEMOS } from '~/integrations/tambo/constants'
import { useAssitant } from '../..'
import { mapExampleContext } from '../context'
import { MessageThreadCollapsible } from '../ui-tambo/message-thread-collapsible'
import { useMap } from './map-context'
import { useAutoSearch } from './use-auto-search'
import { useMapSearch } from './use-map-search'

const introMessages = {
  map: 'While your waiting for your flight, you can search for entrainment options in your destination, do you want me to help you?',
}

const demo = DEMOS.MAP

export function MapAssistant() {
  const { selectedDemo } = useAssitant()
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers()
  const { thread, addThreadMessage } = useTamboThread()
  const { mapRef } = useMap()
  const [currentBBox, setCurrentBBox] = useState<{
    west: number
    east: number
    south: number
    north: number
  } | null>(null)

  // Auto-search for entertainment when area is selected
  useAutoSearch(selectedDemo === demo, 'entertainment')

  // Enable map search - pass contextKey to listen to correct thread (for user queries)
  useMapSearch(selectedDemo)

  // Poll for bbox changes to update context helper
  useEffect(() => {
    if (selectedDemo !== demo || !mapRef.current) return

    const interval = setInterval(() => {
      const bbox = mapRef.current?.getCurrentBBox()
      if (bbox) {
        setCurrentBBox(bbox)
      } else {
        setCurrentBBox(null)
      }
    }, 500) // Check every 500ms

    return () => clearInterval(interval)
  }, [selectedDemo, mapRef])

  useEffect(() => {
    if (selectedDemo === demo) {
      addContextHelper(
        'assistantBehavior',
        () =>
          `## Role\n${mapExampleContext.objective}\n\n## Instructions\n${mapExampleContext.instructions}`
      )

      // Add dynamic map context - updates when map state changes
      // This context helper is called by Tambo when generating responses, so it always gets the latest state
      addContextHelper('mapState', () => {
        // Always get fresh bbox when Tambo asks for context (not cached)
        const bbox = mapRef.current?.getCurrentBBox() || currentBBox
        if (!bbox) {
          return `The map is currently showing New York City, NY (default location). 

IMPORTANT: No area has been selected yet. The user needs to draw a rectangle on the map to select an area before you can help them search for things to do or points of interest.

If the user asks about the selected area or what they can do, politely remind them to first draw a rectangle on the map to select an area.`
        }

        // Calculate approximate center of bbox
        const centerLng = (bbox.west + bbox.east) / 2
        const centerLat = (bbox.south + bbox.north) / 2

        return `The user has selected an area on the map. Here are the details:

**Selected Area Coordinates:**
- Western boundary: ${bbox.west.toFixed(4)}° longitude
- Eastern boundary: ${bbox.east.toFixed(4)}° longitude  
- Southern boundary: ${bbox.south.toFixed(4)}° latitude
- Northern boundary: ${bbox.north.toFixed(4)}° latitude
- Approximate center: ${centerLng.toFixed(4)}° longitude, ${centerLat.toFixed(4)}° latitude

**What you can do:**
- When the user asks about things to do, places to visit, restaurants, cafes, or any points of interest in this area, you can help them search
- The map component will automatically search for points of interest when the user asks questions
- You can describe what types of activities or places might be available in this geographic area
- If the user asks "what can I do with this selection?" or similar questions, explain that they can search for entertainment options, restaurants, cafes, attractions, etc. in the selected area`
      })
    }
    return () => {
      removeContextHelper('assistantBehavior')
      removeContextHelper('mapState')
    }
  }, [selectedDemo, addContextHelper, removeContextHelper, mapRef, currentBBox])

  useEffect(() => {
    if (selectedDemo !== demo) return

    if (!thread?.messages?.length) {
      addThreadMessage(
        {
          id: 'welcome-message',
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: introMessages[selectedDemo],
            },
          ],
          createdAt: new Date().toISOString(),
          threadId: thread.id,
          componentState: {},
        },
        false
      ) // false = don't send to server, just add locally
    }
  }, [thread?.messages?.length, selectedDemo, thread?.id, addThreadMessage])

  if (selectedDemo !== demo) return null

  return (
    <MessageThreadCollapsible
      contextKey={selectedDemo}
      variant="compact"
      defaultOpen={true}
      className="absolute dr-bottom-6 dr-right-4 dr-mr-8"
    />
  )
}
