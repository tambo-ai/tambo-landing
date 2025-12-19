import { useEffect, useEffectEvent } from 'react'

export const MAP_SEARCH_EVENT = 'tambo:map:search'

/** Structured search parameters */
export type SearchParams = {
  category: string
  brandFilter?: string
}

/** Result returned from search handler */
export type SearchResult = {
  unknownCategory?: boolean
  suggestedCategories?: string[]
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
