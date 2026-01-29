'use client'
import { useLenisSnap } from '~/app/(pages)/_components/lenis/snap'
import { TimelineSection } from '~/app/(pages)/home/_components/timeline-section'
import { RiveWrapper } from '~/components/rive'
import { messages } from './data'

export function TamboSteps() {
  const setSnapRef = useLenisSnap('center')

  return (
    <TimelineSection
      ref={setSnapRef}
      id="moment-1"
      messages={messages}
      href="https://docs.tambo.co/concepts/components"
      title="Generative UI, powered by your components."
    >
      <RiveWrapper
        className="desktop-only"
        src="/assets/rives/moment-1_loop_1.riv"
      />
      <RiveWrapper
        className="mobile-only"
        src="/assets/rives/mobile_moment-1_loop_1.riv"
      />
      {/* <Animation /> */}
    </TimelineSection>
  )
}
