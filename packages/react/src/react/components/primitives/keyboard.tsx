import { forwardRef } from 'react'
import { Keyboard as KeyboardPrimitive } from 'react-aria-components'

import { twMerge } from 'tailwind-merge'

interface KeyboardProps extends React.HTMLAttributes<HTMLElement> {
  keys: string | string[]
  classNames?: {
    base?: string
    kbd?: string
  }
}

const Keyboard = forwardRef(function Keyboard(
  { keys, classNames, ...props }: KeyboardProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  return (
    <KeyboardPrimitive
      ref={ref}
      className={twMerge(
        'text-current/60 group-hover:text-fg group-focus:text-fg hidden font-mono group-focus:opacity-90 group-disabled:opacity-50 lg:inline-flex forced-colors:group-focus:text-[HighlightText]',
        classNames?.base
      )}
      {...props}
    >
      {(Array.isArray(keys) ? keys : keys.split('')).map((char, index) => (
        <kbd
          key={index}
          className={twMerge(
            'tracking-widest',
            index > 0 && char.length > 1 && 'pl-1',
            classNames?.kbd
          )}
        >
          {char}
        </kbd>
      ))}
    </KeyboardPrimitive>
  )
})

export type { KeyboardProps }
export { Keyboard }
