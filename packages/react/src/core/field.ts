import type { Column, Relation } from 'drizzle-orm'
import {
  type FindTableByDBName,
  getTableName,
  is,
  One,
  type TableRelationalConfig,
} from 'drizzle-orm'
import type { Simplify } from 'type-fest'
import type { ZodObject, ZodOptional } from 'zod/v4'
import z from 'zod/v4'

import { ApiDefaultMethod, type MaybePromise } from './collection'
import type { AnyContext, Context, ContextToRequestContext } from './context'
import type { ServerConfigEditorProviderProps } from './richtext/types'
import {
  appendFieldNameToFields,
  type GetPrimaryColumn,
  getPrimaryColumn,
  getPrimaryColumnTsName,
} from './utils'

import type { FileUploadOptionsProps } from '../react/components/compound/file-upload-field'

export type OptionCallback<TType extends string | number, in TContext extends AnyContext> = (
  args: ContextToRequestContext<TContext>
) => MaybePromise<Array<{ label: string; value: TType }>>

export type FieldsWithFieldName<TFields extends Record<string, FieldBase>> = {
  [TKey in keyof TFields]: TFields[TKey] & { fieldName: string }
}

export interface FieldMetadataColumns {
  source: 'column'
  columnTsName: string
  column: Column
}

export interface FieldMetadataRelations {
  source: 'relation'
  relation: Relation
  relationTsName: string
  referencedTableTsName: string
  sourceTableTsName: string
  primaryColumn: Column
  primaryColumnTsName: string
}

export type FieldMetadata = FieldMetadataColumns | FieldMetadataRelations

export const FieldMutateModeCollection = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
} as const
export type FieldMutateModeCollection = typeof FieldMutateModeCollection
export type FieldMutateMode =
  (typeof FieldMutateModeCollection)[keyof typeof FieldMutateModeCollection]

export type FieldBase = {
  label?: string
  description?: string
  placeholder?: string
  isRequired?: boolean
  update?: FieldMutateMode
  create?: FieldMutateMode
}

export interface FieldColumnJsonCollectionOptions<in TContext extends AnyContext = AnyContext> {
  richText: {
    type: 'richText'
    default?: string
    editor: ServerConfigEditorProviderProps
  } & FieldBase
}

export interface FieldColumnStringCollectionOptions<in TContext extends AnyContext = AnyContext> {
  text: {
    type: 'text'
    default?: string
  } & FieldBase
  password: {
    type: 'password'
    default?: string
  } & FieldBase
  email: {
    type: 'email'
    default?: string
  } & FieldBase
  selectText: {
    type: 'selectText'
    options: OptionCallback<string, TContext>
    default?: string
  } & FieldBase
  time: {
    type: 'time'
    default?: Date
  } & FieldBase
  date: {
    type: 'date'
    default?: Date
  } & FieldBase
  media: {
    type: 'media'
    uploadOptions?: FileUploadOptionsProps
  } & FieldBase
}

export interface FieldColumnStringArrayCollectionOptions<
  in TContext extends AnyContext = AnyContext,
> {
  comboboxText: {
    type: 'comboboxText'
    options: OptionCallback<string, TContext>
    label?: string
  } & FieldBase
}

export interface FieldColumnNumberCollectionOptions<TContext extends AnyContext = AnyContext> {
  number: {
    type: 'number'
    default?: number
  } & FieldBase
  selectNumber: {
    type: 'selectNumber'
    options: OptionCallback<number, TContext>
    default?: number
  } & FieldBase
}

export interface FieldColumnNumberArrayCollectionOptions<TContext extends AnyContext = AnyContext> {
  comboboxNumber: {
    type: 'comboboxNumber'
    options: OptionCallback<number, TContext>
    label?: string
  } & FieldBase
}

export interface FieldColumnBooleanCollectionOptions {
  checkbox: {
    type: 'checkbox'
    default?: boolean
  } & FieldBase
  switch: {
    type: 'switch'
    default?: boolean
  } & FieldBase
}

export interface FieldColumnBooleanArrayCollectionOptions {
  comboboxBoolean: {
    type: 'comboboxBoolean'
    default?: boolean[]
  } & FieldBase
}

export interface FieldColumnDateCollectionOptions {
  date: {
    type: 'date'
    default?: Date
  } & FieldBase
}

export type FieldRelationCollectionOptions<
  TContext extends AnyContext = AnyContext,
  TInputType extends string | number = string | number,
