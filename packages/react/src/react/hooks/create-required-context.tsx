import React from 'react'

export function createRequiredContext<T = {}, R = T>(
  name: string,
  options?: {
    valueMapper?: (value: T) => R
    render?: (props: React.PropsWithChildren<{ value: R }>) => React.ReactNode
  }
) {
  const Context = React.createContext<R>(null!)

  function useContext() {
    const c = React.use(Context)
    if (!c) {
      throw new Error(`use${name} must be used within a ${name}Provider`)
    }
    return c
  }

  function Provider(props: React.PropsWithChildren<T>) {
    const value = options?.valueMapper ? options.valueMapper(props) : props

    const sanitizedValue = (value as any)?.children
      ? (() => {
          const { children: _children, ...sanitizedValue } = value as any
          return sanitizedValue
        })()
      : value

    return (
      <Context value={sanitizedValue as R}>
        {options?.render
          ? options.render({
              children: props.children,
              value: value as R,
            })
          : props.children}
      </Context>
    )
  }

  return [Provider, useContext, Context] as const
}
