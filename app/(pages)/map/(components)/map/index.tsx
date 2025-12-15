'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export type BBox = { west: number; south: number; east: number; north: number }

export type Cafe = {
  id: number
  type: string
  name: string | null
  lat: number
  lon: number
  tags: Record<string, unknown>
}

export type AreaAnalyzeResponse = {
  area: { bbox: BBox }
  points_of_interest: { cafes: Cafe[] }
}

type Props = {
  className?: string
  height?: number | string
  pinSvgPath?: string
  useUserLocationOnLoad?: boolean
  fallbackCenter?: [number, number] // [lng, lat]
  fallbackZoom?: number
  userZoom?: number
  onResult?: (result: AreaAnalyzeResponse) => void
  onBBoxSelected?: (bbox: BBox) => void
}

const DEFAULT_FALLBACK_CENTER: [number, number] = [-74.00594, 40.71278] // NYC [lng, lat]

function getBrowserLocation(): Promise<{ lng: number; lat: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator))
      return reject(new Error('Geolocation not supported'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lng: pos.coords.longitude, lat: pos.coords.latitude }),
      reject,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    )
  })
}

function bboxFromLngLats(a: mapboxgl.LngLat, b: mapboxgl.LngLat): BBox {
  return {
    west: Math.min(a.lng, b.lng),
    east: Math.max(a.lng, b.lng),
    south: Math.min(a.lat, b.lat),
    north: Math.max(a.lat, b.lat),
  }
}

function cafesToFeatureCollection(cafes: Cafe[]) {
  return {
    type: 'FeatureCollection' as const,
    features: cafes
      .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon))
      .map((c) => ({
        type: 'Feature' as const,
        id: c.id,
        properties: { name: c.name ?? 'Coffee place' },
        geometry: { type: 'Point' as const, coordinates: [c.lon, c.lat] },
      })),
  }
}

