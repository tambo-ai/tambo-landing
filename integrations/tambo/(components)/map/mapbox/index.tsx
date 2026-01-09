'use client'

import cn from 'clsx'
import { useLenis } from 'lenis/react'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import InfoSVG from '~/assets/svgs/info.svg'
import { useAssitant } from '~/integrations/tambo'
import { DEFAULT_DESTINATION } from '~/integrations/tambo/constants'
import { useRectangleMapDrawing } from './drawing'
import { useMapNavigationListener } from './events'
import s from './map.module.css'
import { useMapSearch } from './search'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export type POI = {
  id: string | number
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

export function MapBox({
  className,
  height = 520,
  fallbackZoom = 12,
  center = DEFAULT_DESTINATION.center,
}: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { setMap } = useAssitant()
  const lenis = useLenis()

  useRectangleMapDrawing({ center })
  useMapSearch({ center })
  useMapNavigationListener((params) => {
    const map = mapRef.current

    if (!map) return
    map.stop()

    setTimeout(() => {
      map.flyTo({
        center: [params.center.lng, params.center.lat],
        zoom: params.zoom ?? fallbackZoom,
        essential: true,
      })
    }, 100)
  })

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

    mapRef.current = map
    map.on('load', () => {
      setMap(map)
    })

    return () => {
      setMap(undefined)
      mapRef.current = null
      map.remove()
    }
  }, [setMap])

  return (
    <>
      <div
        className={className}
        style={{ width: '100%' }}
        data-lenis-prevent
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
      <div
        className={cn(
          s.mapTooltip,
          'absolute dr-bottom-8 dr-left-8 dr-w-227 dr-h-32 dr-rounded-16 dr-pl-4 flex items-center justify-start bg-white overflow-hidden'
        )}
      >
        <div className="dr-size-24 bg-off-white dr-rounded-12 flex items-center justify-center">
          <InfoSVG className="dr-w-16 dr-h-16 " />
        </div>
        <span
          className={cn(
            s.tooltipText,
            'typo-p-s absolute dr-left-36 top-1/2 -translate-y-1/2 whitespace-nowrap dr-text-10'
          )}
        >
          Hold Cmd/Ctrl to drag around the map.
        </span>
      </div>
    </>
  )
}

//UTILS
export const EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

export function isMapValid(map: mapboxgl.Map | undefined): map is mapboxgl.Map {
  if (!map) return false
  try {
    // Check if the map container is still in DOM and map is loaded
    return !!map.getContainer()?.isConnected && map.loaded()
  } catch {
    return false
  }
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
