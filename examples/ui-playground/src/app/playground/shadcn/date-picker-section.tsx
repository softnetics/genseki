import React, { useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { CalendarDotsIcon, ClockIcon } from '@phosphor-icons/react'
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns'

import { InputGroup, InputGroupControl } from '@genseki/react'
import {
  Button,
  Calendar,
  CalendarDayButton,
  DatePickerContent,
  DatePickerProvider,
  DatePickerTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from '@genseki/ui'

import { InformationCard, PlaygroundCard } from '../../../components/card'

function BasicDatePicker() {
  const [date, setDate] = useState<Date>()

  return (
    <div>
      <DatePickerProvider>
        <DatePickerTrigger
          value={date}
          formatDate={(value) => {
            // `formatDate` is optional
            return value?.getTime()
          }}
        />
        <DatePickerContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="min-w-(--radix-popover-trigger-width)"
          />
        </DatePickerContent>
      </DatePickerProvider>
    </div>
  )
}

function CustomDatePicker() {
  const [date, setDate] = useState<Date | undefined>()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <DatePickerProvider open={open} onOpenChange={setOpen}>
          <DatePickerTrigger asChild>
            <Button className="min-w-[120px]">Book a restaurant</Button>
          </DatePickerTrigger>
          <DatePickerContent align="start">
            <Calendar
              mode="single"
              className="min-w-(--radix-popover-trigger-width)"
              captionLayout="dropdown"
              selected={date}
              onSelect={setDate}
            />
            <hr />
            <div className="p-6 flex gap-x-6 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          </DatePickerContent>
        </DatePickerProvider>
      </div>
      <Typography type="caption" className="text-text-tertiary">
        {date
          ? `Booking date: ${format(date, 'dd/MM/yyyy HH:mm:ss')}`
          : 'Please choose the reservation date'}
      </Typography>
    </div>
  )
}

/**
 * @description This is an example from Shadcn
 */
function FromScratchDatePicker() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[200px] justify-between ring-offset-0 ring-0"
        >
          {date ? format(date, 'dd/MM/yyyy') : <Typography>Select date</Typography>}
          <CalendarDotsIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}

function RangeDatePicker() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [open, setOpen] = useState(false)

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return 'Select date range'
    if (!range.to) return format(range.from, 'dd/MM/yyyy')
    return `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!dateRange?.from}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-between ring-offset-0 ring-0"
            >
              <Typography>{formatDateRange(dateRange)}</Typography>
              <CalendarDotsIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              classNames={{
                today: '',
              }}
              components={{
                DayButton: (props) => (
                  <CalendarDayButton
                    {...props}
                    className="data-[range-start=true]:!rounded-full data-[range-end=true]:!rounded-full"
                  />
                ),
              }}
            />
            <hr />
            <div className="p-8 flex justify-end gap-x-6">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDateRange(undefined)
                  setOpen(false)
                }}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Typography type="caption" className="text-text-tertiary">
        {dateRange?.from && dateRange?.to
          ? `Selected range: ${format(dateRange.from, 'dd/MM/yyyy')} to ${format(dateRange.to, 'dd/MM/yyyy')}`
          : dateRange?.from
            ? `Start date: ${format(dateRange.from, 'dd/MM/yyyy')} (select end date)`
            : 'Please select a date range'}
      </Typography>
    </div>
  )
}

function DateTimePicker() {
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState('09:00')
  const [open, setOpen] = useState(false)

  const formatDateTime = (date: Date | undefined, time: string) => {
    if (!date) return 'Select date and time'
    return `${format(date, 'dd/MM/yyyy')} at ${time}`
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(':')
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(parseInt(hours), parseInt(minutes))
      setDate(newDateTime)
    } else {
      setDate(selectedDate)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (date) {
      const [hours, minutes] = newTime.split(':')
      const newDateTime = new Date(date)
      newDateTime.setHours(parseInt(hours), parseInt(minutes))
      setDate(newDateTime)
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-between ring-offset-0 ring-0"
            >
              <Typography>{formatDateTime(date, time)}</Typography>
              <CalendarDotsIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="min-w-[320px]"
            />
            <hr />
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="size-8" />
                <Typography type="body" className="font-medium">
                  Time
                </Typography>
              </div>
              <InputGroup>
                <InputGroupControl>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                  />
                </InputGroupControl>
              </InputGroup>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDate(undefined)
                    setTime('09:00')
                    setOpen(false)
                  }}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button onClick={() => setOpen(false)} className="flex-1">
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Typography type="caption" className="text-text-tertiary">
        {date ? `Selected: ${format(date, 'dd/MM/yyyy HH:mm')}` : 'Please select a date and time'}
      </Typography>
    </div>
  )
}

function MultiMonthDatePicker() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [open, setOpen] = useState(false)

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return 'Select date range'
    if (!range.to) return format(range.from, 'dd/MM/yyyy')
    return `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!dateRange?.from}
              className="data-[empty=true]:text-muted-foreground w-[320px] justify-between ring-offset-0 ring-0"
            >
              <Typography>{formatDateRange(dateRange)}</Typography>
              <CalendarDotsIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={3}
              className="min-w-[900px]"
            />
            <hr />
            <div className="p-8 space-x-6">
              <Button
                variant="outline"
                onClick={() => {
                  setDateRange(undefined)
                  setOpen(false)
                }}
              >
                Clear
              </Button>
              <Button onClick={() => setOpen(false)}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Typography type="caption" className="text-text-tertiary">
        {dateRange?.from && dateRange?.to
          ? `Selected range: ${format(dateRange.from, 'dd/MM/yyyy')} to ${format(dateRange.to, 'dd/MM/yyyy')}`
          : dateRange?.from
            ? `Start date: ${format(dateRange.from, 'dd/MM/yyyy')} (select end date)`
            : 'Please select a date range'}
      </Typography>
    </div>
  )
}

