import type { CalendarDate, Time } from '@internationalized/date'
import { parseDate, parseTime } from '@internationalized/date'

export function convertDateStringToCalendarDate(
  dateString: string | null | undefined
): CalendarDate | null {
  if (!dateString) return null
  return parseDate(dateString.split('T')[0])
}

export function convertDateStringToTimeValue(timeString: string | null | undefined): Time | null {
  if (!timeString) return null
  return parseTime(timeString)
}
