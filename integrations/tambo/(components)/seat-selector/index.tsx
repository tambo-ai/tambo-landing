'use client'

import cn from 'clsx'
import { useCallback, useState } from 'react'
import { z } from 'zod'
import s from './styles.module.css'

// Define Zod schema for seat selector props
export const SeatSelectorSchema = z.object({
  rows: z.number().default(6).describe('Number of seat rows'),
  seatsPerRow: z.number().default(6).describe('Seats per row (A-F format)'),
  takenSeats: z
    .array(z.string())
    .default([
      '1A',
      '1C',
      '1D',
      '1F',
      '2B',
      '2C',
      '2E',
      '3A',
      '3D',
      '3E',
      '3F',
      '4A',
      '4B',
      '4C',
      '4E',
      '5B',
      '5D',
      '5F',
      '6A',
      '6C',
      '6D',
      '6E',
      '6F',
    ])
    .describe('Array of pre-taken seats (e.g., ["1A", "2C", "3F"])'),
  maxSelections: z
    .number()
    .optional()
    .describe('Maximum number of seats a user can select'),
  label: z
    .string()
    .default('Select Your Seats')
    .describe('Label to display above seat selector'),
})

export type SeatSelectorProps = z.infer<typeof SeatSelectorSchema>

export function SeatSelector(props: SeatSelectorProps) {
  const validated = SeatSelectorSchema.parse(props)
  const { rows, seatsPerRow, takenSeats, maxSelections, label } = validated

  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

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
    <div className={cn('dt:dr-p-32 dr-p-16', s.wrapper)}>
      <h3 className={cn('typo-h3 dt:dr-mb-16 dr-mb-12', s.title)}>{label}</h3>

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
        className={cn('dt:dr-gap-12 dr-gap-8 dt:dr-mb-24 dr-mb-16', s.seatGrid)}
      >
        {/* Header with seat letters */}
        <div className="flex dt:dr-gap-8 dr-gap-6 dt:dr-pl-48 dr-pl-32">
          {seatLetters.map((letter) => (
            <div
              key={letter}
              className={cn(
                'dt:dr-w-40 dr-w-32 text-center typo-label-m',
                s.seatHeader
              )}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Seat rows */}
        {Array.from({ length: rows }, (_, rowIndex) => {
          const rowNumber = rowIndex + 1
          return (
            <div
              key={rowNumber}
              className="flex dt:dr-gap-8 dr-gap-6 items-center"
            >
              {/* Row number */}
              <div
                className={cn(
                  'dt:dr-w-32 dr-w-24 text-right typo-label-m',
                  s.rowNumber
                )}
              >
                {rowNumber}
              </div>

              {/* Seats in this row */}
              {seatLetters.map((letter) => {
                const seatId = `${rowNumber}${letter}`
                const taken = isSeatTaken(seatId)
                const selected = isSeatSelected(seatId)

                return (
                  <button
                    key={seatId}
                    type="button"
                    onClick={() => !taken && toggleSeat(seatId)}
                    disabled={taken}
                    className={cn(
                      'dt:dr-w-40 dt:dr-h-40 dr-w-32 dr-h-32 dr-rounded-t-8 dr-rounded-b-4 typo-label-s',
                      s.seat,
                      selected && s.isSelected,
                      taken && s.isTaken
                    )}
                  >
                    {taken && '✕'}
                    {!taken && selected && '✓'}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex dt:dr-gap-24 dr-gap-16 typo-label-s dt:dr-mb-16 dr-mb-12">
        <div className={s.legendItem}>
          <div
            className={cn(
              'dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6',
              s.legendDot,
              s.legendAvailable
            )}
          />
          <span>Available</span>
        </div>
        <div className={s.legendItem}>
          <div
            className={cn(
              'dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6',
              s.legendDot,
              s.legendSelected
            )}
          />
          <span>Selected</span>
        </div>
        <div className={s.legendItem}>
          <div
            className={cn(
              'dt:dr-w-20 dt:dr-h-20 dr-w-16 dr-h-16 dr-rounded-4 dt:dr-mr-8 dr-mr-6',
              s.legendDot,
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
          disabled={selectedSeats.length === 0}
          className={cn(
            'dt:dr-px-16 dt:dr-py-8 dr-px-12 dr-py-6 dr-rounded-10 typo-button',
            s.button,
            s.buttonPrimary
          )}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  )
}
