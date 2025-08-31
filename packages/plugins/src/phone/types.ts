import type {
  AnyAccountTable,
  AnySessionTable,
  AnyTable,
  AnyTypedFieldColumn,
  AnyUserTable as BaseAnyUserTable,
  AnyVerificationTable,
  DataType,
  ToZodObject,
} from '@genseki/react'

export interface BaseSignUpBody {
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

export interface PluginSchema {
  user: AnyUserTable
  session: AnySessionTable
  account: AnyAccountTable
  verification: AnyVerificationTable
}
