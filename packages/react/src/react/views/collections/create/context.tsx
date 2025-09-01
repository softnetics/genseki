'use client'

import React, { createContext, useContext, useMemo } from 'react'

import type { FieldProps } from './field'
import Field from './field'
import type { FieldsSetProps } from './fieldsSet'
import FieldsSet from './fieldsSet'
import type { CreateFormProps } from './form'
import { CreateForm } from './form'
import type { CollectionCreateTitleProps } from './title'
import CollectionCreateTitle from './title'
import DefaultCollectionCreateView from './view'

import { CollectionFormLayout, type FormLayoutProps } from '../layouts/collection-form-layout'

interface CollectionListContextValue<TFieldsValue extends {} = {}> {
  components: {
    Field: React.FC<FieldProps<TFieldsValue>>
    FieldsSet: React.FC<FieldsSetProps>
    CreateForm: React.FC<CreateFormProps<TFieldsValue>>
    CollectionCreateTitle: React.FC<CollectionCreateTitleProps>
    DefaultCollectionCreateView: React.FC
    CollectionFormLayout: React.FC<FormLayoutProps>
  }
}

const CollectionCreateContext = createContext<CollectionListContextValue | null>(null)

interface CollectionCreateProviderProps {
  children: React.ReactNode
}
export const CollectionCreateProvider = ({ children }: CollectionCreateProviderProps) => {
  const components = useMemo<CollectionListContextValue['components']>(
    () => ({
      Field,
      FieldsSet,
      CreateForm,
      CollectionCreateTitle,
      DefaultCollectionCreateView,
      CollectionFormLayout,
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
>(): CollectionListContextValue<TFieldsValue> => {
  const value = useContext(CollectionCreateContext)
  if (!value)
    throw new Error('"useCollectionCreate" must be used within a "CollectionCreateProvider"')

  return value as unknown as CollectionListContextValue<TFieldsValue>
}
