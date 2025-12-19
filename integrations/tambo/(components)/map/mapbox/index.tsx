'use client'

import { useLenis } from 'lenis/react'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import { useAssitant } from '~/integrations/tambo'
import { useRectangleMapDrawing } from './drawing'
import { useMapSearch } from './search'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export type POI = {
  id: number
  type: string
  name: string | null
  lat: number
  lon: number
  tags: Record<string, unknown>
}

type Props = {
  className?: string
  height?: number | string
  fallbackZoom?: number
  center?: [number, number] // [lng, lat]
}

const DEFAULT_CENTER: [number, number] = [-74.00594, 40.71278] // NYC [lng, lat]

export function MapBox({
  className,
  height = 520,
  fallbackZoom = 12,
  center = DEFAULT_CENTER,
}: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { setMap } = useAssitant()
  const lenis = useLenis()

  useRectangleMapDrawing({ center })
  useMapSearch({ center })

  // Map Initialization
  useEffect(() => {
    if (mapRef.current) return
    if (!containerRef.current) return
    if (containerRef.current.querySelector('.mapboxgl-map')) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: fallbackZoom,
    })

    map.on('load', () => {
      mapRef.current = map
      setMap(map)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [fallbackZoom, center, setMap])

  return (
    <div
      className={className}
      style={{ width: '100%' }}
      onMouseEnter={() => {
        lenis?.stop()
      }}
      onMouseLeave={() => {
        lenis?.start()
      }}
      role="region"
      aria-label="Area Select Map"
    >
      <div
        ref={(el: HTMLDivElement | null) => {
          containerRef.current = el
        }}
        style={{ height, width: '100%' }}
      />
    </div>
  )
}

//UTILS
export const EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

export function getGeoJSONSource(
  map: mapboxgl.Map,
  id: string
): mapboxgl.GeoJSONSource | undefined {
  return map.getSource(id) as mapboxgl.GeoJSONSource | undefined
}

// HOOKS
export function useMapPanMode() {
  const [panMode, setPanMode] = useState(false)
  const { map } = useAssitant()

  useEffect(() => {
    function onKeyChange(enabled: boolean) {
      setPanMode(enabled)
      if (!map) return

      if (enabled) {
        map.dragPan.enable()
        map.getCanvas().style.cursor = 'grab'
      } else {
        map.dragPan.disable()
        map.getCanvas().style.cursor = ''
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') onKeyChange(true)
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') onKeyChange(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [map])

  return panMode
}
