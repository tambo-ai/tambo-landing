'use client'
import { TimelineSection } from '~/app/(pages)/home/_components/timeline-section'
import { Animation } from './animation'
import { messages } from './data'

export function Section6() {
  return (
    <TimelineSection
      messages={messages}
      title="Native MCP support, hard wiring done for you."
    >
      <Animation />
    </TimelineSection>
  )
}
