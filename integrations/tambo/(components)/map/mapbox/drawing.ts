import mapboxgl from 'mapbox-gl'
import { useEffect, useEffectEvent, useRef } from 'react'
import { useAssitant } from '~/integrations/tambo'
import { EMPTY_FEATURE_COLLECTION, getGeoJSONSource, useMapPanMode } from './'

type BBox = { west: number; south: number; east: number; north: number }

export function useRectangleMapDrawing({
  center,
}: {
  center: [number, number]
}) {
  //Drawing
  const startRef = useRef<mapboxgl.LngLat | null>(null)
  const drawingRef = useRef(false)
  const { setCurrentBBox } = useAssitant()

  const { map } = useAssitant()
  const panMode = useMapPanMode()

  const handleDrawStart = useEffectEvent((e: mapboxgl.MapMouseEvent) => {
    if (!map || e.originalEvent.button !== 0) return
    if (isClickOnPOI(map, e.point)) return

    if (isPanModeActive(e, panMode)) {
      map.dragPan.enable()
      return
    }

    drawingRef.current = true
    startRef.current = e.lngLat

    clearGeoJSONSource(map, 'selection')
    clearGeoJSONSource(map, 'pois')

    map.dragPan.disable()
    map.getCanvas().style.cursor = 'crosshair'
    e.preventDefault()
  })

  const handleDrawMove = useEffectEvent((e: mapboxgl.MapMouseEvent) => {
    if (!(map && drawingRef.current && startRef.current)) return

    const bbox = bboxFromLngLats(startRef.current, e.lngLat)
    const poly = bboxToPolygonFeature(bbox)
    getGeoJSONSource(map, 'selection')?.setData({
      type: 'FeatureCollection',
      features: [poly],
    })
  })

  const handleDrawEnd = useEffectEvent((e: mapboxgl.MapMouseEvent) => {
    if (!(map && drawingRef.current && startRef.current)) return

    drawingRef.current = false
    const bbox = bboxFromLngLats(startRef.current, e.lngLat)
    startRef.current = null

    map.getCanvas().style.cursor = ''

    if (isValidBBox(bbox)) {
      logBBoxSelection(bbox)
      setCurrentBBox(bbox)
    }

    if (!isPanModeActive(e, panMode)) {
      map.dragPan.disable()
    }
  })

  // Drawing interaction event listeners
  useEffect(() => {
    if (!map) return

    map.on('mousedown', handleDrawStart)
    map.on('mousemove', handleDrawMove)
    map.on('mouseup', handleDrawEnd)

    return () => {
      map.off('mousedown', handleDrawStart)
      map.off('mousemove', handleDrawMove)
      map.off('mouseup', handleDrawEnd)
    }
  }, [map])

  // Map Sources and Layers Setup
  useEffect(() => {
    if (!map) return

    map.dragPan.disable()
    map.doubleClickZoom.disable()

    // Attribution can't be removed; compact is allowed
    map.addControl(new mapboxgl.AttributionControl({ compact: true }))
    new mapboxgl.Marker().setLngLat(center).addTo(map)

    // Add GeoJSON sources
    map.addSource('selection', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    })

    // Selection layers (visible rectangle)
    map.addLayer({
      id: 'selection-fill',
      type: 'fill',
      source: 'selection',
      paint: {
        'fill-color': '#B6FFDD',
        'fill-opacity': 0.5,
      },
    })

    map.addLayer({
      id: 'selection-line',
      type: 'line',
      source: 'selection',
      paint: {
        'line-color': '#80C1A2',
        'line-width': 2,
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
    })
  }, [map, center])
}

//UTILS
/** Create a GeoJSON polygon feature from a bounding box */
function bboxToPolygonFeature(bbox: BBox) {
  return {
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
}

function bboxFromLngLats(a: mapboxgl.LngLat, b: mapboxgl.LngLat): BBox {
  return {
    west: Math.min(a.lng, b.lng),
    east: Math.max(a.lng, b.lng),
    south: Math.min(a.lat, b.lat),
    north: Math.max(a.lat, b.lat),
  }
}

function clearGeoJSONSource(map: mapboxgl.Map, id: string): void {
  getGeoJSONSource(map, id)?.setData(EMPTY_FEATURE_COLLECTION)
}

function isClickOnPOI(map: mapboxgl.Map, point: mapboxgl.Point): boolean {
  const poiLayers = ['pois-points', 'pois-points-selected', 'pois-labels']
  const existingLayers = poiLayers.filter((id) => map.getLayer(id))
  if (existingLayers.length === 0) return false
  return map.queryRenderedFeatures(point, { layers: existingLayers }).length > 0
}

function isPanModeActive(e: mapboxgl.MapMouseEvent, panMode: boolean): boolean {
  return e.originalEvent.metaKey || e.originalEvent.ctrlKey || panMode
}

/** Log bbox selection details to console */
function logBBoxSelection(bbox: BBox): void {
  const centerLng = (bbox.west + bbox.east) / 2
  const centerLat = (bbox.south + bbox.north) / 2
  const widthKm = (
    (bbox.east - bbox.west) *
    111 *
    Math.cos((centerLat * Math.PI) / 180)
  ).toFixed(2)
  const heightKm = ((bbox.north - bbox.south) * 111).toFixed(2)

  console.log('📍 Area selected:', {
    center: `${centerLat.toFixed(4)}°N, ${centerLng.toFixed(4)}°E`,
    size: `${widthKm} × ${heightKm} km`,
    bounds: {
      north: bbox.north.toFixed(4),
      south: bbox.south.toFixed(4),
      east: bbox.east.toFixed(4),
      west: bbox.west.toFixed(4),
    },
  })
}

function isValidBBox(bbox: BBox): boolean {
  const MIN_SIZE = 0.0001 // ~11 meters at equator
  const width = Math.abs(bbox.east - bbox.west)
  const height = Math.abs(bbox.north - bbox.south)
  return width > MIN_SIZE && height > MIN_SIZE
}