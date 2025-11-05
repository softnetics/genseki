'use client'
import React, { useEffect, useRef } from 'react'

import { CaretUpDownIcon, CheckIcon, XIcon } from '@phosphor-icons/react'
import { useControllableState } from '@radix-ui/react-use-controllable-state'

import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

import { Badge } from '../../../src'
import { createRequiredContext } from '../../../src/react/hooks/create-required-context'
import { cn } from '../../../src/react/utils/cn'

/**
 *
 * Shadcn component
 *
 */

interface Item {
  value: string
  label: string
}

interface ComboboxContextValue {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  value: string[]
  onValueChange: React.Dispatch<React.SetStateAction<string[]>>
  items: Item[]
  multipleItems?: boolean
}

const [_ComboboxProvider, useCombobox] =
  createRequiredContext<ComboboxContextValue>('Combobox provider')

interface ComboboxProviderProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>
  value?: string[]
  onValueChange?: React.Dispatch<React.SetStateAction<string[]>>
  items: Item[]
  multipleItems?: boolean
}

const useItemsChange = (items: Item[], itemsChangeCb: () => void) => {
  const prevItemsRef = useRef(items)

  useEffect(() => {
    // Sync check if value is not under items by comparing prev items, and current items
    if (JSON.stringify(prevItemsRef.current) !== JSON.stringify(items)) {
      itemsChangeCb()
      prevItemsRef.current = items
    }
  }, [items])
}

const ComboboxProvider = React.memo((props: ComboboxProviderProps) => {
  const filterValueAppearInItems = (value: string[]) => {
    return value?.filter((v) => props.items.some((item) => item.value === v)) || []
  }
  // typing value
  const [value, setValue] = useControllableState<string[]>({
    defaultProp: [],
    onChange: (value) => props.onValueChange?.(filterValueAppearInItems(value)),
    prop: props.value,
  })

  // popover state
  const [open, setOpen] = useControllableState({
    defaultProp: false,
    onChange: props.onOpenChange,
    prop: props.open,
  })

  useItemsChange(props.items, () => {
    setValue(filterValueAppearInItems(value))
  })

  return (
    <_ComboboxProvider
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
      items={props.items}
      multipleItems={props.multipleItems ?? false}
    >
      <_ComboboxPopoverProvider>{props.children}</_ComboboxPopoverProvider>
    </_ComboboxProvider>
  )
})

function _ComboboxPopoverProvider(props: { children?: React.ReactNode }) {
  const ctx = useCombobox()
  return (
    <Popover open={ctx.open} onOpenChange={ctx.onOpenChange}>
      {props.children}
    </Popover>
  )
}

function ComboboxTriggerMultiValue({
  className,
  children,
  ...props
}: {
  children?: ((selectedItem: Item[] | undefined) => React.ReactElement) | React.ReactNode
} & Omit<React.ComponentPropsWithRef<typeof PopoverTrigger>, 'children'>) {
  const ctx = useCombobox()

  const selectedItems = ctx.items.filter((item) => ctx.value.includes(item.value))

  const onTriggerKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === 'ArrowDown') ctx.onOpenChange(true)
  }

  const renderItems = React.useMemo(() => {
    return (
      <span className="flex flex-wrap flex-1 gap-2 pr-8">
        {selectedItems.map((selectedItem) => (
          <Badge
            onClick={(e) => {
              e.stopPropagation()
              ctx.onValueChange((prevItems) =>
                prevItems.filter((prevItem) => prevItem !== selectedItem.value)
              )
            }}
            shape="square"
            intent="gray"
            key={selectedItem.value}
            className="flex "
          >
            {selectedItem.label}
            <XIcon className="size-5 ml-1" />
          </Badge>
        ))}
      </span>
    )
  }, [selectedItems])

  return (
    <PopoverTrigger
      asChild
      onKeyDown={onTriggerKeyDown}
      className={cn('w-[200px] min-h-18 justify-between flex h-auto relative', className)}
      aria-expanded={ctx.open}
      {...props}
      // These properties will be merged down to a children
    >
      {typeof children === 'function' ? (
        children(selectedItems)
      ) : children ? (
        children
      ) : (
        <Button variant="outline" role="combobox">
          {selectedItems.length > 0 ? renderItems : 'Please select item'}
          <CaretUpDownIcon className="h-8 w-8 shrink-0 opacity-50 absolute right-4 inset-y-0 my-auto" />
        </Button>
      )}
    </PopoverTrigger>
  )
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: {
  children?: ((selectedItem: Item | undefined) => React.ReactElement) | React.ReactNode
} & Omit<React.ComponentPropsWithRef<typeof PopoverTrigger>, 'children'>) {
  const ctx = useCombobox()

  if (ctx.multipleItems) {
    throw new Error(
      'Please use `MultipleValueComboboxTrigger` component for mange multi value selection, this will make component maintenance more easier'
    )
  }

  const selectedItem = ctx.items.find((item) => ctx.value.includes(item.value))

  const onTriggerKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === 'ArrowDown') ctx.onOpenChange(true)
  }

  return (
    <PopoverTrigger
      asChild
      onKeyDown={onTriggerKeyDown}
      className={cn('w-[200px] justify-between', className)}
      aria-expanded={ctx.open}
      {...props}
    >
      {typeof children === 'function' ? (
        children(selectedItem)
      ) : children ? (
        children
      ) : (
        <Button variant="outline" role="combobox">
          {selectedItem?.label || 'Please select item'}
          <CaretUpDownIcon className="ml-4 h-8 w-8 shrink-0 opacity-50" />
        </Button>
      )}
    </PopoverTrigger>
  )
}

function ComboboxCommandInput(props: React.ComponentPropsWithRef<typeof CommandInput>) {
  return <CommandInput placeholder="Search item..." {...props} />
}

function ComboboxContent({
  children,
  className,
  ...props
}: { children?: React.ReactNode; className?: string } & React.ComponentPropsWithRef<
  typeof PopoverContent
>) {
  return (
    <Command loop className="w-fit">
      <PopoverContent
        className={cn('w-(--radix-popover-trigger-width) bg-background p-0', className)}
        {...props}
      >
        {children}
      </PopoverContent>
    </Command>
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

  const isValueExistedBefore = ctx.value.some((existedValue) => existedValue === value)

  const onSelect = () => {
    ctx.onValueChange((prevItems) => {
      if (ctx.multipleItems) {
        return isValueExistedBefore
          ? prevItems.filter((prevItem) => prevItem !== value)
          : [...prevItems, value]
      }

      return isValueExistedBefore ? [] : [value]
    })

    !ctx.multipleItems && ctx.onOpenChange(false)
  }

  return (
    <CommandItem id={value} value={value} onSelect={onSelect} {...props}>
      <CheckIcon
        className={cn('mr-4 h-8 w-8', isValueExistedBefore ? 'opacity-100' : 'opacity-0')}
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
  ComboboxTriggerMultiValue,
  useCombobox,
}
