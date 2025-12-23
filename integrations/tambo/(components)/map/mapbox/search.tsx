import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useEffectEvent, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { type BBox, useAssitant } from '~/integrations/tambo'
import type { POI } from './'
import { fetchWithRetry } from './api'
import {
  type SearchParams,
  type SearchResult,
  useMapSearchListener,
} from './events'
import PlusIcon  from '~/assets/svgs/plus.svg'
import cn from 'clsx'
import { useTamboThreadInput } from '@tambo-ai/react'

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
  const { setValue, submit } = useTamboThreadInput()

  // Cleanup helper
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(({ marker, root }) => {
      root.unmount()
      marker.remove()
    })
    markersRef.current = []
  }, [])



  const handleClick = useCallback(async (poi: POI) => {
    const message = `I want to go to ${poi.name ?? 'this location'}`
    setValue(message)
    await submit({ streamResponse: true })
    setValue('')
  }, [ setValue, submit])

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
        if (!Number.isFinite(poi.lat) || !Number.isFinite(poi.lon)) return

        const container = document.createElement('div')
        const root = createRoot(container)
        root.render(<PoiMarker poi={poi} onClick={handleClick} />)

        const marker = new mapboxgl.Marker({ element: container, anchor: 'bottom' })
          .setLngLat([poi.lon, poi.lat])
          .addTo(map)

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
    if (!map) return

    map.dragPan.disable()
    map.doubleClickZoom.disable()

    map.addControl(new mapboxgl.AttributionControl({ compact: true }))
    new mapboxgl.Marker().setLngLat(center).addTo(map)

    return () => {
      clearMarkers()
    }
  }, [map, center, clearMarkers])

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
    <div className="flex flex-col items-center dr-gap-8">
      <div>
        <PinSVG className="dr-size-full" />
      </div>
      <button
        type="button"
        onClick={() => onClick(poi)}
        aria-label={`Action for ${poi.name ?? 'POI'}`}
        className="dr-h-20 aspect-square cursor-pointer rounded-full border border-dark-teal hover:[&>span:first-child]:opacity-0 hover:[&>span:last-child]:opacity-100 hover:[&>span:last-child]:block transition-opacity duration-300"
      >
        <span className="h-full w-full border-2 border-white bg-black flex items-center justify-center rounded-full text-teal">
         <PlusIcon className="dr-size-8" />
        </span>
        <span className="text-xs text-black opacity-0 display-none">
          {poi.name}
        </span>
      </button>
    </div>
  )
}

