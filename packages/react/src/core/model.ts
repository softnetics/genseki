export const DataType = {
  STRING: 'STRING',
  INT: 'INT',
  FLOAT: 'FLOAT',
  BOOLEAN: 'BOOLEAN',
  DATETIME: 'DATETIME',
  JSON: 'JSON',
  BYTES: 'BYTES',
  BIGINT: 'BIGINT',
  DECIMAL: 'DECIMAL',
} as const

export type DataType = (typeof DataType)[keyof typeof DataType]

export const SchemaType = {
  COLUMN: 'COLUMN',
  RELATION: 'RELATION',
} as const

export type SchemaType = (typeof SchemaType)[keyof typeof SchemaType]

export interface ModelConfig {
  name: string
  dbModelName: string
  prismaModelName: string
}

export interface FieldBaseSchema {
  schema: SchemaType
  name: string
  isId: boolean
  isList: boolean
  isUnique: boolean
  isRequired: boolean
  isReadOnly: boolean
  hasDefaultValue: boolean
}

export interface SanitizedFieldColumnSchema extends FieldBaseSchema {
  schema: typeof SchemaType.COLUMN
  dataType: DataType
  enumValues?: string[]
}
export interface FieldColumnSchema extends SanitizedFieldColumnSchema {}

export interface SanitizedFieldRelationSchema extends FieldBaseSchema {
  schema: typeof SchemaType.RELATION
  relationName: string
  referencedModel: string

  relationToFields: string[]
  relationFromFields: string[]
  relationDataTypes: string[]
}

export interface FieldRelationSchema extends Omit<SanitizedFieldRelationSchema, 'referencedModel'> {
  referencedModel: ModelSchema<ModelShape, ModelConfig>
}

export interface ModelShapeBase {
  primaryFields: string[]
  uniqueFields: string[][]
}

export interface SanitizedModelShape extends ModelShapeBase {
  columns: Record<string, SanitizedFieldColumnSchema>
  relations: Record<string, SanitizedFieldRelationSchema>
}

export interface ModelShape extends ModelShapeBase {
  columns: Record<string, FieldColumnSchema>
  relations: Record<string, FieldRelationSchema>
}

export interface SanitizedModelSchema<
  TShape extends SanitizedModelShape,
  TConfig extends ModelConfig,
> {
  shape: TShape
  config: TConfig
}

export interface SanitizedModelSchemas extends Record<string, SanitizedModelSchema<any, any>> {}

export interface ModelSchema<
  TShape extends ModelShape = ModelShape,
  TConfig extends ModelConfig = ModelConfig,
> {
  shape: TShape
  config: TConfig
}

export interface ModelSchemas extends Record<string, ModelSchema> {}

type SanitizeFieldRelationSchema<T extends FieldRelationSchema> = Omit<
  SanitizedFieldRelationSchema,
  'referencedModel'
> & {
  referencedModel: T['referencedModel']['config']['name']
}

export function sanitizedFieldRelationSchema<T extends FieldRelationSchema>(
  field: T
): SanitizeFieldRelationSchema<T> {
  return {
    ...field,
    referencedModel: field.referencedModel.config.name,
  }
}

export type Simplify<T> = {
  [K in keyof T]: T[K]
} & {}
