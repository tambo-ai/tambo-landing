import cn from 'clsx'
import { useAssitant } from '~/integrations/tambo'

/**
Itinerary item schema:
itinerary [
  {
    poi: {
      id: 'dXJuOm1ieHBvaTo1YzlhNmI1OC00ZWQ5LTQxNzItOWJiNS1iYmVkODAyNDBjZDU',
      lat: 48.854256,
      lon: 2.350285,
      name: "Au Vieux Paris d'Arcole",
      type: 'poi'
    },
    selectedDate: '2026-07-01 21:00'
  }
]
 */

const formatTimeRange = (dateString: string) => {
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

export function AssistantNotifications({ className }: { className: string }) {
  const { finishSeatSelection, choosedSeat, itinerary, destination } =
    useAssitant()

  return (
    <div
      className={cn(
        'border border-dark-grey dr-rounded-20 dr-p-8 dr-pb-16 opacity-0 transition-opacity duration-200 ease-in-out dr-w-207',
        destination.name && 'opacity-100',
        className
      )}
    >
      <div className="typo-p-sentient dr-p-16 border border-dark-grey dr-rounded-12 bg-off-white/80 dr-mb-16">
        <p>myTravel Assistant</p>
      </div>
      <ul className="flex flex-col dr-gap-23 dr-p-8">
        <li>
          <span className="block typo-label-s opacity-50 dr-mb-8">
            {'<'}Destination{'>'}
          </span>
          <span className="typo-label-s">{destination?.name}</span>
        </li>
        <li>
          <span className="block typo-label-s opacity-50 dr-mb-8">
            {'<'}Flight seats{'>'}
          </span>{' '}
          <span className="typo-label-s">
            {' '}
            {choosedSeat.length > 0 ? choosedSeat.join(', ') : 'None'}
          </span>
        </li>
        <li>
          <span className="block typo-label-s opacity-50 dr-mb-8">
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
                      new Date(item.selectedDate).toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                  </span>
                  <span className="block">
                    {item?.selectedDate && formatTimeRange(item.selectedDate)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </li>
        {/* Remove Later */}
        <li>
          <span className="typo-label-m">Seat selection: </span>
          <span className="typo-label-s">
            {choosedSeat.length > 0 ? choosedSeat.join(', ') : 'None'}
          </span>
          <button
            type="button"
            className="typo-label-s"
            onClick={() => finishSeatSelection('7E')}
          >
            Random seat
          </button>
        </li>
      </ul>
    </div>
  )
}
