import { NextResponse } from 'next/server'

type BBox = { west: number; south: number; east: number; north: number }

type RequestBody = {
  bbox: BBox
  category: string
  brandFilter?: string
}

export async function POST(req: Request) {
  const body = (await req.json()) as RequestBody
  const { west, south, east, north } = body.bbox
  const { category, brandFilter } = body

  // Check if category is recognized
  const tags = getOSMTags(category)

  if (tags === null) {
    return NextResponse.json({
      unknownCategory: true,
      category,
      message: `I don't recognize the category "${category}".`,
      suggestedCategories: getSuggestedCategories(category),
    })
  }

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

    let items = (overpassData.elements ?? []).map(
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

    // Filter by brand name if provided by the LLM
    if (brandFilter) {
      const filterLower = brandFilter.toLowerCase()

      items = items.filter(
        (item: { name: string | null; tags: Record<string, string> }) => {
          const name = item.name?.toLowerCase() || ''
          const brand = item.tags?.brand?.toLowerCase() || ''

          // Check name or brand tag
          return name.includes(filterLower) || brand.includes(filterLower)
        }
      )
    }

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

// Comprehensive category to OSM tags mapping
// The LLM will provide clean category names, so matching is straightforward
const CATEGORY_TO_TAGS: Record<string, string[]> = {
  // Food & Drink
  coffee: ['amenity=cafe'],
  'coffee shop': ['amenity=cafe'],
  cafe: ['amenity=cafe'],
  café: ['amenity=cafe'],
  restaurant: ['amenity=restaurant'],
  'fast food': ['amenity=fast_food'],
  bar: ['amenity=bar', 'amenity=pub'],
  pub: ['amenity=pub'],
  bakery: ['shop=bakery'],
  'ice cream': ['amenity=ice_cream'],
  pizza: ['amenity=restaurant', 'shop=pizza'],

  // Health & Fitness
  pharmacy: ['amenity=pharmacy'],
  drugstore: ['amenity=pharmacy'],
  hospital: ['amenity=hospital'],
  clinic: ['amenity=clinic'],
  doctor: ['amenity=doctors'],
  dentist: ['amenity=dentist'],
  gym: ['leisure=fitness_centre', 'leisure=sports_centre'],
  fitness: ['leisure=fitness_centre'],
  'fitness center': ['leisure=fitness_centre'],
  'fitness centre': ['leisure=fitness_centre'],

  // Transportation
  'gas station': ['amenity=fuel'],
  fuel: ['amenity=fuel'],
  'petrol station': ['amenity=fuel'],
  parking: ['amenity=parking'],
  'ev charging': ['amenity=charging_station'],
  'charging station': ['amenity=charging_station'],
  'car wash': ['amenity=car_wash'],
  'car rental': ['amenity=car_rental'],
  'bus stop': ['highway=bus_stop'],
  'train station': ['railway=station'],

  // Accommodation
  hotel: ['tourism=hotel'],
  motel: ['tourism=motel'],
  hostel: ['tourism=hostel'],
  accommodation: ['tourism=hotel', 'tourism=motel', 'tourism=hostel'],
  lodging: ['tourism=hotel', 'tourism=motel'],

  // Finance
  bank: ['amenity=bank'],
  atm: ['amenity=atm'],

  // Shopping
  supermarket: ['shop=supermarket'],
  grocery: ['shop=supermarket', 'shop=convenience'],
  'grocery store': ['shop=supermarket', 'shop=convenience'],
  'convenience store': ['shop=convenience'],
  'shopping mall': ['shop=mall'],
  mall: ['shop=mall'],
  shop: ['shop'],
  store: ['shop'],
  'clothing store': ['shop=clothes'],
  clothes: ['shop=clothes'],
  'electronics store': ['shop=electronics'],
  electronics: ['shop=electronics'],
  bookstore: ['shop=books'],
  'book store': ['shop=books'],

  // Recreation
  park: ['leisure=park'],
  playground: ['leisure=playground'],
  cinema: ['amenity=cinema'],
  'movie theater': ['amenity=cinema'],
  movies: ['amenity=cinema'],
  theater: ['amenity=theatre'],
  theatre: ['amenity=theatre'],
  sports: ['leisure=sports_centre'],
  'swimming pool': ['leisure=swimming_pool'],
  pool: ['leisure=swimming_pool'],
  'golf course': ['leisure=golf_course'],

  // Education
  school: ['amenity=school'],
  university: ['amenity=university'],
  college: ['amenity=college'],
  library: ['amenity=library'],

  // Tourism
  museum: ['tourism=museum'],
  attraction: ['tourism=attraction'],
  'tourist attraction': ['tourism=attraction'],
  gallery: ['tourism=gallery'],
  'art gallery': ['tourism=gallery'],
  zoo: ['tourism=zoo'],
  aquarium: ['tourism=aquarium'],

  // Services
  'post office': ['amenity=post_office'],
  police: ['amenity=police'],
  'police station': ['amenity=police'],
  'fire station': ['amenity=fire_station'],
  laundry: ['shop=laundry'],
  laundromat: ['shop=laundry'],
  'hair salon': ['shop=hairdresser'],
  barber: ['shop=hairdresser'],
  'beauty salon': ['shop=beauty'],

  // Workspace
  office: ['office'],
  coworking: ['amenity=coworking_space'],
  'coworking space': ['amenity=coworking_space'],
}

// Get all available categories for suggestions
const ALL_CATEGORIES = Object.keys(CATEGORY_TO_TAGS)

/**
 * Map a category string to OSM tags.
 * Returns null if category is not recognized (triggers LLM clarification).
 */
function getOSMTags(category: string): string[] | null {
  const normalized = category.toLowerCase().trim()

  // Direct match
  if (CATEGORY_TO_TAGS[normalized]) {
    return CATEGORY_TO_TAGS[normalized]
  }

  // Partial match (e.g., "coffee shops" matches "coffee shop")
  for (const [key, tags] of Object.entries(CATEGORY_TO_TAGS)) {
    // Check if the normalized category includes the key or vice versa
    if (normalized.includes(key) || key.includes(normalized)) {
      return tags
    }
    // Also check plural forms (simple -s suffix)
    if (normalized === `${key}s` || `${normalized}s` === key) {
      return tags
    }
  }

  // No match found - return null to trigger LLM clarification
  return null
}

/**
 * Suggest similar categories based on word overlap with the unknown input.
 */
function getSuggestedCategories(unknown: string): string[] {
  const normalizedWords = unknown.toLowerCase().split(/\s+/)
  const suggestions: string[] = []

  for (const category of ALL_CATEGORIES) {
    const categoryWords = category.split(/\s+/)

    // Check for any word overlap
    const hasOverlap = categoryWords.some((cw) =>
      normalizedWords.some(
        (uw) =>
          cw.includes(uw) ||
          uw.includes(cw) ||
          // Check for similar start (3+ chars)
          (cw.length >= 3 &&
            uw.length >= 3 &&
            cw.slice(0, 3) === uw.slice(0, 3))
      )
    )

    if (hasOverlap) {
      suggestions.push(category)
    }
  }

  // If no suggestions found, return common categories
  if (suggestions.length === 0) {
    return ['restaurant', 'cafe', 'shop', 'hotel', 'park', 'gym', 'office']
  }

  // Return unique suggestions, limited to 5
  return [...new Set(suggestions)].slice(0, 5)
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
