'use client'

import * as React from 'react'

import {
  CaretDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  SpinnerIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { tv } from 'tailwind-variants'

import { BaseIcon } from './base-icon'
import { Description, FieldError } from './field'
import { focusStyles } from './primitive'

import { Label } from '../../../../v2'
import { cn } from '../../utils/cn'

/**
 *
 * React Aria component
 *
 */

/**
 * @deprecated
 */
type ComboboxItem = { label: string; value: string }

/**
 * @deprecated
 */
interface ComboboxContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  search: string
  setSearch: (search: string) => void
  value: string | null
  onChange: (value: string | null) => void
  items: ComboboxItem[]
  isPending?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  errorMessage?: string
  deselectable?: boolean
  placeholder?: string
  onSearch?: (q: string) => void
}

/**
 * @deprecated
 */
const ComboboxContext = React.createContext<ComboboxContextValue | null>(null)

/**
 * @deprecated
 */
const useComboboxContext = () => {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error('Combobox components must be used within Combobox')
  }
  return context
}

/**
 * @deprecated
 */
interface ComboboxProps {
  value: string | null
  onChange: (value: string | null) => void

  items: ComboboxItem[]
  isPending?: boolean

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
  children?: React.ReactNode
}

/**
 * @deprecated
 */
const ariaTriggerStyles = tv({
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

/**
 * @deprecated
 */
interface ComboboxTriggerProps {
  children: React.ReactNode
  className?: string
  isPending?: boolean
}

/**
 * @deprecated
 */
const ComboboxTrigger = ({ children, className }: ComboboxTriggerProps) => {
  const { open, setOpen, isDisabled, errorMessage } = useComboboxContext()

  return (
    <div
      className={cn(
        ariaTriggerStyles({
          isDisabled: isDisabled,
          isInvalid: Boolean(errorMessage),
          isFocused: open,
        }),
        className
      )}
      data-open={open ? '' : undefined}
      onClick={() => {
        if (isDisabled) return
        if (!open) setOpen(true)
      }}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
    >
      {children}
    </div>
  )
}

/**
 * @deprecated
 */
interface ComboboxSearchInputProps {
  placeholder?: string
  className?: string
}

/**
 * @deprecated
 */
const ComboboxSearchInput = ({ placeholder, className }: ComboboxSearchInputProps) => {
  const { open, search, setSearch, value, items, isDisabled, setOpen, onChange, isPending } =
    useComboboxContext()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [selectedText, setSelectedText] = React.useState('')

  // Sync selected label
  React.useEffect(() => {
    if (!value) return setSelectedText('')
    const matchedItem = items.find((i) => i.value === value)
    if (matchedItem) {
      setSelectedText(matchedItem.label)
    }
  }, [value, items])

  const displayText = open ? search : selectedText
  const showPlaceholder = displayText.length === 0
  const actualPlaceholder = placeholder || 'Search…'

  const clearSelection = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDisabled) return
    onChange(null)
    setSearch('')
    setOpen(false)
  }

  return (
    <>
      <BaseIcon icon={MagnifyingGlassIcon} className="mr-2 shrink-0 text-muted-fg" />
      <input
        ref={inputRef}
        className={cn(
          'flex-1 bg-transparent outline-none',
          'placeholder:text-muted-fg',
          'text-ellipsis',
          className
        )}
        placeholder={showPlaceholder ? actualPlaceholder : undefined}
        value={displayText}
        onChange={(e) => {
          if (!open) return
          setSearch(e.target.value)
        }}
        onFocus={() => {
          if (isDisabled) return
          if (!open) setOpen(true)
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

      {isPending ? (
        <BaseIcon icon={SpinnerIcon} className="animate-spin size-6 mr-2" />
      ) : (
        <BaseIcon
          icon={CaretDownIcon}
          className={cn(
            'shrink-0 transition-transform text-muted-fg',
            open && 'rotate-180 text-fg'
          )}
        />
      )}
    </>
  )
}

/**
 * @deprecated
 */
interface ComboboxListProps {
  children: React.ReactNode
  className?: string
}

/**
 * @deprecated
 */
const ComboboxList = ({ children, className }: ComboboxListProps) => {
  const { open, setOpen } = useComboboxContext()
  const listRef = React.useRef<HTMLDivElement>(null)

  // Click outside
  React.useEffect(() => {
    if (!open) return
    const onDocMouseDown = (e: MouseEvent) => {
      const el = listRef.current
      if (el && !el.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div ref={listRef} className={cn('relative', className)}>
      <div className="absolute z-50 mt-5 w-full rounded-md border bg-white shadow">
        <ul role="listbox" className="max-h-64 overflow-auto py-3">
          {children}
        </ul>
      </div>
    </div>
  )
}

/**
 * @deprecated
 */
interface ComboboxLabelProps {
  children: React.ReactNode
}

/**
 * @deprecated
 */
const ComboboxLabel = ({ children }: ComboboxLabelProps) => {
  return <span>{children}</span>
}

/**
 * @deprecated
 */
interface ComboboxOptionProps {
  isSelected?: boolean
  onSelect?: () => void
  children: React.ReactNode
  value?: string
}

/**
 * @deprecated
 */
const ComboboxOption = ({ isSelected, onSelect, children, value }: ComboboxOptionProps) => {
  const {
    items,
    onChange,
    setOpen,
    setSearch,
    value: currentValue,
    deselectable,
  } = useComboboxContext()

  const handleSelect = () => {
    if (value) {
      const item = items.find((i) => i.value === value)
      if (item) {
        if (deselectable && currentValue === item.value) {
          onChange(null)
          setSearch('')
          setOpen(false)
          return
        }
        onChange(item.value)
        setSearch(item.label)
        setOpen(false)
      }
    }
    onSelect?.()
  }

  return (
    <li
      role="option"
      aria-selected={isSelected}
      className="px-3"
      onMouseDown={(e) => {
        e.preventDefault()
        handleSelect()
      }}
    >
      <div
        className={cn(
          'px-4 py-6 cursor-pointer text-sm hover:bg-muted text-text-primary rounded-md flex items-center justify-between transition-colors duration-100',
          isSelected && 'font-semibold bg-muted'
        )}
      >
        {children}
        {isSelected && <BaseIcon icon={CheckIcon} className="size-8 text-icon-brand" />}
      </div>
    </li>
  )
}

/**
 * @deprecated
 */
const Combobox = ({
  className,
  value,
  onChange,
  items,
  isPending: _isPending,
  onSearch,
  onOpenChange,
  label,
  placeholder = 'Search…',
  description,
  errorMessage,
  isDisabled,
  isRequired,
  deselectable: _deselectable = false,
  children,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const rootRef = React.useRef<HTMLDivElement>(null)

  const handleOpen = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  const contextValue: ComboboxContextValue = {
    open,
    setOpen: handleOpen,
    search,
    setSearch: (text) => {
      setSearch(text)
      onSearch?.(text)
    },
    value,
    onChange,
    items,
    isPending: _isPending,
    isDisabled,
    isRequired,
    errorMessage,
    deselectable: _deselectable,
    placeholder,
    onSearch,
  }

  return (
    <ComboboxContext.Provider value={contextValue}>
      <div ref={rootRef} className={cn('flex flex-col gap-y-4 group', className)}>
        {label && (
          <Label>
            {label} {isRequired && <span className="text-text-brand">*</span>}
          </Label>
        )}
        <div>
          {children}
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </div>
      </div>
    </ComboboxContext.Provider>
  )
}

export {
  Combobox,
  ComboboxLabel,
  ComboboxList,
  ComboboxOption,
  ComboboxSearchInput,
  ComboboxTrigger,
}
export type { ComboboxItem, ComboboxProps }
