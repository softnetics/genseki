'use client'

import type {
  ListBoxProps,
  PopoverProps,
  SelectProps as SelectPrimitiveProps,
  ValidationResult,
} from 'react-aria-components'
import {
  Button,
  composeRenderProps,
  Select as SelectPrimitive,
  SelectValue,
} from 'react-aria-components'

import { CaretDownIcon } from '@phosphor-icons/react'
import { tv } from 'tailwind-variants'

import {
  DropdownItem,
  DropdownItemDetails,
  DropdownLabel,
  DropdownSection,
  DropdownSeparator,
} from './dropdown'
import { Description, FieldError, Label } from './field'
import { ListBox } from './list-box'
import { PopoverContent, type PopoverContentProps } from './popover'
import { composeTailwindRenderProps, focusStyles } from './primitive'

import { BaseIcon } from '../../components/primitives/base-icon'
import { cn } from '../../utils/cn'

const selectTriggerStyles = tv({
  extend: focusStyles,
  base: [
    'btr flex w-full cursor-default items-center gap-12 gap-x-2 rounded-md border border-input px-6 py-5 text-start shadow-sm transition group-disabled:opacity-50 **:data-[slot=icon]:size-8 h-20 dark:shadow-none',
    'group-data-open:border-ring/70 group-data-open:ring-4 group-data-open:ring-ring/20',
    'text-fg group-invalid:border-danger group-invalid:ring-danger/20 forced-colors:group-invalid:border-[Mark]',
  ],
  variants: {
    isDisabled: {
      true: 'opacity-80 bg-bluegray-100 forced-colors:border-[GrayText] forced-colors:text-[GrayText]',
    },
  },
})

interface SelectProps<T extends object> extends SelectPrimitiveProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  items?: Iterable<T>
  className?: string
}

const Select = <T extends object>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectPrimitive
      {...props}
      className={composeTailwindRenderProps(className, 'group flex flex-col gap-y-4')}
    >
      {(values) => (
        <>
          {label && (
            <Label>
              {label} {props.isRequired && <span className="ml-1 text-pumpkin-500">*</span>}
            </Label>
          )}
          {typeof props.children === 'function' ? props.children(values) : props.children}
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </SelectPrimitive>
  )
}

interface SelectListProps<T extends object>
  extends Omit<ListBoxProps<T>, 'layout' | 'orientation'>,
    Pick<PopoverProps, 'placement'> {
  items?: Iterable<T>
  popoverClassName?: PopoverContentProps['className']
}

const SelectList = <T extends object>({
  children,
  items,
  className,
  popoverClassName,
  ...props
}: SelectListProps<T>) => {
  return (
    <PopoverContent
      showArrow={false}
      respectScreen={false}
      className={composeTailwindRenderProps(
        popoverClassName,
        'bg-bg min-w-[var(--trigger-width,120px)]'
      )}
      placement={props.placement}
    >
      <ListBox
        layout="stack"
        orientation="vertical"
        className={composeTailwindRenderProps(
          className,
          'max-h-[inherit] min-w-[inherit] border-0 shadow-none'
        )}
        items={items}
        {...props}
      >
        {children}
      </ListBox>
    </PopoverContent>
  )
}

interface SelectTriggerProps extends React.ComponentProps<typeof Button> {
  prefix?: React.ReactNode
  className?: string
}

const SelectTrigger = ({ className, ...props }: SelectTriggerProps) => {
  return (
    <Button
      className={composeRenderProps(cn('h-auto', className), (className, renderProps) =>
        selectTriggerStyles({
          ...renderProps,
          className,
        })
      )}
    >
      {props.prefix && <span className="mr-2">{props.prefix}</span>}
      <SelectValue
        data-slot="select-value"
        className="data-placeholder:text-muted-fg grid flex-1 grid-cols-[auto_1fr] items-center text-base *:data-[slot=avatar]:*:-mx-0.5 *:data-[slot=avatar]:-mx-0.5 *:data-[slot=icon]:-mx-0.5 *:data-[slot=avatar]:*:mr-2 *:data-[slot=avatar]:mr-2 *:data-[slot=icon]:mr-2 [&_[slot=description]]:hidden"
      />
      <BaseIcon
        icon={CaretDownIcon}
        className="text-muted-fg group-data-open:rotate-180 group-data-open:text-fg shrink-0 duration-300 group-disabled:opacity-50 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
      />
    </Button>
  )
}

const SelectSection = DropdownSection
const SelectSeparator = DropdownSeparator
const SelectLabel = DropdownLabel
const SelectOptionDetails = DropdownItemDetails
const SelectOption = DropdownItem

export {
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectOptionDetails,
  SelectSection,
  SelectSeparator,
  SelectTrigger,
}
export type { SelectProps, SelectTriggerProps }
