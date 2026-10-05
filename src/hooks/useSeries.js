import { useCallback } from 'react'
import { fetchSeries, fetchSeriesList } from '../lib/seriesApi.js'
import { useAsync } from './useAsync.js'

export function useSeriesList() {
  return useAsync(fetchSeriesList)
}

export function useSeries(id) {
  const load = useCallback(() => fetchSeries(id), [id])
  return useAsync(load)
}
