import { useEffect, useState } from 'react'

import { BaseFilterBox, type BaseFilterBoxInterface } from './base'

import { DatePicker, Label, Typography } from '../../../../../../../components'

interface FilterDateInterface extends BaseFilterBoxInterface {
  updateThisFilter: (startDate: string, endDate: string) => void
}

export function FilterDate(props: FilterDateInterface) {
  const [select, setSelect] = useState<{ startDate?: Date; endDate?: Date }>({
    startDate: undefined,
    endDate: undefined,
  })
  const isValidDate = (d?: Date) => !!d && !isNaN(d.getTime())

  const isDateRangeValid = (start: Date, end: Date): boolean => {
    if (!isValidDate(start) || !isValidDate(end)) return false
    return end.getTime() >= start.getTime()
  }

  const toIsoStartOfDayUTC = (d: Date) =>
    new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
    ).toISOString()

  const toIsoEndOfDayUTC = (d: Date) =>
    new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999)
    ).toISOString()

  useEffect(() => {
    const { startDate, endDate } = select
    if (!startDate || !endDate) return
    if (!isDateRangeValid(startDate, endDate)) return

    props.updateThisFilter(toIsoStartOfDayUTC(startDate), toIsoEndOfDayUTC(endDate))
  }, [select.startDate, select.endDate])

  return (
    <BaseFilterBox {...props}>
      <div>
        <Label>Filter by "{props.label}"</Label>
        <div className="flex items-end gap-2 my-2">
          <div className="flex flex-col gap-2 grow">
            <p>Start Date</p>
            <DatePicker
              onChange={(sd) => {
                const dateToDate = new Date(sd?.toString() || '')
                setSelect((prev) => ({
                  ...prev,
                  startDate: dateToDate,
                }))
              }}
            />
          </div>
          <div className="flex flex-col gap-2 grow">
            <p>End Date</p>
            <DatePicker
              onChange={(ed) => {
                const dateToDate = new Date(ed?.toString() || '')
                setSelect((prev) => ({
                  ...prev,
                  endDate: dateToDate,
                }))
              }}
            />
          </div>
        </div>
        {select.endDate &&
          select.startDate &&
          !isDateRangeValid(select.startDate, select.endDate) && (
            <Typography
              type="body"
              weight="bold"
              className="bg-primary/50 rounded-sm px-4 py-1 text-white"
            >
              End Date must be AFTER Start date
            </Typography>
          )}
      </div>
    </BaseFilterBox>
  )
}
