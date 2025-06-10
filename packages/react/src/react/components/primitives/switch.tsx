'use client'

import { forwardRef } from 'react'
import {
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from 'react-aria-components'

import { composeTailwindRenderProps } from './primitive'

interface SwitchProps extends SwitchPrimitiveProps {
  ref?: React.RefObject<HTMLLabelElement>
}
const Switch = forwardRef(function Switch(
  { children, className, ...props }: SwitchProps,
  ref: React.ForwardedRef<HTMLLabelElement>
) {
  return (
    <SwitchPrimitive
      ref={ref}
      {...props}
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
          {typeof children === 'function' ? children(values) : children}
        </>
      )}
    </SwitchPrimitive>
  )
})

export type { SwitchProps }
export { Switch }
