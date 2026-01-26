'use client'

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'

interface RiveWrapperProps {
  className?: string
  src: string
  stateMachine?: string
}

export function RiveWrapper({
  src,
  className,
  stateMachine,
}: RiveWrapperProps) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    stateMachines: stateMachine,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  })

  return <RiveComponent className={className} />
}
