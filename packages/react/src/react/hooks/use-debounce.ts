import { useEffect, useRef } from 'react'

export function useDebounce<T>(
  value: T,
  callback: (debouncedValue: T) => void,
  delay: number
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Update callback to latest
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(value)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])
}
