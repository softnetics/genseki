'use client'

import { forwardRef } from 'react'
import {
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from 'react-aria-components'

import { AriaDescription, AriaLabel } from './field'
import { composeTailwindRenderProps } from './primitive'

import { cn } from '../../utils/cn'

interface SwitchProps extends SwitchPrimitiveProps {
  size?: 'md' | 'lg'
  ref?: React.RefObject<HTMLLabelElement>
  description?: string
  isRequired?: boolean
  label?: string
}
const Switch = forwardRef(function Switch(
  { className, size = 'md', ...props }: SwitchProps,
  ref: React.ForwardedRef<HTMLLabelElement>
) {
  // If provide only 1 thing then center
  const shouldCenter = [props.description, props.label].filter((item) => !!item).length == 1

  const id = props.id ?? `switch-${props.name}`

  return (
    <div
      className={cn(
        'grid grid-cols-[40px_1fr] items-start',
        shouldCenter ? 'items-center' : 'items-start',
        size === 'lg' && 'h-10'
      )}
    >
      <SwitchPrimitive
        ref={ref}
        {...props}
        id={id}
        className={composeTailwindRenderProps(
          className,
          'group inline-flex touch-none items-center'
        )}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {(values) => (
          <>
            <span
              className={cn(
                'bg-(--switch) shrink-0 group-invalid:ring-danger/20 group-focus:ring-primary/20 group-selected:bg-primary mr-4 cursor-pointer rounded-full border-2 border-transparent transition duration-200 [--switch:color-mix(in_oklab,var(--color-muted)_90%,black_10%)] group-focus:ring-4 group-disabled:cursor-default group-disabled:opacity-50 dark:[--switch:color-mix(in_oklab,var(--color-muted)_85%,white_15%)]',
                size === 'lg' && 'h-12 w-[44px]',
                size === 'md' && 'h-10 w-[36px]'
              )}
            >
              <span
                className={cn(
                  'bg-primary-fg group-pressed:w-5 group-selected:group-data-[pressed]:ml-2 block origin-right rounded-full shadow-sm transition-all duration-200 forced-colors:disabled:outline-[GrayText]',
                  size === 'lg' && 'size-10 group-selected:ml-10',
                  size === 'md' && 'size-8 group-selected:ml-8'
                )}
              />
            </span>
            {typeof props.children === 'function' ? props.children(values) : props.children}
          </>
        )}
      </SwitchPrimitive>
      <div className="flex flex-col gap-1">
        <>
          {props.label ? (
            <AriaLabel
              htmlFor={id}
              className={cn(props.description && 'text-sm/4 font-normal select-none')}
            >
              {props.label}
              {props.isRequired && <span className="ml-1 text-red-pumpkin">*</span>}
            </AriaLabel>
          ) : (
            (props.children as React.ReactNode)
          )}
          {props.description && <AriaDescription>{props.description}</AriaDescription>}
        </>
      </div>
    </div>
  )
})

export type { SwitchProps }
export { Switch }
