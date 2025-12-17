'use client'

import { TamboProvider, useTamboContextHelpers } from '@tambo-ai/react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { mapExampleContext, seatExampleContext } from './(components)/context'
import { MessageThreadCollapsible } from './(components)/ui-tambo/message-thread-collapsible'
import { MessageThreadFull } from './(components)/ui-tambo/message-thread-full'
import { SeatSelector } from './(components)/seat-selector'
import { SeatSelectorSchema } from './(components)/seat-selector/schema'
import { useTamboThread } from '@tambo-ai/react'
import { MapProvider } from './(components)/map/map-context'
import { useMapSearch } from './(components)/map/use-map-search'
import cn from 'clsx'

const introMessages = {
  travel: 'You have to select your seat ASAP before the flight starts, do you want me to help you?',
  map: 'While your waiting for your flight, you can search for entrainment options in your destination, do you want me to help you?',
}

const components = [
  {
    name: 'seat-selector',
    description: 'A seat selector component',
    component: SeatSelector,
    propsSchema: SeatSelectorSchema,
  },
]

export function TamboIntegration({children}: {children: React.ReactNode}) {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
    >
      <MapProvider>
        <AssistantProvider> {children} </AssistantProvider>
      </MapProvider>
    </TamboProvider>
  )
}

export function AssistantNotifications({className}: {className: string}) {
  const {finishSeatSelection, choosedSeat} = useAssitant()

  return (
    <ul className={cn('flex flex-col dr-gap-8 border border-dark-grey dr-rounded-8 dr-p-16', className)}>
      <label className='typo-surtitle'>Travel assistant</label>
      <li>
        <span className='typo-label-m'>Hotel: </span>
        <span className='typo-label-s'> Booked</span>
      </li>
      <li>
        <span className='typo-label-m'>Flight: </span>
        <span className='typo-label-s'> NYC La Guardia</span>
      </li>
      <li>
        <span className='typo-label-m'>Seat selection: </span>
        <span className='typo-label-s'>{choosedSeat.length > 0 ? choosedSeat.join(', ') : 'None'}</span>
        <button className='typo-label-s' onClick={() => finishSeatSelection('7E')}>
          Random seat
        </button>
      </li>
      <li>
        <span className='typo-label-m'>Itinerary: </span>
        <span className='typo-label-s'>Empty</span>
      </li>
    </ul>
  )
}

export function TravelAssistant() {
  const { selectedDemo } = useAssitant()
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers()
  const { thread, addThreadMessage } = useTamboThread()

  useEffect(() => {
    if (selectedDemo === 'travel') {
      addContextHelper('assistantBehavior', () => 
        `## Role\n${seatExampleContext.objective}\n\n## Instructions\n${seatExampleContext.instructions}`
      )
    }
    return () => removeContextHelper('assistantBehavior')
  }, [selectedDemo, addContextHelper, removeContextHelper])

  useEffect(() => {
    if(selectedDemo !== 'travel') return

    if (!thread?.messages?.length) {
      addThreadMessage({
        id: 'welcome-message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: introMessages[selectedDemo],
          }
        ],
        createdAt: new Date().toISOString(),
        threadId: thread.id,
        componentState: {},
      }, false) // false = don't send to server, just add locally
    }
  }, [thread?.messages?.length, selectedDemo])

  if (selectedDemo === 'map') return null
  return <MessageThreadFull className="absolue z-1" contextKey={selectedDemo} variant="compact" />
}

export function MapAssistant() {
  const { selectedDemo } = useAssitant()
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers()
  const { thread, addThreadMessage } = useTamboThread()
  // Enable map search - pass contextKey to listen to correct thread
  useMapSearch(selectedDemo)

  useEffect(() => {
    if (selectedDemo === 'map') {
      addContextHelper('assistantBehavior', () => 
        `## Role\n${mapExampleContext.objective}\n\n## Instructions\n${mapExampleContext.instructions}`
      )
    }
    return () => removeContextHelper('assistantBehavior')
  }, [selectedDemo, addContextHelper, removeContextHelper])

  useEffect(() => {
    if(selectedDemo !== 'map') return

    if (!thread?.messages?.length) {
      addThreadMessage({
        id: 'welcome-message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: introMessages[selectedDemo],
          }
        ],
        createdAt: new Date().toISOString(),
        threadId: thread.id,
        componentState: {},
      }, false) // false = don't send to server, just add locally
    }
  }, [thread?.messages?.length, selectedDemo])

  if (selectedDemo === 'travel') return null
  return (
    <MessageThreadCollapsible
      contextKey={selectedDemo}
      variant="compact"
      defaultOpen={true}
      className="absolute dr-bottom-6 dr-right-4 dr-mr-8"
    />
  )
}

type Demo = 'travel' | 'map'
type Threads = [string | null, string | null]

const AssistantContext = createContext<{
  selectedDemo: Demo
  threads: Threads
  choosedSeat: string[]
  setSelectedDemo: React.Dispatch<React.SetStateAction<Demo>>
  setThreads: React.Dispatch<React.SetStateAction<Threads>>
  switchToTravelThread: () => void
  switchToMapThread: () => void
  finishSeatSelection: (seat: string) => void
}>({
  selectedDemo: 'travel',
  threads: [null, null],
  choosedSeat: [],
  setSelectedDemo: () => {},
  setThreads: () => {},
  switchToTravelThread: () => {},
  switchToMapThread: () => {},
  finishSeatSelection: () => {},
})

function AssistantProvider({ children, }: { children: React.ReactNode }) {
  const [selectedDemo, setSelectedDemo] = useState<Demo>('travel')
  const [choosedSeat, setChoosedSeat] = useState<string[]>([])
  const [threads, setThreads] = useState<Threads>([null, null])
  const { thread, startNewThread, switchCurrentThread } = useTamboThread()
  
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
}, [thread?.id, setThreads])

const switchToTravelThread = useCallback(() => {
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
}, [threads, switchCurrentThread])

const finishSeatSelection = useCallback((seat: string) => {
  setSelectedDemo('map')
  switchToMapThread()
  setChoosedSeat([seat])
}, [setSelectedDemo, switchToMapThread])

  return (<AssistantContext.Provider value={{ selectedDemo, threads, choosedSeat, setSelectedDemo, setThreads, switchToTravelThread, switchToMapThread, finishSeatSelection }}>
    {children}
  </AssistantContext.Provider>)
}

export const useAssitant = () => {
  const context = useContext(AssistantContext)
  if (!context) {
    throw new Error('useAssistant must be used within a AssistantProvider')
  }
  return context
}