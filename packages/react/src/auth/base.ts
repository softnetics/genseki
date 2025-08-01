import type { DataType } from '../core/model'
import type {
  AnyTable,
  AnyTypedFieldColumn,
  WithHasDefaultValue,
  WithIsRequired,
} from '../core/table'

export type AnyUserTable = AnyTable<{
  columns: {
    id: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    name: AnyTypedFieldColumn<typeof DataType.STRING>
    email: AnyTypedFieldColumn<typeof DataType.STRING>
    emailVerified: AnyTypedFieldColumn<typeof DataType.BOOLEAN>
    image: AnyTypedFieldColumn<typeof DataType.STRING>
  }
  relations: {}
  primaryFields: ['id']
  uniqueFields: (['id'] | ['email'])[]
}>

export type AnySessionTable = AnyTable<{
  columns: {
    id: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    expiredAt: WithIsRequired<AnyTypedFieldColumn<typeof DataType.DATETIME>>
    token: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    ipAddress: AnyTypedFieldColumn<typeof DataType.STRING>
    userAgent: AnyTypedFieldColumn<typeof DataType.STRING>
    userId: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
  }
  relations: {}
  primaryFields: ['id']
  uniqueFields: any
}>

export type AnyAccountTable = AnyTable<{
  columns: {
    id: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    // Account ID is a unique identifier for the account (e.g., Google ID, Facebook ID, User ID)
    accountId: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    // Provider ID is the identifier for the provider (e.g., google, facebook, credentials)
    provider: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    // User ID is the identifier for the user in the system
    userId: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    idToken: AnyTypedFieldColumn<typeof DataType.STRING>
    accessToken: AnyTypedFieldColumn<typeof DataType.STRING>
    refreshToken: AnyTypedFieldColumn<typeof DataType.STRING>
    accessTokenExpiredAt: AnyTypedFieldColumn<typeof DataType.DATETIME>
    refreshTokenExpiredAt: AnyTypedFieldColumn<typeof DataType.DATETIME>
    scope: AnyTypedFieldColumn<typeof DataType.STRING>
    // Password is used for email and password authentication
    password: AnyTypedFieldColumn<typeof DataType.STRING>
  }
  relations: {}
  primaryFields: ['id']
  uniqueFields: (['id'] | ['userId', 'provider'])[]
}>

export type AnyVerificationTable = AnyTable<{
  columns: {
    id: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>>
    identifier: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    value: AnyTypedFieldColumn<typeof DataType.STRING>
    userId: WithIsRequired<AnyTypedFieldColumn<typeof DataType.STRING>>
    expiredAt: WithIsRequired<AnyTypedFieldColumn<typeof DataType.DATETIME>>
    createdAt: WithHasDefaultValue<WithIsRequired<AnyTypedFieldColumn<typeof DataType.DATETIME>>>
  }
  relations: {}
  primaryFields: ['id']
  uniqueFields: any
}>
