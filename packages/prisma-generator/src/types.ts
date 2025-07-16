/**
 * Creates a sanitized model with the given shape and config.
 * @param {TShape} shape The shape of the model
 * @param {TConfig} config The configuration of the model
 * @returns {SanitizedModel<TShape>} A sanitized model containing the shape and config
 */
export function model<const TShape extends SanitizedModelShape, const TConfig extends ModelConfig>(
  shape: TShape,
  config: TConfig
): SanitizedModel<TShape, TConfig> {
  return { config, shape }
}

export const DataType = {
  STRING: 'STRING',
  INT: 'INT',
  FLOAT: 'FLOAT',
  BOOLEAN: 'BOOLEAN',
  DATETIME: 'DATETIME',
  JSON: 'JSON',
  BYTES: 'BYTES',
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

  primaryFields: string[]
  uniqueFields: string[][]
}

export interface SanitizedFieldSchemaBase {
  schema: SchemaType
  name: string
  isId: boolean
  isList: boolean
  isUnique: boolean
  isRequired: boolean
  isReadOnly: boolean
  hasDefaultValue: boolean
}

export interface SanitizedFieldSchemaColumn extends SanitizedFieldSchemaBase {
  schema: typeof SchemaType.COLUMN
  dataType: DataType
  enumValues?: string[]
}

export interface SanitizedFieldSchemaRelation extends SanitizedFieldSchemaBase {
  schema: typeof SchemaType.RELATION
  relationName: string
  referencedModel: string
  relationToFields: string[]
  relationFromFields: string[]
}

export interface SanitizedModelShape
  extends Record<string, SanitizedFieldSchemaRelation | SanitizedFieldSchemaColumn> {}

export interface SanitizedModel<TShape extends SanitizedModelShape, TConfig extends ModelConfig> {
  shape: TShape
  config: TConfig
}

export type Simplify<T> = {
  [K in keyof T]: T[K]
} & {}
