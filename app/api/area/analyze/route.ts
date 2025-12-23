import { NextResponse } from 'next/server'

type BBox = { west: number; south: number; east: number; north: number }

type RequestBody = {
  bbox: BBox
  category: string
  brandFilter?: string
}

type MapboxFeature = {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  properties: {
    mapbox_id: string
    name: string
    name_preferred?: string
    full_address?: string
    place_formatted?: string
    context: string
    poi_category?: string[]
    poi_category_ids?: string[]
    brand?: string
    brand_id?: string
    metadata?: Record<string, unknown>
    [key: string]: unknown
  }
}

type MapboxSearchResponse = {
  type: 'FeatureCollection'
  features: MapboxFeature[]
  attribution: string
}

export async function POST(req: Request) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!mapboxToken) {
    return NextResponse.json(
      { error: 'Mapbox token is not configured' },
      { status: 500 }
    )
  }

  const body = (await req.json()) as RequestBody
  const { west, south, east, north } = body.bbox
  const { category, brandFilter } = body

  // Build search query - combine category and brand filter if provided
  const searchQuery = brandFilter ? `${brandFilter} ${category}` : category

  // Build Mapbox Search Box API URL
  // bbox format: min_longitude,min_latitude,max_longitude,max_latitude
  const params = new URLSearchParams({
    q: searchQuery,
    access_token: mapboxToken,
    bbox: `${west},${south},${east},${north}`,
    proximity: `${(west + east) / 2},${(south + north) / 2}`,
    types: 'poi',
    limit: '10',
  })

  const url = `https://api.mapbox.com/search/searchbox/v1/forward?${params.toString()}`

  // Add timeout to fetch request (15 seconds)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const text = await response.text()
      console.error('Mapbox Search Box error:', text)

      return NextResponse.json(
        { error: 'Map search failed', details: text },
        { status: response.status }
      )
    }

    const data: MapboxSearchResponse = await response.json()

    // Map Mapbox features to POI format
    const items = data.features.map((feature) => ({
      id: feature.properties.mapbox_id,
      type: 'poi',
      name: feature.properties.name_preferred || feature.properties.name,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      tags: {
        full_address: feature.properties.full_address,
        place_formatted: feature.properties.place_formatted,
        category: feature.properties.poi_category,
        brand: feature.properties.brand,
        context: feature.properties.context,
      },
      metadata: feature.properties.metadata,
    }))

    const result = {
      area: {
        bbox: body.bbox,
      },
      points_of_interest: {
        items,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Mapbox Search Box request timeout')
      return NextResponse.json(
        {
          error:
            'Request timeout. The search service took too long to respond.',
          details: 'Please try again.',
        },
        { status: 504 }
      )
    }

    console.error('Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
