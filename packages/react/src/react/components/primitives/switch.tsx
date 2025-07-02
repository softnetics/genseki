'use client'

import { forwardRef } from 'react'
import {
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from 'react-aria-components'

import { Description, Label } from './field'
import { composeTailwindRenderProps } from './primitive'

import { cn } from '../../utils/cn'

interface SwitchProps extends SwitchPrimitiveProps {
  ref?: React.RefObject<HTMLLabelElement>
  description?: string
  isRequired?: boolean
  label?: string
}
const Switch = forwardRef(function Switch(
  { className, ...props }: SwitchProps,
  ref: React.ForwardedRef<HTMLLabelElement>
) {
  // If provide only 1 thing then center
  const shouldCenter = [props.description, props.label].filter((item) => !!item).length == 1

  const id = props.id ?? `switch-${props.name}`

  return (
    <div
      className={cn(
        'grid grid-cols-[40px_1fr] items-start',
        shouldCenter ? 'items-center' : 'items-start'
      )}
    >
      <SwitchPrimitive
        ref={ref}
        {...props}
        id={id}
        className={composeTailwindRenderProps(
          className,
          'group inline-flex touch-none items-center sm:text-base'
        )}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {(values) => (
          <>
            <span className="bg-(--switch) group-invalid:ring-danger/20 group-focus:ring-primary/20 group-selected:bg-primary mr-4 h-8 w-16 cursor-pointer rounded-full border-2 border-transparent transition duration-200 [--switch:color-mix(in_oklab,var(--color-muted)_90%,black_10%)] group-focus:ring-4 group-disabled:cursor-default group-disabled:opacity-50 dark:[--switch:color-mix(in_oklab,var(--color-muted)_85%,white_15%)]">
              <span className="bg-primary-fg group-selected:ml-8 group-pressed:w-5 group-selected:group-data-[pressed]:ml-2 block size-6 origin-right rounded-full shadow-sm transition-all duration-200 forced-colors:disabled:outline-[GrayText]" />
            </span>
            {typeof props.children === 'function' ? props.children(values) : props.children}
          </>
        )}
      </SwitchPrimitive>
      <div className="flex flex-col gap-1">
        <>
          {props.label ? (
            <Label
              htmlFor={id}
              className={cn(props.description && 'text-sm/4 font-normal select-none')}
            >
              {props.label}
              {props.isRequired && <span className="ml-1 text-red-500">*</span>}
            </Label>
          ) : (
            (props.children as React.ReactNode)
          )}
          {props.description && <Description>{props.description}</Description>}
        </>
      </div>
    </div>
  )
})

export type { SwitchProps }
export { Switch }
