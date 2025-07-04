export const DataType = {
  INTEGER: 'INTEGER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  JSON: 'JSON',
} as const
export type DataType = (typeof DataType)[keyof typeof DataType]

export const Dialect = {
  POSTGRES: 'POSTGRES',
  MYSQL: 'MYSQL',
  SQLITE: 'SQLITE',
} as const
export type Dialect = (typeof Dialect)[keyof typeof Dialect]

export const Relationship = {
  ONE_TO_ONE: 'ONE_TO_ONE',
  ONE_TO_MANY: 'ONE_TO_MANY',
  MANY_TO_ONE: 'MANY_TO_ONE',
  MANY_TO_MANY: 'MANY_TO_MANY',
} as const
export type Relationship = (typeof Relationship)[keyof typeof Relationship]

export const SchemaType = {
  COLUMN: 'COLUMN',
  RELATION: 'RELATION',
} as const
export type SchemaType = (typeof SchemaType)[keyof typeof SchemaType]

// enum
export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
} as const
export type Role = (typeof Role)[keyof typeof Role]

interface ColumnConfig {
  dataType: DataType
  dialect: Dialect
  isPrimary?: boolean
  isUnique?: boolean
  isNullable?: boolean
  hasDefault?: boolean
  enumValues?: string[]
}
interface ColumnSchema extends ColumnConfig {
  type: typeof SchemaType.COLUMN
}

export interface SanitizedRelationConfig {
  relationship: Relationship
  relatedTo: string // name of the related model
  isNullable?: boolean
  relationshipName?: string
}

export interface SanitizedRelationSchema extends SanitizedRelationConfig {
  type: typeof SchemaType.RELATION
}

interface ModelConfig {
  name: string
  dbModelName: string
  prismaModelName: string
}

interface SanitizedModelShape extends Record<string, ColumnSchema | SanitizedRelationSchema> {}

export interface SanitizedModel<out TShape extends SanitizedModelShape = SanitizedModelShape> {
  config: ModelConfig
  shape: TShape
}

export interface RelationConfig {
  relationship: Relationship
  relatedTo: Model
  isNullable?: boolean
  relationshipName?: string
}

export interface RelationSchema extends RelationConfig {
  type: typeof SchemaType.RELATION
}

interface ModelShape extends Record<string, ColumnSchema | RelationSchema> {}

export interface Model<out TShape extends ModelShape = ModelShape> {
  config: ModelConfig
  shape: TShape
}

export function model<const TShape extends SanitizedModelShape, const TConfig extends ModelConfig>(
  shape: TShape,
  config: TConfig
): SanitizedModel<TShape> {
  return { config, shape }
}
