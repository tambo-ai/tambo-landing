'use client'

import {
  Alignment,
  type FileAsset,
  Fit,
  Layout,
  useRive,
} from '@rive-app/react-webgl2'
import cn from 'clsx'
import { useIntersectionObserver } from 'hamo'
import { useCallback, useEffect } from 'react'

interface RiveWrapperProps {
  className?: string
  src: string
  alignment?: keyof typeof Alignment
  fit?: keyof typeof Fit
  autoBind?: boolean
}

export function RiveWrapper({
  src,
  className,
  alignment = 'Center',
  fit = 'FitWidth',
  autoBind = true,
}: RiveWrapperProps) {
  const [setRef, intersection] = useIntersectionObserver({
    threshold: 0.3,
  })

  const assetLoader = useCallback((asset: FileAsset, bytes: Uint8Array) => {
    // If bytes has data, the asset is embedded - let Rive handle it
    if (bytes.length > 0) {
      return false
    }

    // Load referenced fonts
    if (asset.isFont) {
      fetch('/fonts/Sentient/Sentient-Light.woff2')
        .then((res) => res.arrayBuffer())
        .then((buffer) => asset.decode(new Uint8Array(buffer)))
      return true
    }
    // Load referenced images (Rive doesn't include extension, so append .webp)
    if (asset.isImage) {
      fetch(`/assets/rives/images/${asset.name}.webp`)
        .then((res) => res.arrayBuffer())
        .then((buffer) => asset.decode(new Uint8Array(buffer)))
      return true
    }
    return false
  }, [])

  const { RiveComponent, rive } = useRive({
    src,
    autoplay: false,
    stateMachines: 'MainStateMachine',
    autoBind,
    assetLoader,
    layout: new Layout({
      fit: Fit[fit],
      alignment: Alignment[alignment],
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
