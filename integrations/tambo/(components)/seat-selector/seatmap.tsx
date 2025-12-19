'use client'

import { useTamboComponentState } from '@tambo-ai/react'
import cn from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { useAssitant } from '~/integrations/tambo'
import { isEmptyArray } from '~/libs/utils'
import type { SeatMapProps } from './schema'
import { SEATS } from './schema'
import s from './styles.module.css'

type SelectedSeats = string[]
type CurrentPage = number

const ROWS = 25
const SEATS_PER_ROW = 6
const ROWS_PER_PAGE = 5
const TOTAL_PAGES = Math.ceil(ROWS / ROWS_PER_PAGE)
const SEAT_LETTERS = Array.from({ length: SEATS_PER_ROW }, (_, i) =>
  String.fromCharCode(65 + i)
)

function getCurrentPage(currentPage: CurrentPage) {
  return Math.min(ROWS_PER_PAGE, ROWS - currentPage * ROWS_PER_PAGE)
}

// Props passed from AI are wrapped in a value object
export function SeatMap({ value }: { value: SeatMapProps }) {
  const { userSelectedSeats, maxSelections } = value
  const [currentPage, setCurrentPage] = useState<CurrentPage>(0)
  const [selectedSeats, setSelectedSeats] =
    useTamboComponentState<SelectedSeats>(
      'userSelectedSeats',
      [],
      userSelectedSeats
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
  }, [userSelectedSeats])

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
    [selectedSeats, maxSelections]
  )

  const isSeatTaken = useCallback(
    (seatId: string) => SEATS.find((seat) => seat.id === seatId)?.taken,
    []
  )

  const isSeatSelected = useCallback(
    (seatId: string) => selectedSeats?.includes(seatId),
    [selectedSeats]
  )

  return (
    <div className="w-fit relative dt:dr-p-24 dr-p-16 border border-dark-grey dr-rounded-12">
      <h3 className="dr-py-6 dr-px-12 typo-button absolute -dr-top-14 left-1/2 -translate-x-1/2 border dr-rounded-20 text-color-black">
        {'<SeatMap/>'}
      </h3>
      <SelectedSeatsInfo
        selectedSeats={selectedSeats || []}
        maxSelections={maxSelections}
      />
      <div className="w-full dt:dr-gap-12 dr-gap-8 dt:dr-mb-24 dr-mb-16 flex flex-col items-center">
        <SeatLetters />
        {Array.from({ length: getCurrentPage(currentPage) }, (_, i) => {
          const rowNumber = currentPage * ROWS_PER_PAGE + i + 1
          return (
            <div
              key={rowNumber}
              className="flex dt:dr-gap-8 dr-gap-6 items-center"
            >
              {/* Rows 1-3 */}
              {SEAT_LETTERS.slice(0, 3).map((letter) => {
                const seatId = `${rowNumber}${letter}`
                const taken = isSeatTaken(seatId)
                const selected = isSeatSelected(seatId)

                return (
                  <Seat
                    key={seatId}
                    className={cn(
                      s.seat,
                      selected && s.isSelected,
                      taken && s.isTaken
                    )}
                    onClick={() => !taken && toggleSeat(seatId)}
                    disabled={taken}
                  >
                    {taken && '✕'}
                    {!taken && selected && '✓'}
                  </Seat>
                )
              })}
              {/* Row number */}
              <div className="dt:dr-w-32 dr-w-24 text-center typo-label-m text-color-black-70">
                {rowNumber}
              </div>
              {/* Rows 3-6 */}
              {SEAT_LETTERS.slice(3, 6).map((letter) => {
                const seatId = `${rowNumber}${letter}`
                const taken = isSeatTaken(seatId)
                const selected = isSeatSelected(seatId)

                return (
                  <Seat
                    key={seatId}
                    className={cn(
                      s.seat,
                      selected && s.isSelected,
                      taken && s.isTaken
                    )}
                    onClick={() => !taken && toggleSeat(seatId)}
                    disabled={taken}
                  >
                    {taken && '✕'}
                    {!taken && selected && '✓'}
                  </Seat>
                )
              })}
            </div>
          )
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
      <Legend />
      <Actionables
        className="absolute bottom-0 right-0"
        clearSelection={() => setSelectedSeats([])}
        selectedSeats={selectedSeats || []}
        maxSelections={maxSelections}
      />
    </div>
  )
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
        'dt:dr-w-40 dt:dr-h-61 dr-w-32 dr-h-32 dr-rounded-t-8 dr-rounded-b-4 typo-label-s',
        className
      )}
      {...props}
    >
      {children}
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
    <div className={cn('flex dt:dr-gap-12 dr-gap-8', className)}>
      <button
        type="button"
        onClick={clearSelection}
        disabled={isEmptyArray(selectedSeats)}
        className={cn(
          'dt:dr-px-16 dt:dr-py-8 dr-px-12 dr-py-6 dr-rounded-10 typo-button',
          s.button
        )}
      >
        Clear Selection
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
        Confirm Selection
      </button>
    </div>
  )
}

function Legend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex dt:dr-gap-24 dr-gap-16 typo-label-s dt:dr-mb-16 dr-mb-12',
        className
      )}
    >
      <div className="flex items-center">
        <div className="dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6 bg-white border border-dark-grey" />
        <span>Available</span>
      </div>
      <div className="flex items-center">
        <div className="dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6 dr-border-2 border-dark-grey bg-teal border" />
        <span>Selected</span>
      </div>
      <div className="flex items-center">
        <div className="dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6 bg-grey border border-dark-grey " />
        <span>Taken</span>
      </div>
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex justify-center dr-gap-8 dr-mb-16">
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
            aria-label={`Go to rows ${i * ROWS_PER_PAGE + 1}-${Math.min((i + 1) * ROWS_PER_PAGE, ROWS)}`}
          />
        )
      })}
    </div>
  )
}

function SeatLetters({ className }: { className?: string }) {
  return (
    <div className={cn('flex dt:dr-gap-48 dr-gap-36', className)}>
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

function SelectedSeatsInfo({
  selectedSeats,
  maxSelections,
  className,
}: {
  selectedSeats: string[]
  maxSelections: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'dt:dr-mb-24 dr-mb-16 dt:dr-p-16 dr-p-12 dr-rounded-12 bg-light-gray border border-dark-grey',
        className
      )}
    >
      <span className="typo-label-m text-black">Selected Seats:</span>{' '}
      <span className="typo-p ml-2">
        {!isEmptyArray(selectedSeats) ? selectedSeats?.join(', ') : 'None'}
      </span>
      {maxSelections && (
        <span className="typo-label-s text-black-70 ml-4">
          ({selectedSeats?.length}/{maxSelections})
        </span>
      )}
    </div>
  )
}