export function AreaSelectMap({
  className,
  height = 520,
  pinSvgPath = 'assets/maps/pin.png',
  useUserLocationOnLoad = true,
  fallbackCenter = DEFAULT_FALLBACK_CENTER,
  fallbackZoom = 12,
  userZoom = 13,
  onResult,
  onBBoxSelected,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const startRef = useRef<mapboxgl.LngLat | null>(null)
  const drawingRef = useRef(false)

  // ✅ keep latest callbacks WITHOUT re-creating the map
  const onResultRef = useRef<Props['onResult']>(onResult)
  const onBBoxSelectedRef = useRef<Props['onBBoxSelected']>(onBBoxSelected)

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    onBBoxSelectedRef.current = onBBoxSelected
  }, [onBBoxSelected])

  // ✅ Cmd/Ctrl to pan; otherwise drag draws rectangle
  const panModeRef = useRef(false)

  const fcLng = fallbackCenter[0]
  const fcLat = fallbackCenter[1]

  useEffect(() => {
    if (mapRef.current) return
    if (!containerRef.current) return

    let map: mapboxgl.Map | null = null
    let isLoaded = false

    const setPanMode = (enabled: boolean) => {
      panModeRef.current = enabled
      if (!mapRef.current) return

      if (enabled) {
        mapRef.current.dragPan.enable()
        mapRef.current.getCanvas().style.cursor = 'grab'
      } else {
        mapRef.current.dragPan.disable()
        mapRef.current.getCanvas().style.cursor = ''
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') setPanMode(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') setPanMode(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    ;(async () => {
      let center: [number, number] = [fcLng, fcLat]
      let zoom = fallbackZoom

      if (useUserLocationOnLoad) {
        try {
          const loc = await getBrowserLocation()
          center = [loc.lng, loc.lat]
          zoom = userZoom
          console.log('📍 Using user location:', loc)
        } catch {
          console.log('📍 Location not available, using fallback center.')
        }
      }

      map = new mapboxgl.Map({
        container: containerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom,
      })

      mapRef.current = map

      map.on('load', () => {
        isLoaded = true

        // default: draw mode (no pan until Cmd/Ctrl)
        map!.dragPan.disable()

        // prevent double click zoom
        map!.doubleClickZoom.disable()

        // attribution can’t be removed; compact is allowed
        map!.addControl(new mapboxgl.AttributionControl({ compact: true }))

        // optional marker for initial center
        new mapboxgl.Marker().setLngLat(center).addTo(map!)

        map!.addSource('selection', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        })

        map!.addSource('cafes', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        })

        // selection layers (visible)
        map!.addLayer({
          id: 'selection-fill',
          type: 'fill',
          source: 'selection',
          paint: {
            'fill-color': '#22c55e',
            'fill-opacity': 0.25,
          },
        })

        map!.addLayer({
          id: 'selection-line',
          type: 'line',
          source: 'selection',
          paint: {
            'line-color': '#16a34a',
            'line-width': 3,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
        })

        // load pin image + add layers
        map!.loadImage('/' + pinSvgPath.replace(/^\//, ''), (err, image) => {
          if (err || !image) {
            console.error('❌ Failed to load pin icon:', err)
            return
          }

          if (!map!.hasImage('coffee-pin')) {
            map!.addImage('coffee-pin', image, { pixelRatio: 2 })
          }

          map!.addLayer({
            id: 'cafes-points',
            type: 'symbol',
            source: 'cafes',
            layout: {
              'icon-image': 'coffee-pin',
              'icon-anchor': 'bottom',
              'icon-allow-overlap': true,
              'icon-size': 1.0,
            },
          })

          map!.addLayer({
            id: 'cafes-points-selected',
            type: 'symbol',
            source: 'cafes',
            filter: ['==', ['id'], -1],
            layout: {
              'icon-image': 'coffee-pin',
              'icon-anchor': 'bottom',
              'icon-allow-overlap': true,
              'icon-size': 1.4,
            },
          })

          map!.addLayer({
            id: 'cafes-labels',
            type: 'symbol',
            source: 'cafes',
            layout: {
              'text-field': ['get', 'name'],
              'text-size': 12,
              'text-offset': [0, 1.4],
              'text-anchor': 'top',
            },
          })

          // click highlight
          const selectFeature = (feature: mapboxgl.MapboxGeoJSONFeature) => {
            if (feature.id == null) return
            const id = Number(feature.id)
            map!.setFilter('cafes-points-selected', ['==', ['id'], id])
          }

          map!.on('click', 'cafes-points', (e) => {
            const f = e.features?.[0]
            if (f) selectFeature(f)
          })
          map!.on('click', 'cafes-points-selected', (e) => {
            const f = e.features?.[0]
            if (f) selectFeature(f)
          })
        })
      })

      // draw rectangle with mouse; Cmd/Ctrl pans
      map.on('mousedown', (e) => {
        if (!isLoaded) return
        if (e.originalEvent.button !== 0) return

        if (
          e.originalEvent.metaKey ||
          e.originalEvent.ctrlKey ||
          panModeRef.current
        ) {
          map!.dragPan.enable()
          return
        }

        drawingRef.current = true
        startRef.current = e.lngLat

        // clear only when starting a NEW draw
        const src = map!.getSource('selection') as
          | mapboxgl.GeoJSONSource
          | undefined
        src?.setData({ type: 'FeatureCollection', features: [] })

        map!.dragPan.disable()
        map!.getCanvas().style.cursor = 'crosshair'
        e.preventDefault()
      })

      map.on('mousemove', (e) => {
        if (!(drawingRef.current && startRef.current)) return

        const bbox = bboxFromLngLats(startRef.current, e.lngLat)
        const poly = {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [bbox.west, bbox.south],
                [bbox.east, bbox.south],
                [bbox.east, bbox.north],
                [bbox.west, bbox.north],
                [bbox.west, bbox.south],
              ],
            ],
          },
        }

        const src = map!.getSource('selection') as
          | mapboxgl.GeoJSONSource
          | undefined
        src?.setData({ type: 'FeatureCollection', features: [poly] })
      })

      map.on('mouseup', async (e) => {
        if (!(drawingRef.current && startRef.current)) return

        drawingRef.current = false
        const bbox = bboxFromLngLats(startRef.current, e.lngLat)
        startRef.current = null

        map!.getCanvas().style.cursor = ''

        onBBoxSelectedRef.current?.(bbox)

        const res = await fetch('/api/area/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bbox }),
        })

        const data = (await res.json()) as AreaAnalyzeResponse

        const cafes = data.points_of_interest?.cafes ?? []
        const cafeSrc = map!.getSource('cafes') as
          | mapboxgl.GeoJSONSource
          | undefined
        cafeSrc?.setData(cafesToFeatureCollection(cafes))

        // ✅ DO NOT clear selection here => rectangle stays visible
        onResultRef.current?.(data)

        if (
          !(
            e.originalEvent.metaKey ||
            e.originalEvent.ctrlKey ||
            panModeRef.current
          )
        ) {
          map!.dragPan.disable()
        }
      })
    })()

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [
    // ✅ stable dependencies (numbers, not the array reference)
    fcLng,
    fcLat,
    fallbackZoom,
    pinSvgPath,
    useUserLocationOnLoad,
    userZoom,
  ])

  return (
    <div className={className} style={{ width: '100%' }}>
      <div ref={containerRef} style={{ height, width: '100%' }} />
    </div>
  )
}
