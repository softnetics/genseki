import type { ReactNode } from 'react'

export interface AutoFieldInputClientData {
  type: 'input'
  name: string
  label?: string
  description?: string
  placeholder?: string
  input: ReactNode
}

export interface AutoFieldRelationConnectClientData {
  type: 'relation'
  mode: 'connect'
  name: string
  selectInput: ReactNode
}

export interface AutoFieldRelationCreateClientData {
  type: 'relation'
  mode: 'create'
  name: string
  inputFields: AutoFieldClientData[]
}

export interface AutoFieldRelationConnectOrCreateClientData {
  type: 'relation'
  mode: 'connectOrCreate'
  name: string
  selectInput: ReactNode
  inputFields: AutoFieldClientData[]
}

export type AutoFieldRelationClientData =
  | AutoFieldRelationConnectClientData
  | AutoFieldRelationCreateClientData
  | AutoFieldRelationConnectOrCreateClientData

export type AutoFieldClientData = AutoFieldInputClientData | AutoFieldRelationClientData
