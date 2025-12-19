import mapboxgl from 'mapbox-gl'
import { useEffect, useEffectEvent } from 'react'
import { type BBox, useAssitant } from '~/integrations/tambo'
import type { POI } from './'
import { getGeoJSONSource } from './'
import { fetchWithRetry, updateMapPOIs } from './api'
import {
  type SearchParams,
  type SearchResult,
  useMapSearchListener,
} from './events'

type AreaAnalyzeResponse = {
  area: { bbox: BBox }
  points_of_interest: { items: POI[] }
  // Unknown category response fields
  unknownCategory?: boolean
  suggestedCategories?: string[]
}

export function useMapSearch({
  center,
  onResult,
}: {
  center: [number, number]
  onResult?: (result: AreaAnalyzeResponse) => void
}) {
  const { map, currentBBox } = useAssitant()

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

      // Check if API returned unknown category
      if (result.data.unknownCategory) {
        console.log(
          `❓ Unknown category "${params.category}", suggestions:`,
          result.data.suggestedCategories
        )
        return {
          unknownCategory: true,
          suggestedCategories: result.data.suggestedCategories,
        }
      }

      const pois = result.data.points_of_interest?.items ?? []
      console.log(
        `🗺️ Updating map with ${pois.length} POIs for category: "${params.category}"${params.brandFilter ? ` (brand: ${params.brandFilter})` : ''}`
      )

      updateMapPOIs(map, pois, getGeoJSONSource, poisToFeatureCollection)
      onResult?.(result.data)

      return {}
    }
  )

  // Map Sources and Layers Setup
  useEffect(() => {
    if (!map) return

    map.dragPan.disable()
    map.doubleClickZoom.disable()

    // Attribution can't be removed; compact is allowed
    map.addControl(new mapboxgl.AttributionControl({ compact: true }))
    new mapboxgl.Marker().setLngLat(center).addTo(map)

    map.addSource('pois', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    })

    map.addLayer({
      id: 'pois-points',
      type: 'circle',
      source: 'pois',
      paint: {
        'circle-radius': 8,
        'circle-color': '#ef4444',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    })

    map.addLayer({
      id: 'pois-labels',
      type: 'symbol',
      source: 'pois',
      layout: {
        'text-field': ['get', 'name'],
        'text-offset': [0, 1.5],
        'text-anchor': 'top',
        'text-size': 12,
      },
      paint: {
        'text-color': '#1f2937',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1,
      },
    })
  }, [map, center])

  // Listen for search events from tools
  useMapSearchListener(handleSearch)

  return { handleSearch }
}

function poisToFeatureCollection(pois: POI[]) {
  return {
    type: 'FeatureCollection' as const,
    features: pois
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))
      .map((p) => {
        // Try to get name from various possible fields in tags
        let displayName: string | null = p.name
        if (!displayName && p.tags) {
          // Common OSM name fields - ensure they're strings
          const getStringTag = (key: string): string | null => {
            const value = p.tags[key]
            return typeof value === 'string' ? value : null
          }

          displayName =
            getStringTag('name') ||
            getStringTag('name:en') ||
            getStringTag('name:es') ||
            getStringTag('name:fr') ||
            getStringTag('name:de') ||
            getStringTag('alt_name') ||
            getStringTag('official_name') ||
            // Try to infer from amenity/leisure/shop type
            getStringTag('amenity') ||
            getStringTag('leisure') ||
            getStringTag('shop') ||
            getStringTag('tourism') ||
            null
        }

        return {
          type: 'Feature' as const,
          id: p.id,
          properties: { name: displayName ?? 'Point of interest' },
          geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] },
        }
      }),
  }
}
