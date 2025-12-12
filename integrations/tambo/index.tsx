'use client'

import { TamboContextHelpersProvider, TamboProvider, useTamboThread } from '@tambo-ai/react'
import { mapExampleContext, seatExampleContext } from './(components)/context'
import { SeatSelector, SeatSelectorSchema } from './(components)/seat-selector'
import { MessageThreadFull } from './(components)/ui-tambo/message-thread-full'
import { MessageThreadCollapsible } from './(components)/ui-tambo/message-thread-collapsible'

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
        {children}
    </TamboProvider>
  )
}

export function TravelAssistant({ selectedDemo }: { selectedDemo: 'travel' | 'map' }) {
  if(selectedDemo === 'map') return null

  return (
    <TamboContextHelpersProvider
      contextHelpers={{
        instructions: () => seatExampleContext,
      }}
  >
    <MessageThreadFull contextKey={selectedDemo} variant="compact" />
  </TamboContextHelpersProvider>
  )
}

export function MapAssistant({ selectedDemo }: { selectedDemo: 'travel' | 'map' }) {
  if(selectedDemo === 'travel') return null

  return (
    <TamboContextHelpersProvider
      contextHelpers={{
        instructions: () => mapExampleContext,
      }}
  >
    <MessageThreadCollapsible  contextKey={selectedDemo} variant="compact" defaultOpen={true}
     className="absolute dr-bottom-6 dr-right-4" />
  </TamboContextHelpersProvider>
  )
}

