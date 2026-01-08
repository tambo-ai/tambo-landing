import {
  useTamboContextHelpers,
  useTamboThread,
  withInteractable,
} from '@tambo-ai/react'
import cn from 'clsx'
import { useEffect } from 'react'
import InfoSVG from '~/assets/svgs/info.svg'
import { useAssitant } from '~/integrations/tambo'
import { MapBox } from '~/integrations/tambo/(components)/map/mapbox'
import { DEMOS } from '~/integrations/tambo/constants'
import { MessageThreadCollapsible } from '../ui-tambo/message-thread-collapsible'
import s from './map.module.css'
import { MapSchema, mapExampleContext } from './schema'

const introMessages = {
  map: 'While your waiting for your flight, you can search for entrainment options in your destination, do you want me to help you?',
}
const demo = DEMOS.MAP

type MapComponentProps = {
  height: number
  center: { lng: number; lat: number }
  zoom: number
}

function MapComponent({ height, center, zoom }: MapComponentProps) {
  return (
    <MapBox
      className="absolute top-0 left-0 w-full"
      height={height}
      fallbackZoom={zoom}
      center={center ? [center.lng, center.lat] : undefined}
    />
  )
}

export const InterctableMap = withInteractable(MapComponent, {
  componentName: 'map',
  description:
    'A map component for selecting an area on a map and analyzing the area for things to do and add pins to the map',
  propsSchema: MapSchema,
})

export function MapAssistant() {
  const { destination, selectedDemo, weather, currentBBox, itinerary } =
    useAssitant()
  const { addContextHelper, removeContextHelper } = useTamboContextHelpers()
  const { thread, addThreadMessage } = useTamboThread()

  useEffect(() => {
    if (selectedDemo === demo) {
      addContextHelper('assistantBehavior', () =>
        mapExampleContext.assistantBehavior(destination, weather)
      )
      addContextHelper('mapState', () =>
        mapExampleContext.mapState(currentBBox)
      )
      addContextHelper('itinerary', () =>
        mapExampleContext.itinerary(itinerary)
      )
    }

    return () => {
      removeContextHelper('assistantBehavior')
      removeContextHelper('mapState')
      removeContextHelper('itinerary')
    }
  }, [selectedDemo, addContextHelper, removeContextHelper, currentBBox])

  useEffect(() => {
    if (selectedDemo !== demo) return

    if (!thread?.messages?.length) {
      addThreadMessage(
        {
          id: 'welcome-message',
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: introMessages[selectedDemo],
            },
          ],
          createdAt: new Date().toISOString(),
          threadId: thread.id,
          componentState: {},
        },
        false
      )
    }
  }, [thread?.messages?.length, selectedDemo, thread?.id, addThreadMessage])

  if (selectedDemo !== demo) return null

  return (
    <>
      <MessageThreadCollapsible
        contextKey={selectedDemo}
        variant="compact"
        defaultOpen={true}
        className="absolute dr-bottom-6 dr-right-4 dr-mr-8"
      />
      <div className={s.mapTooltip}>
        <div className={s.icon}>
          <InfoSVG className="dr-w-16 dr-h-16 " />
        </div>
        <span className={cn(s.tooltipText, 'typo-p-s')}>
          Hold Cmd/Ctrl to drag around the map.
        </span>
      </div>
    </>
  )
}
