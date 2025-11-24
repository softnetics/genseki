import type { CalendarDate, Time } from '@internationalized/date'
import { parseDate, parseTime } from '@internationalized/date'

export function convertDateStringToCalendarDate(
  dateString: string | Date | null | undefined
): CalendarDate | null {
  if (!dateString) return null

  if (dateString instanceof Date) {
    return parseDate(dateString.toISOString().split('T')[0])
  }

  return parseDate(dateString.split('T')[0])
}

export function convertDateStringToTimeValue(
  timeString: string | Date | null | undefined
): Time | null {
  if (!timeString) return null

  if (timeString instanceof Date) {
    const hours = timeString.getHours().toString().padStart(2, '0')
    const minutes = timeString.getMinutes().toString().padStart(2, '0')
    const seconds = timeString.getSeconds().toString().padStart(2, '0')
    return parseTime(`${hours}:${minutes}:${seconds}`)
  }

  return parseTime(timeString)
}
