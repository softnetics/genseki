import { CalendarDate, parseDate, parseTime, Time } from '@internationalized/date'

export const convertDateToCalendarDate = <TDate extends Date>(
  date: TDate | CalendarDate | undefined
) => {
  if (date instanceof CalendarDate) return date

  if (!date) return undefined

  return parseDate(date.toISOString().split('T')[0])
}
export const convertDateToTimeValue = <TDate extends Date>(date: TDate | Time | undefined) => {
  if (date instanceof Time) return date

  if (!date) return undefined

  return parseTime(date.toTimeString().split(' ')[0])
}
