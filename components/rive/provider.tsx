'use client'

import { RuntimeLoader } from '@rive-app/react-webgl2'
import { useEffect, useState, type ReactNode } from 'react'

// Configure Rive to use self-hosted WASM instead of CDN
// This must be called BEFORE any Rive component renders
let wasmConfigured = false

function configureRiveWasm() {
  if (wasmConfigured) return
  RuntimeLoader.setWasmUrl('/assets/rive/rive.wasm')
  wasmConfigured = true
}

interface RiveProviderProps {
  children: ReactNode
}

export function RiveProvider({ children }: RiveProviderProps) {
  const [isConfigured, setIsConfigured] = useState(wasmConfigured)

  useEffect(() => {
    configureRiveWasm()
    setIsConfigured(true)
  }, [])

  // Don't render children until WASM is configured
  if (!isConfigured) return null

  return <>{children}</>
}
