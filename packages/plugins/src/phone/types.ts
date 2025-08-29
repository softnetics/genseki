import type { ZodObject, ZodOptional, ZodType } from 'zod'

import type {
  AnyAccountTable,
  AnySessionTable,
  AnyTable,
  AnyTypedFieldColumn,
  AnyUserTable as BaseAnyUserTable,
  AnyVerificationTable,
  DataType,
} from '@genseki/react'

export type ToZodObject<T extends Record<string, any>> = ZodObject<{
  [Key in keyof T]-?: T[Key] extends undefined
    ? ZodOptional<ZodType<NonNullable<T[Key]>>>
    : ZodType<T[Key]>
}>

export type BaseSignUpBody = {
  name: string
  phone: string
  password: string
  email?: string
}

export type BaseSignUpBodySchema = ToZodObject<BaseSignUpBody>

type AnyUserTable = AnyTable<{
  columns: {
    phone: AnyTypedFieldColumn<typeof DataType.STRING>
    phoneVerified: AnyTypedFieldColumn<typeof DataType.BOOLEAN>
  }
  relations: {}
  uniqueFields: any
  primaryFields: any
}> &
  BaseAnyUserTable

export type AnyPluginSchema = {
  user: any
  session: any
  account: any
  verification: any
}

export interface PluginSchema {
  user: AnyUserTable
  session: AnySessionTable
  account: AnyAccountTable
  verification: AnyVerificationTable
}
