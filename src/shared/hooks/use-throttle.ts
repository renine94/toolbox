import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 값에 쓰로틀링을 적용하는 훅
 * @param value 쓰로틀링할 값
 * @param delay 최소 간격 (ms)
 * @returns 쓰로틀링된 값
 *
 * @example
 * const [scrollY, setScrollY] = useState(0)
 * const throttledScrollY = useThrottleValue(scrollY, 100)
 *
 * useEffect(() => {
 *   // 100ms마다 최대 1번만 업데이트
 *   updateUI(throttledScrollY)
 * }, [throttledScrollY])
 */
export function useThrottleValue<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdated.current

    if (timeSinceLastUpdate >= delay) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, delay - timeSinceLastUpdate)

      return () => clearTimeout(timer)
    }
  }, [value, delay])

  return throttledValue
}

/**
 * 함수에 쓰로틀링을 적용하는 훅
 * @param callback 쓰로틀링할 함수
 * @param delay 최소 간격 (ms)
 * @returns 쓰로틀링된 함수
 *
 * @example
 * const handleScroll = useThrottleCallback(() => {
 *   console.log('scroll position:', window.scrollY)
 * }, 100)
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll)
 *   return () => window.removeEventListener('scroll', handleScroll)
 * }, [handleScroll])
 */
export function useThrottleCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCalled = useRef<number>(0)
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
      const now = Date.now()
      const timeSinceLastCall = now - lastCalled.current

      if (timeSinceLastCall >= delay) {
        lastCalled.current = now
        callbackRef.current(...args)
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastCalled.current = Date.now()
          callbackRef.current(...args)
          timeoutRef.current = null
        }, delay - timeSinceLastCall)
      }
    },
    [delay]
  )
}
