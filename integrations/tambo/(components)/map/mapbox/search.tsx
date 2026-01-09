import { useTamboThreadInput } from '@tambo-ai/react'
import cn from 'clsx'
import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useEffectEvent, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { HashPattern } from '~/app/(pages)/home/_components/hash-pattern'
import ArrowSVG from '~/assets/svgs/arrow.svg'
import PlusIcon from '~/assets/svgs/plus.svg'
import { type BBox, useAssitant } from '~/integrations/tambo'
import { isMapValid } from '.'
import type { POI } from './'
import { fetchWithRetry } from './api'
import {
  type SearchParams,
  type SearchResult,
  useMapSearchListener,
} from './events'
import s from './map.module.css'

type AreaAnalyzeResponse = {
  area: { bbox: BBox }
  points_of_interest: { items: POI[] }
}

type MarkerWithRoot = {
  marker: mapboxgl.Marker
  root: Root
}

export function useMapSearch({
  center,
  onResult,
}: {
  center: [number, number]
  onResult?: (result: AreaAnalyzeResponse) => void
}) {
  const { map, currentBBox } = useAssitant()
  const markersRef = useRef<MarkerWithRoot[]>([])
  const { setValue } = useTamboThreadInput()

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(({ marker, root }) => {
      // Defer unmount to avoid conflict with React render cycle
      queueMicrotask(() => root.unmount())
      marker.remove()
    })
    markersRef.current = []
  }, [])

  const handleClick = useCallback(
    async (poi: POI) => {
      const message = `I want to go to ${poi.name ?? 'this location'}`
      setValue(message)
    },
    [setValue]
  )

  const handleSearch = useEffectEvent(
    async (params: SearchParams): Promise<SearchResult> => {
      if (!map) {
        throw new Error('Map is not initialized. Please wait for it to load.')
      }

      const bbox = currentBBox
      if (!bbox) {
        throw new Error(
          'No area selected. Please draw a rectangle on the map first.'
        )
      }

      const result = await fetchWithRetry<AreaAnalyzeResponse>(
        '/api/area/analyze',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bbox,
            category: params.category,
            brandFilter: params.brandFilter,
          }),
        }
      )

      if (!result.ok) {
        throw new Error(result.error || 'Search failed')
      }

      const pois = result.data.points_of_interest?.items ?? []

      clearMarkers()
      pois.forEach((poi) => {
        if (!(Number.isFinite(poi.lat) && Number.isFinite(poi.lon))) return

        const container = document.createElement('div')
        const root = createRoot(container)
        root.render(<PoiMarker poi={poi} onClick={handleClick} />)

        const marker = new mapboxgl.Marker({
          element: container,
          anchor: 'bottom',
        })
          .setLngLat([poi.lon, poi.lat])
          .addTo(map)

        // Get the wrapper element and add z-index control on hover
        const markerElement = marker.getElement()
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.zIndex = '999'
        })
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.zIndex = '1'
        })

        markersRef.current.push({ marker, root })
      })

      onResult?.(result.data)

      return {
        count: pois.length,
        names: pois
          .slice(0, 5)
          .map((p) => p.name)
          .filter((name): name is string => name !== null),
        pois,
      }
    }
  )

  // Map setup
  useEffect(() => {
    if (!isMapValid(map)) return

    map.dragPan.disable()
    map.doubleClickZoom.disable()

    map.addControl(new mapboxgl.AttributionControl({ compact: true }))
    new mapboxgl.Marker().setLngLat(center).addTo(map)
  }, [map, center])

  // Listen for search events from tools
  useMapSearchListener(handleSearch)

  return { handleSearch }
}

function PoiMarker({
  poi,
  onClick,
}: {
  poi: POI
  onClick: (poi: POI) => void
}) {
  return (
    <div
      className={cn(
        s.pois,
        'flex flex-col items-center justify-center dr-gap-9'
      )}
    >
      <div className={s.pin}>
        <PinSVG className="dr-size-full" />
      </div>
      <button
        type="button"
        onClick={() => onClick(poi)}
        aria-label={`Action for ${poi.name ?? 'POI'}`}
        className={cn(
          s.button,
          'dr-size-20 flex items-center justify-center dr-gap-4 relative dr-rounded-12 dr-border dr-border-dark-teal dr-p-2 dr-py-4 dr-pr-4 dr-bg-white'
        )}
      >
        <HashPattern
          className={cn('absolute inset-0 text-dark-teal/50 ', s.hashPattern)}
        />
        <span
          className={cn(
            s.text,
            'typo-label-s dr-pl-8 leading-none dr-max-w-200 overflow-hidden text-teal whitespace-nowrap z-10'
          )}
        >
          {poi.name}
        </span>
        <span
          className={cn(
            'absolute dr-right-1 dr-size-16 bg-black rounded-full grid place-items-center',
            s.icon
          )}
        >
          <ArrowSVG className="dr-size-8 absolute top-1/2 -translate-y-1/2" />
          <PlusIcon className="dr-size-8 text-teal absolute top-1/2 -translate-y-1/2" />
        </span>
      </button>
    </div>
  )
}

function PinSVG({ className }: { className: string }) {
  return (
    <svg
      width="32"
      height="41"
      viewBox="0 0 32 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Pin</title>
      <path
        d="M16 0.5C20.1094 0.504812 24.0493 2.13915 26.9551 5.04492C29.7703 7.86012 31.3924 11.646 31.4951 15.6162L31.5 16.001C31.4997 22.6716 27.9517 28.5655 24.2695 32.8789C20.5952 37.183 16.843 39.8484 16.5488 40.0537H16.5479C16.4083 40.1515 16.3057 40.2288 16.1943 40.291C16.085 40.352 16.0256 40.3633 16 40.3633C15.9744 40.3633 15.915 40.352 15.8057 40.291C15.6943 40.2288 15.5917 40.1515 15.4521 40.0537H15.4512C15.157 39.8484 11.4048 37.183 7.73047 32.8789C4.04825 28.5655 0.500347 22.6716 0.5 16.001C0.504662 11.8914 2.13901 7.95083 5.04492 5.04492C7.9507 2.13915 11.8906 0.504812 16 0.5ZM16 9.68164C14.3243 9.68164 12.7171 10.3473 11.5322 11.5322C10.3473 12.7171 9.68164 14.3243 9.68164 16C9.68164 17.2496 10.0529 18.4708 10.7471 19.5098C11.4413 20.5487 12.4276 21.3587 13.582 21.8369C14.7364 22.3151 16.0069 22.441 17.2324 22.1973C18.458 21.9535 19.5842 21.3514 20.4678 20.4678C21.3514 19.5842 21.9535 18.458 22.1973 17.2324C22.441 16.0069 22.3151 14.7364 21.8369 13.582C21.3587 12.4276 20.5487 11.4413 19.5098 10.7471C18.4708 10.0529 17.2496 9.68164 16 9.68164Z"
        fill="#B6FFDD"
        stroke="#80C1A2"
      />
    </svg>
  )
}
