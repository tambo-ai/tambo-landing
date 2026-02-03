import type { Destination } from '.'

// Feature flag - set NEXT_PUBLIC_MAPBOX_ENABLED=true to enable Mapbox integration
export const MAPBOX_ENABLED = process.env.NEXT_PUBLIC_MAPBOX_ENABLED === 'true'

export const DEMOS = {
  INTRO: 'intro',
  SEAT: 'seat',
  MAP: 'map',
} as const

export const SEAT_MAP_CONFIG = {
  rows: 25,
  columns: ['A', 'B', 'C', 'D', 'E', 'F'],
  rowsPerPage: 4,
  seatsPerRow: 6,
  emergencyExitRows: [11, 12],
} as const

export const DEFAULT_DESTINATION = {
  name: 'New York',
  center: [-74.00594, 40.71278],
} satisfies Destination
