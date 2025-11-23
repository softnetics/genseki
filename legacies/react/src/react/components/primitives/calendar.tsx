'use client'

import { use } from 'react'
import type { CalendarProps as CalendarPrimitiveProps, DateValue } from 'react-aria-components'
import { CalendarStateContext } from 'react-aria-components'
import {
  Calendar as CalendarPrimitive,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader as CalendarGridHeaderPrimitive,
  CalendarHeaderCell,
  composeRenderProps,
  Heading,
  Text,
  useLocale,
} from 'react-aria-components'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useDateFormatter } from '@react-aria/i18n'
import type { CalendarState } from '@react-stately/calendar'
import { twMerge } from 'tailwind-merge'

import { type CalendarDate, getLocalTimeZone, today } from '@internationalized/date'

import { Button } from './button'
import { Select, SelectLabel, SelectList, SelectOption, SelectTrigger } from './select'

import { BaseIcon } from '../../components/primitives/base-icon'

/**
 * @deprecated
 */
interface CalendarProps<T extends DateValue>
  extends Omit<CalendarPrimitiveProps<T>, 'visibleDuration'> {
  errorMessage?: string
  className?: string
}

/**
 * @deprecated
 */
const Calendar = <T extends DateValue>({ errorMessage, className, ...props }: CalendarProps<T>) => {
  const now = today(getLocalTimeZone())

  return (
    <CalendarPrimitive {...props}>
      <CalendarHeader />
      <CalendarGrid className="[&_td]:border-collapse [&_td]:px-0 [&_td]:py-0.5">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={composeRenderProps(className, (className, { isSelected, isDisabled }) =>
                twMerge(
                  'relative flex size-18 cursor-default items-center justify-center rounded-lg text-fg tabular-nums outline-hidden hover:bg-secondary-fg/15 sm:size-20 sm:text-sm/6 forced-colors:text-[ButtonText] forced-colors:outline-0',
                  isSelected &&
                    'bg-primary pressed:bg-primary text-primary-fg hover:bg-primary/90 data-invalid:bg-danger data-invalid:text-danger-fg forced-colors:bg-[Highlight] forced-colors:text-[Highlight] forced-colors:data-invalid:bg-[Mark]',
                  isDisabled && 'text-muted-fg forced-colors:text-[GrayText]',
                  date.compare(now) === 0 &&
                    'after:-translate-x-1/2 after:pointer-events-none after:absolute after:start-1/2 after:bottom-2 after:z-10 after:size-[3px] after:rounded-full after:bg-primary selected:after:bg-primary-fg focus-visible:after:bg-primary-fg',
                  className
                )
              )}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-danger text-sm/6">
          {errorMessage}
        </Text>
      )}
    </CalendarPrimitive>
  )
}

/**
 * @deprecated
 */
const CalendarHeader = ({
  isRange,
  className,
  ...props
}: React.ComponentProps<'header'> & { isRange?: boolean }) => {
  const { direction } = useLocale()
  const state = use(CalendarStateContext)!

  return (
    <header
      data-slot="calendar-header"
      className={twMerge('flex w-full justify-center gap-1.5 p-1 pl-2 pb-8 sm:pb-6', className)}
      {...props}
    >
      {!isRange && (
        <>
          <SelectMonth state={state} />
          <SelectYear state={state} />
        </>
      )}
      <Heading
        className={twMerge(
          'mr-2 flex-1 text-left font-medium text-muted-fg sm:text-sm',
          !isRange && 'sr-only',
          className
        )}
      />
      <div className="flex items-center gap-1">
        <Button
          size="square-petite"
          className="size-14 **:data-[slot=icon]:text-fg p-0"
          variant="ghost"
          slot="previous"
        >
          {direction === 'rtl' ? (
            <BaseIcon weight="regular" size="sm" icon={CaretRightIcon} />
          ) : (
            <BaseIcon weight="regular" size="sm" icon={CaretLeftIcon} />
          )}
        </Button>
        <Button
          size="square-petite"
          className="size-14 **:data-[slot=icon]:text-fg p-0"
          variant="ghost"
          slot="next"
        >
          {direction === 'rtl' ? (
            <BaseIcon weight="regular" size="sm" icon={CaretLeftIcon} />
          ) : (
            <BaseIcon weight="regular" size="sm" icon={CaretRightIcon} />
          )}
        </Button>
      </div>
    </header>
  )
}

/**
 * @deprecated
 */
const SelectMonth = ({ state }: { state: CalendarState }) => {
  const months = []

  const formatter = useDateFormatter({
    month: 'long',
    timeZone: state.timeZone,
  })

  const numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate)
  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i })
    months.push(formatter.format(date.toDate(state.timeZone)))
  }
  return (
    <Select
      className="[popover-width:8rem] w-auto"
      aria-label="Select month"
      selectedKey={state.focusedDate.month.toString() ?? (new Date().getMonth() + 1).toString()}
      onSelectionChange={(value) => {
        state.setFocusedDate(state.focusedDate.set({ month: Number(value) }))
      }}
    >
      <SelectTrigger className="h-14 w-44 px-4 py-0 text-xs focus:ring-3 **:data-[slot=select-value]:inline-block **:data-[slot=select-value]:truncate group-data-open:ring-3" />
      <SelectList className="w-64 min-w-64 max-w-64" popoverClassName="w-64 max-w-64 min-w-64">
        {months.map((month, index) => (
          <SelectOption key={index} id={(index + 1).toString()} textValue={month}>
            <SelectLabel>{month}</SelectLabel>
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  )
}

/**
 * @deprecated
 */
const SelectYear = ({ state }: { state: CalendarState }) => {
  const years: { value: CalendarDate; formatted: string }[] = []
  const formatter = useDateFormatter({
    year: 'numeric',
    timeZone: state.timeZone,
  })

  for (let i = -20; i <= 20; i++) {
    const date = state.focusedDate.add({ years: i })
    years.push({
      value: date,
      formatted: formatter.format(date.toDate(state.timeZone)),
    })
  }

  return (
    <Select
      aria-label="Select year"
      selectedKey={20}
      onSelectionChange={(value) => {
        state.setFocusedDate(years[Number(value)]?.value)
      }}
    >
      <SelectTrigger className="h-14 w-36 text-xs px-4 py-0 focus:ring-3 group-data-open:ring-3" />
      <SelectList className="w-44 min-w-44 max-w-44" popoverClassName="w-44 max-w-44 min-w-44">
        {years.map((year, i) => (
          <SelectOption key={i} id={i} textValue={year.formatted}>
            <SelectLabel>{year.formatted}</SelectLabel>
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  )
}

/**
 * @deprecated
 */
const CalendarGridHeader = () => {
  return (
    <CalendarGridHeaderPrimitive>
      {(day) => (
        <CalendarHeaderCell className="pb-2 font-semibold text-muted-fg text-sm sm:px-0 sm:py-0.5 lg:text-xs">
          {day}
        </CalendarHeaderCell>
      )}
    </CalendarGridHeaderPrimitive>
  )
}

export type { CalendarProps }
export { Calendar, CalendarGridHeader, CalendarHeader }
