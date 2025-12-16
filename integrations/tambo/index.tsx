'use client'

import { TamboProvider, useTamboContextHelpers } from '@tambo-ai/react'
import { useEffect } from 'react'
import { mapExampleContext, seatExampleContext } from './(components)/context'
import { MessageThreadCollapsible } from './(components)/ui-tambo/message-thread-collapsible'
import { MessageThreadFull } from './(components)/ui-tambo/message-thread-full'
import { SeatSelector, SeatSelectorSchema } from './(components)/seat-selector'
import { InterctableMap } from './(components)/map'

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
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers()

  useEffect(() => {
    if (selectedDemo === 'travel') {
      addContextHelper('assistantBehavior', () => 
        `## Role\n${seatExampleContext.objective}\n\n## Instructions\n${seatExampleContext.instructions}`
      )
    }
    return () => removeContextHelper('assistantBehavior')
  }, [selectedDemo, addContextHelper, removeContextHelper])

  if (selectedDemo === 'map') return null
  return <MessageThreadFull contextKey={selectedDemo} variant="compact" />
}

export function MapAssistant({ selectedDemo }: { selectedDemo: 'travel' | 'map' }) {
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers()

  useEffect(() => {
    if (selectedDemo === 'map') {
      addContextHelper('assistantBehavior', () => 
        `## Role\n${mapExampleContext.objective}\n\n## Instructions\n${mapExampleContext.instructions}`
      )
    }
    return () => removeContextHelper('assistantBehavior')
  }, [selectedDemo, addContextHelper, removeContextHelper])

  if (selectedDemo === 'travel') return null
  return (
    <>
    <InterctableMap height={650} />  
    <MessageThreadCollapsible
      contextKey={selectedDemo}
      variant="compact"
      defaultOpen={true}
      className="absolute dr-bottom-6 dr-right-4 dr-mr-8"
    />
    </>
  )
}



