'use client'

import { TamboProvider, useTamboThread } from '@tambo-ai/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { seatComponent } from './(components)/seat-selector/schema'
import { DEFAULT_DESTINATION, DEMOS, MAPBOX_ENABLED } from './constants'
import { type ForecastDay, getCurrentDate, mapTools } from './tools'

// Mapbox event listener - only used when Mapbox is enabled
// eslint-disable-next-line @typescript-eslint/no-empty-function
const useAddToItineraryListener = MAPBOX_ENABLED
  ? require('./(components)/map/mapbox/events').useAddToItineraryListener
  : (_callback: unknown) => undefined

const components = [...seatComponent]
const tools = [...mapTools]

type Demo = (typeof DEMOS)[keyof typeof DEMOS]
type Threads = [string | null, string | null]
export type Destination = {
  name: string | null
  center: [number, number]
}
export type WeatherResult = {
  timezone: string
  forecast: ForecastDay[]
}
export type POI = {
  id: string | number
  type: string
  name: string | null
  lat: number
  lon: number
  metadata?: Record<string, unknown>
}
export type BBox = { west: number; south: number; east: number; north: number }
type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`
export type itineraryItem = {
  poi: POI
  selectedDate: DateString
}

export function TamboIntegration({ children }: { children: React.ReactNode }) {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      contextHelpers={{
        userTime: () => getCurrentDate(),
      }}
    >
      <AssistantProvider> {children} </AssistantProvider>
    </TamboProvider>
  )
}

const AssistantContext = createContext<{
  // Main
  destination: Destination
  weather: WeatherResult | null
  selectedDemo: Demo
  threads: Threads
  setWeather: React.Dispatch<React.SetStateAction<WeatherResult | null>>
  setSelectedDemo: React.Dispatch<React.SetStateAction<Demo>>
  setThreads: React.Dispatch<React.SetStateAction<Threads>>
  setDestination: React.Dispatch<React.SetStateAction<Destination>>
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
  switchToDemoThread: (demo: Demo) => void
}>({
  destination: DEFAULT_DESTINATION,
  weather: null,
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
  setDestination: () => {},
  setWeather: () => {},
  switchToDemoThread: (demo: Demo) => {},
  finishSeatSelection: () => {},
})

function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [destination, setDestination] =
    useState<Destination>(DEFAULT_DESTINATION)
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [selectedDemo, setSelectedDemo] = useState<Demo>(DEMOS.INTRO)
  const [threads, setThreads] = useState<Threads>([null, null])
  const [choosedSeat, setChoosedSeat] = useState<string[]>([])
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined)
  const [currentBBox, setCurrentBBox] = useState<BBox | null>(null)
  const [itinerary, setItinerary] = useState<itineraryItem[]>([])
  const { thread, startNewThread, switchCurrentThread } = useTamboThread()

  // Obscure but failing to use Tambo thread management better
  useEffect(() => {
    setThreads((prev: Threads) => {
      // On first render, save the intro thread
      if (prev[0] === null || prev[0] === 'placeholder') {
        return [thread.id, null]
      }

      // If the seat thread is created, save it
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

  const switchToDemoThread = useCallback(
    (demo: Demo) => {
      const demoIndex = Object.values(DEMOS).indexOf(demo)
      const threadId = threads[demoIndex - 1]

      if (threadId === null) {
        startNewThread()
      } else {
        switchCurrentThread(threadId)
      }
    },
    [threads, switchCurrentThread, startNewThread]
  )

  const finishSeatSelection = useCallback(
    (seat: string) => {
      setSelectedDemo(DEMOS.MAP)
      switchToDemoThread(DEMOS.MAP)
      setChoosedSeat([seat])
    },
    [switchToDemoThread]
  )

  const addToItinerary = useCallback(
    (item: itineraryItem) => {
      setItinerary((prev) => [...prev, item])
    },
    [setItinerary]
  )

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
        destination,
        weather,
        selectedDemo,
        threads,
        choosedSeat,
        map,
        itinerary,
        addToItinerary,
        currentBBox,
        setSelectedDemo,
        setThreads,
        switchToDemoThread,
        setMap,
        finishSeatSelection,
        setCurrentBBox,
        setDestination,
        setWeather,
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
