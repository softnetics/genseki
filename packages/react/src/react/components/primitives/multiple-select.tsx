'use client'

import {
  Children,
  isValidElement,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ComboBoxProps, GroupProps, Key, ListBoxProps, Selection } from 'react-aria-components'
import { Button, ComboBox, Group } from 'react-aria-components'

import { CaretDownIcon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { DropdownItem, DropdownLabel, DropdownSection } from './dropdown'
import { Description, FieldGroup, type FieldProps, Input, Label } from './field'
import { ListBox } from './list-box'
import { PopoverContent } from './popover'
import { composeTailwindRenderProps } from './primitive'
import { type RestrictedIntent, Tag, TagGroup, type TagGroupProps, TagList } from './tag-group'

import { BaseIcon } from '../../components/primitives/base-icon'

interface MultipleSelectProps<T>
  extends Omit<ListBoxProps<T>, 'renderEmptyState'>,
    Pick<
      ComboBoxProps<T & { selectedKeys: Selection }>,
      'isRequired' | 'validate' | 'validationBehavior'
    >,
    FieldProps,
    Pick<TagGroupProps, 'shape'>,
    Pick<GroupProps, 'isDisabled' | 'isInvalid'> {
  className?: string
  errorMessage?: string
  intent?: RestrictedIntent
  maxItems?: number
  renderEmptyState?: (inputValue: string) => React.ReactNode
}

function mapToNewObject<T extends object>(array: T[]): { id: T[keyof T]; textValue: T[keyof T] }[] {
  return array.map((item) => {
    const idProperty = Object.keys(item).find((key) => key === 'id' || key === 'key')
    const textProperty = Object.keys(item).find((key) => key !== 'id' && key !== 'key')
    return {
      id: item[idProperty as keyof T],
      textValue: item[textProperty as keyof T],
    }
  })
}

const MultipleSelect = <T extends object>({
  className,
  maxItems = Number.POSITIVE_INFINITY,
  renderEmptyState,
  children,
  ...props
}: MultipleSelectProps<T>) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [selectedKeys, onSelectionChange] = useState<Selection>(new Set(props.selectedKeys))

  const isMax = [Array.from(selectedKeys)].length >= maxItems

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setInputValue('')
    return () => {
      inputRef.current?.focus()
    }
  }, [props?.selectedKeys, selectedKeys])

  const addItem = (e: Key | null) => {
    if (!e || isMax) return
    onSelectionChange?.((s) => new Set([...Array.from(s), e!]))
    // @ts-expect-error incompatible type Key and Selection
    props.onSelectionChange?.((s) => new Set([...s, e!]))
  }

  const removeItem = (e: Set<Key>) => {
    onSelectionChange?.(
      (s) => new Set([...Array.from(s)].filter((i) => i !== e.values().next().value))
    )
    props.onSelectionChange?.(
      // @ts-expect-error incompatible type Key and Selection
      (s) => new Set([...s].filter((i) => i !== e.values().next().value))
    )
  }

  const onKeyDownCapture = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '') {
      onSelectionChange?.((s) => new Set([...Array.from(s)].slice(0, -1)))
      // @ts-expect-error incompatible type Key and Selection
      props.onSelectionChange?.((s) => new Set([...s].slice(0, -1)))
    }
  }

  const parsedItems = props.items
    ? mapToNewObject(props.items as T[])
    : mapToNewObject(
        Children.map(
          children as React.ReactNode,
          (child) => isValidElement(child) && child.props
        ) as T[]
      )

  const availableItemsToSelect = props.items
    ? parsedItems.filter((item) => ![...Array.from(selectedKeys)].includes(item.id as Key))
    : parsedItems

  const filteredChildren = props.items
    ? parsedItems.filter((item) => ![...Array.from(selectedKeys)].includes(item.id as Key))
    : Children.map(
        children as React.ReactNode,
        (child) => isValidElement(child) && child.props
      )?.filter((item: T & any) => ![...Array.from(selectedKeys)].includes(item.id))

  return (
    <Group
      isDisabled={props.isDisabled}
      isInvalid={props.isInvalid}
      className={composeTailwindRenderProps(className, 'group flex h-fit flex-col gap-y-4')}
    >
      {({ isInvalid, isDisabled }) => (
        <>
          {props.label && (
            <Label onClick={() => inputRef.current?.focus()}>
              {props.label} {props.isRequired && <span className="ml-1 text-pumpkin-500">*</span>}
            </Label>
          )}
          <FieldGroup
            ref={triggerRef as RefObject<HTMLDivElement>}
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            className="flex h-fit min-h-10 flex-wrap items-center"
          >
            <TagGroup
              onRemove={removeItem}
              aria-hidden
              shape={props.shape}
              intent={props.intent}
              aria-label="Selected items"
            >
              <TagList
                className={twMerge(
                  [...Array.from(selectedKeys)].length !== 0 && 'flex flex-1 flex-wrap p-6 pr-0',
                  '[&_.jdt3lr2x]:last:-mr-1 gap-1.5 outline-hidden',
                  props.shape === 'square' && '[&_.jdt3lr2x]:rounded-[calc(var(--radius-lg)-4px)]'
                )}
                items={[...Array.from(selectedKeys)].map((key) => ({
                  id: key,
                  textValue: parsedItems.find((item) => item.id === key)?.textValue as string,
                }))}
              >
                {(item: { id: Key; textValue: Key }) => (
                  <Tag isDisabled={isDisabled} textValue={item.textValue as string}>
                    {item.textValue as string}
                  </Tag>
                )}
              </TagList>
            </TagGroup>
            <ComboBox
              isRequired={props.isRequired}
              validate={props.validate}
              validationBehavior={props.validationBehavior}
              isReadOnly={isMax}
              isDisabled={isDisabled}
              className="flex flex-1"
              aria-label="Search"
              onSelectionChange={addItem}
              inputValue={inputValue}
              onInputChange={isMax ? () => {} : setInputValue}
            >
              <div className="flex w-full flex-row items-center justify-between">
                <Input
                  onFocus={() => triggerButtonRef.current?.click()}
                  ref={inputRef as RefObject<HTMLInputElement>}
                  className="flex-1 p-6 shadow-none ring-0"
                  onBlur={() => {
                    setInputValue('')
                  }}
                  onKeyDownCapture={onKeyDownCapture}
                  placeholder={isMax ? 'Maximum reached' : props.placeholder}
                />
                <Button
                  ref={triggerButtonRef}
                  aria-label="Chevron"
                  className="ml-auto inline-flex items-center self-stretch justify-center text-muted-fg outline-hidden pl-4 pr-6"
                >
                  <BaseIcon
                    icon={CaretDownIcon}
                    className="group-has-open:-rotate-180 transition duration-300"
                  />
                </Button>
              </div>
              <PopoverContent
                showArrow={false}
                respectScreen={false}
                triggerRef={triggerRef}
                className="min-w-(--trigger-width) overflow-hidden"
                style={{
                  minWidth: triggerRef.current?.offsetWidth,
                  width: triggerRef.current?.offsetWidth,
                }}
              >
                <ListBox
                  className="max-h-[inherit] min-w-[inherit] border-0 shadow-0"
                  renderEmptyState={() =>
                    renderEmptyState ? (
                      renderEmptyState(inputValue)
                    ) : (
                      <Description className="block p-3">
                        {inputValue ? (
                          <>
                            No results found for:{' '}
                            <strong className="font-medium text-fg">{inputValue}</strong>
                          </>
                        ) : (
                          'No options'
                        )}
                      </Description>
                    )
                  }
                  items={(availableItemsToSelect as T[]) ?? props.items}
                  {...props}
                >
                  {filteredChildren?.map((item: any) => (
                    <MultipleSelectItem
                      key={item.id as Key}
                      id={item.id as Key}
                      textValue={item.textValue as string}
                    >
                      {item.textValue as string}
                    </MultipleSelectItem>
                  )) ?? children}
                </ListBox>
              </PopoverContent>
            </ComboBox>
          </FieldGroup>
          {props.description && <Description>{props.description}</Description>}
          {props.errorMessage && isInvalid && (
            <Description className="text-danger text-sm/5">{props.errorMessage}</Description>
          )}
        </>
      )}
    </Group>
  )
}

export const MultipleSelectItem = DropdownItem
export const MultipleSelectLabel = DropdownLabel
export const MultipleSelectSection = DropdownSection

export { MultipleSelect }
export type { MultipleSelectProps }