> = {
  connect: {
    type: 'connect'
    fields: FieldsInitial<any, TContext>
    options: OptionCallback<TInputType, TContext>
  } & FieldBase
  create: {
    type: 'create'
    fields: FieldsInitial<any, TContext>
  } & FieldBase
  connectOrCreate: {
    type: 'connectOrCreate'
    fields: FieldsInitial<any, TContext>
    options: OptionCallback<TInputType, TContext>
  } & FieldBase
}

export type FieldColumnCollection<TContext extends Context = Context> =
  FieldColumnJsonCollectionOptions<TContext> &
    FieldColumnStringCollectionOptions<TContext> &
    FieldColumnStringArrayCollectionOptions<TContext> &
    FieldColumnNumberCollectionOptions<TContext> &
    FieldColumnNumberArrayCollectionOptions<TContext> &
    FieldColumnBooleanCollectionOptions &
    FieldColumnBooleanArrayCollectionOptions &
    FieldColumnDateCollectionOptions

export type FieldColumn<TContext extends AnyContext> =
  FieldColumnCollection<TContext>[keyof FieldColumnCollection<TContext>] & {
    _: FieldMetadataColumns
  }

export type FieldRelationCollection<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Context<TFullSchema> = Context<TFullSchema>,
> = Simplify<
  FieldRelationCollectionOptions<TContext> & {
    connect: {
      fields: Fields<TFullSchema, TContext>
    }
    create: {
      fields: Fields<TFullSchema, TContext>
    }
    connectOrCreate: {
      fields: Fields<TFullSchema, TContext>
    }
  }
>

export type FieldRelation<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Context<TFullSchema> = Context<TFullSchema>,
> = FieldRelationCollection<TFullSchema, TContext>[keyof FieldRelationCollection<any, TContext>] & {
  _: FieldMetadataRelations
  mode: 'one' | 'many'
}

export type FieldCollection<TContext extends AnyContext> = FieldColumnCollection<TContext> &
  FieldRelationCollection<any, TContext>

export type FieldOptions<TContext extends AnyContext> =
  FieldCollection<TContext>[keyof FieldCollection<TContext>]

export type Field<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Context<TFullSchema> = Context<TFullSchema>,
> = FieldColumn<TContext> | FieldRelation<TFullSchema, TContext>

export type AnyField = Field<any, AnyContext>

export type FieldsInitial<
  TFullSchema extends Record<string, unknown>,
  TContext extends Context<TFullSchema>,
> = Record<string, Field<TFullSchema, TContext>>

export type AnyFieldsInitial = FieldsInitial<any, AnyContext>

export type Fields<
  TFullSchema extends Record<string, unknown>,
  TContext extends Context<TFullSchema>,
  TFields extends FieldsInitial<TFullSchema, TContext> = FieldsInitial<TFullSchema, TContext>,
> = FieldsWithFieldName<TFields>

export type AnyFields = Fields<any, AnyContext, any>

export type FieldClient = Omit<AnyField, 'options'>

export type FieldsClientInitial = Record<string, FieldClient>

export type FieldsClient<TFields extends FieldsClientInitial = FieldsClientInitial> =
  FieldsWithFieldName<TFields>

export type FieldColumnOptionsFromTable<
  TColumn extends Column<any>,
  TContext extends AnyContext = AnyContext,
> = TColumn['_']['dataType'] extends 'string'
  ? FieldColumnStringCollectionOptions<TContext>[keyof FieldColumnStringCollectionOptions<TContext>]
  : TColumn['_']['dataType'] extends 'number'
    ? FieldColumnNumberCollectionOptions<TContext>[keyof FieldColumnNumberCollectionOptions<TContext>]
    : TColumn['_']['dataType'] extends 'boolean'
      ? FieldColumnBooleanCollectionOptions[keyof FieldColumnBooleanCollectionOptions]
      : TColumn['_']['dataType'] extends 'date'
        ? FieldColumnDateCollectionOptions[keyof FieldColumnDateCollectionOptions]
        : TColumn['_']['dataType'] extends 'json'
          ? FieldColumnJsonCollectionOptions<TContext>[keyof FieldColumnJsonCollectionOptions<TContext>]
          : TColumn['_']['dataType'] extends 'array'
            ? TColumn['_']['data'] extends string[]
              ? FieldColumnStringArrayCollectionOptions<TContext>[keyof FieldColumnStringArrayCollectionOptions<TContext>]
              : TColumn['_']['data'] extends number[]
                ? FieldColumnNumberArrayCollectionOptions<TContext>[keyof FieldColumnNumberArrayCollectionOptions<TContext>]
                : TColumn['_']['data'] extends boolean[]
                  ? FieldColumnBooleanArrayCollectionOptions[keyof FieldColumnBooleanArrayCollectionOptions]
                  : never
            : never

