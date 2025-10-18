'use client'

import { createContext, use } from 'react'
import type { ToggleButtonGroupProps, ToggleButtonProps } from 'react-aria-components'
import { composeRenderProps, ToggleButton, ToggleButtonGroup } from 'react-aria-components'

import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

/**
 * @deprecated
 */
type ToggleGroupContextProps = {
  isDisabled?: boolean
  gap?: 0 | 1 | 2 | 3 | 4
  intent?: 'plain' | 'outline' | 'solid'
  orientation?: 'horizontal' | 'vertical'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'square-petite'
}

/**
 * @deprecated
 */
const ToggleGroupContext = createContext<ToggleGroupContextProps>({
  gap: 1,
  intent: 'outline',
  orientation: 'horizontal',
  size: 'md',
})

/**
 * @deprecated
 */
type BaseToggleGroupProps = Omit<ToggleGroupContextProps, 'gap' | 'intent'>

/**
 * @deprecated
 */
interface ToggleGroupPropsNonZeroGap extends BaseToggleGroupProps {
  gap?: Exclude<ToggleGroupContextProps['gap'], 0>
  intent?: ToggleGroupContextProps['intent']
}

/**
 * @deprecated
 */
interface ToggleGroupPropsGapZero extends BaseToggleGroupProps {
  gap?: 0
  intent?: Exclude<ToggleGroupContextProps['intent'], 'plain'>
}

/**
 * @deprecated
 */
type ToggleGroupProps = ToggleButtonGroupProps &
  (ToggleGroupPropsGapZero | ToggleGroupPropsNonZeroGap) & {
    ref?: React.RefObject<HTMLDivElement>
  }

/**
 * @deprecated
 */
const toggleGroupStyles = tv({
  base: 'flex',
  variants: {
    orientation: {
      horizontal:
        'flex-row [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      vertical: 'flex-col items-start',
    },
    gap: {
      0: 'gap-0 rounded-lg *:[button]:inset-ring-1 *:[button]:rounded-none',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    gap: 0,
  },
  compoundVariants: [
    {
      gap: 0,
      orientation: 'vertical',
      className:
        '*:[button]:-mt-px *:[button]:first:rounded-t-[calc(var(--radius-lg)-1px)] *:[button]:last:rounded-b-[calc(var(--radius-lg)-1px)]',
    },
    {
      gap: 0,
      orientation: 'horizontal',
      className:
        '*:[button]:-mr-px *:[button]:first:rounded-s-[calc(var(--radius-lg)-1px)] *:[button]:last:rounded-e-[calc(var(--radius-lg)-1px)]',
    },
  ],
})

/**
 * @deprecated
 */
const ToggleGroup = ({
  className,
  ref,
  intent = 'outline',
  gap = 0,
  size = 'md',
  orientation = 'horizontal',
  ...props
}: ToggleGroupProps) => {
  return (
    <ToggleGroupContext.Provider
      value={{ intent, gap, orientation, size, isDisabled: props.isDisabled }}
    >
      <ToggleButtonGroup
        ref={ref}
        orientation={orientation}
        className={composeRenderProps(className, (className, renderProps) =>
          toggleGroupStyles({
            ...renderProps,
            gap,
            orientation,
            className,
          })
        )}
        {...props}
      />
    </ToggleGroupContext.Provider>
  )
}

/**
 * @deprecated
 */
const toggleStyles = tv({
  base: [
    'inset-ring inset-ring-border cursor-default items-center gap-x-2 rounded-lg outline-hidden sm:text-sm',
    'forced-colors:[--button-icon:ButtonText] forced-colors:hover:[--button-icon:ButtonText]',
    '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0 *:data-[slot=icon]:size-8 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-current/60 pressed:*:data-[slot=icon]:text-current hover:*:data-[slot=icon]:text-current/90',
  ],
  variants: {
    isDisabled: {
      true: 'opacity-50 forced-colors:border-[GrayText]',
    },
    isFocusVisible: {
      true: 'inset-ring-ring/70 z-20 ring-4 ring-ring/20',
    },
    intent: {
      plain: 'inset-ring-0 selected:bg-secondary selected:text-secondary-fg',
      solid: ['inset-ring selected:inset-ring-fg selected:bg-fg selected:text-bg'],
      outline: [
        'pressed:border-secondary-fg/10 selected:border-secondary-fg/10 selected:bg-secondary selected:text-secondary-fg hover:border-secondary-fg/10 hover:bg-muted hover:text-secondary-fg',
      ],
    },
    noGap: { true: '' },
    orientation: {
      horizontal: 'inline-flex justify-center',
      vertical: 'flex',
    },
    size: {
      'square-petite': 'size-14 shrink-0',
      lg: 'p-7 *:data-[slot=icon]:size-10 sm:text-base',
      md: 'p-6',
      sm: 'p-4',
      xs: 'p-2 text-xs/4 *:data-[slot=icon]:size-6',
    },
    shape: {
      square: 'rounded-lg',
      circle: 'rounded-full',
    },
  },
  defaultVariants: {
    intent: 'outline',
    size: 'sm',
    shape: 'square',
  },
  compoundVariants: [
    {
      noGap: true,
      orientation: 'vertical',
      className: 'w-full',
    },
  ],
})

/**
 * @deprecated
 */
interface ToggleProps extends ToggleButtonProps, VariantProps<typeof toggleStyles> {
  ref?: React.RefObject<HTMLButtonElement>
}

/**
 * @deprecated
 */
const Toggle = ({ className, intent, ref, ...props }: ToggleProps) => {
  const {
    intent: groupIntent,
    orientation,
    gap,
    size,
    isDisabled: isGroupDisabled,
  } = use(ToggleGroupContext)
  return (
    <ToggleButton
      ref={ref}
      isDisabled={props.isDisabled ?? isGroupDisabled}
      className={composeRenderProps(className, (className, renderProps) =>
        toggleStyles({
          ...renderProps,
          intent: intent ?? groupIntent,
          size: props.size ?? size,
          orientation,
          shape: props.shape,
          noGap: gap === 0,
          className,
        })
      )}
      {...props}
    />
  )
}

export type { ToggleGroupProps, ToggleProps }
export { Toggle, ToggleGroup }
