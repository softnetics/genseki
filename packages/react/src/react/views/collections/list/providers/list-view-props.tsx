'use client'
import React, { createContext, use } from 'react'

import type { Fields } from '../../../../../core'
import type { ClientListViewProps } from '../../../../../core/collection'

type ClientListViewPropsContextValue<TFields extends Fields> = ClientListViewProps<TFields>

const ClientListViewPropsContext = createContext<ClientListViewPropsContextValue<any>>(null!)

/**
 * @description A provider to provide `listViewProps` for client
 */
export function ClientListViewPropsProvider<TFields extends Fields>(props: {
  children?: React.ReactNode
  clientListViewProps: ClientListViewProps<TFields>
}) {
  return (
    <ClientListViewPropsContext value={props.clientListViewProps}>
      {props.children}
    </ClientListViewPropsContext>
  )
}

export function useClientListViewPropsContext() {
  const value = use(ClientListViewPropsContext)
  if (!value) throw new Error('useListActions must be used within a ListActionsProvider')
  return value
}
