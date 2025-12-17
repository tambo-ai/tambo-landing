import { NextResponse } from 'next/server'

type BBox = { west: number; south: number; east: number; north: number }

// Map common queries to OSM tags
function getOSMTags(query: string): string[] {
  const normalizedQuery = query.toLowerCase()

  // Coffee/cafe queries
  if (
    normalizedQuery.includes('coffee') ||
    normalizedQuery.includes('cafe') ||
    normalizedQuery.includes('café') ||
    normalizedQuery.includes('espresso') ||
    normalizedQuery.includes('latte')
  ) {
    return ['amenity=cafe', 'amenity=coffee_shop']
  }

  // Restaurant queries
  if (
    normalizedQuery.includes('restaurant') ||
    normalizedQuery.includes('dining') ||
    normalizedQuery.includes('eat') ||
    normalizedQuery.includes('food')
  ) {
    return ['amenity=restaurant', 'amenity=fast_food']
  }

  // Bar/pub queries
  if (
    normalizedQuery.includes('bar') ||
    normalizedQuery.includes('pub') ||
    normalizedQuery.includes('drink')
  ) {
    return ['amenity=bar', 'amenity=pub']
  }

  // Shopping queries
  if (
    normalizedQuery.includes('shop') ||
    normalizedQuery.includes('store') ||
    normalizedQuery.includes('buy') ||
    normalizedQuery.includes('shopping')
  ) {
    return ['shop']
  }

  // Attractions/tourism
  if (
    normalizedQuery.includes('attraction') ||
    normalizedQuery.includes('tourist') ||
    normalizedQuery.includes('museum') ||
    normalizedQuery.includes('sightseeing') ||
    normalizedQuery.includes('interesting') ||
    normalizedQuery.includes('visit')
  ) {
    return ['tourism']
  }

  // Entertainment queries (theaters, cinemas, clubs, etc.)
  if (
    normalizedQuery.includes('entertainment') ||
    normalizedQuery.includes('entertain') ||
    normalizedQuery.includes('theater') ||
    normalizedQuery.includes('cinema') ||
    normalizedQuery.includes('club') ||
    normalizedQuery.includes('nightlife') ||
    normalizedQuery.includes('show') ||
    normalizedQuery.includes('more places') ||
    normalizedQuery.includes('more options')
  ) {
    // Return multiple categories for entertainment
    return [
      'amenity=cafe',
      'amenity=restaurant',
      'amenity=bar',
      'amenity=pub',
      'tourism',
      'leisure',
    ]
  }

  // Default: search for cafes (backward compatibility)
  return ['amenity=cafe']
}

function buildOverpassQuery(tags: string[], bbox: BBox): string {
  const { west, south, east, north } = bbox

  const queries = tags.map((tag) => {
    if (tag.includes('=')) {
      const [key, value] = tag.split('=')
      return `
  node["${key}"="${value}"](${south},${west},${north},${east});
  way["${key}"="${value}"](${south},${west},${north},${east});
  relation["${key}"="${value}"](${south},${west},${north},${east});`
    }
    // For tags without values (like "shop", "tourism")
    return `
  node["${tag}"](${south},${west},${north},${east});
  way["${tag}"](${south},${west},${north},${east});
  relation["${tag}"](${south},${west},${north},${east});`
  })

  return `
[out:json][timeout:60];
(${queries.join('')}
);
out center tags;
`.trim()
}

export async function POST(req: Request) {
  const body = (await req.json()) as { bbox: BBox; query?: string }
  const { west, south, east, north } = body.bbox
  const query = body.query || ''

  const tags = getOSMTags(query)
  const overpassQuery = buildOverpassQuery(tags, { west, south, east, north })

  // Add timeout to fetch request (70 seconds - slightly longer than Overpass timeout)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 70000)

  try {
    const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!overpassRes.ok) {
      const text = await overpassRes.text()
      console.error('❌ Overpass error:', text)

      // Check if it's a timeout error
      if (text.includes('timeout') || text.includes('too busy')) {
        return NextResponse.json(
          {
            error:
              'The map service is currently busy. Please try again in a moment.',
            details: 'The OpenStreetMap server is temporarily overloaded.',
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: 'Map search failed', details: text },
        { status: 502 }
      )
    }

    const overpassData = await overpassRes.json()

    const items = (overpassData.elements ?? []).map(
      (el: {
        id: number
        type: string
        lat?: number
        lon?: number
        center?: { lat: number; lon: number }
        tags?: Record<string, string>
      }) => {
        const lat = el.lat ?? el.center?.lat
        const lon = el.lon ?? el.center?.lon
        return {
          id: el.id,
          type: el.type,
          name: el.tags?.name ?? null,
          lat,
          lon,
          tags: el.tags ?? {},
        }
      }
    )

    const result = {
      area: {
        bbox: body.bbox,
      },
      points_of_interest: {
        items,
      },
    }

    // ✅ Console log on server
    console.log(`📍 Found POIs for query "${query}": ${items.length}`)

    return NextResponse.json(result)
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Overpass request timeout')
      return NextResponse.json(
        {
          error: 'Request timeout. The map service took too long to respond.',
          details: 'Please try a smaller area or try again later.',
        },
        { status: 504 }
      )
    }

    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