function PinSVG({className}: {className: string}){
  return <svg
  className={cn("dr-w-40 shadow-xs", className)}
  viewBox="0 0 40 49"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <title>Pin</title>
  <path
    d="M20 4C15.758 4.00481 11.6911 5.69207 8.69161 8.69161C5.69207 11.6911 4.00481 15.758 4 20C4 33.6909 18.5455 44.0309 19.1655 44.4636C19.41 44.635 19.7014 44.8633 20 44.8633C20.2986 44.8633 20.59 44.635 20.8345 44.4636C21.4545 44.0309 36 33.6909 36 20C35.9952 15.758 34.3079 11.6911 31.3084 8.69161C28.3089 5.69207 24.242 4.00481 20 4ZM20 14.1818C21.1507 14.1818 22.2756 14.523 23.2324 15.1624C24.1892 15.8017 24.9349 16.7103 25.3753 17.7735C25.8157 18.8366 25.9309 20.0065 25.7064 21.1351C25.4819 22.2637 24.9278 23.3004 24.1141 24.1141C23.3004 24.9278 22.2637 25.4819 21.1351 25.7064C20.0065 25.9309 18.8366 25.8157 17.7735 25.3753C16.7103 24.9349 15.8017 24.1892 15.1624 23.2324C14.523 22.2756 14.1818 21.1507 14.1818 20C14.1818 18.4569 14.7948 16.977 15.8859 15.8859C16.977 14.7948 18.4569 14.1818 20 14.1818Z"
    fill="#D9D9D9"
  />
  <path
    d="M36 20C35.9953 15.8905 34.412 11.9452 31.5859 8.97559L31.3086 8.69141C28.3091 5.69187 24.242 4.00481 20 4C15.758 4.00481 11.6909 5.69187 8.69141 8.69141C5.69187 11.6909 4.00481 15.758 4 20L4.01074 20.6396C4.45155 34.0105 18.5523 44.0362 19.165 44.4639C19.4096 44.6352 19.7014 44.8633 20 44.8633C20.2986 44.8633 20.5904 44.6352 20.835 44.4639C21.4477 44.0362 35.5484 34.0106 35.9893 20.6396L36 20ZM20 14.1816C21.1507 14.1816 22.2756 14.5228 23.2324 15.1621C24.1892 15.8014 24.9346 16.7104 25.375 17.7734C25.8153 18.8365 25.9305 20.0062 25.7061 21.1348C25.4816 22.2634 24.9279 23.3006 24.1143 24.1143L23.959 24.2637C23.1705 24.9958 22.1928 25.4956 21.1348 25.7061C20.0062 25.9305 18.8365 25.8153 17.7734 25.375C16.7767 24.9621 15.9156 24.2811 15.2852 23.4092L15.1621 23.2324C14.5629 22.3356 14.2254 21.2909 14.1855 20.2158L14.1816 20C14.1816 18.4569 14.7946 16.9769 15.8857 15.8857C16.9769 14.7946 18.4569 14.1816 20 14.1816ZM18.1816 20C18.1816 20.3595 18.2886 20.7108 18.4883 21.0098C18.6881 21.3088 18.9725 21.5421 19.3047 21.6797C19.6368 21.8171 20.002 21.8533 20.3545 21.7832C20.7072 21.713 21.0319 21.5404 21.2861 21.2861C21.5404 21.0319 21.713 20.7072 21.7832 20.3545C21.8533 20.002 21.8171 19.6368 21.6797 19.3047C21.5421 18.9725 21.3088 18.6881 21.0098 18.4883C20.7108 18.2886 20.3595 18.1816 20 18.1816C19.5178 18.1816 19.0548 18.3729 18.7139 18.7139C18.3729 19.0548 18.1816 19.5178 18.1816 20ZM40 20C40 28.2407 35.6578 35.1557 31.6924 39.8008C27.6866 44.4932 23.608 47.4044 23.1289 47.7393C23.11 47.7525 23.0969 47.7627 23.0527 47.7939C23.0165 47.8196 22.9636 47.8568 22.9043 47.8975C22.7888 47.9766 22.6073 48.0972 22.3857 48.2207C21.9935 48.4395 21.1393 48.8633 20 48.8633C18.8607 48.8633 18.0065 48.4395 17.6143 48.2207C17.3927 48.0972 17.2112 47.9766 17.0957 47.8975C17.0364 47.8568 16.9835 47.8196 16.9473 47.7939C16.903 47.7626 16.8891 47.7535 16.8701 47.7402V47.7393C16.3879 47.4022 12.3116 44.4911 8.30762 39.8008C4.34224 35.1557 3.3503e-07 28.2407 0 20V19.9951L0.00683594 19.499C0.139559 14.3778 2.23188 9.49468 5.86328 5.86328C9.61177 2.11479 14.694 0.00610505 19.9951 0H20.0049L20.501 0.00683594C25.6222 0.139559 30.5053 2.23188 34.1367 5.86328C37.8852 9.61177 39.9939 14.694 40 19.9951V20Z"
    fill="white"
    fillOpacity="0.8"
  />
  <path
    d="M20 4C15.758 4.00481 11.6911 5.69207 8.69161 8.69161C5.69207 11.6911 4.00481 15.758 4 20C4 33.6909 18.5455 44.0309 19.1655 44.4636C19.41 44.635 19.7014 44.8633 20 44.8633C20.2986 44.8633 20.59 44.635 20.8345 44.4636C21.4545 44.0309 36 33.6909 36 20C35.9952 15.758 34.3079 11.6911 31.3084 8.69161C28.3089 5.69207 24.242 4.00481 20 4ZM20 14.1818C21.1507 14.1818 22.2756 14.523 23.2324 15.1624C24.1892 15.8017 24.9349 16.7103 25.3753 17.7735C25.8157 18.8366 25.9309 20.0065 25.7064 21.1351C25.4819 22.2637 24.9278 23.3004 24.1141 24.1141C23.3004 24.9278 22.2637 25.4819 21.1351 25.7064C20.0065 25.9309 18.8366 25.8157 17.7735 25.3753C16.7103 24.9349 15.8017 24.1892 15.1624 23.2324C14.523 22.2756 14.1818 21.1507 14.1818 20C14.1818 18.4569 14.7948 16.977 15.8859 15.8859C16.977 14.7948 18.4569 14.1818 20 14.1818Z"
    fill="#7FFFC3"
  />
  <path
    d="M20 4C24.242 4.00481 28.3091 5.69187 31.3086 8.69141C34.3081 11.6909 35.9952 15.758 36 20L35.9893 20.6396C35.5484 34.0106 21.4477 44.0362 20.835 44.4639C20.5904 44.6352 20.2986 44.8633 20 44.8633C19.7014 44.8633 19.4096 44.6352 19.165 44.4639C18.5523 44.0362 4.45155 34.0105 4.01074 20.6396L4 20C4.00481 15.758 5.69187 11.6909 8.69141 8.69141C11.6909 5.69187 15.758 4.00481 20 4ZM20 5C16.0232 5.00481 12.2105 6.58642 9.39844 9.39844C6.58619 12.2107 5.00455 16.0239 5 20.001C5.00035 26.4972 8.45957 32.2781 12.1104 36.5547C15.7457 40.8132 19.4601 43.4501 19.7373 43.6436L19.7393 43.6445C19.7726 43.6679 19.8081 43.6935 19.8369 43.7139C19.8678 43.7358 19.8962 43.7552 19.9229 43.7734C19.9519 43.7933 19.9779 43.8084 20 43.8223C20.0221 43.8084 20.0481 43.7933 20.0771 43.7734C20.1038 43.7552 20.1322 43.7358 20.1631 43.7139C20.1919 43.6935 20.2274 43.6679 20.2607 43.6445L20.2627 43.6436C20.5399 43.4501 24.2543 40.8132 27.8896 36.5547C31.5404 32.2781 34.9997 26.4972 35 20.001C34.9954 16.0239 33.4138 12.2107 30.6016 9.39844C27.7895 6.58642 23.9768 5.00481 20 5ZM20 13.1816C21.3485 13.1816 22.6668 13.5819 23.7881 14.3311C24.9092 15.0802 25.7828 16.1449 26.2988 17.3906C26.8149 18.6364 26.9505 20.0075 26.6875 21.3301C26.4244 22.6527 25.7748 23.8678 24.8213 24.8213C23.8677 25.7748 22.6527 26.4244 21.3301 26.6875C20.0075 26.9505 18.6364 26.8149 17.3906 26.2988C16.1449 25.7828 15.0802 24.9092 14.3311 23.7881C13.5819 22.6668 13.1816 21.3485 13.1816 20C13.1816 18.1917 13.9001 16.4574 15.1787 15.1787C16.4574 13.9001 18.1917 13.1816 20 13.1816ZM14.1855 20.2158C14.2254 21.2909 14.5629 22.3356 15.1621 23.2324C15.8014 24.1892 16.7104 24.9346 17.7734 25.375C18.8365 25.8153 20.0062 25.9305 21.1348 25.7061C22.1928 25.4956 23.1705 24.9958 23.959 24.2637L24.1143 24.1143C24.9279 23.3006 25.4816 22.2634 25.7061 21.1348C25.9305 20.0062 25.8153 18.8365 25.375 17.7734C24.9621 16.7767 24.2811 15.9156 23.4092 15.2852L23.2324 15.1621C22.2756 14.5228 21.1507 14.1816 20 14.1816C18.4569 14.1816 16.9769 14.7946 15.8857 15.8857C14.7946 16.9769 14.1816 18.4569 14.1816 20L14.1855 20.2158Z"
    fill="#80C1A2"
  />
</svg>
}