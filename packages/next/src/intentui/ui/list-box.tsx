import type {
  ListBoxItemProps as ListBoxItemPrimitiveProps,
  ListBoxProps,
} from 'react-aria-components'
import {
  composeRenderProps,
  ListBox as ListBoxPrimitive,
  ListBoxItem as ListBoxItemPrimitive,
} from 'react-aria-components'

import { IconCheck, IconHamburger } from '@intentui/icons'
import { twMerge } from 'tailwind-merge'

import { cn } from '~/utils/cn'

import {
  DropdownDescription,
  DropdownItemDetails,
  dropdownItemStyles,
  DropdownLabel,
  DropdownSection,
} from './dropdown'
import { composeTailwindRenderProps } from './primitive'

const ListBox = <T extends object>({ className, ...props }: ListBoxProps<T>) => (
  <ListBoxPrimitive
    {...props}
    className={composeTailwindRenderProps(
      className,
      "outline-hidden *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1 grid max-h-96 w-full grid-cols-[auto_1fr] flex-col gap-y-1 overflow-auto overflow-y-auto rounded-md border p-2 shadow-lg [scrollbar-width:thin] [&::-webkit-scrollbar]:size-0.5"
    )}
  />
)

interface ListBoxItemProps<T extends object> extends ListBoxItemPrimitiveProps<T> {
  className?: string
}

const ListBoxItem = <T extends object>({ children, className, ...props }: ListBoxItemProps<T>) => {
  const { isDisabled } = props
  const textValue = typeof children === 'string' ? children : undefined

  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        cn(
          dropdownItemStyles({
            ...renderProps,
            className,
          }),
          isDisabled && 'opacity-50'
        )
      )}
    >
      {(renderProps) => {
        const { allowsDragging, isSelected, isFocused, isDragging } = renderProps

        return (
          <>
            {allowsDragging && (
              <IconHamburger
                className={twMerge(
                  'text-muted-fg size-4 shrink-0 transition',
                  isFocused && 'text-fg',
                  isDragging && 'text-fg',
                  isSelected && 'text-accent-fg/70'
                )}
              />
            )}
            {isSelected && <IconCheck className="-mx-0.5 mr-2" data-slot="checked-icon" />}
            {typeof children === 'function' ? (
              children(renderProps)
            ) : typeof children === 'string' ? (
              <DropdownLabel>{children}</DropdownLabel>
            ) : (
              children
            )}
          </>
        )
      }}
    </ListBoxItemPrimitive>
  )
}

type ListBoxSectionProps = React.ComponentProps<typeof DropdownSection>
const ListBoxSection = ({ className, ...props }: ListBoxSectionProps) => {
  return (
    <DropdownSection
      className={twMerge('gap-y-1 [&_.lbi:last-child]:-mb-1.5', className)}
      {...props}
    />
  )
}

const ListBoxItemDetails = DropdownItemDetails
const ListBoxLabel = DropdownLabel
const ListBoxDescription = DropdownDescription

ListBox.Section = ListBoxSection
ListBox.ItemDetails = ListBoxItemDetails
ListBox.Description = ListBoxDescription
ListBox.Item = ListBoxItem
ListBox.Label = ListBoxLabel

export type { ListBoxItemProps, ListBoxSectionProps }
export { ListBox }
