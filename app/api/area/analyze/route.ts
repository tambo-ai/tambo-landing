import { NextResponse } from 'next/server'

type BBox = { west: number; south: number; east: number; north: number }

export async function POST(req: Request) {
  const body = (await req.json()) as { bbox: BBox }
  const { west, south, east, north } = body.bbox

  // amenity=cafe is the common OSM tag for cafes/coffee shops
  const overpassQuery = `
[out:json][timeout:25];
(
  node["amenity"="cafe"](${south},${west},${north},${east});
  way["amenity"="cafe"](${south},${west},${north},${east});
  relation["amenity"="cafe"](${south},${west},${north},${east});
);
out center tags;
`.trim()

  const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  })

  if (!overpassRes.ok) {
    const text = await overpassRes.text()
    console.log('❌ Overpass error:', text)
    return NextResponse.json(
      { error: 'Overpass request failed', details: text },
      { status: 502 }
    )
  }

  const json = await overpassRes.json()

  const cafes = (json.elements ?? []).map((el: any) => {
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
  })

  const result = {
    area: {
      bbox: body.bbox,
    },
    points_of_interest: {
      cafes,
    },
  }

  // ✅ Console log on server
  console.log(`☕ Found cafes: ${cafes.length}`)

  return NextResponse.json(result)
}
