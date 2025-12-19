import { defineTool, type TamboTool } from '@tambo-ai/react'
import { z } from 'zod'
import { dispatchMapSearch } from './mapbox/events'

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
  unknownCategory?: boolean
  suggestedCategories?: string[]
}

// Tool 1: Search and display results on the map
// Note: This tool dispatches a search event. The actual search and bbox validation
// happens in the useMapSearch hook which has access to React context.
async function analyzeArea(params: {
  category: string
  brandFilter?: string
}): Promise<AnalyzeAreaResult> {
  try {
    console.log(
      `🔍 Triggering map search: category="${params.category}", brand="${params.brandFilter || 'none'}"`
    )

    const result = await dispatchMapSearch({
      category: params.category,
      brandFilter: params.brandFilter,
    })

    // Check if the category was unknown
    if (result.unknownCategory) {
      return {
        success: false,
        message: `I don't know how to search for "${params.category}". Could you tell me what type of place this is? For example, is it more like: ${result.suggestedCategories?.join(', ') || 'a restaurant, cafe, shop, or something else'}?`,
        unknownCategory: true,
        suggestedCategories: result.suggestedCategories,
      }
    }

    return {
      success: true,
      message: `Found places matching "${params.category}"${params.brandFilter ? ` filtered by "${params.brandFilter}"` : ''} and displayed them on the map`,
    }
  } catch (error) {
    console.error(`❌ Search failed`, error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to search area'
    )
  }
}

// Tool 2: Search for a location by name (geocoding)
async function searchLocation(params: {
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

    return {
      found: true,
      message: `Found ${results.length} locations matching "${params.location}"`,
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

export const mapTools: TamboTool[] = [
  defineTool({
    name: 'analyze_selected_area',
    description:
      'Search for places in the selected map area and display them as pins. ' +
      "Extract the category (type of place) and optionally a specific brand/name filter from the user's request. " +
      'If the result indicates unknownCategory=true, ask the user to clarify what type of place it is using the suggestedCategories as hints. ' +
      'The user must draw a rectangle on the map first.',
    tool: analyzeArea,
    inputSchema: z.object({
      category: z
        .string()
        .describe(
          'The type of place to search for. Examples: "coffee shop", "restaurant", "hotel", ' +
            '"gym", "pharmacy", "gas station", "bank", "park", "museum", "supermarket", ' +
            '"hospital", "school", "bar", "cinema", "office", "coworking space"'
        ),
      brandFilter: z
        .string()
        .optional()
        .describe(
          'Optional: specific brand or business name to filter results. ' +
            'Examples: "Starbucks", "McDonald\'s", "Hilton", "Planet Fitness", "Walgreens"'
        ),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      unknownCategory: z.boolean().optional(),
      suggestedCategories: z.array(z.string()).optional(),
    }),
  }),
  defineTool({
    name: 'search_location',
    description:
      'Search for a location by name (e.g., "New York City", "Paris, France", "Central Park") and get coordinates and bounding box',
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
]
