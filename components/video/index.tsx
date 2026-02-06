'use client'

import { useIntersectionObserver } from 'hamo'
import { useRef, useState } from 'react'

export function Video({
  children,
  priority,
  autoPlay,
  fallback,
}: {
  children: React.ReactNode
  priority?: boolean
  autoPlay?: boolean
  fallback?: React.ReactNode // required for Safari lowPowerMode support
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [setIntersectionRef, intersection] = useIntersectionObserver({
    rootMargin: '1000px',
    once: true,
  })
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="h-full w-full relative">
      <video
        {...(autoPlay && {
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
        })}
        className="w-full h-full object-cover"
        ref={(node) => {
          setIntersectionRef(node)
          videoRef.current = node
        }}
        onTimeUpdate={(_e) => {
          setIsPlaying(true)
        }}
        style={{
          visibility: isPlaying ? 'visible' : 'hidden',
        }}
      >
        {(priority || intersection?.isIntersecting) && children}
      </video>
      <div
        className="absolute inset-0 grid place-items-center"
        style={{
          visibility: isPlaying ? 'hidden' : 'visible',
        }}
      >
        {fallback}
      </div>
    </div>
  )
}
