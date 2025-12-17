'use client'

import mapboxgl from 'mapbox-gl'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export type BBox = { west: number; south: number; east: number; north: number }

export type POI = {
  id: number
  type: string
  name: string | null
  lat: number
  lon: number
  tags: Record<string, unknown>
}

export type AreaAnalyzeResponse = {
  area: { bbox: BBox }
  points_of_interest: { items: POI[] }
}

export type AreaSelectMapHandle = {
  search: (query: string) => Promise<void>
  getCurrentBBox: () => BBox | null
}

type Props = {
  className?: string
  height?: number | string
  pinSvgPath?: string
  fallbackZoom?: number
  initialCenter?: [number, number] // [lng, lat]
  initialBBox?: BBox // Initial bounding box to display
  onResult?: (result: AreaAnalyzeResponse) => void
  onBBoxSelected?: (bbox: BBox) => void
}

const DEFAULT_CENTER: [number, number] = [-74.00594, 40.71278] // NYC [lng, lat]

function bboxFromLngLats(a: mapboxgl.LngLat, b: mapboxgl.LngLat): BBox {
  return {
    west: Math.min(a.lng, b.lng),
    east: Math.max(a.lng, b.lng),
    south: Math.min(a.lat, b.lat),
    north: Math.max(a.lat, b.lat),
  }
}

function poisToFeatureCollection(pois: POI[]) {
  return {
    type: 'FeatureCollection' as const,
    features: pois
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))
      .map((p) => ({
        type: 'Feature' as const,
        id: p.id,
        properties: { name: p.name ?? 'Point of interest' },
        geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] },
      })),
  }
}

