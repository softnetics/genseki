'use client'

import { FormProvider, useForm } from 'react-hook-form'

import type { ServerConfig } from '@kivotos/core'

import { useServerFunction } from '../providers/root'
export type TEMP_FORM_TYPE = { x: string; y: string }

// We'll need to create a flexible and dynamic form that canhandle any structure

export function Form<TServerConfig extends ServerConfig>(props: {
  method: 'create'
  slug: string
  children: React.ReactElement
}) {
  const methods = useForm<TEMP_FORM_TYPE>({
    defaultValues: {},
  })
  const serverFunction = useServerFunction<TServerConfig>()

  const submitAction = async (formData: FormData) => {
    // @ts-expect-error TODO: Form data type
    console.log(Object.fromEntries(formData))
    // await serverFunction({
    //   slug: props.slug,
    //   method: props.method,
    //   payload: {
    //     ...(props.id ? { id: props.id } : {}),
    //     data: data as any,
    //   },
    // } as any)
  }

  return (
    <FormProvider {...methods}>
      <form action={submitAction}>{props.children}</form>
    </FormProvider>
  )
}