type RelationFieldOptionsFromTable<
  TRelationPrimaryColumn extends Column,
  TContext extends AnyContext = AnyContext,
> = TRelationPrimaryColumn['_']['data'] extends infer TType extends string | number
  ? FieldRelationCollectionOptions<TContext, TType>['connect' | 'create' | 'connectOrCreate']
  : TRelationPrimaryColumn

type GetReferencedPrimaryColumn<
  TTableRelationConfigByTableTsName extends Record<string, TableRelationalConfig>,
  TRelation extends Relation,
> =
  FindTableByDBName<
    TTableRelationConfigByTableTsName,
    TRelation['referencedTableName']
  > extends infer TReferencedTableRelationalConfig extends TableRelationalConfig
    ? GetPrimaryColumn<TReferencedTableRelationalConfig>
    : never

type GetReferencedTableTsName<
  TTableRelationConfigByTableTsName extends Record<string, TableRelationalConfig>,
  TRelation extends Relation,
> =
  FindTableByDBName<
    TTableRelationConfigByTableTsName,
    TRelation['referencedTableName']
  > extends infer TReferencedTableRelationalConfig extends TableRelationalConfig
    ? TReferencedTableRelationalConfig['tsName']
    : never

type GetRelationMode<TRelation extends Relation> = TRelation extends One ? 'one' : 'many'

export class FieldBuilder<
  TFullSchema extends Record<string, unknown>,
  TTableRelationConfigByTableTsName extends Record<string, TableRelationalConfig>,
  TTableTsName extends string,
  TContext extends Context<TFullSchema>,
