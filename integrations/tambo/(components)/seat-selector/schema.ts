import type { TamboComponent } from '@tambo-ai/react'
import { z } from 'zod'
import { SeatMap } from '~/integrations/tambo/(components)/seat-selector/seatmap'

const SeatSChema = z.object({
  id: z.string(),
  taken: z.boolean(),
  price: z.number(),
  position: z.enum(['window', 'middle', 'aisle']),
  emergencyExit: z.boolean(),
})
type SeatProps = z.infer<typeof SeatSChema>

const SeatSelectorSchema = z.object({
  userSelectedSeats: z
    .array(z.string())
    .describe('Seat selected by user. Array of seat IDs.'),
  maxSelections: z
    .number()
    .default(1)
    .describe('Maximum number of seats a user can select'),
})
export type SeatMapProps = z.infer<typeof SeatSelectorSchema>

export const seatComponent: TamboComponent[] = [
  {
    component: SeatMap,
    name: 'seat-selector',
    description:
      'A seat selector component for airplane seats. When the user mentions a specific seat (like "5A" or "row 3 window"), use the userSelectedSeats prop to highlight that seat.',
    propsSchema: SeatSelectorSchema,
    associatedTools: [
      //Zod V3
      {
        name: 'get-airplane-seats',
        description: 'Get airplane seats information',
        tool: async () => ({ seats: SEATS }),
        toolSchema: z
          .function()
          .args(z.object({}))
          .returns(
            z.object({
              seats: z.array(SeatSChema),
            })
          )
          .describe('Get airplane seats information'),
      },
      // {
      //   name: 'get-airplane-seats',
      //   description: 'Get airplane seats information',
      //   tool: async () => ({ seats: SEATS }),
      //   toolSchema: z
      //     .function()
      //     .input(z.object({}))
      //     .output(
      //       z.object({
      //         seats: z.array(SeatSChema),
      //       })
      //     )
      //     .describe('Get airplane seats information'),
      // },
    ],
  },
]

export const seatExampleContext = {
  objective:
    'You are a helpful assistant that can help with seat selection for an airplane',
  instructions: `User already knows he needs to select a seat, so if user asks something not related to seat selection, you should brielfy answer and politely redirect them to the seat selection component.
  
  When user agrees to start, you should ask them if they prefer a window or aisle seat, if they don't have any limitations around seating in emergency exits, etc. Also ask about the budget for the seat.
  
  You also have access to the get-airplane-seats tool to get information about the seats on the airplane.

  When showing the seat-selector component, if the user has already mentioned a specific seat they want 
  (like "I want seat 5A" or "can I have row 3 window seat"), pass that seat IDs as the userSelectedSeats prop which will map the useTamboComponentState keyName 'userSelectedSeats'.
  
  User must go through the seat map component to select the seats, you can show it at the end if it already picked a seat or seats.`,
}

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'] as const
const COLUMN_POSITIONS: Record<string, SeatProps['position']> = {
  A: 'window',
  B: 'middle',
  C: 'aisle',
  D: 'aisle',
  E: 'middle',
  F: 'window',
}
const EMERGENCY_EXIT_ROWS = [11, 12]

export function generateSeats(totalRows = 25, seed = 42): SeatProps[] {
  // Seeded random for consistent results
  const seededRandom = (n: number) => {
    const x = Math.sin(seed + n) * 10000
    return x - Math.floor(x)
  }

  const seats: SeatProps[] = []
  let seatIndex = 0

  for (let row = 1; row <= totalRows; row++) {
    // Price: $60 at row 1, $10 at last row (linear interpolation)
    const price = Math.round(60 - ((row - 1) / (totalRows - 1)) * 50)

    // Occupancy probability: 50% at row 1, 95% at last row
    const takenProbability = 0.5 + ((row - 1) / (totalRows - 1)) * 0.45

    for (const column of COLUMNS) {
      seats.push({
        id: `${row}${column}`,
        taken: seededRandom(seatIndex++) < takenProbability,
        price,
        position: COLUMN_POSITIONS[column],
        emergencyExit: EMERGENCY_EXIT_ROWS.includes(row),
      })
    }
  }

  return seats
}

