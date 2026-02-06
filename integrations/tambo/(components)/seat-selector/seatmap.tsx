'use client'

import { useTamboComponentState } from '@tambo-ai/react'
import cn from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { useAssitant } from '~/integrations/tambo'
import { SEAT_MAP_CONFIG } from '~/integrations/tambo/constants'
import { isEmptyArray } from '~/libs/utils'
import type { SeatMapProps } from './schema'
import { SEATS } from './schema'
import s from './styles.module.css'

type SeatsType = string[]
type CurrentPage = number

const TOTAL_ROWS = SEAT_MAP_CONFIG.rows
const SEATS_PER_ROW = SEAT_MAP_CONFIG.seatsPerRow
const ROWS_PER_PAGE = SEAT_MAP_CONFIG.rowsPerPage
const TOTAL_PAGES = Math.ceil(TOTAL_ROWS / ROWS_PER_PAGE)
const SEAT_LETTERS = Array.from({ length: SEATS_PER_ROW }, (_, i) =>
  String.fromCharCode(65 + i)
)

function getCurrentPage(currentPage: CurrentPage) {
  return Math.min(ROWS_PER_PAGE, TOTAL_ROWS - currentPage * ROWS_PER_PAGE)
}

// Props passed from AI structured output are wrapped in a value object
export function SeatMap({ value }: { value: SeatMapProps }) {
  const { userSelectedSeats, maxSelections, assistantHighlightedSeats } = value
  const [currentPage, setCurrentPage] = useState<CurrentPage>(0)
  const [selectedSeats, setSelectedSeats] = useTamboComponentState<SeatsType>(
    'userSelectedSeats',
    [],
    userSelectedSeats
  )
  const [highlightedSeats] = useTamboComponentState<SeatsType>(
    'assistantHighlightedSeats',
    [],
    assistantHighlightedSeats
  )
  useEffect(() => {
    if (!isEmptyArray(userSelectedSeats)) {
      setCurrentPage(
        Math.floor(
          (Number.parseInt(userSelectedSeats[0].match(/\d+/)?.[0] || '1', 10) -
            1) /
            ROWS_PER_PAGE
        )
      )
    }

    if (!isEmptyArray(assistantHighlightedSeats)) {
      setCurrentPage(
        Math.floor(
          (Number.parseInt(
            assistantHighlightedSeats[0].match(/\d+/)?.[0] || '1',
            10
          ) -
            1) /
            ROWS_PER_PAGE
        )
      )
    }
  }, [userSelectedSeats, assistantHighlightedSeats])

  const toggleSeat = useCallback(
    (seatId: string) => {
      if (!(selectedSeats && seatId)) return

      if (selectedSeats?.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter((id) => id !== seatId))
      } else if (
        maxSelections === undefined ||
        selectedSeats?.length < maxSelections
      ) {
        setSelectedSeats([...selectedSeats, seatId])
      }
    },
    [selectedSeats, maxSelections, setSelectedSeats]
  )

  return (
    <div
      className={cn(
        'relative w-fit dr-max-w-340 dt:dr-p-24 dr-p-16 border border-dark-grey dr-rounded-12 dr-ml-24',
        s.shadow
      )}
    >
      <h3
        className={cn(
          'dr-py-6 dr-px-12 typo-button absolute -dr-top-14 left-1/2 -translate-x-1/2 border border-dark-grey dr-rounded-20 text-color-black bg-mint normal-case',
          s.shadow
        )}
      >
        {'<SeatMap/>'}
      </h3>
      <div className="w-full dr-gap-8 dr-mb-24 flex flex-col items-center">
        <SeatLetters />
        {Array.from({ length: getCurrentPage(currentPage) }, (_, i) => {
          const rowNumber = currentPage * ROWS_PER_PAGE + i + 1
          return (
            <div key={rowNumber} className="flex dr-gap-2 items-center">
              {/* Rows 1-3 */}
              <SeatRows
                from={0}
                to={3}
                rowNumber={rowNumber}
                selectedSeats={selectedSeats}
                highlightedSeats={highlightedSeats}
                toggleSeat={toggleSeat}
              />
              {/* Row number */}
              <div className="dr-w-52 dr-h-61 dr-pt-16 text-center typo-label-m text-color-black-70">
                {rowNumber}
              </div>
              {/* Rows 3-6 */}
              <SeatRows
                from={3}
                to={6}
                rowNumber={rowNumber}
                selectedSeats={selectedSeats}
                highlightedSeats={highlightedSeats}
                toggleSeat={toggleSeat}
              />
            </div>
          )
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
        className="absolute top-1/2 -translate-y-1/2 right-full flex-col dr-gap-8 dr-p-12"
      />
      <div className="dr-p-12 absolute top-1/2 -translate-y-1/2 left-full ">
        <Legend className="flex flex-col dr-gap-24" />
      </div>
      <Actionables
        clearSelection={() => setSelectedSeats([])}
        selectedSeats={selectedSeats || []}
        maxSelections={maxSelections}
      />
    </div>
  )
}

function SeatRows({
  from,
  to,
  rowNumber,
  selectedSeats,
  highlightedSeats,
  toggleSeat,
}: {
  from: number
  to: number
  rowNumber: number
  selectedSeats: SeatsType | undefined
  highlightedSeats: SeatsType | undefined
  toggleSeat: (seatId: string) => void
}) {
  const isSeatTaken = useCallback(
    (seatId: string) => SEATS.find((seat) => seat.id === seatId)?.taken,
    []
  )
  const isSeatSelected = useCallback(
    (seatId: string) => selectedSeats?.includes(seatId),
    [selectedSeats]
  )

  const isSeatHighlighted = useCallback(
    (seatId: string) => highlightedSeats?.includes(seatId),
    [highlightedSeats]
  )

  return SEAT_LETTERS.slice(from, to).map((letter) => {
    const seat = SEATS.find((seat) => seat.id === `${rowNumber}${letter}`) || {
      id: '',
      taken: false,
      price: 0,
      position: 'middle',
      emergencyExit: false,
    }
    const taken = isSeatTaken(seat.id)
    const selected = isSeatSelected(seat.id)
    const highlighted = isSeatHighlighted(seat.id)

    return (
      <Seat
        key={seat.id}
        className={cn(
          'relative flex items-center justify-center',
          s.seat,
          selected && s.isSelected,
          taken && s.isTaken,
          highlighted && s.highglighted
        )}
        onClick={() => !taken && toggleSeat(seat.id)}
        disabled={taken}
      >
        <span className="relative z-10 dr-px-6 dr-py-14 flex items-center justify-center">
          {taken && '✕'}
          {!taken && (
            <span
              className={cn(
                'border border-dark-grey bg-white dr-px-4 dr-py-2 dr-rounded-2',
                s.label
              )}
            >
              {seat.price}$
            </span>
          )}
        </span>
      </Seat>
    )
  })
}

function Seat({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={cn(
        'dr-rounded-4 dr-w-40 dr-h-61 typo-label-s flex flex-col justify-end',
        className
      )}
      {...props}
    >
      {children}
      <span className="relative z-10 dr-h-15 w-full shrink-0" />
    </button>
  )
}

function Actionables({
  className,
  clearSelection,
  selectedSeats,
  maxSelections,
}: {
  className?: string
  clearSelection: () => void
  selectedSeats: string[]
  maxSelections: number
}) {
  const { finishSeatSelection } = useAssitant()

  return (
    <div className={cn('flex dt:dr-gap-12 dr-gap-8 justify-center', className)}>
      <button
        type="button"
        onClick={clearSelection}
        disabled={isEmptyArray(selectedSeats)}
        className={cn(
          'dt:dr-px-16 dt:dr-py-8 dr-px-12 dr-py-6 dr-rounded-10 typo-button',
          s.button
        )}
      >
        Clear
      </button>
      <button
        type="button"
        disabled={selectedSeats?.length !== maxSelections}
        className={cn(
          'dt:dr-px-16 dt:dr-py-8 dr-px-12 dr-py-6 dr-rounded-10 typo-button',
          s.button,
          s.buttonPrimary
        )}
        onClick={() => finishSeatSelection(selectedSeats?.join(',') || '')}
      >
        Confirm
      </button>
    </div>
  )
}

function Legend({ className }: { className?: string }) {
  return (
    <ol className={cn('typo-label-s dt:dr-mb-16 dr-mb-12', className)}>
      <li className="flex items-center">
        <span className="dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6 bg-grey border border-dark-grey " />
        <span>Unavailable</span>
      </li>
      <li className="flex items-center">
        <span className="dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6 bg-ghost-mint border border-dark-grey" />
        <span>Available</span>
      </li>
      <li className="flex items-center">
        <span
          className={cn(
            'relative dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6 dr-border-2 border-dark-grey bg-teal border',
            s.pattern,
            s.highlighted
          )}
        />
        <span>Recommended</span>
      </li>
      <li className="flex items-center">
        <span
          className={cn(
            'relative dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6 dr-border-2 border-dark-grey bg-mint border',
            s.pattern,
            s.selected
          )}
        />
        <span>Selected</span>
      </li>
    </ol>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}) {
  return (
    <div className={cn('flex justify-center dr-gap-8 dr-mb-16', className)}>
      {Array.from({ length: totalPages }, (_, i) => {
        const pageKey = `page-${i}`
        return (
          <button
            key={pageKey}
            type="button"
            onClick={() => onPageChange(i)}
            className={cn(
              'dr-w-10 dr-h-10 rounded-full border-none cursor-pointer transition-all duration-200 hover:scale-125',
              currentPage === i ? 'bg-teal' : 'bg-grey'
            )}
            aria-label={`Go to rows ${i * ROWS_PER_PAGE + 1}-${Math.min((i + 1) * ROWS_PER_PAGE, TOTAL_ROWS)}`}
          />
        )
      })}
    </div>
  )
}

function SeatLetters({ className }: { className?: string }) {
  return (
    <div className={cn('flex dt:dr-gap-48 dr-gap-36 dr-mb-8', className)}>
      <div className="flex dt:dr-gap-8 dr-gap-6">
        {SEAT_LETTERS.slice(0, 3).map((letter) => (
          <div
            key={letter}
            className="dt:dr-w-40 dr-w-32 text-center typo-label-m text-color-black-70"
          >
            {letter}
          </div>
        ))}
      </div>
      <div className="flex dt:dr-gap-8 dr-gap-6">
        {SEAT_LETTERS.slice(3, 6).map((letter) => (
          <div
            key={letter}
            className="dt:dr-w-40 dr-w-32 text-center typo-label-m text-color-black-70"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  )
}
