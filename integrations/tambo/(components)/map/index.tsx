import { withInteractable } from '@tambo-ai/react'
import { AreaSelectMap } from '~/integrations/tambo/(components)/map/area-select-map'
import { useMap } from './map-context'
import { MapSchema } from './schema'

// Re-export MapAssistant for convenience
export { MapAssistant } from './map-assistant'

type MapComponentProps = {
  height: number
  center?: { lng: number; lat: number }
  zoom?: number
  selectedArea?: { west: number; east: number; south: number; north: number }
  location?: string
}

function MapComponent({
  height,
  center,
  zoom,
  selectedArea,
}: MapComponentProps) {
  const { mapRef } = useMap()

  return (
    <div className="absolute top-0 left-0 w-full">
      <AreaSelectMap
        ref={mapRef}
        height={height}
        fallbackZoom={zoom}
        initialCenter={center ? [center.lng, center.lat] : undefined}
        initialBBox={selectedArea}
      />
    </div>
  )
}

export const InterctableMap = withInteractable(MapComponent, {
  componentName: 'map',
  description:
    'A map component for selecting an area on a map and analyzing the area for things to do and add pins to the map',
  propsSchema: MapSchema as any,
})