export const SEATS = [
  {
    id: '1A',
    taken: false,
    price: 60,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '1B',
    taken: true,
    price: 60,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '1C',
    taken: true,
    price: 60,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '1D',
    taken: true,
    price: 60,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '1E',
    taken: false,
    price: 60,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '1F',
    taken: false,
    price: 60,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '2A',
    taken: true,
    price: 58,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '2B',
    taken: true,
    price: 58,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '2C',
    taken: true,
    price: 58,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '2D',
    taken: true,
    price: 58,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '2E',
    taken: true,
    price: 58,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '2F',
    taken: true,
    price: 58,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '3A',
    taken: true,
    price: 56,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '3B',
    taken: true,
    price: 56,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '3C',
    taken: true,
    price: 56,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '3D',
    taken: false,
    price: 56,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '3E',
    taken: false,
    price: 56,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '3F',
    taken: true,
    price: 56,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '4A',
    taken: false,
    price: 54,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '4B',
    taken: false,
    price: 54,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '4C',
    taken: true,
    price: 54,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '4D',
    taken: false,
    price: 54,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '4E',
    taken: true,
    price: 54,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '4F',
    taken: true,
    price: 54,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '5A',
    taken: true,
    price: 52,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '5B',
    taken: false,
    price: 52,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '5C',
    taken: false,
    price: 52,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '5D',
    taken: true,
    price: 52,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '5E',
    taken: false,
    price: 52,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '5F',
    taken: true,
    price: 52,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '6A',
    taken: true,
    price: 50,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '6B',
    taken: true,
    price: 50,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '6C',
    taken: true,
    price: 50,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '6D',
    taken: true,
    price: 50,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '6E',
    taken: true,
    price: 50,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '6F',
    taken: true,
    price: 50,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '7A',
    taken: false,
    price: 48,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '7B',
    taken: false,
    price: 48,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '7C',
    taken: true,
    price: 48,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '7D',
    taken: true,
    price: 48,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '7E',
    taken: true,
    price: 48,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '7F',
    taken: false,
    price: 48,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '8A',
    taken: false,
    price: 45,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '8B',
    taken: true,
    price: 45,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '8C',
    taken: true,
    price: 45,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '8D',
    taken: false,
    price: 45,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '8E',
    taken: false,
    price: 45,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '8F',
    taken: false,
    price: 45,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '9A',
    taken: false,
    price: 43,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '9B',
    taken: false,
    price: 43,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '9C',
    taken: true,
    price: 43,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '9D',
    taken: true,
    price: 43,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '9E',
    taken: true,
    price: 43,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '9F',
    taken: true,
    price: 43,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '10A',
    taken: false,
    price: 41,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '10B',
    taken: true,
    price: 41,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '10C',
    taken: true,
    price: 41,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '10D',
    taken: false,
    price: 41,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '10E',
    taken: true,
    price: 41,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '10F',
    taken: true,
    price: 41,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '11A',
    taken: true,
    price: 39,
    position: 'window',
    emergencyExit: true,
  },
  {
    id: '11B',
    taken: false,
    price: 39,
    position: 'middle',
    emergencyExit: true,
  },
  {
    id: '11C',
    taken: false,
    price: 39,
    position: 'aisle',
    emergencyExit: true,
  },
  {
    id: '11D',
    taken: true,
    price: 39,
    position: 'aisle',
    emergencyExit: true,
  },
  {
    id: '11E',
    taken: true,
    price: 39,
    position: 'middle',
    emergencyExit: true,
  },
  {
    id: '11F',
    taken: false,
    price: 39,
    position: 'window',
    emergencyExit: true,
  },
  {
    id: '12A',
    taken: true,
    price: 37,
    position: 'window',
    emergencyExit: true,
  },
  {
    id: '12B',
    taken: true,
    price: 37,
    position: 'middle',
    emergencyExit: true,
  },
  {
    id: '12C',
    taken: true,
    price: 37,
    position: 'aisle',
    emergencyExit: true,
  },
  {
    id: '12D',
    taken: true,
    price: 37,
    position: 'aisle',
    emergencyExit: true,
  },
  {
    id: '12E',
    taken: true,
    price: 37,
    position: 'middle',
    emergencyExit: true,
  },
  {
    id: '12F',
    taken: true,
    price: 37,
    position: 'window',
    emergencyExit: true,
  },
  {
    id: '13A',
    taken: false,
    price: 35,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '13B',
    taken: true,
    price: 35,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '13C',
    taken: true,
    price: 35,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '13D',
    taken: true,
    price: 35,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '13E',
    taken: true,
    price: 35,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '13F',
    taken: false,
    price: 35,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '14A',
    taken: true,
    price: 33,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '14B',
    taken: true,
    price: 33,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '14C',
    taken: true,
    price: 33,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '14D',
    taken: false,
    price: 33,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '14E',
    taken: true,
    price: 33,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '14F',
    taken: true,
    price: 33,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '15A',
    taken: false,
    price: 31,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '15B',
    taken: true,
    price: 31,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '15C',
    taken: true,
    price: 31,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '15D',
    taken: true,
    price: 31,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '15E',
    taken: false,
    price: 31,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '15F',
    taken: false,
    price: 31,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '16A',
    taken: false,
    price: 29,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '16B',
    taken: true,
    price: 29,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '16C',
    taken: true,
    price: 29,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '16D',
    taken: true,
    price: 29,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '16E',
    taken: true,
    price: 29,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '16F',
    taken: false,
    price: 29,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '17A',
    taken: true,
    price: 27,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '17B',
    taken: false,
    price: 27,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '17C',
    taken: true,
    price: 27,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '17D',
    taken: true,
    price: 27,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '17E',
    taken: true,
    price: 27,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '17F',
    taken: true,
    price: 27,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '18A',
    taken: true,
    price: 25,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '18B',
    taken: true,
    price: 25,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '18C',
    taken: true,
    price: 25,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '18D',
    taken: true,
    price: 25,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '18E',
    taken: true,
    price: 25,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '18F',
    taken: true,
    price: 25,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '19A',
    taken: true,
    price: 23,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '19B',
    taken: true,
    price: 23,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '19C',
    taken: true,
    price: 23,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '19D',
    taken: true,
    price: 23,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '19E',
    taken: true,
    price: 23,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '19F',
    taken: false,
    price: 23,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '20A',
    taken: true,
    price: 20,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '20B',
    taken: true,
    price: 20,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '20C',
    taken: true,
    price: 20,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '20D',
    taken: true,
    price: 20,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '20E',
    taken: true,
    price: 20,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '20F',
    taken: false,
    price: 20,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '21A',
    taken: true,
    price: 18,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '21B',
    taken: false,
    price: 18,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '21C',
    taken: true,
    price: 18,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '21D',
    taken: false,
    price: 18,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '21E',
    taken: false,
    price: 18,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '21F',
    taken: true,
    price: 18,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '22A',
    taken: true,
    price: 16,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '22B',
    taken: true,
    price: 16,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '22C',
    taken: true,
    price: 16,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '22D',
    taken: false,
    price: 16,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '22E',
    taken: true,
    price: 16,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '22F',
    taken: false,
    price: 16,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '23A',
    taken: true,
    price: 14,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '23B',
    taken: true,
    price: 14,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '23C',
    taken: true,
    price: 14,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '23D',
    taken: true,
    price: 14,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '23E',
    taken: true,
    price: 14,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '23F',
    taken: true,
    price: 14,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '24A',
    taken: true,
    price: 12,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '24B',
    taken: true,
    price: 12,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '24C',
    taken: true,
    price: 12,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '24D',
    taken: true,
    price: 12,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '24E',
    taken: true,
    price: 12,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '24F',
    taken: true,
    price: 12,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '25A',
    taken: true,
    price: 10,
    position: 'window',
    emergencyExit: false,
  },
  {
    id: '25B',
    taken: true,
    price: 10,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '25C',
    taken: true,
    price: 10,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '25D',
    taken: true,
    price: 10,
    position: 'aisle',
    emergencyExit: false,
  },
  {
    id: '25E',
    taken: false,
    price: 10,
    position: 'middle',
    emergencyExit: false,
  },
  {
    id: '25F',
    taken: true,
    price: 10,
    position: 'window',
    emergencyExit: false,
  },
]
