import { ReactNode, useCallback, useMemo, useRef } from 'react'
import {
  type ControllerProps,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  useForm as useReactHookForm,
  type UseFormHandleSubmit as UseReactHookFormHandleSubmit,
  type UseFormProps as UseReactHookFormProps,
  type UseFormReturn as UseReactHookFormReturn,
} from 'react-hook-form'

import { Collection, InferFields } from '~/core/collection'

import { Form, FormField as _FormField } from './form'
import { createRequireContext } from './utils'

type InferFieldFromCollection<TCollection extends Collection> =
  TCollection extends Collection<any, any, any, any, infer TFields> ? InferFields<TFields> : never

export type FormSubmitHandler<TSchema extends FieldValues> = (data: TSchema) => void

export type FormSubmitErrorHandler<TSchema extends FieldValues> = (
  errors: FieldErrors<TSchema>
) => void

interface UseFormProps<
  TCollection extends Collection<any, any>,
  TContext = any,
  TFields extends Record<string, any> = InferFieldFromCollection<TCollection>,
> extends UseReactHookFormProps<TFields, TContext, TFields> {
  collection: TCollection
  onSubmit?: FormSubmitHandler<TFields>
  onError?: FormSubmitErrorHandler<TFields>
}

export type UseFormReturn<
  TCollection extends Collection<any, any>,
  TContext = any,
  TFields extends Record<string, any> = InferFieldFromCollection<TCollection>,
> = Omit<UseReactHookFormReturn<TFields, TContext, TFields>, 'handleSubmit'> & {
  /**
   * Encouraged to use `form.onSubmit` instead
   * @deprecated
   */
  handleSubmit: UseReactHookFormHandleSubmit<TFields, TFields>
  Provider: (props: { children: ReactNode }) => JSX.Element
  Field: <TName extends FieldPath<TFields> = FieldPath<TFields>>(
    props: Omit<ControllerProps<TFields, TName>, 'control'>
  ) => JSX.Element
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void> | void
}

function useEffectEvent<T extends (...args: any[]) => any>(handler: T): T {
  const handlerRef = useRef(handler)
  handlerRef.current = handler
  return useCallback(((...args) => handlerRef.current(...args)) as T, [])
}

export function useForm<
  TCollection extends Collection,
  TContext = any,
  TFields extends Record<string, any> = InferFieldFromCollection<TCollection>,
>(
  props: UseFormProps<TCollection, TContext, TFields>
): UseFormReturn<TCollection, TContext, TFields> {
  const { collection, ...formProps } = props

  const form = useReactHookForm<TFields, TContext, TFields>(formProps)

  const Provider = useEffectEvent((props: { children: ReactNode }) => {
    return (
      <CollectionContext.Provider value={collection}>
        <Form {...form}>{props.children as any}</Form>
      </CollectionContext.Provider>
    )
  })

  const onSubmit = useMemo(() => {
    return form.handleSubmit(
      ((data: any, event: any) => props?.onSubmit?.(data)) as any,
      (errors, event) => props?.onError?.(errors)
    )
  }, [form, props?.onSubmit, props?.onError])

  return {
    ...form,
    Provider,
    Field: _FormField as any,
    onSubmit,
  }
}

export const [CollectionContextProvider, useCollectionContext, CollectionContext] =
  createRequireContext<Collection | null>('CollectionContext')

export function useReadOne<TCollection extends Collection>(collection: TCollection) {}

export function useReadMany<TCollection extends Collection>(collection: TCollection) {}

export function useCreate<TCollection extends Collection>(collection: TCollection) {}

export function useUpdate<TCollection extends Collection>(collection: TCollection) {}
