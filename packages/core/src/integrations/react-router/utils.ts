import { createContext, useContext as useReactContext } from 'react'

export function createRequireContext<TContextValue>(name: string) {
  const Context = createContext(null as TContextValue | null)
  const useContext = () => {
    const context = useReactContext(Context)
    if (!context) {
      throw new Error(`use${name}Context must be inside of ${name}ContextProvider`)
    }
    return context
  }
  return [
    Context.Provider as React.Provider<TContextValue>,
    useContext as () => TContextValue,
    Context,
  ] as const
}
