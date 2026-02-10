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
import { useCallback, useEffect, useState } from 'react'

interface RiveWrapperProps {
  className?: string
  src: string
  alignment?: keyof typeof Alignment
  fit?: keyof typeof Fit
  autoBind?: boolean
  fallback?: React.ReactNode
}

export function RiveWrapper({
  src,
  className,
  alignment = 'Center',
  fit = 'FitWidth',
  autoBind = true,
  fallback,
}: RiveWrapperProps) {
  const [setRef, intersection] = useIntersectionObserver({
    threshold: 0.3,
  })
  const [isLoaded, setIsLoaded] = useState(false)

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
    onLoad: () => {
      // Wait for the canvas to actually render before swapping
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsLoaded(true)
        })
      })
    },
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
      <div
        className="absolute inset-0"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      >
        <RiveComponent className="size-full" />
      </div>
      {fallback && (
        <div
          className="absolute inset-0"
          style={{
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 300ms ease',
          }}
        >
          {fallback}
        </div>
      )}
    </div>
  )
}
