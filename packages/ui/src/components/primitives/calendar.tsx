'use client'

import * as React from 'react'
import { type DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { CaretDownIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'

import { Button, buttonVariants } from './button'

import { cn } from '../../utils/cn'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // TODO: Change --spacing(16) back to --spacing(8) after spacing migration back to 4
        'bg-background group/calendar py-7 px-8 [--cell-size:--spacing(16)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        ...classNames,
        root: cn('w-fit', defaultClassNames.root, classNames?.root),
        months: cn(
          'flex gap-8 flex-col md:flex-row relative',
          defaultClassNames.months,
          classNames?.months
        ),
        month: cn('flex flex-col w-full gap-8', defaultClassNames.month, classNames?.month),
        nav: cn(
          'flex items-center gap-2 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav,
          classNames?.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_previous,
          classNames?.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_next,
          classNames?.button_next
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption,
          classNames?.month_caption
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-3',
          defaultClassNames.dropdowns,
          classNames?.dropdowns
        ),
        dropdown_root: cn(
          'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring has-focus:ring-[2px] rounded-md',
          defaultClassNames.dropdown_root,
          classNames?.dropdown_root
        ),
        dropdown: cn(
          'absolute bg-popover inset-0 opacity-0',
          defaultClassNames.dropdown,
          classNames?.dropdown
        ),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'rounded-md pl-4 pr-2 flex items-center gap-2 text-sm h-16 [&>svg]:text-muted-foreground [&>svg]:size-7',
          defaultClassNames.caption_label,
          classNames?.caption_label
        ),
        month_grid: cn('w-full border-collapse', classNames?.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays, classNames?.weekdays),
        weekday: cn(
          'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
          defaultClassNames.weekday,
          classNames?.weekday
        ),
        week: cn('flex w-full mt-4', defaultClassNames.week, classNames?.week),
        week_number_header: cn(
          'select-none w-(--cell-size)',
          defaultClassNames.week_number_header,
          classNames?.week_number_header
        ),
        week_number: cn(
          'text-[0.8rem] select-none text-muted-foreground',
          defaultClassNames.week_number,
          classNames?.week_number
        ),
        day: cn(
          'relative w-full h-full p-0 text-center group/day aspect-square select-none',
          defaultClassNames.day,
          classNames?.day
        ),
        range_start: cn(
          'rounded-l-full bg-accent',
          defaultClassNames.range_start,
          classNames?.range_start
        ),
        range_middle: cn('rounded-none', defaultClassNames.range_middle, classNames?.range_middle),
        range_end: cn(
          'rounded-r-full bg-accent',
          defaultClassNames.range_end,
          classNames?.range_end
        ),
        today: cn(
          'bg-accent text-accent-foreground rounded-full data-[selected=true]:rounded-full',
          'before:bg-primary before:content-[""] before:absolute relative before:inset-x-0 before:size-2 before:rounded-full before:bottom-1.5 before:mx-auto', // Dot
          defaultClassNames.today,
          classNames?.today
        ),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside,
          classNames?.outside
        ),
        disabled: cn(
          'text-muted-foreground opacity-50',
          defaultClassNames.disabled,
          classNames?.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden, classNames?.hidden),
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef as React.Ref<HTMLDivElement> | undefined}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return <CaretLeftIcon className={cn('size-8', className)} {...props} />
          }

          if (orientation === 'right') {
            return <CaretRightIcon className={cn('size-8', className)} {...props} />
          }

          return <CaretDownIcon className={cn('size-8', className)} {...props} />
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[2px] [&>span]:text-xs [&>span]:opacity-70',
        'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground rounded-full',
        'data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:rounded-full',
        'data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-middle=true]:rounded-none',
        'data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:rounded-full',
        'group-data-[outside]/day:text-text-disabled',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
