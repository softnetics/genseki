'use client'

import * as React from 'react'

import {
  CaretDownIcon,
  CaretUpDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  SpinnerIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { tv } from 'tailwind-variants'

import { BaseIcon } from './base-icon'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { AriaDescription, AriaFieldError } from './field'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { focusStyles } from './primitive'

import { createRequireContext } from '../../hooks/create-required-context'
import { cn } from '../../utils/cn'

/**
 *
 * React Aria component
 *
 */

/**
 * @deprecated
 */
type AriaComboboxItem = { label: string; value: string }

/**
 * @deprecated
 */
interface AriaComboboxContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  search: string
  setSearch: (search: string) => void
  value: string | null
  onChange: (value: string | null) => void
  items: AriaComboboxItem[]
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
const AriaComboboxContext = React.createContext<AriaComboboxContextValue | null>(null)

/**
 * @deprecated
 */
const useAriaComboboxContext = () => {
  const context = React.useContext(AriaComboboxContext)
  if (!context) {
    throw new Error('Combobox components must be used within Combobox')
  }
  return context
}

/**
 * @deprecated
 */
interface AriaComboboxProps {
  value: string | null
  onChange: (value: string | null) => void

  items: AriaComboboxItem[]
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
interface AriaComboboxTriggerProps {
  children: React.ReactNode
  className?: string
  isPending?: boolean
}

/**
 * @deprecated
 */
const AriaComboboxTrigger = ({ children, className }: AriaComboboxTriggerProps) => {
  const { open, setOpen, isDisabled, errorMessage } = useAriaComboboxContext()

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
interface AriaComboboxSearchInputProps {
  placeholder?: string
  className?: string
}

/**
 * @deprecated
 */
const AriaComboboxSearchInput = ({ placeholder, className }: AriaComboboxSearchInputProps) => {
  const { open, search, setSearch, value, items, isDisabled, setOpen, onChange, isPending } =
    useAriaComboboxContext()
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
interface AriaComboboxListProps {
  children: React.ReactNode
  className?: string
}

/**
 * @deprecated
 */
const AriaComboboxList = ({ children, className }: AriaComboboxListProps) => {
  const { open, setOpen } = useAriaComboboxContext()
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
interface AriaComboboxLabelProps {
  children: React.ReactNode
}

/**
 * @deprecated
 */
const AriaComboboxLabel = ({ children }: AriaComboboxLabelProps) => {
  return <span>{children}</span>
}

/**
 * @deprecated
 */
interface AriaComboboxOptionProps {
  isSelected?: boolean
  onSelect?: () => void
  children: React.ReactNode
  value?: string
}

/**
 * @deprecated
 */
const AriaComboboxOption = ({ isSelected, onSelect, children, value }: AriaComboboxOptionProps) => {
  const {
    items,
    onChange,
    setOpen,
    setSearch,
    value: currentValue,
    deselectable,
  } = useAriaComboboxContext()

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
const AriaCombobox = ({
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
}: AriaComboboxProps) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const rootRef = React.useRef<HTMLDivElement>(null)

  const handleOpen = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  const contextValue: AriaComboboxContextValue = {
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
    <AriaComboboxContext.Provider value={contextValue}>
      <div ref={rootRef} className={cn('flex flex-col gap-y-4 group', className)}>
        {label && (
          <Label>
            {label} {isRequired && <span className="text-text-brand">*</span>}
          </Label>
        )}
        <div>
          {children}
          {description && <AriaDescription>{description}</AriaDescription>}
          <AriaFieldError>{errorMessage}</AriaFieldError>
        </div>
      </div>
    </AriaComboboxContext.Provider>
  )
}

export {
  AriaCombobox,
  AriaComboboxLabel,
  AriaComboboxList,
  AriaComboboxOption,
  AriaComboboxSearchInput,
  AriaComboboxTrigger,
}
export type { AriaComboboxItem, AriaComboboxProps }

/**
 *
 * Shadcn component
 *
 */

interface Item {
  value: string
  label: string
}

const [_ComboboxProvider, useCombobox] = createRequireContext<{
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  value: string
  onValueChange: (value: string) => void
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
}>('Combobox provider')

function ComboboxProvider(props: {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>
  value?: string
  onValueChange?: (value: string) => void
  items: Item[]
}) {
  const [items, setItems] = React.useState<Item[]>(props.items ?? [])

  // typing value
  const [value, setValue] = useControllableState<string>({
    defaultProp: '',
    onChange: props.onValueChange,
    prop: props.value,
  })

  // popover state
  const [open, setOpen] = useControllableState({
    defaultProp: false,
    onChange: props.onOpenChange,
    prop: props.open,
  })

  return (
    <_ComboboxProvider
      value={{ open: open, onOpenChange: setOpen, value, onValueChange: setValue, items, setItems }}
    >
      <_ComboboxPopoverProvider>{props.children}</_ComboboxPopoverProvider>
    </_ComboboxProvider>
  )
}

function _ComboboxPopoverProvider(props: { children?: React.ReactNode }) {
  const ctx = useCombobox()
  return (
    <Command value={ctx.value || ''} loop className="w-fit">
      <Popover open={ctx.open} onOpenChange={ctx.onOpenChange}>
        {props.children}
      </Popover>
    </Command>
  )
}

function ComboboxTrigger(props: {
  children?: ((selectedItem: Item | undefined) => React.ReactElement) | React.ReactNode
  className?: string
}) {
  const ctx = useCombobox()

  const selectedItem = ctx.items.find((item) => item.value === ctx.value)

  return (
    <PopoverTrigger asChild>
      {typeof props.children === 'function' ? (
        props.children(selectedItem)
      ) : props.children ? (
        props.children
      ) : (
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={ctx.open}
          className={cn('w-[200px] justify-between', props.className)}
        >
          {selectedItem?.label || 'Please select item'}
          <CaretUpDownIcon className="ml-4 h-8 w-8 shrink-0 opacity-50" />
        </Button>
      )}
    </PopoverTrigger>
  )
}

function ComboboxCommandInput() {
  return <CommandInput placeholder="Search framework..." />
}

function ComboboxContent({
  children,
  className,
  ...props
}: { children?: React.ReactNode; className?: string } & React.ComponentPropsWithRef<
  typeof PopoverContent
>) {
  return (
    <PopoverContent className={cn('w-(--radix-popover-trigger-width) p-0', className)} {...props}>
      {children}
    </PopoverContent>
  )
}

function ComboboxCommandEmpty({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentPropsWithRef<typeof CommandEmpty>) {
  return (
    <CommandEmpty className={cn('text-muted-foreground', className)} {...props}>
      {children || 'No framework found'}
    </CommandEmpty>
  )
}

function ComboboxCommandList({
  children,
  ...props
}: { children?: React.ReactNode } & React.ComponentPropsWithRef<typeof CommandList>) {
  return <CommandList {...props}>{children}</CommandList>
}

function ComboboxCommandGroup({
  children: Children,
  ...props
}: {
  children: React.FC<{ items: Item[] }>
} & Omit<React.ComponentPropsWithRef<typeof CommandGroup>, 'children'>) {
  const ctx = useCombobox()
  return (
    <CommandGroup {...props}>
      <Children items={ctx.items} />
    </CommandGroup>
  )
}

function ComboboxCommandItem({
  value,
  label,
  ...props
}: { children?: React.ReactNode; value: string; label: string } & React.ComponentPropsWithRef<
  typeof CommandItem
>) {
  const ctx = useCombobox()

  return (
    <CommandItem
      id={value}
      value={value}
      onSelect={() => {
        ctx.onValueChange(value === ctx.value ? '' : value)
        ctx.onOpenChange(false)
      }}
      {...props}
    >
      <CheckIcon
        className={cn('mr-4 h-8 w-8', value === ctx.value ? 'opacity-100' : 'opacity-0')}
      />
      {label}
    </CommandItem>
  )
}

export {
  ComboboxCommandEmpty,
  ComboboxCommandGroup,
  ComboboxCommandInput,
  ComboboxCommandItem,
  ComboboxCommandList,
  ComboboxContent,
  ComboboxProvider,
  ComboboxTrigger,
  useCombobox,
}
