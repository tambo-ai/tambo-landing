'use client'

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-webgl2'
import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useEffect } from 'react'

interface RiveWrapperProps {
  className?: string
  src: string
}

export function RiveWrapper({ src, className }: RiveWrapperProps) {
  const [setRef, intersection] = useIntersectionObserver({
    threshold: 0.3,
  })

  const { RiveComponent, rive } = useRive({
    src,
    autoplay: false,
    stateMachines: 'MainStateMachine',
    autoBind: true,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
  })

  useEffect(() => {
    if (intersection?.isIntersecting) {
      rive?.play()
    } else {
      rive?.pause()
    }
  }, [intersection, rive])

  return (
    <div ref={setRef} className={cn('relative size-full', className)}>
      <div className="absolute inset-0">
        <RiveComponent className="size-full" />
      </div>
    </div>
  )
}
