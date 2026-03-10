'use client'

import React from 'react'

import { SlidersHorizontalIcon, TrashIcon } from '@phosphor-icons/react'

import { Button } from './button'
import { Checkbox } from './checkbox'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Typography } from './typography'

import { cn } from '../../utils/cn'

export type FilterOption<T extends string = string> = {
  value: T
  label: string
  isSelected?: boolean
  description?: string
}

export type FilterOptions = Record<string, FilterOption[]>

export function getSelectedValues<T extends string>(options: FilterOption<T>[]) {
  return options.filter((option) => option.isSelected).map((option) => option.value)
}

export interface FilterProps<T extends FilterOptions = FilterOptions> {
  options: T
  onChange: (options: T) => void
}

export function Filter<T extends FilterOptions>({ options, onChange }: FilterProps<T>) {
  const [openModal, setOpenModal] = React.useState(false)
  const [internalOptions, setInternalOptions] = React.useState<T>(options)
  const [selectedColumn, setSelectedColumn] = React.useState<string | null>(
    Object.keys(options)[0] ?? null
  )

  function toggleItem(column: string, label: string) {
    setInternalOptions((prev) => {
      const prevOptions = prev[column]
      if (!prevOptions) return prev
      const newOptions = prevOptions.map((option) => ({
        ...option,
        isSelected: option.label === label ? !option.isSelected : option.isSelected,
      }))
      return { ...prev, [column]: newOptions }
    })
  }

  function apply() {
    onChange(internalOptions)
    setOpenModal(false)
  }

  function reset() {
    const newOptions = Object.fromEntries(
      Object.entries(internalOptions).map(([column, options]) => [
        column,
        options.map((option) => ({ ...option, isSelected: false })),
      ])
    ) as T
    setInternalOptions(newOptions)
    onChange(newOptions)
    setOpenModal(false)
  }

  function columnCount(column: string) {
    return internalOptions[column]?.length || 0
  }

  const columns = Object.keys(internalOptions)
  const totalSelected = Object.entries(options).reduce(
    (acc, [_, options]) => acc + options.filter((option) => option.isSelected).length,
    0
  )

  return (
    <Popover open={openModal} onOpenChange={setOpenModal}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Typography>Filter</Typography>
          <CountBadge count={totalSelected} />
          <SlidersHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <div className="w-fit py-6 bg-surface-primary border border-border-primary rounded-xl flex flex-col gap-4 min-w-[600px] h-[436px]">
          <Typography type="h4" weight="bold" className="px-6 text-lg w-full">
            Apply Filters
          </Typography>

          <div className="flex items-start gap-6 w-full px-6 flex-1 min-h-0">
            <ul className="min-w-[230px] overflow-auto h-full">
              {columns.map((column) => (
                <li
                  key={column}
                  className="w-full p-4 rounded-sm hover:bg-surface-primary-hover flex items-center cursor-pointer justify-between"
                  onClick={() => setSelectedColumn(column)}
                >
                  <Typography weight="normal" type="body">
                    {column}
                  </Typography>
                  <CountBadge count={columnCount(column)} />
                </li>
              ))}
            </ul>

            <ul className="flex-1 h-full border border-border-primary p-3 rounded-lg overflow-auto">
              {selectedColumn &&
                internalOptions[selectedColumn]?.map((option) => (
                  <li
                    key={`${selectedColumn}-${option.value}`}
                    className="w-full flex gap-4 items-start p-4 cursor-pointer"
                    onClick={() => toggleItem(selectedColumn, option.label)}
                  >
                    <Checkbox checked={option.isSelected} className="mt-1" />
                    <div>
                      <Typography weight="medium" type="body" className="block">
                        {option.label}
                      </Typography>
                      {option.description && (
                        <Typography
                          weight="normal"
                          type="caption"
                          className="text-text-secondary block"
                        >
                          {option.description}
                        </Typography>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="w-full px-6 pt-4 border-t flex items-center justify-end gap-2 border-border-primary">
            <Button variant="outline" onClick={reset}>
              <TrashIcon />
              <Typography>Reset All</Typography>
            </Button>
            <Button onClick={apply}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function CountBadge({ count }: { count: number }) {
  return (
    <div
      className={cn(
        'size-[22px] rounded-full bg-surface-primary border flex items-center justify-center',
        {
          'opacity-0': count === 0,
        }
      )}
    >
      {count}
    </div>
  )
}