> {
  private readonly tableRelationalConfig: TTableRelationConfigByTableTsName[TTableTsName]

  constructor(
    tableTsName: TTableTsName,
    private readonly tableRelationalConfigByTableTsName: TTableRelationConfigByTableTsName
  ) {
    this.tableRelationalConfig = tableRelationalConfigByTableTsName[
      tableTsName
    ] as TTableRelationConfigByTableTsName[TTableTsName]

    if (this.tableRelationalConfig === undefined) {
      throw new Error(
        `Table ${tableTsName} not found in schema. Available tables: ${Object.keys(
          tableRelationalConfigByTableTsName
        ).join(', ')}`
      )
    }
  }

  columns<
    TColumnTsName extends Extract<
      keyof TTableRelationConfigByTableTsName[TTableTsName]['columns'],
      string
    >,
    const TOptions extends FieldColumnOptionsFromTable<
      TTableRelationConfigByTableTsName[TTableTsName]['columns'][TColumnTsName],
      TContext
    >,
  >(columnTsName: TColumnTsName, options: TOptions) {
    const fieldMetadata = {
      source: 'column',
      columnTsName: columnTsName,
      column: this.tableRelationalConfig['columns'][
        columnTsName
      ] as TTableRelationConfigByTableTsName[TTableTsName]['columns'][TColumnTsName],
    } satisfies FieldMetadata

    return {
      _: fieldMetadata,
      ...options,
    } as Simplify<TOptions & { _: typeof fieldMetadata }>
  }

  relations<
    TRelationTsName extends Extract<
      keyof TTableRelationConfigByTableTsName[TTableTsName]['relations'],
      string
    >,
    const TOptions extends RelationFieldOptionsFromTable<
      GetReferencedPrimaryColumn<
        TTableRelationConfigByTableTsName,
        TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
      >,
      TContext
    >,
  >(
    relationTsName: TRelationTsName,
    optionsFn: (
      fb: FieldBuilder<
        TFullSchema,
        TTableRelationConfigByTableTsName,
        GetReferencedTableTsName<
          TTableRelationConfigByTableTsName,
          TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
        >,
        TContext
      >
    ) => TOptions
  ) {
    const relation = this.tableRelationalConfig['relations'][
      relationTsName
    ] as TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]

    type ReferencedTableRelationalConfig = FindTableByDBName<
      TTableRelationConfigByTableTsName,
      TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]['referencedTableName']
    >

    const referencedTableRelationalConfig = Object.values(
      this.tableRelationalConfigByTableTsName
    ).find((t) => t.dbName === relation.referencedTableName) as
      | ReferencedTableRelationalConfig
      | undefined
    if (!referencedTableRelationalConfig) {
      throw new Error(`Referenced table ${relation.referencedTableName} not found in schema`)
    }

    type SourceTableRelationalConfig = FindTableByDBName<
      TTableRelationConfigByTableTsName,
      TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]['sourceTable']['_']['name']
    >

    const sourceTableRelationalConfig = Object.values(this.tableRelationalConfigByTableTsName).find(
      (t) => t.dbName === getTableName(relation.sourceTable)
    ) as SourceTableRelationalConfig | undefined
    if (!sourceTableRelationalConfig) {
      throw new Error(`Source table ${relation.sourceTable._.name} not found in schema`)
    }

    const primaryColumn = getPrimaryColumn(referencedTableRelationalConfig)
    const primaryColumnTsName = getPrimaryColumnTsName(referencedTableRelationalConfig)

    const fb = new FieldBuilder(
      referencedTableRelationalConfig.tsName,
      this.tableRelationalConfigByTableTsName
    ) as FieldBuilder<
      TFullSchema,
      TTableRelationConfigByTableTsName,
      GetReferencedTableTsName<
        TTableRelationConfigByTableTsName,
        TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
      >,
      TContext
    >

    const options = optionsFn(fb)

    if (options.type === 'connectOrCreate' || options.type === 'create') {
      options.fields = appendFieldNameToFields(options.fields)
    }

    const fieldMetadata = {
      source: 'relation',
      relationTsName: relationTsName,
      referencedTableTsName: referencedTableRelationalConfig.tsName,
      sourceTableTsName: sourceTableRelationalConfig.tsName,
      relation: relation,
      primaryColumn: primaryColumn as GetReferencedPrimaryColumn<
        TTableRelationConfigByTableTsName,
        TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
      >,
      primaryColumnTsName: primaryColumnTsName as string,
    } satisfies FieldMetadata

    const mode = (is(relation, One) ? 'one' : 'many') as GetRelationMode<
      TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
    >

    type Result = TOptions & {
      _: typeof fieldMetadata
      mode: GetRelationMode<
        TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
      >
    }

    return {
      _: fieldMetadata,
      ...options,
      mode,
    } as Simplify<
      Result &
        (Result extends FieldRelationCollection<TFullSchema, TContext>['connectOrCreate' | 'create']
          ? { fields: FieldsWithFieldName<Result['fields']> }
          : {})
    >
  }

  fields<TFields extends FieldsInitial<TFullSchema, TContext>>(
    tableTsName: TTableTsName,
    optionsFn: (
      fb: FieldBuilder<TFullSchema, TTableRelationConfigByTableTsName, TTableTsName, TContext>
    ) => TFields
  ): Simplify<FieldsWithFieldName<TFields>> {
    const fb = new FieldBuilder(tableTsName, this.tableRelationalConfigByTableTsName)
    return appendFieldNameToFields(optionsFn(fb as any))
  }
}

// TODO: Add support for relation input fields
type CastOptionalFieldToZodSchema<
  TField extends AnyField,
  TSchema extends z.ZodTypeAny,
> = TField['_'] extends { source: 'column' }
  ? TField['_']['column']['notNull'] extends true
    ? ZodOptional<TSchema>
    : TSchema
  : TSchema

