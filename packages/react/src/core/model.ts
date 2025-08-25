import type { JsonValue } from 'type-fest'

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

export type InferDataType<T extends DataType> = T extends typeof DataType.STRING
  ? string
  : T extends typeof DataType.INT
    ? number
    : T extends typeof DataType.FLOAT
      ? number
      : T extends typeof DataType.BOOLEAN
        ? boolean
        : T extends typeof DataType.DATETIME
          ? Date
          : T extends typeof DataType.JSON
            ? JsonValue
            : T extends typeof DataType.BYTES
              ? Uint8Array
              : T extends typeof DataType.BIGINT
                ? bigint
                : T extends typeof DataType.DECIMAL
                  ? string
                  : never

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
  isId?: boolean
  isList?: boolean
  isUnique?: boolean
  isRequired?: boolean
  isReadOnly?: boolean
  hasDefaultValue?: boolean
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
  relationDataTypes: DataType[]
}

export interface FieldRelationSchema extends Omit<SanitizedFieldRelationSchema, 'referencedModel'> {
  referencedModel: ModelSchema<ModelShape, ModelConfig>
}

export interface AnyFieldRelationSchema
  extends Omit<SanitizedFieldRelationSchema, 'referencedModel'> {
  referencedModel: ModelSchema<any, ModelConfig>
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

export interface AnyModelShape extends ModelShapeBase {
  columns: Record<string, FieldColumnSchema>
  relations: Record<string, AnyFieldRelationSchema>
}

export interface SanitizedModelSchema<
  TShape extends SanitizedModelShape = SanitizedModelShape,
  TConfig extends ModelConfig = ModelConfig,
> {
  shape: TShape
  config: TConfig
}

export interface SanitizedModelSchemas extends Record<string, SanitizedModelSchema> {}

export interface ModelSchema<
  TShape extends ModelShape = AnyModelShape,
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
    referencedModel: field.referencedModel.config.prismaModelName,
  }
}

export function unsanitizedModelSchemas<TModelSchemas extends ModelSchemas>(
  schemas: SanitizedModelSchemas
): TModelSchemas {
  const result: ModelSchemas = Object.fromEntries(
    Object.entries(schemas).map(([name, schema]) => {
      const relations = Object.fromEntries(
        Object.entries(schema.shape.relations).map(([key, value]) => {
          const _value = { ...value }
          Object.defineProperty(_value, 'referencedModel', {
            get() {
              return schemas[schema.shape.relations[key].referencedModel]
            },
          })
          return [key, _value as unknown as FieldRelationSchema]
        })
      )
      return [name, { ...schema, shape: { ...schema.shape, relations } }]
    })
  )
  return result as TModelSchemas
}

export type Simplify<T> = {
  [K in keyof T]: T[K]
} & {}
