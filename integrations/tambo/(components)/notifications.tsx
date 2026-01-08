'use client'

import cn from 'clsx'
import {
  Clock,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAssitant } from '~/integrations/tambo'
import { isEmptyArray } from '~/libs/utils'
import { DEMOS } from '../constants'

export function AssistantNotifications({ className }: { className: string }) {
  const {
    selectedDemo,
    choosedSeat,
    itinerary,
    destination,
    finishSeatSelection,
  } = useAssitant()

  return (
    <div
      className={cn(
        'border border-dark-grey dr-rounded-20 dr-p-8 dr-pb-16 transition-opacity duration-200 ease-in-out dr-w-207',
        selectedDemo === DEMOS.INTRO && 'opacity-0',
        className
      )}
    >
      <div className="typo-p-sentient dr-p-16 border border-dark-grey dr-rounded-12 bg-off-white/80 dr-mb-16">
        <p>myTravel Assistant</p>
      </div>
      <ul className="flex flex-col dr-gap-23 dr-p-8">
        <li>
          <span className="block typo-label-s opacity-50 dr-mb-6">
            {'<'}Destination{'>'}
          </span>
          <div className="grid grid-cols-2 dr-gap-8">
            <span className="typo-code-snippet uppercase">
              {destination?.name}
            </span>
            <WeatherWidget />
          </div>
        </li>
        <li>
          <span className="block typo-label-s opacity-50 dr-mb-6">
            {'<'}Flight seats{'>'}
          </span>{' '}
          <span className="typo-label-s">
            {' '}
            {!isEmptyArray(choosedSeat) ? choosedSeat.join(', ') : 'None'}
          </span>
        </li>
        {selectedDemo === DEMOS.MAP && (
          <li>
            <span className="block typo-label-s opacity-50 dr-mb-6">
              {'<'}Planned activities{'>'}
            </span>{' '}
            <ul className="flex flex-col dr-gap-8">
              {itinerary.map((item) => (
                <li
                  className="typo-label-s list-disc list-inside"
                  key={item?.poi?.id}
                >
                  <span className="inline-block align-top">
                    <span className="block">{item?.poi?.name}</span>
                    <span className="block">
                      {item?.selectedDate &&
                        new Date(item.selectedDate).toLocaleDateString(
                          'en-US',
                          {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit',
                          }
                        )}
                    </span>
                    <span className="block">
                      {item?.selectedDate && formatTimeRange(item.selectedDate)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  )
}

export function WeatherWidget() {
  const { weather } = useAssitant()
  const [currentTime, setCurrentTime] = useState<string | null>(null)

  const timezone = weather?.timezone

  useEffect(() => {
    if (!timezone) return

    // Set initial time immediately
    setCurrentTime(formatTime(new Date(), timezone))

    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date(), timezone))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [timezone])

  if (!weather?.forecast || isEmptyArray(weather.forecast)) return null

  const today = weather.forecast[0]
  const temp = Math.round(today.temperatureMax)
  const unit = today.temperatureUnit
  const description = today.weatherDescription

  return (
    <div className="flex flex-col justify-between dr-gap-8 typo-label-s">
      <span className="flex items-center dr-gap-4">
        <Clock size={14} strokeWidth={1.5} />
        <p className="text-nowrap">{currentTime}</p>
      </span>
      <span className="flex items-center dr-gap-4">
        <span>{getWeatherIcon(description)}</span>
        {temp}
        {unit}
      </span>
    </div>
  )
}

function getWeatherIcon(description: string) {
  const iconProps = { size: 16, strokeWidth: 1.5 }

  switch (description) {
    case 'clear sky':
      return <Sun {...iconProps} />
    case 'partly cloudy':
      return <CloudSun {...iconProps} />
    case 'foggy':
      return <CloudFog {...iconProps} />
    case 'rainy':
      return <CloudRain {...iconProps} />
    case 'snowy':
      return <Snowflake {...iconProps} />
    case 'thunderstorm':
      return <CloudLightning {...iconProps} />
    default:
      return <Cloud {...iconProps} />
  }
}

function formatTime(date: Date, timezone: string): string {
  return date
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    })
    .toLowerCase()
}

function formatTimeRange(dateString: string) {
  const date = new Date(dateString.replace(' ', 'T'))
  const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000)

  const format = (d: Date) =>
    d
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase()
      .replace(':00', '')
      .replace(/\s/g, '')

  return `${format(date)} → ${format(endDate)}`
}
