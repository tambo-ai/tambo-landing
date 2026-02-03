'use client'
import dynamic from 'next/dynamic'
import { useLenisSnap } from '~/app/(pages)/_components/lenis/snap'
import { TimelineSection } from '~/app/(pages)/home/_components/timeline-section'
import { useDeviceDetection } from '~/hooks/use-device-detection'
import { messages } from './data'

const RiveWrapper = dynamic(
  () => import('~/components/rive').then((mod) => mod.RiveWrapper),
  {
    ssr: false,
  }
)

export function TamboSteps() {
  const setSnapRef = useLenisSnap('center')
  const { isMobile, isDesktop } = useDeviceDetection()

  return (
    <TimelineSection
      ref={setSnapRef}
      id="moment-1"
      messages={messages}
      href="https://docs.tambo.co/concepts/components"
      title="Generative UI, powered by your components."
    >
      {/* Only render the appropriate Rive animation for the device */}
      {isDesktop && <RiveWrapper src="/assets/rives/moment-1_loop_1.riv" />}
      {isMobile && (
        <RiveWrapper src="/assets/rives/mobile_moment-1_loop_1.riv" />
      )}
    </TimelineSection>
  )
}
