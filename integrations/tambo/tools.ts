import { defineTool, type TamboTool } from '@tambo-ai/react'
import { z } from 'zod'
import type { POI } from '~/integrations/tambo'
import {
  dispatchAddToItinerary,
  dispatchMapNavigation,
  dispatchMapSearch,
} from '~/integrations/tambo/(components)/map/mapbox/events'
import { isEmptyArray } from '~/libs/utils'

type BBox = {
  west: number
  east: number
  south: number
  north: number
}

type MapboxFeature = {
  place_name: string
  center: [number, number]
  bbox?: [number, number, number, number]
  place_type?: string[]
}

type LocationResult = {
  name: string
  center: { lng: number; lat: number }
  bbox: BBox | null
  placeType: string
}

type SearchLocationResult =
  | { found: false; message: string; suggestions: never[] }
  | { found: true; message: string; results: LocationResult[] }

type AreaSuggestion = {
  category: string
  queries: string[]
}

type AnalyzeAreaResult = {
  success: boolean
  message: string
  count: number
  names: string[]
  points_of_interest: POI[]
}

export type ForecastDay = {
  date: string
  temperatureMax: number
  temperatureMin: number
  temperatureUnit: string
  weatherCode: number
  weatherDescription: string
  precipitation: number
  precipitationUnit: string
  windSpeedMax: number
  windSpeedUnit: string
}

type WeatherResult = {
  message: string
  timezone: string
  forecast: ForecastDay[]
  units: {
    temperature: string
    precipitation: string
    windSpeed: string
  }
}

// Tool 1: Search and display results on the map
// Note: This tool dispatches a search event. The actual search and bbox validation
// happens in the useMapSearch hook which has access to React context.
async function analyzeArea(params: {
  category: string
  brandFilter?: string
}): Promise<AnalyzeAreaResult> {
  try {
    const result = await dispatchMapSearch({
      category: params.category,
      brandFilter: params.brandFilter,
    })

    const message =
      result.count > 0
        ? `Found ${result.count} places matching "${params.category}"${params.brandFilter ? ` filtered by "${params.brandFilter}"` : ''}${!isEmptyArray(result.names) ? `: ${result.names.join(', ')}` : ''}`
        : `No places found matching "${params.category}"${params.brandFilter ? ` filtered by "${params.brandFilter}"` : ''} in the selected area`

    return {
      success: !isEmptyArray(result.names),
      message,
      count: result.count,
      names: result.names,
      points_of_interest: result.pois,
    }
  } catch (error) {
    console.error('Search failed', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to search area'
    )
  }
}

// Tool 2: Search for a location by name (geocoding)
export async function searchLocation(params: {
  location: string
}): Promise<SearchLocationResult> {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!mapboxToken) {
    throw new Error('Mapbox token is not configured')
  }

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(params.location)}.json?access_token=${mapboxToken}&limit=5`

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error('Failed to search for location')
    }

    const data = await res.json()

    if (!data.features || data.features.length === 0) {
      return {
        found: false,
        message: `No locations found for "${params.location}"`,
        suggestions: [],
      }
    }

    const results = data.features.map((feature: MapboxFeature) => ({
      name: feature.place_name,
      center: {
        lng: feature.center[0],
        lat: feature.center[1],
      },
      bbox: feature.bbox
        ? {
            west: feature.bbox[0],
            south: feature.bbox[1],
            east: feature.bbox[2],
            north: feature.bbox[3],
          }
        : null,
      placeType: feature.place_type?.[0] || 'place',
    }))

    // Navigate to the first result
    if (!isEmptyArray(results)) {
      const firstResult = results[0]
      dispatchMapNavigation({
        destination: params.location,
        center: firstResult.center,
        zoom: 12,
      })
    }

    return {
      found: true,
      message: `Found ${results.length} locations matching "${params.location}" and navigated to ${results[0]?.name || 'the location'}`,
      results,
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to search location'
    )
  }
}

// Tool 3: Get suggestions for what to search in an area
async function getAreaSuggestions(): Promise<{
  message: string
  suggestions: AreaSuggestion[]
}> {
  const suggestions = [
    {
      category: 'Food & Drink',
      queries: ['coffee', 'restaurants', 'bars', 'cafes'],
    },
    { category: 'Tourism', queries: ['attractions', 'museums', 'sightseeing'] },
    {
      category: 'Entertainment',
      queries: ['entertainment', 'theaters', 'cinemas', 'nightlife'],
    },
    { category: 'Shopping', queries: ['shops', 'stores', 'shopping'] },
  ]

  return {
    message:
      'Here are some suggestions for what you can search for in the selected area',
    suggestions,
  }
}

type AddToItineraryToolResult = {
  success: boolean
  message: string
  addedItem: { name: string; id: string | number }
}

// Tool 4: Add a POI to the itinerary
async function addPoiToItinerary(params: {
  poi: POI
  selectedDate: string
}): Promise<AddToItineraryToolResult> {
  try {
    const result = await dispatchAddToItinerary(params)
    return {
      success: result.success,
      message: `Added "${result.addedItem.name}" to your itinerary`,
      addedItem: result.addedItem,
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to add to itinerary'
    )
  }
}

// Tool 5: Get current date
export async function getCurrentDate(): Promise<{
  message: string
  date: string
}> {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return {
    message: `The current date is ${formattedDate}`,
    date: formattedDate,
  }
}

// Tool 6: Get weather for coordinates
export async function getWeather(params: {
  latitude: number
  longitude: number
}): Promise<WeatherResult> {
  try {
    // Validate coordinates
    if (
      typeof params.latitude !== 'number' ||
      typeof params.longitude !== 'number'
    ) {
      throw new Error('Latitude and longitude must be valid numbers')
    }

    if (params.latitude < -90 || params.latitude > 90) {
      throw new Error('Latitude must be between -90 and 90')
    }

    if (params.longitude < -180 || params.longitude > 180) {
      throw new Error('Longitude must be between -180 and 180')
    }

    // Call weather API route (relative URL works in both client and server contexts)
    const url = `/api/weather?lat=${params.latitude}&lon=${params.longitude}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `Failed to fetch weather: ${response.statusText}`
      )
    }

    const data = await response.json()

    // Validate forecast data
    if (
      !(data.forecast && Array.isArray(data.forecast)) ||
      isEmptyArray(data.forecast)
    ) {
      throw new Error('Invalid forecast data received')
    }

    // Format user-friendly message with week forecast summary
    const forecastSummary = data.forecast
      .slice(0, 7)
      .map((day: ForecastDay) => {
        const date = new Date(day.date)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
        return `${dayName}: ${day.weatherDescription}, ${day.temperatureMin}${day.temperatureUnit}-${day.temperatureMax}${day.temperatureUnit}`
      })
      .join('; ')

    const message = `7-day weather forecast for coordinates ${params.latitude.toFixed(4)}, ${params.longitude.toFixed(4)}: ${forecastSummary}`

    return {
      message,
      timezone: data.timezone,
      forecast: data.forecast,
      units: data.units,
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to get weather data'
    )
  }
}

