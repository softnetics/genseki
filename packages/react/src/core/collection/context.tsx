'use client'
import React, { createContext, useContext } from 'react'

import type { FieldsClient } from '../field'

export interface CollectionContextValue {
  slug: string
  fields: FieldsClient
  params: Record<string, string>
  headers: Record<string, string>
  searchParams: Record<string, string | string[]>
  pathname: string
}

const ColectionContext = createContext<CollectionContextValue>(null!)

export interface CollectionProviderProps extends CollectionContextValue {
  children?: React.ReactNode
}

/**
 * @description A provider to provide `listViewProps` for client
 */
export function CollectionProvider(props: CollectionProviderProps) {
  const { children, ...rest } = props
  return <ColectionContext.Provider value={rest}>{children}</ColectionContext.Provider>
}

export function useCollectionContext() {
  const value = useContext(ColectionContext)
  if (!value) {
    throw new Error('"useCollectionContext" must be used within a "CollectionProvider"')
  }
  return value
}
