import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 값에 디바운싱을 적용하는 훅
 * @param value 디바운싱할 값
 * @param delay 지연 시간 (ms)
 * @returns 디바운싱된 값
 *
 * @example
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounceValue(search, 300)
 *
 * useEffect(() => {
 *   // debouncedSearch가 변경될 때만 API 호출
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 함수에 디바운싱을 적용하는 훅
 * @param callback 디바운싱할 함수
 * @param delay 지연 시간 (ms)
 * @returns 디바운싱된 함수
 *
 * @example
 * const handleSearch = useDebounceCallback((query: string) => {
 *   fetchResults(query)
 * }, 300)
 *
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebounceCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}