type FieldToZodScheama<TField extends AnyField> =
  TField extends FieldColumnStringCollectionOptions<any>[keyof FieldColumnStringCollectionOptions<any>]
    ? CastOptionalFieldToZodSchema<TField, z.ZodString>
    : TField extends FieldColumnStringArrayCollectionOptions<any>[keyof FieldColumnStringArrayCollectionOptions<any>]
      ? CastOptionalFieldToZodSchema<TField, z.ZodArray<z.ZodString>>
      : TField extends FieldColumnNumberCollectionOptions<any>[keyof FieldColumnNumberCollectionOptions<any>]
        ? CastOptionalFieldToZodSchema<TField, z.ZodNumber>
        : TField extends FieldColumnNumberArrayCollectionOptions<any>[keyof FieldColumnNumberArrayCollectionOptions<any>]
          ? CastOptionalFieldToZodSchema<TField, z.ZodArray<z.ZodNumber>>
          : TField extends FieldColumnBooleanCollectionOptions[keyof FieldColumnBooleanCollectionOptions]
            ? CastOptionalFieldToZodSchema<TField, z.ZodBoolean>
            : TField extends FieldColumnBooleanArrayCollectionOptions[keyof FieldColumnBooleanArrayCollectionOptions]
              ? CastOptionalFieldToZodSchema<TField, z.ZodArray<z.ZodBoolean>>
              : TField extends FieldColumnDateCollectionOptions[keyof FieldColumnDateCollectionOptions]
                ? CastOptionalFieldToZodSchema<TField, z.ZodISODate>
                : never
// TODO: Relation input
// TODO: Optioanl and default values

export function fieldToZodScheama<TField extends AnyField>(
  field: TField
): FieldToZodScheama<TField> {
  // TODO: More options
  switch (field.type) {
    // Richtext JSON
    case 'richText':
      return z.any() as unknown as FieldToZodScheama<TField>
    // string input
    case 'text':
    case 'selectText':
    case 'time':
    case 'password':
    case 'media':
      if (!field._.column.notNull) {
        return z.string().optional() as FieldToZodScheama<TField>
      }

      return z.string() as FieldToZodScheama<TField>
    case 'email':
      if (!field._.column.notNull) {
        return z.string().email().optional() as FieldToZodScheama<TField>
      }

      return z.string().email() as FieldToZodScheama<TField>
    // string[] input
    case 'comboboxText':
      if (!field._.column.notNull) {
        return z.array(z.string()).optional() as FieldToZodScheama<TField>
      }
      return z.array(z.string()) as FieldToZodScheama<TField>
    // number input
    case 'number':
    case 'selectNumber':
      if (!field._.column.notNull) {
        return z.number().optional() as FieldToZodScheama<TField>
      }
      return z.number() as FieldToZodScheama<TField>
    // number[] input
    case 'comboboxNumber':
      if (!field._.column.notNull) {
        return z.array(z.number()).optional() as FieldToZodScheama<TField>
      }
      return z.array(z.number()) as FieldToZodScheama<TField>
    // boolean input
    case 'checkbox':
    case 'switch':
      if (!field._.column.notNull) {
        return z.boolean().optional() as FieldToZodScheama<TField>
      }
      return z.boolean() as FieldToZodScheama<TField>
    // boolean[] input
    case 'comboboxBoolean':
      if (!field._.column.notNull) {
        return z.array(z.boolean()).optional() as FieldToZodScheama<TField>
      }
      return z.array(z.boolean()) as FieldToZodScheama<TField>
    // date input
    case 'date':
      if (!field._.column.notNull) {
        return z.iso.date().optional() as FieldToZodScheama<TField>
      }
      return z.iso.date() as FieldToZodScheama<TField>
    // TODO: relation input
    case 'connect':
      return z.any() as unknown as FieldToZodScheama<TField>
    case 'create':
      return z.any() as unknown as FieldToZodScheama<TField>
    case 'connectOrCreate':
      return z.any() as unknown as FieldToZodScheama<TField>
    default:
      throw new Error(`Unknown field type: ${(field as any).type}`)
  }
}

type FieldsToZodObject<TFields extends AnyFields> = ZodObject<{
  [TKey in keyof TFields]: TFields[TKey] extends AnyField ? z.ZodTypeAny : never
}>

export function fieldsToZodObject<TFields extends AnyFields>(
  fields: TFields,
  method?: typeof ApiDefaultMethod.CREATE | typeof ApiDefaultMethod.UPDATE
): FieldsToZodObject<TFields> {
  const zodObject = Object.entries(fields).reduce(
    (acc, [key, field]) => {
      if (method) {
        if (
          method === ApiDefaultMethod.UPDATE &&
          field.update !== FieldMutateModeCollection.ENABLED
        ) {
          return acc
        }
        if (
          method === ApiDefaultMethod.CREATE &&
          field.create !== FieldMutateModeCollection.ENABLED
        ) {
          return acc
        }
      }
      acc[key] = fieldToZodScheama(field)
      return acc
    },
    {} as Record<string, z.ZodTypeAny>
  )

  return z.object(zodObject) as FieldsToZodObject<TFields>
}
