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
