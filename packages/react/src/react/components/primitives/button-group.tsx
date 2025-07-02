'use client'

import { createContext, use } from 'react'
import {
  composeRenderProps,
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from 'react-aria-components'

import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { composeTailwindRenderProps } from './primitive'

type ButtonSize = 'sm' | 'md'

interface ButtonGroupContextValue
  extends Pick<ToggleButtonGroupProps, 'selectionMode' | 'orientation'> {
  size?: ButtonSize
}

const ButtonGroupContext = createContext<ButtonGroupContextValue>({
  size: 'md',
  selectionMode: 'single',
  orientation: 'horizontal',
})

const useButtonGroupContext = () => use(ButtonGroupContext)

interface ButtonGroupProps extends ToggleButtonGroupProps {
  size?: ButtonSize
}

const ButtonGroup = ({
  size = 'md',
  orientation = 'horizontal',
  selectionMode = 'single',
  className,
  ...props
}: ButtonGroupProps) => {
  return (
    <ButtonGroupContext.Provider value={{ size, selectionMode, orientation }}>
      <ToggleButtonGroup
        selectionMode={selectionMode}
        className={composeTailwindRenderProps(
          className,
          `inset-ring inset-ring-border inline-flex overflow-hidden rounded-md border-bluegray-300 p-0.5 ${
            orientation === 'horizontal' ? 'flex-row' : 'flex-col'
          } ${selectionMode === 'single' ? 'gap-0.5' : 'gap-0'}`
        )}
        {...props}
      />
    </ButtonGroupContext.Provider>
  )
}

interface ButtonGroupItemProps extends ToggleButtonProps {}

const ButtonGroupItemStyles = tv({
  base: [
    'bg-bluegray-200 cursor-pointer',
    'text-bluegray-800 px-4 py-2',
    'relative isolate inline-flex flex-row items-center font-medium outline-hidden',
  ],
  variants: {
    orientation: {
      horizontal: 'justify-center',
      vertical: 'justify-start',
    },
    selectionMode: {
      single: '',
      multiple:
        'rounded-none first:rounded-l-[calc(var(--radius-lg)-2px)] last:rounded-r-[calc(var(--radius-lg)-2px)]',
    },
    size: {
      sm: [
        'text-base',
        '*:data-[slot=icon]:size-4.5 sm:*:data-[slot=icon]:size-4',
        '*:data-[slot=loader]:size-4.5 sm:*:data-[slot=loader]:size-4',
      ],
      md: [
        'text-lg',
        '*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4',
        '*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4',
      ],
    },
    isSelected: {
      // add inside shadow
      true: `bg-white`,
    },
    isDisabled: {
      true: 'opacity-50 grayscale cursor-not-allowed',
    },
  },
  defaultVariants: {
    size: 'md',
    isCircle: false,
  },
})

const ButtonGroupItem = ({ className, ...props }: ButtonGroupItemProps) => {
  const { size, selectionMode, orientation } = useButtonGroupContext()

  return (
    <ToggleButton
      data-slot="toggle-group-item"
      className={composeRenderProps(className, (className, renderProps) =>
        twMerge(
          ButtonGroupItemStyles({
            ...renderProps,
            size,
            orientation,
            selectionMode,
            className,
          })
        )
      )}
      {...props}
    />
  )
}

export type { ButtonGroupItemProps, ButtonGroupProps }
export { ButtonGroup, ButtonGroupItem }
