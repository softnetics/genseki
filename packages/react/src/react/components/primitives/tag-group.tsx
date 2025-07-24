'use client'

import { createContext, use } from 'react'
import type {
  TagGroupProps as TagGroupPrimitiveProps,
  TagListProps,
  TagProps as TagPrimitiveProps,
} from 'react-aria-components'
import {
  Button,
  composeRenderProps,
  Tag as TagPrimitive,
  TagGroup as TagGroupPrimitive,
  TagList as TagListPrimitive,
} from 'react-aria-components'

import { XIcon } from '@phosphor-icons/react'
import { twJoin, twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { badgeShapes, badgeStyles } from './badge'
import { Description, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

import { BaseIcon } from '../../components/primitives/base-icon'

const intents = {
  primary: {
    base: [
      'bg-pumpkin-100 text-pumpkin-600 **:[[slot=remove]]:hover:bg-primary **:[[slot=remove]]:hover:text-primary-fg',
    ],
    selected: [
      'bg-primary dark:hover:bg-primary dark:bg-primary hover:bg-primary text-primary-fg dark:text-primary-fg hover:text-primary-fg',
      '**:[[slot=remove]]:hover:bg-primary-fg/50 **:[[slot=remove]]:hover:text-primary',
    ],
  },
  gray: {
    base: [
      'bg-bluegray-100 text-bluegray-600 **:[[slot=remove]]:hover:bg-fg **:[[slot=remove]]:hover:text-bg',
    ],
    selected: [
      'bg-stroke-body text-white',
      '**:[[slot=remove]]:hover:bg-secondary/30 **:[[slot=remove]]:hover:text-secondary',
    ],
  },
  correct: {
    base: [
      'bg-surface-correct text-text-correct **:[[slot=remove]]:hover:bg-success **:[[slot=remove]]:hover:text-success-fg',
    ],
    selected: [
      'bg-palm-500 text-white',
      '**:[[slot=remove]]:hover:bg-success-fg/30 **:[[slot=remove]]:hover:text-success-fg',
    ],
  },
  incorrect: {
    base: [
      'bg-red-50 text-red-700 **:[[slot=remove]]:hover:bg-danger **:[[slot=remove]]:hover:text-danger-fg',
    ],
    selected: [
      'bg-red-500 text-white',
      '**:[[slot=remove]]:hover:bg-danger-fg/30 **:[[slot=remove]]:hover:text-danger-fg',
    ],
  },
  accent: {
    base: [
      'bg-yellow-50 text-yellow-600 **:[[slot=remove]]:hover:bg-warning **:[[slot=remove]]:hover:text-warning-fg',
    ],
    selected: [
      'bg-yellow-500 text-white',
      '**:[[slot=remove]]:hover:bg-warning-fg/30 **:[[slot=remove]]:hover:text-warning-fg',
    ],
  },
  info: {
    base: [
      'bg-ocean-50 text-ocean-600',
      '**:[[slot=remove]]:hover:bg-danger **:[[slot=remove]]:hover:text-danger-fg',
    ],
    selected: [
      'bg-ocean-500 text-white',
      '**:[[slot=remove]]:hover:bg-danger-fg/30 **:[[slot=remove]]:hover:text-danger-fg',
    ],
  },
}

type RestrictedIntent = 'primary' | 'gray' | 'correct' | 'incorrect' | 'accent' | 'info'

type Intent = 'primary' | 'gray' | 'correct' | 'incorrect' | 'accent' | 'info'

type Shape = keyof typeof badgeShapes

type TagGroupContextValue = {
  intent: Intent
  shape: Shape
}

const TagGroupContext = createContext<TagGroupContextValue>({
  intent: 'primary',
  shape: 'square',
})

interface TagGroupProps extends TagGroupPrimitiveProps {
  intent?: Intent
  shape?: 'square' | 'circle'
  errorMessage?: string
  label?: string
  description?: string
  ref?: React.RefObject<HTMLDivElement>
}

const TagGroup = ({ children, ref, className, ...props }: TagGroupProps) => {
  return (
    <TagGroupPrimitive
      ref={ref}
      className={twMerge('flex flex-col flex-wrap', className)}
      {...props}
    >
      <TagGroupContext.Provider
        value={{
          intent: props.intent || 'primary',
          shape: props.shape || 'square',
        }}
      >
        {props.label && <Label className="mb-1">{props.label}</Label>}
        {children}
        {props.description && <Description>{props.description}</Description>}
      </TagGroupContext.Provider>
    </TagGroupPrimitive>
  )
}

const TagList = <T extends object>({ className, ...props }: TagListProps<T>) => {
  return (
    <TagListPrimitive
      {...props}
      className={composeTailwindRenderProps(className, 'flex flex-wrap gap-1.5')}
    />
  )
}

const tagStyles = tv({
  base: [badgeStyles.base, 'outline-hidden'],
  variants: {
    isLink: { true: 'cursor-pointer', false: 'cursor-default' },
    isFocusVisible: { true: 'inset-ring inset-ring-current/10' },
    isDisabled: { true: 'opacity-50' },
    allowsRemoving: { true: 'pr-1' },
  },
})

interface TagProps extends TagPrimitiveProps {
  intent?: Intent
  shape?: Shape
  size?: 'sm' | 'md'
}

const Tag = ({ className, intent, shape, size = 'md', ...props }: TagProps) => {
  const textValue = typeof props.children === 'string' ? props.children : undefined
  const groupContext = use(TagGroupContext)

  return (
    <TagPrimitive
      textValue={textValue}
      {...props}
      className={composeRenderProps(className, (_, renderProps) => {
        const finalIntent = intent || groupContext.intent
        const finalShape = shape || groupContext.shape

        return tagStyles({
          ...renderProps,
          isLink: 'href' in props,
          className: twJoin([
            'border-none transition-colors duration-100',
            intents[finalIntent]?.base,
            badgeShapes[finalShape],
            size === 'sm' ? 'text-sm px-4 py-2' : 'text-base px-4 py-3',
            renderProps.isSelected ? intents[finalIntent].selected : undefined,
          ]),
        })
      })}
    >
      {({ allowsRemoving }) => {
        return (
          <>
            {props.children as React.ReactNode}
            {allowsRemoving && (
              <Button
                slot="remove"
                className="-mr-0.5 ml-4 grid size-6 place-content-center rounded-sm hover:[&>[data-slot=icon]]:text-primary-fg outline-hidden [&>[data-slot=icon]]:size-6 [&>[data-slot=icon]]:shrink-0"
              >
                <BaseIcon icon={XIcon} className="text-inherit" />
              </Button>
            )}
          </>
        )
      }}
    </TagPrimitive>
  )
}

export type { RestrictedIntent, TagGroupProps, TagListProps, TagProps }
export { Tag, TagGroup, TagList }
