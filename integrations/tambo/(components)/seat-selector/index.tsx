import { useTamboContextHelpers, useTamboThread } from '@tambo-ai/react'
import { useEffect } from 'react'
import { useAssitant } from '~/integrations/tambo'
import { DEMOS } from '~/integrations/tambo/constants'
import { MessageThreadFull } from '../ui-tambo/message-thread-full'
import { seatExampleContext } from './schema'

const introMessages = {
  seat: 'Damn nice choice, i’m jealous. Your flight is really soon, it’s time to select your seat. Ready to start?',
}

const demo = DEMOS.SEAT

export function SeatAssistant() {
  const { selectedDemo } = useAssitant()
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers()
  const { thread, addThreadMessage } = useTamboThread()

  useEffect(() => {
    if (selectedDemo === demo) {
      addContextHelper(
        'assistantBehavior',
        () =>
          `## Role\n${seatExampleContext.objective}\n\n## Instructions\n${seatExampleContext.instructions}`
      )
    }
    return () => removeContextHelper('assistantBehavior')
  }, [selectedDemo, addContextHelper, removeContextHelper])

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
              text: introMessages.seat,
            },
          ],
          createdAt: new Date().toISOString(),
          threadId: thread.id,
          componentState: {},
        },
        false
      )
    }
  }, [thread?.messages?.length, selectedDemo, thread?.id, addThreadMessage])

  if (selectedDemo !== demo) return null

  return (
    <MessageThreadFull
      className="absolue z-10"
      contextKey={selectedDemo}
      variant="compact"
    />
  )
}
