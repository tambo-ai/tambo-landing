import { ArrowUp } from 'lucide-react'
import type * as React from 'react'
import PlaneSVG from '~/assets/svgs/plane.svg'
import { useAssitant } from '~/integrations/tambo'
import { DEMOS } from '~/integrations/tambo/constants'
import { searchLocation } from '~/integrations/tambo/tools'
import { useMapNavigationListener } from '../map/mapbox/events'

const demo = DEMOS.INTRO

export function IntroAssistant() {
  const { selectedDemo, setDestination, setSelectedDemo } = useAssitant()

  useMapNavigationListener((params) => {
    setDestination({
      name: params.destination,
      center: [params.center.lng, params.center.lat],
    })
    setSelectedDemo(DEMOS.SEAT)
  })

  if (selectedDemo !== demo) return null

  return (
    <div className="relative w-full h-full">
      <LocationInput />
    </div>
  )
}

function LocationInput() {
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await searchLocation({
      location: e.currentTarget.message.value,
    })
  }

  return (
    <div className="relative dr-p-16 h-full flex-col flex justify-between items-center">
      <div className="border-2 border-dark-grey dr-rounded-20 dr-p-2 bg-white flex items-center dr-gap-8">
        <span className="bg-black dr-w-24 aspect-square rounded-full flex items-center justify-center">
          <PlaneSVG className="text-contrast dr-w-16 aspect-square" />
        </span>
        <p className="typo-button dr-mr-12">{`< my goated travel assistant >`}</p>
      </div>
      <form onSubmit={handleSendMessage} className="relative dr-w-436 dr-h-48">
        <input
          id="message"
          name="message"
          type="text"
          aria-label="Enter destination city"
          required
          className="typo-p w-full h-full dr-p-8 bg-white border-2 dr-rounded-8 border-light-gray p-2 placeholder:text-muted-foreground/80"
          placeholder="You just booked a trip to..."
        />
        <button
          type="submit"
          className="absolute dr-bottom-8 dr-right-8 dr-w-32 aspect-square dr-p-4 bg-black/80 text-white dr-rounded-8 hover:bg-black/70 disabled:opacity-50 flex items-center justify-center enabled:cursor-pointer"
        >
          <ArrowUp className="w-full h-full" />
        </button>
      </form>
    </div>
  )
}
