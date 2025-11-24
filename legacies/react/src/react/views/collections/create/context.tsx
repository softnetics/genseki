'use client'

import React, { createContext, useContext, useMemo } from 'react'

import { Field, type FieldProps } from './field'
import { Fields, type FieldsProps } from './fields'
import { CreateTitle, type CreateTitleProps } from './title'
import { CreateView } from './view'

import { CollectionFormLayout, type FormLayoutProps } from '../layouts/collection-form-layout'

interface CollectionCreateContextValue<TFieldsValue extends {} = {}> {
  components: {
    CreateField: React.FC<FieldProps<TFieldsValue>>
    CreateFields: React.FC<FieldsProps>
    CreateTitle: React.FC<CreateTitleProps>
    CreateView: React.FC
    CreateFormLayout: React.FC<FormLayoutProps>
  }
}

const CollectionCreateContext = createContext<CollectionCreateContextValue | null>(null)

interface CollectionCreateProviderProps {
  children: React.ReactNode
}
export function CollectionCreateProvider({ children }: CollectionCreateProviderProps) {
  const components = useMemo<CollectionCreateContextValue['components']>(
    () => ({
      CreateField: Field,
      CreateFields: Fields,
      CreateTitle,
      CreateView,
      CreateFormLayout: CollectionFormLayout,
    }),
    []
  )

  return (
    <CollectionCreateContext.Provider
      value={{
        components,
      }}
    >
      {children}
    </CollectionCreateContext.Provider>
  )
}

export const useCollectionCreate = <
  TFieldsValue extends {},
>(): CollectionCreateContextValue<TFieldsValue> => {
  const value = useContext(CollectionCreateContext)
  if (!value)
    throw new Error('"useCollectionCreate" must be used within a "CollectionCreateProvider"')

  return value as unknown as CollectionCreateContextValue<TFieldsValue>
}