export const mapTools: TamboTool[] = [
  defineTool({
    name: 'analyze_selected_area',
    description:
      'Search for places in the selected map area and display them as pins. ' +
      "Extract the category (type of place) and optionally a specific brand/name filter from the user's request. " +
      'The user must draw a rectangle on the map first.',
    tool: analyzeArea,
    inputSchema: z.object({
      category: z
        .string()
        .describe(
          'The type of place to search for. Can be any text query. ' +
            'Examples: "coffee shop", "restaurant", "hotel", "gym", "pharmacy", "Starbucks", "museum"'
        ),
      brandFilter: z
        .string()
        .optional()
        .describe(
          'Optional: specific brand or business name to combine with the category. ' +
            'Examples: "Starbucks", "McDonald\'s", "Hilton", "Planet Fitness"'
        ),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      count: z.number(),
      names: z.array(z.string()),
    }),
  }),
  defineTool({
    name: 'search_location',
    description:
      'Search for a location by name (e.g., "New York City", "Paris, France", "Central Park") and navigate the map to that location. ' +
      'The map will automatically fly to the first matching result.',
    tool: searchLocation,
    inputSchema: z.object({
      location: z.string().describe('The location name to search for'),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      message: z.string(),
      results: z
        .array(
          z.object({
            name: z.string(),
            center: z.object({
              lng: z.number(),
              lat: z.number(),
            }),
            bbox: z
              .object({
                west: z.number(),
                south: z.number(),
                east: z.number(),
                north: z.number(),
              })
              .nullable(),
            placeType: z.string(),
          })
        )
        .optional(),
    }),
  }),
  defineTool({
    name: 'get_area_suggestions',
    description:
      'Get suggestions for what types of places can be searched for in a map area',
    tool: getAreaSuggestions,
    inputSchema: z.object({}),
    outputSchema: z.object({
      message: z.string(),
      suggestions: z.array(
        z.object({
          category: z.string(),
          queries: z.array(z.string()),
        })
      ),
    }),
  }),
  defineTool({
    name: 'add_to_itinerary',
    description:
      "Add a point of interest (POI) to the user's travel itinerary. " +
      'Use this when the user wants to save a location they found on the map to their itinerary. ' +
      'The POI must have been returned from a previous search or analysis.',
    tool: addPoiToItinerary,
    inputSchema: z.object({
      poi: z
        .object({
          id: z
            .union([z.string(), z.number()])
            .describe('Unique identifier for the POI'),
          type: z
            .string()
            .describe('Type of the POI (e.g., "restaurant", "museum")'),
          name: z.string().nullable().describe('Name of the POI'),
          lat: z.number().describe('Latitude coordinate'),
          lon: z.number().describe('Longitude coordinate'),
        })
        .describe('The point of interest to add to the itinerary'),
      selectedDate: z
        .string()
        .describe(
          'Date for when to visit this location (YYYY-MM-DD HH:MM format)'
        ),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      addedItem: z.object({
        name: z.string(),
        id: z.union([z.string(), z.number()]),
      }),
    }),
  }),
  defineTool({
    name: 'get_current_date',
    description: 'Get local current date',
    tool: getCurrentDate,
    inputSchema: z.object({}),
    outputSchema: z.object({
      message: z.string(),
      date: z.string(),
    }),
  }),
  defineTool({
    name: 'get_weather',
    description:
      'Get seven days weather forecast for a specific location using latitude and longitude coordinates.' +
      'Returns temperature, weather conditions, precipitation, and wind speed.',
    tool: getWeather,
    inputSchema: z.object({
      latitude: z
        .number()
        .min(-90)
        .max(90)
        .describe('Latitude coordinate (-90 to 90)'),
      longitude: z
        .number()
        .min(-180)
        .max(180)
        .describe('Longitude coordinate (-180 to 180)'),
    }),
    outputSchema: z.object({
      message: z.string(),
      timezone: z.string(),
      forecast: z.array(
        z.object({
          date: z.string(),
          temperatureMax: z.number(),
          temperatureMin: z.number(),
          temperatureUnit: z.string(),
          weatherCode: z.number(),
          weatherDescription: z.string(),
          precipitation: z.number(),
          precipitationUnit: z.string(),
          windSpeedMax: z.number(),
          windSpeedUnit: z.string(),
        })
      ),
      units: z.object({
        temperature: z.string(),
        precipitation: z.string(),
        windSpeed: z.string(),
      }),
    }),
  }),
]
