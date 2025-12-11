'use client'

import { TamboProvider } from '@tambo-ai/react'
import { seatExampleContext } from './(components)/context'
import { SeatSelector, SeatSelectorSchema } from './(components)/seat-selector'
import { MessageThreadFull } from './(components)/ui-tambo/message-thread-full'

export function TamboIntegration() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      contextHelpers={{
        instructions: () => seatExampleContext,
      }}
    >
      <MessageThreadFull contextKey="tambo-template" variant="compact" />
    </TamboProvider>
  )
}

const components = [
  {
    name: 'seat-selector',
    description: 'A seat selector component',
    component: SeatSelector,
    propsSchema: SeatSelectorSchema,
  },
]
