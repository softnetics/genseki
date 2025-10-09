'use client'

import * as React from 'react'

import { CheckIcon } from '@phosphor-icons/react'
import { CaretUpDownIcon } from '@phosphor-icons/react'
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

import { createRequireContext } from '../../hooks/create-required-context'
import { cn } from '../../utils/cn'

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
]

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
          <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
        className={cn('mr-2 h-4 w-4', value === ctx.value ? 'opacity-100' : 'opacity-0')}
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
