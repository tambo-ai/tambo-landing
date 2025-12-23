import cn from 'clsx'
import { useAssitant } from '~/integrations/tambo'

export function AssistantNotifications({ className }: { className: string }) {
  const { finishSeatSelection, choosedSeat, itinerary } = useAssitant()

  return (
    <ul
      className={cn(
        'flex flex-col dr-gap-8 border border-dark-grey dr-rounded-8 dr-p-16',
        className
      )}
    >
      <div className="typo-surtitle">Travel assistant</div>
      <li>
        <span className="typo-label-m">Hotel: </span>
        <span className="typo-label-s"> Booked</span>
      </li>
      <li>
        <span className="typo-label-m">Flight: </span>
        <span className="typo-label-s"> NYC La Guardia</span>
      </li>
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
      <li>
        <span className="typo-label-m">Itinerary: </span>
        <span className="typo-label-s">{itinerary.length > 0 ? itinerary.sort((a,b) => new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime()).map((item) => `${item.poi.name} ${item.selectedDate ? `(Selected date: ${item.selectedDate})` : ''}`).join(', ') : 'Empty'}</span>
      </li>
    </ul>
  )
}
