'use client'

import React from 'react'

import { SlidersHorizontalIcon, TrashIcon } from '@phosphor-icons/react'

import { Button } from './button'
import { Checkbox } from './checkbox'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Typography } from './typography'

export type FilterItem = {
  column: string
  value: string
  isSelected?: boolean
  label: string
  description?: string
}

interface FilterProps {
  items: FilterItem[]
  onChange: (items: FilterItem[]) => void
}

export function getSelectedValues(column: string, items: FilterItem[]) {
  return items.filter((item) => item.column === column && item.isSelected).map((item) => item.value)
}

export function Filter({ items, onChange }: FilterProps) {
  const [openModal, setOpenModal] = React.useState(false)
  const [internalItems, setInternalItems] = React.useState(items)
  const [selectedColumn, setSelectedColumn] = React.useState<string | null>(
    items.length > 0 ? items[0].column : null
  )

  function toggleItem(column: string, value: string) {
    const newItems = internalItems.map((item) => ({
      ...item,
      isSelected:
        item.column === column && item.value === value ? !item.isSelected : item.isSelected,
    }))
    setInternalItems(newItems)
  }

  function apply() {
    onChange(internalItems)
    setOpenModal(false)
  }

  function reset() {
    const newItems = internalItems.map((item) => ({ ...item, isSelected: false }))
    setInternalItems(newItems)
    onChange(newItems)
    setOpenModal(false)
  }

  function columnCount(column: string) {
    return internalItems.reduce(
      (acc, item) => (acc + item.column === column && item.isSelected ? 0 : 1),
      0
    )
  }

  const columns = Array.from(new Set(internalItems.map((item) => item.column)))

  return (
    <Popover open={openModal} onOpenChange={setOpenModal}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-fit">
          <Typography>Filter</Typography>
          <SlidersHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <div className="w-fit py-6 bg-surface-primary border border-border-primary rounded-xl flex flex-col gap-4 min-w-[600px] h-[436px]">
          <Typography type="h4" weight="bold" className="px-6 text-lg w-full">
            Appy Filters
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
                    Columns {column}
                  </Typography>
                  <div className="size-[22px] rounded-full bg-surface-primary border flex items-center justify-center">
                    {columnCount(column)}
                  </div>
                </li>
              ))}
            </ul>

            <ul className="flex-1 h-full border border-border-primary p-3 rounded-lg overflow-auto">
              {internalItems
                .filter((item) => item.column === selectedColumn)
                .map((item) => (
                  <li
                    key={`${item.column}-${item.value}`}
                    className="w-full flex gap-4 items-start p-4 cursor-pointer"
                    onClick={() => toggleItem(item.column, item.value)}
                  >
                    <Checkbox checked={item.isSelected} className="mt-1" />
                    <div>
                      <Typography weight="medium" type="body" className="block">
                        {item.label}
                      </Typography>
                      {item.description && (
                        <Typography
                          weight="normal"
                          type="caption"
                          className="text-text-secondary block"
                        >
                          {item.description}
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