export const AreaSelectMap = forwardRef<AreaSelectMapHandle, Props>(
  function AreaSelectMap(
    {
      className,
      height = 520,
      pinSvgPath = 'assets/maps/pin.png',
      fallbackZoom = 12,
      initialCenter,
      initialBBox,
      onResult,
      onBBoxSelected,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)

    const startRef = useRef<mapboxgl.LngLat | null>(null)
    const drawingRef = useRef(false)

    // ✅ Store current bbox
    const currentBBoxRef = useRef<BBox | null>(null)

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

    // Prevent page scroll when using mouse wheel on map (allow map zoom only)
    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const handleWheel = (e: WheelEvent) => {
        // Check if event is from Mapbox canvas (let it handle zoom)
        const target = e.target as HTMLElement
        const isMapboxCanvas = target.tagName === 'CANVAS' && 
          (target.classList.contains('mapboxgl-canvas') || 
           container.querySelector('.mapboxgl-canvas') === target)
        
        // If it's on the Mapbox canvas, let Mapbox handle it for zoom
        // but still prevent page scroll by preventing default
        if (isMapboxCanvas) {
          e.preventDefault()
          return
        }
        
        // For other elements in the container, prevent page scroll
        e.preventDefault()
        e.stopPropagation()
      }

      // Use bubble phase so Mapbox can handle canvas events first
      container.addEventListener('wheel', handleWheel, { passive: false })

      return () => {
        container.removeEventListener('wheel', handleWheel)
      }
    }, [])

    // ✅ Expose search function via ref
    useImperativeHandle(ref, () => ({
      search: async (query: string) => {
        const bbox = currentBBoxRef.current
        if (!bbox) {
          console.warn('No area selected. Please draw a rectangle first.')
          return
        }

        try {
          const res = await fetch('/api/area/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bbox, query }),
          })

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
            console.error('Search failed:', errorData.error || 'Unknown error')
            
            if (res.status === 503 || res.status === 504) {
              console.warn('Map service is busy. Please try again in a moment.')
            }
            return
          }

          const data = (await res.json()) as AreaAnalyzeResponse

          const pois = data.points_of_interest?.items ?? []
          const poiSrc = mapRef.current?.getSource('pois') as
            | mapboxgl.GeoJSONSource
            | undefined
          poiSrc?.setData(poisToFeatureCollection(pois))

          onResultRef.current?.(data)
        } catch (error) {
          console.error('Search request failed:', error)
        }
      },
      getCurrentBBox: () => currentBBoxRef.current,
    }))

  useEffect(() => {
    if (mapRef.current) return
    if (!containerRef.current) return
    if (containerRef.current.querySelector('.mapboxgl-map')) return

    // Use NYC as default center
    const fcLng = DEFAULT_CENTER[0]
    const fcLat = DEFAULT_CENTER[1]

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
      const center: [number, number] = initialCenter ?? [fcLng, fcLat]
      const zoom = fallbackZoom

      console.log('📍 Using location:', { lng: center[0], lat: center[1] })

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

        map!.addSource('pois', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        })

        // If initialBBox is provided, draw it on the map
        if (initialBBox) {
          const poly = {
            type: 'Feature' as const,
            properties: {},
            geometry: {
              type: 'Polygon' as const,
              coordinates: [
                [
                  [initialBBox.west, initialBBox.south],
                  [initialBBox.east, initialBBox.south],
                  [initialBBox.east, initialBBox.north],
                  [initialBBox.west, initialBBox.north],
                  [initialBBox.west, initialBBox.south],
                ],
              ],
            },
          }

          const src = map!.getSource('selection') as
            | mapboxgl.GeoJSONSource
            | undefined
          src?.setData({ type: 'FeatureCollection', features: [poly] })

          // Store the bbox
          currentBBoxRef.current = initialBBox
          
          // Notify parent
          onBBoxSelectedRef.current?.(initialBBox)
        }

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
            id: 'pois-points',
            type: 'symbol',
            source: 'pois',
            layout: {
              'icon-image': 'coffee-pin',
              'icon-anchor': 'bottom',
              'icon-allow-overlap': true,
              'icon-size': 1.0,
            },
          })

          map!.addLayer({
            id: 'pois-points-selected',
            type: 'symbol',
            source: 'pois',
            filter: ['==', ['id'], -1],
            layout: {
              'icon-image': 'coffee-pin',
              'icon-anchor': 'bottom',
              'icon-allow-overlap': true,
              'icon-size': 1.4,
            },
          })

          map!.addLayer({
            id: 'pois-labels',
            type: 'symbol',
            source: 'pois',
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
            map!.setFilter('pois-points-selected', ['==', ['id'], id])
          }

          map!.on('click', 'pois-points', (e) => {
            const f = e.features?.[0]
            if (f) selectFeature(f)
          })
          map!.on('click', 'pois-points-selected', (e) => {
            const f = e.features?.[0]
            if (f) selectFeature(f)
          })
        })
      })

      // draw rectangle with mouse; Cmd/Ctrl pans
      map.on('mousedown', (e) => {
        if (!isLoaded) return
        if (e.originalEvent.button !== 0) return

        // don't start drawing if clicking on a POI pin
        const features = map!.queryRenderedFeatures(e.point, {
          layers: ['pois-points', 'pois-points-selected', 'pois-labels'],
        })
        if (features.length > 0) {
          // let the click handler on cafes handle this
          return
        }

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

        // clear POIs when starting a new draw
        const poiSrc = map!.getSource('pois') as
          | mapboxgl.GeoJSONSource
          | undefined
        poiSrc?.setData({ type: 'FeatureCollection', features: [] })

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

      map.on('mouseup', (e) => {
        if (!(drawingRef.current && startRef.current)) return

        drawingRef.current = false
        const bbox = bboxFromLngLats(startRef.current, e.lngLat)
        startRef.current = null

        map!.getCanvas().style.cursor = ''

        // ✅ Store the bbox for later searches
        currentBBoxRef.current = bbox

        // ✅ Notify parent that bbox was selected (but don't search yet)
        onBBoxSelectedRef.current?.(bbox)

        // ✅ DO NOT clear selection here => rectangle stays visible
        // ✅ DO NOT search automatically - wait for user query

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
    fallbackZoom,
    pinSvgPath,
    initialCenter?.[0],
    initialCenter?.[1],
    initialBBox?.west,
    initialBBox?.east,
    initialBBox?.south,
    initialBBox?.north,
  ])

    return (
      <div className={className} style={{ width: '100%' }}>
        <div 
          ref={containerRef} 
          data-lenis-prevent
          style={{ height, width: '100%' }} 
        />
      </div>
    )
  }
)
