import { useCallback } from 'react'
import { fetchBook, fetchBooks } from '../lib/booksApi.js'
import { useAsync } from './useAsync.js'

export function useBooks() {
  return useAsync(fetchBooks)
}

export function useBook(id) {
  const load = useCallback(() => fetchBook(id), [id])
  return useAsync(load)
}
