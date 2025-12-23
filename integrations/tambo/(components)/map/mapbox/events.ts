import { useEffect, useEffectEvent } from 'react'
import { type POI } from '~/integrations/tambo'

export const MAP_SEARCH_EVENT = 'tambo:map:search'

/** Structured search parameters */
export type SearchParams = {
  category: string
  brandFilter?: string
}

/** Result returned from search handler */
export type SearchResult = {
  count: number
  names: string[]
  pois: POI[]
}

type SearchEventDetail = {
  params: SearchParams
  resolve: (result: SearchResult) => void
  reject: (error: Error) => void
}

/**
 * Dispatch a search request to the map component.
 * Returns a promise that resolves with the search result.
 */
export function dispatchMapSearch(params: SearchParams): Promise<SearchResult> {
  return new Promise((resolve, reject) => {
    const detail: SearchEventDetail = { params, resolve, reject }
    window.dispatchEvent(new CustomEvent(MAP_SEARCH_EVENT, { detail }))
  })
}

/**
 * Hook to listen for map search events.
 * Calls the handler when a search event is dispatched and resolves/rejects the promise.
 */
export function useMapSearchListener(
  handler: (params: SearchParams) => Promise<SearchResult>
) {
  const stableHandler = useEffectEvent(async (event: Event) => {
    const { params, resolve, reject } = (
      event as CustomEvent<SearchEventDetail>
    ).detail

    try {
      const result = await handler(params)
      resolve(result)
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)))
    }
  })

  useEffect(() => {
    window.addEventListener(MAP_SEARCH_EVENT, stableHandler)
    return () => window.removeEventListener(MAP_SEARCH_EVENT, stableHandler)
  }, [])
}

export const MAP_NAVIGATION_EVENT = 'tambo:map:navigation'

/** Navigation parameters for flying to a location */
export type MapNavigationParams = {
  center: { lng: number; lat: number }
  zoom?: number
}

/**
 * Dispatch a navigation request to the map component.
 * The map will fly to the specified center location.
 */
export function dispatchMapNavigation(params: MapNavigationParams): void {
  window.dispatchEvent(
    new CustomEvent(MAP_NAVIGATION_EVENT, { detail: params })
  )
}

/**
 * Hook to listen for map navigation events.
 * Calls the handler when a navigation event is dispatched.
 */
export function useMapNavigationListener(
  handler: (params: MapNavigationParams) => void
) {
  const stableHandler = useEffectEvent((event: Event) => {
    const params = (event as CustomEvent<MapNavigationParams>).detail
    handler(params)
  })

  useEffect(() => {
    window.addEventListener(MAP_NAVIGATION_EVENT, stableHandler)
    return () => window.removeEventListener(MAP_NAVIGATION_EVENT, stableHandler)
  }, [])
}

export const ITINERARY_ADD_EVENT = 'tambo:itinerary:add'

/** Parameters for adding a POI to the itinerary */
export type AddToItineraryParams = {
  poi: POI
  selectedDate?: string
}

/** Result returned from itinerary add handler */
export type AddToItineraryResult = {
  success: boolean
  addedItem: { name: string; id: string | number }
}

type ItineraryEventDetail = {
  params: AddToItineraryParams
  resolve: (result: AddToItineraryResult) => void
  reject: (error: Error) => void
}

/**
 * Dispatch a request to add a POI to the itinerary.
 * Returns a promise that resolves with the result after the item is added.
 */
export function dispatchAddToItinerary(
  params: AddToItineraryParams
): Promise<AddToItineraryResult> {
  return new Promise((resolve, reject) => {
    const detail: ItineraryEventDetail = { params, resolve, reject }
    window.dispatchEvent(new CustomEvent(ITINERARY_ADD_EVENT, { detail }))
  })
}

/**
 * Hook to listen for itinerary add events.
 * Calls the handler when an add event is dispatched and resolves/rejects the promise.
 */
export function useAddToItineraryListener(
  handler: (params: AddToItineraryParams) => AddToItineraryResult
) {
  const stableHandler = useEffectEvent((event: Event) => {
    const { params, resolve, reject } = (
      event as CustomEvent<ItineraryEventDetail>
    ).detail

    try {
      const result = handler(params)
      resolve(result)
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)))
    }
  })

  useEffect(() => {
    window.addEventListener(ITINERARY_ADD_EVENT, stableHandler)
    return () => window.removeEventListener(ITINERARY_ADD_EVENT, stableHandler)
  }, [])
}
