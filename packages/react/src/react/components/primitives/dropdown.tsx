import React, { forwardRef } from 'react'
import type {
  ListBoxItemProps,
  SectionProps,
  SeparatorProps,
  TextProps,
} from 'react-aria-components'
import {
  Collection,
  composeRenderProps,
  Header,
  ListBoxItem as ListBoxItemPrimitive,
  ListBoxSection,
  Separator,
  Text,
} from 'react-aria-components'

import { CheckIcon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { Keyboard } from './keyboard'

const dropdownItemStyles = tv({
  base: [
    'col-span-full min-h-16 grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] not-has-data-[slot=dropdown-item-details]:items-center has-data-[slot=dropdown-item-details]:**:data-[slot=checked-icon]:mt-[1.5px] supports-[grid-template-columns:subgrid]:grid-cols-subgrid',
    'group relative cursor-default select-none rounded-[calc(var(--radius-md)-1px)] px-[calc(var(--spacing)*4)] py-[calc(var(--spacing)*4)] md:px-[calc(var(--spacing)*3)] md:py-[calc(var(--spacing)*1.5)] forced-color:text-[Highlight] text-base text-secondary-fg outline-0 forced-color-adjust-none text-base forced-colors:text-[LinkText]',
    '**:data-[slot=avatar]:*:mr-2 **:data-[slot=avatar]:*:size-8 **:data-[slot=avatar]:mr-2 **:data-[slot=avatar]:size-6 sm:**:data-[slot=avatar]:*:size-5 sm:**:data-[slot=avatar]:size-6',
    'data-danger:**:data-[slot=icon]:text-danger/60 **:data-[slot=icon]:size-8 **:data-[slot=icon]:shrink-0 **:data-[slot=icon]:text-muted-fg focus:data-danger:**:data-[slot=icon]:text-danger',
    'data-[slot=menu-radio]:*:data-[slot=icon]:size-8 *:data-[slot=icon]:mr-3',
    'forced-colors:**:data-[slot=icon]:text-[CanvasText] forced-colors:group-focus:**:data-[slot=icon]:text-[Canvas] ',
    '[&>[slot=label]+[data-slot=icon]]:absolute [&>[slot=label]+[data-slot=icon]]:right-0',
  ],
  variants: {
    isDisabled: {
      true: 'text-muted-fg forced-colors:text-[GrayText] opacity-50',
    },
    isSelected: {
      true: '**:data-[slot=avatar]:*:hidden **:data-[slot=avatar]:hidden **:data-[slot=icon]:hidden',
    },
    isFocused: {
      false: 'data-danger:text-danger',
      true: [
        '**:data-[slot=icon]:text-accent-fg **:[kbd]:text-accent-fg',
        'bg-accent text-accent-fg forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
        'data-danger:bg-danger/10 data-danger:text-danger',
        'data-[slot=description]:text-accent-fg data-[slot=label]:text-accent-fg [&_.text-muted-fg]:text-accent-fg/80',
      ],
    },
  },
})

const dropdownSectionStyles = tv({
  slots: {
    section: 'col-span-full grid grid-cols-[auto_1fr] border-b pb-2 border-border',
    header: 'col-span-full px-2.5 py-2 font-semibold text-muted-fg text-sm',
  },
})

const { section, header } = dropdownSectionStyles()

interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string
}

const DropdownSection = forwardRef(function DropdownSection<T extends object>(
  { className, ...props }: DropdownSectionProps<T>,
  ref: React.ForwardedRef<HTMLElement>
) {
  return (
    <ListBoxSection ref={ref} className={section({ className })}>
      {'title' in props && <Header className={header()}>{props.title}</Header>}
      <Collection items={props.items}>{props.children}</Collection>
    </ListBoxSection>
  )
})

interface DropdownItemProps extends ListBoxItemProps {}

const DropdownItem = forwardRef(function DropdownItem(
  { className, ...props }: DropdownItemProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const { isDisabled } = props

  return (
    <ListBoxItemPrimitive
      ref={ref}
      textValue={typeof props.children === 'string' ? props.children : props.textValue}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({ ...renderProps, className, isDisabled })
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          {isSelected && <CheckIcon className="-mx-0.5 mr-2" data-slot="checked-icon" />}
          {typeof children === 'string' ? <DropdownLabel>{children}</DropdownLabel> : children}
        </>
      ))}
    </ListBoxItemPrimitive>
  )
})

interface DropdownItemDetailProps extends TextProps {
  label?: TextProps['children']
  description?: TextProps['children']
  classNames?: {
    label?: TextProps['className']
    description?: TextProps['className']
  }
}

const DropdownItemDetails = forwardRef(function DropdownItemDetails(
  { label, description, classNames, ...props }: DropdownItemDetailProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { slot, children, title, ...restProps } = props

  return (
    <div
      ref={ref}
      data-slot="dropdown-item-details"
      className="col-start-2 flex flex-col gap-y-1"
      {...restProps}
    >
      {label && (
        <Text
          slot={slot ?? 'label'}
          className={twMerge('text-base font-medium', classNames?.label)}
          {...restProps}
        >
          {label}
        </Text>
      )}
      {description && (
        <Text
          slot={slot ?? 'description'}
          className={twMerge('text-sm', classNames?.description)}
          {...restProps}
        >
          {description}
        </Text>
      )}
      {!title && children}
    </div>
  )
})

interface DropdownLabelProps extends TextProps {}

const DropdownLabel = forwardRef(function DropdownLabel(
  { className, ...props }: Omit<DropdownLabelProps, 'ref'>,
  ref: React.ForwardedRef<HTMLElement>
) {
  return (
    <Text
      slot="label"
      ref={ref}
      className={twMerge('col-start-2 text-base', className)}
      {...props}
    />
  )
})

const DropdownSeparator = forwardRef(function DropdownSeparator(
  { className, ...props }: SeparatorProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  return (
    <Separator
      ref={ref}
      orientation="horizontal"
      className={twMerge('bg-border col-span-full -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
})

const DropdownKeyboard = forwardRef(function DropdownKeyboard(
  { className, ...props }: React.ComponentProps<typeof Keyboard>,
  ref: React.ForwardedRef<HTMLElement>
) {
  return (
    <Keyboard
      ref={ref}
      classNames={{
        base: twMerge(
          'absolute right-2 group-hover:text-primary-fg group-focus:text-primary-fg pl-2',
          className
        ),
      }}
      {...props}
    />
  )
})

interface DropdownDescriptionProps extends TextProps {
  ref?: React.Ref<HTMLDivElement>
}

const DropdownDescription = React.forwardRef<HTMLElement, DropdownDescriptionProps>(
  ({ className, ...props }, ref) => (
    <Text
      slot="description"
      ref={ref}
      className={twMerge('text-muted-fg col-start-2 text-sm', className)}
      {...props}
    />
  )
)

/**
 * Note: This is not exposed component, but it's used in other components to render dropdowns.
 * @internal
 */
export type {
  DropdownDescriptionProps,
  DropdownItemDetailProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownSectionProps,
}
export {
  DropdownDescription,
  DropdownItem,
  DropdownItemDetails,
  dropdownItemStyles,
  DropdownKeyboard,
  DropdownLabel,
  DropdownSection,
  dropdownSectionStyles,
  DropdownSeparator,
}
