import { z } from 'zod'
import { type BBox, type itineraryItem, type POI } from '~/integrations/tambo'

// Schema for map component props
export const MapSchema = z.object({
  height: z
    .number()
    .default(356)
    .describe('Height of the map component in pixels'),
  center: z
    .object({
      lng: z.number().describe('Longitude of the map center'),
      lat: z.number().describe('Latitude of the map center'),
    })
    .describe('Initial center location of the map [longitude, latitude]'),
  zoom: z.number().default(12).describe('Initial zoom level of the map'),
  selectedArea: z
    .object({
      west: z.number().describe('Western boundary (longitude)'),
      east: z.number().describe('Eastern boundary (longitude)'),
      south: z.number().describe('Southern boundary (latitude)'),
      north: z.number().describe('Northern boundary (latitude)'),
    })
    .optional()
    .describe('Currently selected bounding box area on the map'),
})

export const mapExampleContext = {
  assistantBehavior: () => `## Role\n  'You are a helpful assistant that can help with searching for entrainment options in a destination.' \n\n## Instructions\n if user asks something not related to searching for entrainment options, you should brielfy answer and politely redirect them to the entrainment selection component.`,
  mapState: (bbox: BBox | null) => {
    if (!bbox) {
      return `
      IMPORTANT: No area has been selected yet. The user needs to draw a rectangle on the map to select an area before you can help them search for things to do or points of interest.

      If the user asks about the selected area or what they can do, politely remind them to first draw a rectangle on the map to select an area.`
    }

    // Calculate approximate center of bbox
    const centerLng = (bbox.west + bbox.east) / 2
    const centerLat = (bbox.south + bbox.north) / 2

    return `The user has selected an area on the map. Here are the details:

    **Selected Area Coordinates:**
    - Western boundary: ${bbox.west.toFixed(4)}° longitude
    - Eastern boundary: ${bbox.east.toFixed(4)}° longitude
    - Southern boundary: ${bbox.south.toFixed(4)}° latitude
    - Northern boundary: ${bbox.north.toFixed(4)}° latitude
    - Approximate center: ${centerLng.toFixed(4)}° longitude, ${centerLat.toFixed(4)}° latitude

    **What you can do:**
    - When the user asks about things to do, places to visit, restaurants, cafes, or any points of interest in this area, you can help them search
    - The map component will automatically search for points of interest when the user asks questions
    - You can describe what types of activities or places might be available in this geographic area
    - If the user asks "what can I do with this selection?" or similar questions, explain that they can search for entertainment options, restaurants, cafes, attractions, etc. in the selected area
    
      **Navigation:**
 - You can navigate the map to any location by using search_location and then updating the interactable map's center prop`
  },
  itinerary: (itinerary: itineraryItem[]) => {
    return `
    The user has selected the following points of interest:
    ${itinerary
      .map((item) => `- ${item.poi.type} - ${item.poi.name} ${item.selectedDate ? `(Selected time: ${item.selectedDate})` : ''}`)
      .join('\n')}
    If user asks to add a point of interest to the itinerary, first check if its already in the itinerary.

    if it is not, you should check the poi metadata to see if it is a restaurant, cafe, attraction, etc. and add its working hours to the itinerary. this way you can check if the point of interest is open and if it is, you can add ask user which time they want to visit the point of interest. 

    Depending on the other pois in the itinerary, you can suggest to the user to add the point of interest to the itinerary. for example if the user is already planning to visit a restaurant, you can suggest to add a cafe to the itinerary.
    `
  }
}