function PresetDatePicker() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [open, setOpen] = useState(false)

  const presets = [
    {
      label: 'Today',
      value: { from: new Date(), to: new Date() },
    },
    {
      label: 'Yesterday',
      value: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) },
    },
    {
      label: 'Last 7 days',
      value: { from: subDays(new Date(), 6), to: new Date() },
    },
    {
      label: 'Last 30 days',
      value: { from: subDays(new Date(), 29), to: new Date() },
    },
    {
      label: 'This week',
      value: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) },
    },
    {
      label: 'This month',
      value: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
  ]

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return 'Select date range'
    if (!range.to) return format(range.from, 'dd/MM/yyyy')
    return `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <DatePickerProvider open={open} onOpenChange={setOpen}>
          <DatePickerTrigger asChild>
            <Button
              variant="outline"
              data-empty={!dateRange?.from}
              className="data-[empty=true]:text-muted-foreground w-[320px] justify-between ring-offset-0 ring-0"
            >
              <Typography>{formatDateRange(dateRange)}</Typography>
              <CalendarDotsIcon />
            </Button>
          </DatePickerTrigger>
          <DatePickerContent className="w-[800px] p-0" align="start">
            <div className="flex">
              <div className="border-r p-4">
                <Typography type="caption" className="font-medium mb-3 text-text-tertiary pl-6">
                  Quick Select
                </Typography>
                <div className="space-y-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setDateRange(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="min-w-[600px]"
              />
            </div>
            <hr />
            <div className="p-6 space-x-6">
              <Button
                variant="outline"
                onClick={() => {
                  setDateRange(undefined)
                  setOpen(false)
                }}
              >
                Clear
              </Button>
              <Button onClick={() => setOpen(false)}>Apply</Button>
            </div>
          </DatePickerContent>
        </DatePickerProvider>
      </div>
      <Typography type="caption" className="text-text-tertiary">
        {dateRange?.from && dateRange?.to
          ? `Selected range: ${format(dateRange.from, 'dd/MM/yyyy')} to ${format(dateRange.to, 'dd/MM/yyyy')}`
          : dateRange?.from
            ? `Start date: ${format(dateRange.from, 'dd/MM/yyyy')} (select end date)`
            : 'Please select a date range'}
      </Typography>
    </div>
  )
}

function DisabledDatesPicker() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <DatePickerProvider>
          <DatePickerTrigger disabled />
          <DatePickerContent className="w-auto p-0">
            <Calendar mode="single" className="min-w-[320px]" />
          </DatePickerContent>
        </DatePickerProvider>
      </div>
    </div>
  )
}

function DisabledDates() {
  const [date, setDate] = useState<Date | undefined>()
  const [open, setOpen] = useState(false)

  const today = new Date()
  const disabledDates = [addDays(today, 1), addDays(today, 2), addDays(today, 5), addDays(today, 8)]

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-between ring-offset-0 ring-0"
            >
              {date ? format(date, 'dd/MM/yyyy') : <Typography>Select date</Typography>}
              <CalendarDotsIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDates}
              className="min-w-[320px]"
            />
            <hr />
            <div className="p-4">
              <Typography type="caption" className="text-text-tertiary">
                Some dates are disabled for booking
              </Typography>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Typography type="caption" className="text-text-tertiary">
        {date ? `Selected date: ${format(date, 'dd/MM/yyyy')}` : 'Please select an available date'}
      </Typography>
    </div>
  )
}

export function DatePickerSection() {
  return (
    <div className="grid gap-8">
      <InformationCard>
        Our example use{' '}
        <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">Popover</span>,{' '}
        <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
          PopoverContent
        </span>{' '}
        and
        <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
          PopoverTrigger
        </span>
        , but you can use{' '}
        <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
          DatePickerProvider
        </span>
        ,
        <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
          DatePickerContent
        </span>{' '}
        and{' '}
        <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
          DatePickerTrigger
        </span>
      </InformationCard>
      <PlaygroundCard title="Simple date picker" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple default datepicker
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicDatePicker />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="From scratch date picker" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          From scratch datepicker
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <FromScratchDatePicker />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Custom date picker" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A custom datepicker
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <CustomDatePicker />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Range date picker" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A date range picker with start and end date selection
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <RangeDatePicker />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Date & Time picker" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A date picker with time selection for precise scheduling
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DateTimePicker />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Multi-month date picker" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A range picker showing multiple months for better navigation
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <MultiMonthDatePicker />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Preset date picker" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A date picker with quick preset options for common date ranges
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <PresetDatePicker />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Disabled dates picker" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A disabled input date picker
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DisabledDatesPicker />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Disabled dates" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A date picker with disabled dates for booking restrictions
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DisabledDates />
        </div>
      </PlaygroundCard>
    </div>
  )
}
