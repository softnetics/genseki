'use client'

import { useId } from 'react'
import type {
  TabListProps as TabListPrimitiveProps,
  TabPanelProps as TabPanelPrimitiveProps,
  TabProps as TabPrimitiveProps,
  TabsProps as TabsPrimitiveProps,
} from 'react-aria-components'
import {
  composeRenderProps,
  Tab as TabPrimitive,
  TabList as TabListPrimitive,
  TabPanel as TabPanelPrimitive,
  Tabs as TabsPrimitive,
} from 'react-aria-components'

import { LayoutGroup, motion } from 'motion/react'
import { twJoin, twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import { Badge } from './badge'
import { composeTailwindRenderProps } from './primitive'

/**
 * @deprecated
 */
const tabsStyles = tv({
  base: 'group/tabs flex gap-4 forced-color-adjust-none',
  variants: {
    orientation: {
      horizontal: 'flex-col',
      vertical: 'w-[800px] flex-row',
    },
    size: {
      md: 'text-base',
      lg: 'text-lg',
    },
  },
})

/**
 * @deprecated
 */
interface TabsProps extends TabsPrimitiveProps {
  size?: 'md' | 'lg'
  ref?: React.RefObject<HTMLDivElement>
}
const Tabs = ({ className, ref, size, ...props }: TabsProps) => {
  return (
    <TabsPrimitive
      className={composeRenderProps(className, (className, renderProps) =>
        tabsStyles({
          ...renderProps,
          className,
          size,
        })
      )}
      ref={ref}
      {...props}
    />
  )
}

/**
 * @deprecated
 */
const tabListStyles = tv({
  base: 'flex forced-color-adjust-none',
  variants: {
    orientation: {
      horizontal: 'flex-row gap-x-5 border-border border-b-2',
      vertical: 'flex-col items-start gap-y-4 border-l-2',
    },
  },
})

/**
 * @deprecated
 */
interface TabListProps<T extends object> extends TabListPrimitiveProps<T> {
  ref?: React.RefObject<HTMLDivElement>
}

/**
 * @deprecated
 */
const TabList = <T extends object>({ className, ref, ...props }: TabListProps<T>) => {
  const id = useId()
  return (
    <LayoutGroup id={id}>
      <TabListPrimitive
        ref={ref}
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
          tabListStyles({ ...renderProps, className })
        )}
      />
    </LayoutGroup>
  )
}

/**
 * @deprecated
 */
const tabStyles = tv({
  base: [
    'relative flex cursor-pointer items-center whitespace-nowrap rounded-full font-semibold outline-hidden transition *:data-[slot=icon]:mr-2 *:data-[slot=icon]:size-4 focus-visible:text-text-brand',
    'group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:py-0 group-data-[orientation=vertical]/tabs:pr-2 group-data-[orientation=vertical]/tabs:pl-4',
    'group-data-[orientation=horizontal]/tabs:pb-6',
  ],
  variants: {
    isSelected: {
      false: 'text-text-primary',
      true: 'text-text-brand',
    },
    isFocused: { false: 'ring-0', true: 'text-text-brand' },
    isDisabled: {
      true: 'text-muted-fg/50',
    },
    size: {
      md: 'text-base',
      lg: 'text-lg',
    },
  },
})

/**
 * @deprecated
 */
interface TabProps extends TabPrimitiveProps {
  badgeNumber?: number
  ref?: React.RefObject<HTMLButtonElement>
}

/**
 * @deprecated
 */
const Tab = ({ children, badgeNumber, ref, ...props }: TabProps) => {
  return (
    <TabPrimitive
      ref={ref}
      {...props}
      className={composeRenderProps(props.className, (_className, renderProps) =>
        tabStyles({
          ...renderProps,
          className: twJoin('href' in props && 'cursor-pointer', _className),
        })
      )}
    >
      {({ isSelected }) => (
        <>
          <div className="flex items-center gap-4">
            {children as React.ReactNode}
            {badgeNumber && (
              <Badge intent={isSelected ? 'brand' : 'gray'} size="sm">
                {badgeNumber}
              </Badge>
            )}
          </div>
          {isSelected && (
            <motion.span
              data-slot="selected-indicator"
              className={twMerge(
                'bg-pumpkin-500 absolute rounded',
                // horizontal
                'group-data-[orientation=horizontal]/tabs:inset-x-0 group-data-[orientation=horizontal]/tabs:-bottom-px group-data-[orientation=horizontal]/tabs:h-1 group-data-[orientation=horizontal]/tabs:w-full',
                // vertical
                'group-data-[orientation=vertical]/tabs:left-0 group-data-[orientation=vertical]/tabs:h-[calc(100%-10%)] group-data-[orientation=vertical]/tabs:w-0.5 group-data-[orientation=vertical]/tabs:transform'
              )}
              // layoutId="current-selected"
              // transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
        </>
      )}
    </TabPrimitive>
  )
}

/**
 * @deprecated
 */
interface TabPanelProps extends TabPanelPrimitiveProps {
  ref?: React.RefObject<HTMLDivElement>
}

/**
 * @deprecated
 */
const TabPanel = ({ className, ref, ...props }: TabPanelProps) => {
  return (
    <TabPanelPrimitive
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(
        className,
        'text-fg focus-visible:outline-hidden flex-1 text-lg'
      )}
    />
  )
}

export type { TabListProps, TabPanelProps, TabProps, TabsProps }
export { Tab, TabList, TabPanel, Tabs }
