'use client'

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'

// import cn from 'clsx'

interface RiveWrapperProps {
  className?: string
  src: string
}

export function RiveWrapper({ src, className }: RiveWrapperProps) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  })

  return <RiveComponent className={className} />
}
