'use client'
import { TimelineSection } from '~/app/(pages)/home/_components/timeline-section'
import { Animation } from './animation'
import { messages } from './data'

export function Section4() {
  return (
    <TimelineSection
      messages={messages}
      title="AI-generated interfaces, powered by your own components."
    >
      <Animation />
    </TimelineSection>
  )
}
