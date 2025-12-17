'use client'

import cn from 'clsx'
import { useCallback, useState } from 'react'
import { z } from 'zod'
import { SeatSelectorSchema } from './schema'
import s from './styles.module.css'
import { useAssitant } from '../..'

export type SeatSelectorProps = z.infer<typeof SeatSelectorSchema>

export function SeatSelector(props: SeatSelectorProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const validated = SeatSelectorSchema.parse(props)
  const { rows, seatsPerRow, takenSeats, maxSelections } = validated
  const { finishSeatSelection} = useAssitant()

  // Generate seat labels (A, B, C, D, E, F, etc.)
  const seatLetters = Array.from({ length: seatsPerRow }, (_, i) =>
    String.fromCharCode(65 + i)
  )

  const toggleSeat = useCallback(
    (seatId: string) => {
      setSelectedSeats((prev) => {
        // If already selected, deselect it
        if (prev.includes(seatId)) {
          return prev.filter((id) => id !== seatId)
        }

        // If max selections reached, don't add more
        if (maxSelections !== undefined && prev.length >= maxSelections) {
          return prev
        }

        // Add to selection
        return [...prev, seatId]
      })
    },
    [maxSelections]
  )

  const clearSelection = useCallback(() => {
    setSelectedSeats([])
  }, [])

  const isSeatTaken = useCallback(
    (seatId: string) => takenSeats.includes(seatId),
    [takenSeats]
  )

  const isSeatSelected = useCallback(
    (seatId: string) => selectedSeats.includes(seatId),
    [selectedSeats]
  )

  return (
    <div className='w-fit relative dt:dr-p-24 dr-p-16 border border-dark-grey dr-rounded-12'>
      <h3 className='dr-py-6 dr-px-12 typo-button absolute -dr-top-14 left-1/2 -translate-x-1/2 border dr-rounded-20 text-color-black'>{'<SeatMap/>'}</h3>

      {/* Selected seats info */}
      <div
        className={cn(
          'dt:dr-mb-24 dr-mb-16 dt:dr-p-16 dr-p-12 dr-rounded-12',
          s.infoBox
        )}
      >
        <span className="typo-label-m text-black">Selected Seats:</span>{' '}
        <span className="typo-p ml-2">
          {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
        </span>
        {maxSelections && (
          <span className="typo-label-s text-black-70 ml-4">
            ({selectedSeats.length}/{maxSelections})
          </span>
        )}
      </div>

      {/* Airplane seat grid */}
      <div
        className='w-full dt:dr-gap-12 dr-gap-8 dt:dr-mb-24 dr-mb-16 flex flex-col items-center'>

        {/* Header with seat letters */}
        <div className="flex dt:dr-gap-48 dr-gap-36">
          <div className="flex dt:dr-gap-8 dr-gap-6">
            {seatLetters.slice(0,3).map((letter) => (
              <div
                key={letter}
                className='dt:dr-w-40 dr-w-32 text-center typo-label-m text-color-black-70'
              >
                {letter}
              </div>
            ))}
          </div>
          <div className="flex dt:dr-gap-8 dr-gap-6">
            {seatLetters.slice(3,6).map((letter) => (
              <div
                key={letter}
                className='dt:dr-w-40 dr-w-32 text-center typo-label-m text-color-black-70'
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Seat rows */}
        {Array.from({ length: rows }, (_, rowIndex) => {
          const rowNumber = rowIndex + 1
          return (
            <div
              key={rowNumber}
              className="flex dt:dr-gap-8 dr-gap-6 items-center"
            >
              {/* Seats in this row */}
              {seatLetters.slice(0,3).map((letter) => {
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
                  >{taken && '✕'}
                    {!taken && selected && '✓'}</Seat>
                )
              })}

              {/* Row number */}
              <div
                className='dt:dr-w-32 dr-w-24 text-center typo-label-m text-color-black-70'
              >
                {rowNumber}
              </div>

              {/* Seats in this row */}
              {seatLetters.slice(3,6).map((letter) => {
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
                  >{taken && '✕'}
                    {!taken && selected && '✓'}</Seat>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex dt:dr-gap-24 dr-gap-16 typo-label-s dt:dr-mb-16 dr-mb-12">
        <div className='flex items-center'>
          <div
            className={cn(
              'dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6',
              s.legendAvailable
            )}
          />
          <span>Available</span>
        </div>
           <div className='flex items-center'>
          <div
            className={cn(
              'dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6 dr-border-2 border-dark-grey',
              s.legendSelected
            )}
          />
          <span>Selected</span>
        </div>
           <div className='flex items-center'>
          <div
            className={cn(
              'dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6',
              s.legendTaken
            )}
          />
          <span>Taken</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex dt:dr-gap-12 dr-gap-8">
        <button
          type="button"
          onClick={clearSelection}
          disabled={selectedSeats.length === 0}
          className={cn(
            'dt:dr-px-16 dt:dr-py-8 dr-px-12 dr-py-6 dr-rounded-10 typo-button',
            s.button
          )}
        >
          Clear Selection
        </button>
        <button
          type="button"
          disabled={selectedSeats.length !== maxSelections}
          className={cn(
            'dt:dr-px-16 dt:dr-py-8 dr-px-12 dr-py-6 dr-rounded-10 typo-button',
            s.button,
            s.buttonPrimary
          )}
          onClick={() => finishSeatSelection(selectedSeats.join(','))}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  )
}

function Seat({  className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className: string, children: React.ReactNode }) {
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