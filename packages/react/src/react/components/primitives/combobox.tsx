'use client'

import React, { useEffect, useRef, useState } from 'react'

import { CaretDownIcon, CheckIcon, MagnifyingGlassIcon, XCircleIcon } from '@phosphor-icons/react'
import { tv } from 'tailwind-variants'

import { BaseIcon } from './base-icon'
import { Description, FieldError, Label } from './field'
import { focusStyles } from './primitive'

import { cn } from '../../utils/cn'

export type ComboboxItem = { label: string; value: string }

export interface ComboboxProps {
  value: string | null
  onChange: (value: string | null) => void

  items: ComboboxItem[]
  isLoading?: boolean

  onSearch?: (q: string) => void
  onOpenChange?: (open: boolean) => void

  label?: string
  placeholder?: string
  description?: string
  errorMessage?: string
  className?: string
  isDisabled?: boolean
  isRequired?: boolean
  deselectable?: boolean
}

const triggerStyles = tv({
  extend: focusStyles,
  base: [
    'flex items-center w-full rounded-md border border-input bg-bg h-20 px-6 py-5 shadow-sm',
    'text-base text-fg transition data-[open]:ring-4 data-[open]:ring-ring/20',
  ],
  variants: {
    isDisabled: { true: 'opacity-80 bg-surface-primary-hover cursor-not-allowed' },
    isInvalid: { true: 'border-danger ring-danger/20' },
  },
})

export function Combobox({
  className,
  value,
  onChange,
  items,
  isLoading,
  onSearch,
  onOpenChange,
  label,
  placeholder = 'Search…',
  description,
  errorMessage,
  isDisabled,
  isRequired,
  deselectable = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedText, setSelectedText] = useState('')

  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync selected label
  useEffect(() => {
    if (!value) return setSelectedText('')
    const matchedItem = items.find((i) => i.value === value)
    if (matchedItem) {
      setSelectedText(matchedItem.label)
    }
  }, [value, items])

  const handleOpen = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
    if (next) {
      setSearch(selectedText || '')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  // Click outside
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!open) return
      const el = rootRef.current
      if (el && !el.contains(e.target as Node)) handleOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  const submitSelection = (index: number) => {
    const item = items[index]
    if (!item) return
    if (deselectable && value === item.value) {
      onChange(null)
      setSelectedText('')
      setSearch('')
      handleOpen(false)
      return
    }
    onChange(item.value)
    setSelectedText(item.label)
    setSearch(item.label)
    handleOpen(false)
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDisabled) return
    onChange(null)
    setSelectedText('')
    setSearch('')
    handleOpen(false)
  }

  const displayText = open ? search : selectedText
  const showPlaceholder = displayText.length === 0

  return (
    <div ref={rootRef} className={cn('group flex flex-col', className)}>
      {label && (
        <Label>
          {label} {isRequired && <span className="ml-1 text-text-brand">*</span>}
        </Label>
      )}

      {/* Trigger */}
      <div
        className={triggerStyles({
          isDisabled: isDisabled,
          isInvalid: Boolean(errorMessage),
          isFocused: open,
        })}
        data-open={open ? '' : undefined}
        onClick={() => {
          if (isDisabled) return
          if (!open) handleOpen(true)
        }}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <BaseIcon icon={MagnifyingGlassIcon} className="mr-2 shrink-0 text-muted-fg" />
        <input
          ref={inputRef}
          className={cn(
            'flex-1 bg-transparent outline-none',
            'placeholder:text-muted-fg',
            'text-ellipsis'
          )}
          placeholder={showPlaceholder ? placeholder : undefined}
          value={displayText}
          onChange={(e) => {
            if (!open) return
            const text = e.target.value
            setSearch(text)
            onSearch?.(text)
          }}
          onFocus={() => {
            if (isDisabled) return
            if (!open) handleOpen(true)
          }}
          disabled={isDisabled}
        />

        {value && (
          <button
            type="button"
            className="mr-2 rounded p-1 text-muted-fg hover:text-fg"
            title="Clear selection"
            onClick={clearSelection}
            tabIndex={-1}
            aria-label="Clear selection"
          >
            <BaseIcon icon={XCircleIcon} />
          </button>
        )}

        <BaseIcon
          icon={CaretDownIcon}
          className={cn(
            'shrink-0 transition-transform text-muted-fg',
            open && 'rotate-180 text-fg'
          )}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="relative">
          <div className="absolute z-50 mt-5 w-full rounded-md border bg-white shadow">
            <ul role="listbox" className="max-h-64 overflow-auto py-3" aria-label={label}>
              {isLoading && <li className="px-4 py-6 text-sm text-muted-fg">Loading…</li>}
              {!isLoading && items.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-fg">No results</li>
              )}
              {!isLoading &&
                items.map((item, idx) => {
                  const isSelected = item.value === value
                  return (
                    <li
                      key={item.value}
                      role="option"
                      aria-selected={isSelected}
                      className="px-3"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        submitSelection(idx)
                      }}
                    >
                      <div
                        className={cn(
                          'px-4 py-6 cursor-pointer text-sm hover:bg-muted text-text-primary rounded-md flex items-center justify-between transition-colors duration-100',
                          isSelected && 'font-semibold bg-muted'
                        )}
                      >
                        {item.label}
                        {isSelected && (
                          <BaseIcon icon={CheckIcon} className="size-8 text-icon-brand" />
                        )}
                      </div>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
      )}

      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </div>
  )
}
