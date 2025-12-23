'use client'

import { TamboProvider, useTamboThread } from '@tambo-ai/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAddToItineraryListener } from './(components)/map/mapbox/events'
import { mapTools } from './(components)/map/tools'
import { seatComponent } from './(components)/seat-selector/schema'
import { DEMOS } from './constants'

const components = [...seatComponent]
const tools = [...mapTools]

export function TamboIntegration({ children }: { children: React.ReactNode }) {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      <AssistantProvider> {children} </AssistantProvider>
    </TamboProvider>
  )
}

type Demo = (typeof DEMOS)[keyof typeof DEMOS]
type Threads = [string | null, string | null]
export type POI = {
  id: string | number
  type: string
  name: string | null
  lat: number
  lon: number
  metadata?: Record<string, unknown>
}
export type BBox = { west: number; south: number; east: number; north: number }
type DateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`
export type itineraryItem = {
  poi: POI
  selectedDate: DateString
}

const AssistantContext = createContext<{
  // Main
  selectedDemo: Demo
  threads: Threads
  setSelectedDemo: React.Dispatch<React.SetStateAction<Demo>>
  setThreads: React.Dispatch<React.SetStateAction<Threads>>
  // Seat
  choosedSeat: string[]
  finishSeatSelection: (seat: string) => void
  // Map
  map: mapboxgl.Map | undefined
  currentBBox: BBox | null
  itinerary: itineraryItem[]
  setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map | undefined>>
  setCurrentBBox: React.Dispatch<React.SetStateAction<BBox | null>>
  addToItinerary: (item: itineraryItem) => void
  // Thread functions
  switchToSeatThread: () => void
  switchToMapThread: () => void

}>({
  selectedDemo: DEMOS.SEAT,
  threads: [null, null],
  choosedSeat: [],
  map: undefined,
  itinerary: [] as itineraryItem[],
  addToItinerary: () => {},
  currentBBox: null,
  setSelectedDemo: () => {},
  setThreads: () => {},
  setMap: () => {},
  setCurrentBBox: () => {},
  switchToSeatThread: () => {},
  switchToMapThread: () => {},
  finishSeatSelection: () => {},
})

function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [selectedDemo, setSelectedDemo] = useState<Demo>(DEMOS.SEAT)
  const [threads, setThreads] = useState<Threads>([null, null])
  const { thread, startNewThread, switchCurrentThread } = useTamboThread()
  const [choosedSeat, setChoosedSeat] = useState<string[]>([])
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined)
  const [itinerary,setItinerary] = useState<itineraryItem[]>([])
  const [currentBBox, setCurrentBBox] = useState<{
    west: number
    east: number
    south: number
    north: number
  } | null>(null)

  useEffect(() => {
    setThreads((prev: Threads) => {
      // On first render, save the travel thread
      if (prev[0] === null || prev[0] === 'placeholder') {
        return [thread.id, null]
      }

      // If the map thread is created, save it
      if (
        prev[1] === null &&
        thread.id !== prev[0] &&
        thread.id !== 'placeholder'
      ) {
        return [prev[0], thread.id]
      }

      return prev
    })
  }, [thread?.id])

  const switchToSeatThread = useCallback(() => {
    if (threads[0]) {
      switchCurrentThread(threads[0])
    }
  }, [threads, switchCurrentThread])

  const switchToMapThread = useCallback(() => {
    if (threads[1] === null) {
      startNewThread()
    } else {
      switchCurrentThread(threads[1])
    }
  }, [threads, switchCurrentThread, startNewThread])

  const finishSeatSelection = useCallback(
    (seat: string) => {
      setSelectedDemo(DEMOS.MAP)
      switchToMapThread()
      setChoosedSeat([seat])
    },
    [switchToMapThread]
  )

  const addToItinerary = useCallback((item: itineraryItem) => {
    setItinerary((prev) => [...prev, item])
  }, [setItinerary])

  // Listen for itinerary add events from the tool
  useAddToItineraryListener((params) => {
    addToItinerary({
      poi: params.poi,
      selectedDate: params.selectedDate as itineraryItem['selectedDate'],
    })
    return {
      success: true,
      addedItem: {
        name: params.poi.name ?? 'Unknown location',
        id: params.poi.id,
      },
    }
  })

  return (
    <AssistantContext.Provider
      value={{
        selectedDemo,
        threads,
        choosedSeat,
        map,
        itinerary,
        addToItinerary,
        currentBBox,
        setSelectedDemo,
        setThreads,
        switchToSeatThread,
        switchToMapThread,
        setMap,
        finishSeatSelection,
        setCurrentBBox,
      }}
    >
      {children}
    </AssistantContext.Provider>
  )
}

export const useAssitant = () => {
  const context = useContext(AssistantContext)
  if (!context) {
    throw new Error('useAssistant must be used within a AssistantProvider')
  }
  return context
}
