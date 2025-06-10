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
import type { Context, ContextToRequestContext } from './context'
import {
  appendFieldNameToFields,
  type GetPrimaryColumn,
  getPrimaryColumn,
  getPrimaryColumnTsName,
} from './utils'

export type OptionCallback<TType extends string | number, in TContext extends Context = Context> = (
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
  placeholder?: string
  isRequired?: boolean
  update?: FieldMutateMode
  create?: FieldMutateMode
  description?: string
}

export interface FieldColumnStringCollectionOptions<TContext extends Context = Context> {
  text: {
    type: 'text'
    default?: string
    label?: string
    placeholder?: string
    // editor?: Editor // TODO: Support rich text editor
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
    mimeTypes: string[]
  } & FieldBase
}

export interface FieldColumnStringArrayCollectionOptions<TContext extends Context = Context> {
  comboboxText: {
    type: 'comboboxText'
    options: OptionCallback<string, TContext>
    label?: string
  } & FieldBase
}

export interface FieldColumnNumberCollectionOptions<TContext extends Context = Context> {
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

export interface FieldColumnNumberArrayCollectionOptions<TContext extends Context = Context> {
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
  TContext extends Context = Context,
  TInputType extends string | number = string | number,
> = {
  connect: {
    type: 'connect'
    fields: FieldsInitial<TContext>
    options: OptionCallback<TInputType, TContext>
  } & FieldBase
  create: {
    type: 'create'
    fields: FieldsInitial<TContext>
  } & FieldBase
  connectOrCreate: {
    type: 'connectOrCreate'
    fields: FieldsInitial<TContext>
    options: OptionCallback<TInputType, TContext>
  } & FieldBase
}

export type FieldColumnCollection<TContext extends Context = Context> =
  FieldColumnStringCollectionOptions<TContext> &
    FieldColumnStringArrayCollectionOptions<TContext> &
    FieldColumnNumberCollectionOptions<TContext> &
    FieldColumnNumberArrayCollectionOptions<TContext> &
    FieldColumnBooleanCollectionOptions &
    FieldColumnBooleanArrayCollectionOptions &
    FieldColumnDateCollectionOptions

export type FieldColumn<TContext extends Context = Context> =
  FieldColumnCollection<TContext>[keyof FieldColumnCollection<TContext>] & {
    _: FieldMetadataColumns
  }

export type FieldRelationCollection<
  TContext extends Context = Context,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
> = Simplify<
  FieldRelationCollectionOptions<TContext> & {
    connect: {
      fields: Fields<TContext, TFullSchema>
    }
    create: {
      fields: Fields<TContext, TFullSchema>
    }
    connectOrCreate: {
      fields: Fields<TContext, TFullSchema>
    }
  }
>

export type FieldRelation<
  TContext extends Context = Context,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
> = FieldRelationCollection<TContext, TFullSchema>[keyof FieldRelationCollection<TContext>] & {
  _: FieldMetadataRelations
  mode: 'one' | 'many'
}

export type FieldCollection<TContext extends Context = Context> = FieldColumnCollection<TContext> &
  FieldRelationCollection<TContext>

export type FieldOptions<TContext extends Context = Context> =
  FieldCollection<TContext>[keyof FieldCollection<TContext>]

export type Field<
  TContext extends Context = Context,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
> = FieldColumn<TContext> | FieldRelation<TContext, TFullSchema>

export type FieldsInitial<
  TContext extends Context = Context,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
> = Record<string, Field<TContext, TFullSchema>>

export type Fields<
  TContext extends Context = Context,
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TFields extends FieldsInitial<TContext, TFullSchema> = FieldsInitial<TContext, TFullSchema>,
> = FieldsWithFieldName<TFields>

export type FieldClient = Omit<Field, 'options'>

export type FieldsClientInitial = Record<string, FieldClient>

export type FieldsClient<TFields extends FieldsClientInitial = FieldsClientInitial> =
  FieldsWithFieldName<TFields>

export type FieldColumnOptionsFromTable<
  TColumn extends Column<any>,
  TContext extends Context = Context,
> = TColumn['_']['dataType'] extends 'string'
  ? FieldColumnStringCollectionOptions<TContext>[keyof FieldColumnStringCollectionOptions<TContext>]
  : TColumn['_']['dataType'] extends 'number'
    ? FieldColumnNumberCollectionOptions<TContext>[keyof FieldColumnNumberCollectionOptions<TContext>]
    : TColumn['_']['dataType'] extends 'boolean'
      ? FieldColumnBooleanCollectionOptions[keyof FieldColumnBooleanCollectionOptions]
      : TColumn['_']['dataType'] extends 'date'
        ? FieldColumnDateCollectionOptions[keyof FieldColumnDateCollectionOptions]
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
  TContext extends Context = Context,
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
  TContext extends Context = Context,
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
        (Result extends FieldRelationCollection<TContext, TFullSchema>['connectOrCreate' | 'create']
          ? { fields: FieldsWithFieldName<Result['fields']> }
          : {})
    >
  }

  fields<TFields extends FieldsInitial<TContext, TFullSchema>>(
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
  TField extends Field<any>,
  TSchema extends z.ZodTypeAny,
> = TField['_'] extends { source: 'column' }
  ? TField['_']['column']['notNull'] extends true
    ? ZodOptional<TSchema>
    : TSchema
  : TSchema

type FieldToZodScheama<TField extends Field<any>> =
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

export function fieldToZodScheama<TField extends Field<any>>(
  field: TField
): FieldToZodScheama<TField> {
  // TODO: More options
  switch (field.type) {
    // string input
    case 'text':
    case 'selectText':
    case 'time':
    case 'media':
      if (!field._.column.notNull) {
        return z.string().optional() as FieldToZodScheama<TField>
      }
      return z.string() as FieldToZodScheama<TField>
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

type FieldsToZodObject<TFields extends Fields<any>> = ZodObject<{
  [TKey in keyof TFields]: TFields[TKey] extends Field<any> ? z.ZodTypeAny : never
}>

export function fieldsToZodObject<TFields extends Fields<any>>(
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
