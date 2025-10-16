'use client'

import type { TooltipProps as TooltipPrimitiveProps } from 'react-aria-components'
import {
  Button,
  composeRenderProps,
  OverlayArrow,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from 'react-aria-components'

import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

/**
 * @deprecated
 */
const tooltipStyles = tv({
  base: [
    'group rounded-lg p-6 text-base will-change-transform dark:shadow-none [&_strong]:font-medium',
  ],
  variants: {
    intent: {
      default: 'bg-black text-text-inverse [&_.arx]:fill-overlay [&_.arx]:stroke-border',
      inverse:
        'border-transparent bg-fg text-bg [&_.arx]:fill-fg [&_.arx]:stroke-transparent dark:[&_.arx]:fill-white [&_.text-muted-fg]:text-bg/70 dark:[&_.text-muted-fg]:text-fg/70',
    },
    isEntering: {
      true: [
        'fade-in animate-in',
        'data-[placement=left]:slide-in-from-right-1 data-[placement=right]:slide-in-from-left-1 data-[placement=top]:slide-in-from-bottom-1 data-[placement=bottom]:slide-in-from-top-1',
      ],
    },
    isExiting: {
      true: [
        'fade-in direction-reverse animate-in',
        'data-[placement=left]:slide-out-to-right-1 data-[placement=right]:slide-out-to-left-1 data-[placement=top]:slide-out-to-bottom-1 data-[placement=bottom]:slide-out-to-top-1',
      ],
    },
  },
  defaultVariants: {
    intent: 'default',
  },
})

/**
 * @deprecated
 */
type TooltipProps = React.ComponentProps<typeof TooltipTriggerPrimitive>

/**
 * @deprecated
 */
const Tooltip = (props: TooltipProps) => <TooltipTriggerPrimitive {...props} />

/**
 * @deprecated
 */
interface TooltipContentProps
  extends Omit<TooltipPrimitiveProps, 'children'>,
    VariantProps<typeof tooltipStyles> {
  showArrow?: boolean
  children: React.ReactNode
}

/**
 * @deprecated
 */
const TooltipContent = ({
  offset = 10,
  showArrow = true,
  intent = 'default',
  children,
  ...props
}: TooltipContentProps) => {
  return (
    <TooltipPrimitive
      {...props}
      offset={offset}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tooltipStyles({
          ...renderProps,
          intent,
          className,
        })
      )}
    >
      {showArrow && (
        <OverlayArrow>
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className="arx group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90"
          >
            <path d="M0 0 L6 6 L12 0" fill="black" />
          </svg>
        </OverlayArrow>
      )}
      <>{children}</>
    </TooltipPrimitive>
  )
}

/**
 * @deprecated
 */
const TooltipTrigger: typeof Button = Button

export type { TooltipContentProps, TooltipProps }
export { Tooltip, TooltipContent, TooltipTrigger }
