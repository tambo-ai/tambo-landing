import { NextResponse } from 'next/server'
import { fetchWithTimeout } from '~/libs/fetch-with-timeout'

type OpenMeteoResponse = {
  latitude: number
  longitude: number
  timezone: string
  timezone_abbreviation: string
  utc_offset_seconds: number
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    precipitation_sum: number[]
    wind_speed_10m_max: number[]
  }
  daily_units: {
    temperature_2m_max: string
    temperature_2m_min: string
    precipitation_sum: string
    wind_speed_10m_max: string
  }
}

// Map weather codes to human-readable descriptions
function getWeatherDescription(code: number): string {
  // Weather code mapping based on WMO Weather interpretation codes
  if (code === 0) return 'clear sky'
  if (code >= 1 && code <= 3) return 'partly cloudy'
  if (code >= 45 && code <= 48) return 'foggy'
  if (code >= 51 && code <= 67) return 'rainy'
  if (code >= 71 && code <= 77) return 'snowy'
  if (code >= 80 && code <= 82) return 'rainy'
  if (code >= 85 && code <= 86) return 'snowy'
  if (code >= 95 && code <= 99) return 'thunderstorm'
  return 'unknown'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  // Validate coordinates
  if (!(lat && lon)) {
    return NextResponse.json(
      { error: 'Missing required parameters: lat and lon' },
      { status: 400 }
    )
  }

  const latitude = Number.parseFloat(lat)
  const longitude = Number.parseFloat(lon)

  // Validate coordinate ranges
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: 'Invalid coordinates: lat and lon must be valid numbers' },
      { status: 400 }
    )
  }

  if (latitude < -90 || latitude > 90) {
    return NextResponse.json(
      { error: 'Invalid latitude: must be between -90 and 90' },
      { status: 400 }
    )
  }

  if (longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { error: 'Invalid longitude: must be between -180 and 180' },
      { status: 400 }
    )
  }

  try {
    // Build Open-Meteo API URL for 7-day forecast
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      daily:
        'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max',
      forecast_days: '7',
      timezone: 'auto',
    })

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`

    // Fetch with timeout (10 seconds)
    const response = await fetchWithTimeout(url, {
      timeout: 10000,
      method: 'GET',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Open-Meteo API error:', response.status, errorText)
      return NextResponse.json(
        {
          error: 'Failed to fetch weather data',
          details: `API returned status ${response.status}`,
        },
        { status: response.status }
      )
    }

    const data = (await response.json()) as OpenMeteoResponse

    // Validate response structure
    if (!data?.daily?.time || data.daily.time.length === 0) {
      return NextResponse.json(
        { error: 'Invalid response from weather API' },
        { status: 500 }
      )
    }

    const { daily, daily_units } = data

    // Format forecast data for each day
    const forecast = daily.time.map((date, index) => ({
      date,
      temperatureMax: daily.temperature_2m_max[index],
      temperatureMin: daily.temperature_2m_min[index],
      temperatureUnit: daily_units.temperature_2m_max,
      weatherCode: daily.weather_code[index],
      weatherDescription: getWeatherDescription(daily.weather_code[index]),
      precipitation: daily.precipitation_sum[index],
      precipitationUnit: daily_units.precipitation_sum,
      windSpeedMax: daily.wind_speed_10m_max[index],
      windSpeedUnit: daily_units.wind_speed_10m_max,
    }))

    return NextResponse.json({
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      timezoneAbbreviation: data.timezone_abbreviation,
      utcOffsetSeconds: data.utc_offset_seconds,
      forecast,
      units: {
        temperature: daily_units.temperature_2m_max,
        precipitation: daily_units.precipitation_sum,
        windSpeed: daily_units.wind_speed_10m_max,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Weather API request timeout')
      return NextResponse.json(
        {
          error: 'Request timeout',
          details: 'The weather service took too long to respond',
        },
        { status: 504 }
      )
    }

    console.error('Unexpected error fetching weather:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch weather data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
