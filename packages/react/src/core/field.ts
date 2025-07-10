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
import type { AnyContextable, ContextToRequestContext } from './context'
import type {
  EditorProviderClientProps,
  ServerConfigEditorProviderProps as EditorProviderProps,
} from './richtext/types'
import {
  appendFieldNameToFields,
  type GetPrimaryColumn,
  getPrimaryColumn,
  getPrimaryColumnTsName,
} from './utils'

import type { FileUploadOptionsProps } from '../react/components/compound/file-upload-field'

export type OptionCallback<TType extends string | number, in TContext extends AnyContextable> = (
  args: ContextToRequestContext<TContext>
) => MaybePromise<Array<{ label: string; value: TType }>>

export type FieldsWithFieldName<TFields extends Record<string, FieldOptionsBase>> = {
  [TKey in keyof TFields]: TFields[TKey] & { $client: { fieldName: string } }
}

export interface FieldColumnClientMetadata {
  source: 'column'
  columnTsName: string
}
export interface FieldColumnMetadata {
  source: 'column'
  column: Column
}

export interface FieldRelationClientMetadata {
  source: 'relation'
  relationTsName: string
  referencedTableTsName: string
  sourceTableTsName: string
  primaryColumnTsName: string
  mode: 'one' | 'many'
}
export interface FieldRelationMetadata {
  source: 'relation'
  relation: Relation
  primaryColumn: Column
}

export const FieldMutateModeCollection = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
} as const
export type FieldMutateModeCollection = typeof FieldMutateModeCollection
export type FieldMutateMode =
  (typeof FieldMutateModeCollection)[keyof typeof FieldMutateModeCollection]

export interface FieldOptionsBase {
  label?: string
  description?: string
  placeholder?: string
  isRequired?: boolean
  update?: FieldMutateMode
  create?: FieldMutateMode
}

export interface FieldColumnClientBase {
  $client: FieldColumnClientMetadata
}
export interface FieldColumnBase extends FieldColumnClientBase {
  $server: FieldColumnMetadata
}
export interface FieldRelationClientBase {
  $client: FieldRelationClientMetadata
}
export interface FieldRelationBase extends FieldRelationClientBase {
  $server: FieldRelationMetadata
}

// JSON field types
export interface FieldColumnJsonRichTextOptions extends FieldOptionsBase {
  type: 'richText'
  default?: string
  editor: EditorProviderProps
}
export interface FieldColumnJsonRichTextClient
  extends Omit<FieldColumnJsonRichTextOptions, 'editor'>,
    FieldColumnClientBase {
  editor: EditorProviderClientProps
}
export interface FieldColumnJsonRichText extends FieldColumnJsonRichTextOptions, FieldColumnBase {}

export type FieldColumnJsonClient = FieldColumnJsonRichTextClient
export type FieldColumnJsonOptions = FieldColumnJsonRichTextOptions
export type FieldColumnJson = FieldColumnJsonRichText

// String field types
export interface FieldColumnStringTextOptions extends FieldOptionsBase {
  type: 'text'
  default?: string
}
export interface FieldColumnStringTextClient
  extends FieldColumnStringTextOptions,
    FieldColumnClientBase {}
export interface FieldColumnStringText extends FieldColumnStringTextOptions, FieldColumnBase {}

export interface FieldColumnStringPasswordOptions extends FieldOptionsBase {
  type: 'password'
  default?: string
}
export interface FieldColumnStringPasswordClient
  extends FieldColumnStringPasswordOptions,
    FieldColumnClientBase {}
export interface FieldColumnStringPassword
  extends FieldColumnStringPasswordOptions,
    FieldColumnBase {}

export interface FieldColumnStringEmailOptions extends FieldOptionsBase {
  type: 'email'
  default?: string
}
export interface FieldColumnStringEmailClient
  extends FieldColumnStringEmailOptions,
    FieldColumnClientBase {}
export interface FieldColumnStringEmail extends FieldColumnStringEmailOptions, FieldColumnBase {}

export interface FieldColumnStringSelectTextOptions<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldOptionsBase {
  type: 'selectText'
  default?: string
  options: OptionCallback<string, TContext>
}
export interface FieldColumnStringSelectTextClient
  extends Omit<FieldColumnStringSelectTextOptions, 'options'>,
    FieldColumnClientBase {}
export interface FieldColumnStringSelectText<in TContext extends AnyContextable = AnyContextable>
  extends FieldColumnStringSelectTextOptions<TContext>,
    FieldColumnBase {}

export interface FieldColumnStringTimeOptions extends FieldOptionsBase {
  type: 'time'
  default?: Date
}
export interface FieldColumnStringTimeClient
  extends FieldColumnStringTimeOptions,
    FieldColumnClientBase {}
export interface FieldColumnStringTime extends FieldColumnStringTimeOptions, FieldColumnBase {}

export interface FieldColumnStringDateOptions extends FieldOptionsBase {
  type: 'date'
  default?: Date
}
export interface FieldColumnStringDateClient
  extends FieldColumnStringDateOptions,
    FieldColumnClientBase {}
export interface FieldColumnStringDate extends FieldColumnStringDateOptions, FieldColumnBase {}

export interface FieldColumnStringMediaOptions extends FieldOptionsBase {
  type: 'media'
  uploadOptions?: FileUploadOptionsProps
}
export interface FieldColumnStringMediaClient
  extends FieldColumnStringMediaOptions,
    FieldColumnClientBase {}
export interface FieldColumnStringMedia extends FieldColumnStringMediaOptions, FieldColumnBase {}

export type FieldColumnStringOptions<TContext extends AnyContextable> =
  | FieldColumnStringTextOptions
  | FieldColumnStringPasswordOptions
  | FieldColumnStringEmailOptions
  | FieldColumnStringSelectTextOptions<TContext>
  | FieldColumnStringTimeOptions
  | FieldColumnStringDateOptions
  | FieldColumnStringMediaOptions
export type FieldColumnStringClient =
  | FieldColumnStringTextClient
  | FieldColumnStringPasswordClient
  | FieldColumnStringEmailClient
  | FieldColumnStringSelectTextClient
  | FieldColumnStringTimeClient
  | FieldColumnStringDateClient
  | FieldColumnStringMediaClient
export type FieldColumnString<TContext extends AnyContextable> =
  | FieldColumnStringText
  | FieldColumnStringPassword
  | FieldColumnStringEmail
  | FieldColumnStringSelectText<TContext>
  | FieldColumnStringTime
  | FieldColumnStringDate
  | FieldColumnStringMedia

export interface FieldColumnStringArrayComboboxTextOptions<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldOptionsBase {
  type: 'comboboxText'
  label?: string
  options: OptionCallback<string, TContext>
}
export interface FieldColumnStringArrayComboboxTextClient
  extends Omit<FieldColumnStringArrayComboboxTextOptions, 'options'>,
    FieldColumnClientBase {}
export interface FieldColumnStringArrayComboboxText<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldColumnStringArrayComboboxTextOptions<TContext>,
    FieldColumnBase {}

export type FieldColumnStringArrayOptions<TContext extends AnyContextable> =
  FieldColumnStringArrayComboboxTextOptions<TContext>
export type FieldColumnStringArrayClient = FieldColumnStringArrayComboboxTextClient
export type FieldColumnStringArray<TContext extends AnyContextable> =
  FieldColumnStringArrayComboboxText<TContext>

// Number field types
export interface FieldColumnNumberNumberOptions extends FieldOptionsBase {
  type: 'number'
  default?: number
}
export interface FieldColumnNumberNumberClient
  extends FieldColumnNumberNumberOptions,
    FieldColumnClientBase {}
export interface FieldColumnNumberNumber extends FieldColumnNumberNumberOptions, FieldColumnBase {}
export interface FieldColumnNumberSelectNumberOptions<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldOptionsBase {
  type: 'selectNumber'
  default?: number
  options: OptionCallback<number, TContext>
}
export interface FieldColumnNumberSelectNumberClient
  extends Omit<FieldColumnNumberSelectNumberOptions, 'options'>,
    FieldColumnClientBase {}
export interface FieldColumnNumberSelectNumber<in TContext extends AnyContextable = AnyContextable>
  extends FieldColumnNumberSelectNumberOptions<TContext>,
    FieldColumnBase {}

export type FieldColumnNumberOptions<TContext extends AnyContextable> =
  | FieldColumnNumberNumberOptions
  | FieldColumnNumberSelectNumberOptions<TContext>
export type FieldColumnNumberClient =
  | FieldColumnNumberNumberClient
  | FieldColumnNumberSelectNumberClient
export type FieldColumnNumber<TContext extends AnyContextable> =
  | FieldColumnNumberNumber
  | FieldColumnNumberSelectNumber<TContext>

// Number array field types
export interface FieldColumnNumberArrayComboboxNumberOptions<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldOptionsBase {
  type: 'comboboxNumber'
  label?: string
  options: OptionCallback<number, TContext>
}
export interface FieldColumnNumberArrayComboboxNumberClient
  extends Omit<FieldColumnNumberArrayComboboxNumberOptions, 'options'>,
    FieldColumnClientBase {}
export interface FieldColumnNumberArrayComboboxNumber<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldColumnNumberArrayComboboxNumberOptions<TContext>,
    FieldColumnBase {}

export type FieldColumnNumberArrayOptions<TContext extends AnyContextable> =
  FieldColumnNumberArrayComboboxNumberOptions<TContext>
export type FieldColumnNumberArrayClient = FieldColumnNumberArrayComboboxNumberClient
export type FieldColumnNumberArray<TContext extends AnyContextable> =
  FieldColumnNumberArrayComboboxNumber<TContext>

// Boolean field types
export interface FieldColumnBooleanCheckboxOptions extends FieldOptionsBase {
  type: 'checkbox'
  default?: boolean
}
export interface FieldColumnBooleanCheckboxClient
  extends FieldColumnBooleanCheckboxOptions,
    FieldColumnClientBase {}
export interface FieldColumnBooleanCheckbox
  extends FieldColumnBooleanCheckboxOptions,
    FieldColumnBase {}
export interface FieldColumnBooleanSwitchOptions extends FieldOptionsBase {
  type: 'switch'
  default?: boolean
}
export interface FieldColumnBooleanSwitchClient
  extends FieldColumnBooleanSwitchOptions,
    FieldColumnClientBase {}
export interface FieldColumnBooleanSwitch
  extends FieldColumnBooleanSwitchOptions,
    FieldColumnBase {}

export type FieldColumnBooleanOptions =
  | FieldColumnBooleanCheckboxOptions
  | FieldColumnBooleanSwitchOptions
export type FieldColumnBooleanClient =
  | FieldColumnBooleanCheckboxClient
  | FieldColumnBooleanSwitchClient
export type FieldColumnBoolean = FieldColumnBooleanCheckbox | FieldColumnBooleanSwitch

// Date field types
export interface FieldColumnDataDateOptions extends FieldOptionsBase {
  type: 'date'
  default?: Date
}
export interface FieldColumnDataDateClient
  extends FieldColumnDataDateOptions,
    FieldColumnClientBase {}
export interface FieldColumnDataDate extends FieldColumnDataDateOptions, FieldColumnBase {}

export type FieldColumnDateOptions = FieldColumnDataDateOptions
export type FieldColumnDateClient = FieldColumnDataDateClient
export type FieldColumnDate = FieldColumnDataDate

// All field columns types
export type FieldColumnOptions<TContext extends AnyContextable> =
  | FieldColumnJsonOptions
  | FieldColumnStringOptions<TContext>
  | FieldColumnStringArrayOptions<TContext>
  | FieldColumnNumberOptions<TContext>
  | FieldColumnNumberArrayOptions<TContext>
  | FieldColumnBooleanOptions
  | FieldColumnDateOptions
export type FieldColumnClient =
  | FieldColumnJsonClient
  | FieldColumnStringClient
  | FieldColumnStringArrayClient
  | FieldColumnNumberClient
  | FieldColumnNumberArrayClient
  | FieldColumnBooleanClient
  | FieldColumnDateClient
export type FieldColumn<TContext extends AnyContextable> =
  | FieldColumnJson
  | FieldColumnString<TContext>
  | FieldColumnStringArray<TContext>
  | FieldColumnNumber<TContext>
  | FieldColumnNumberArray<TContext>
  | FieldColumnBoolean
  | FieldColumnDate

// Relation field types
export interface FieldRelationConnectOptions<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldOptionsBase {
  type: 'connect'
  fields: FieldsInitial<TFullSchema, AnyContextable>
  options: OptionCallback<TInputType, TContext>
}
export interface FieldRelationConnectClient<TFullSchema extends Record<string, unknown>>
  extends Omit<FieldRelationConnectOptions<TFullSchema>, 'options'>,
    FieldRelationClientBase {}

export interface FieldRelationConnect<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldRelationConnectOptions<TFullSchema, TContext, TInputType>,
    FieldRelationBase {}

export interface FieldRelationCreateOptions<TFullSchema extends Record<string, unknown>>
  extends FieldOptionsBase {
  type: 'create'
  fields: Fields<TFullSchema, AnyContextable>
}
export interface FieldRelationCreateClient<TFullSchema extends Record<string, unknown>>
  extends FieldRelationCreateOptions<TFullSchema>,
    FieldColumnClientBase {}
export interface FieldRelationCreate<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
> extends FieldRelationCreateOptions<TFullSchema>,
    FieldRelationBase {}

export interface FieldRelationConnectOrCreateOptions<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldOptionsBase {
  type: 'connectOrCreate'
  fields: Fields<TFullSchema, AnyContextable>
  options: OptionCallback<TInputType, TContext>
}
export interface FieldRelationConnectOrCreateClient<TFullSchema extends Record<string, unknown>>
  extends Omit<FieldRelationConnectOrCreateOptions<TFullSchema>, 'options'>,
    FieldRelationClientBase {}
export interface FieldRelationConnectOrCreate<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldRelationConnectOrCreateOptions<TFullSchema, TContext, TInputType>,
    FieldRelationBase {}

export type FieldRelationOptions<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> =
  | FieldRelationCreateOptions<TFullSchema>
  | FieldRelationConnectOptions<TFullSchema, TContext, TInputType>
  | FieldRelationConnectOrCreateOptions<TFullSchema, TContext, TInputType>
export type FieldRelationClient<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
> =
  | FieldRelationCreateClient<TFullSchema>
  | FieldRelationConnectClient<TFullSchema>
  | FieldRelationConnectOrCreateClient<TFullSchema>
export type FieldRelation<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> =
  | FieldRelationCreate<TFullSchema>
  | FieldRelationConnect<TFullSchema, TContext, TInputType>
  | FieldRelationConnectOrCreate<TFullSchema, TContext, TInputType>

// Define field types
export type FieldClient<TFullSchema extends Record<string, unknown> = Record<string, unknown>> =
  | FieldColumnClient
  | FieldRelationClient<TFullSchema>
export type Field<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
> = FieldColumn<TContext> | FieldRelation<TFullSchema, TContext>
export type AnyFieldClient = FieldClient<any>
export type AnyField = Field<any, AnyContextable>

// Define fields initial
export type FieldsInitialClient<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
> = Record<string, FieldClient<TFullSchema>>
export type FieldsInitial<
  TFullSchema extends Record<string, unknown>,
  TContext extends AnyContextable,
> = Record<string, Field<TFullSchema, TContext>>

export type AnyFieldsInitialClient = FieldsInitialClient<any>
export type AnyFieldsInitial = FieldsInitial<any, AnyContextable>

// Define fields (which is fields with fieldName)
export type FieldsClient<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TFields extends FieldsInitialClient<TFullSchema> = FieldsInitialClient<TFullSchema>,
> = FieldsWithFieldName<TFields>
export type Fields<
  TFullSchema extends Record<string, unknown>,
  TContext extends AnyContextable,
  TFields extends FieldsInitial<TFullSchema, TContext> = FieldsInitial<TFullSchema, TContext>,
> = FieldsWithFieldName<TFields>

export type AnyFieldsClient = FieldsClient<any, AnyFieldsInitialClient>
export type AnyFields = Fields<any, AnyContextable, AnyFieldsInitial>

// More type utilities
export type FieldColumnOptionsFromTable<
  TColumn extends Column<any>,
  TContext extends AnyContextable = AnyContextable,
> = TColumn['_']['dataType'] extends 'string'
  ? FieldColumnStringOptions<TContext>
  : TColumn['_']['dataType'] extends 'number'
    ? FieldColumnNumberOptions<TContext>
    : TColumn['_']['dataType'] extends 'boolean'
      ? FieldColumnBooleanOptions
      : TColumn['_']['dataType'] extends 'date'
        ? FieldColumnDateOptions
        : TColumn['_']['dataType'] extends 'json'
          ? FieldColumnJsonOptions
          : TColumn['_']['dataType'] extends 'array'
            ? TColumn['_']['data'] extends string[]
              ? FieldColumnStringArrayOptions<TContext>
              : TColumn['_']['data'] extends number[]
                ? FieldColumnNumberArrayOptions<TContext>
                : never
            : never

type FieldRelationOptionsFromTable<
  TRelationPrimaryColumn extends Column,
  TContext extends AnyContextable = AnyContextable,
> = TRelationPrimaryColumn['_']['data'] extends infer TType extends string | number
  ?
      | FieldRelationConnectOptions<any, TContext, TType>
      | FieldRelationConnectOrCreateOptions<any, TContext, TType>
      | FieldRelationCreateOptions<any>
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
  TContext extends AnyContextable,
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
      $client: {
        source: 'column',
        columnTsName: columnTsName,
      },
      $server: {
        source: 'column',
        column: this.tableRelationalConfig['columns'][
          columnTsName
        ] as TTableRelationConfigByTableTsName[TTableTsName]['columns'][TColumnTsName],
      },
    } satisfies FieldColumnBase

    return {
      ...fieldMetadata,
      ...options,
    }
  }

  relations<
    TRelationTsName extends Extract<
      keyof TTableRelationConfigByTableTsName[TTableTsName]['relations'],
      string
    >,
    const TOptions extends FieldRelationOptionsFromTable<
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

    const mode = (is(relation, One) ? 'one' : 'many') as GetRelationMode<
      TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
    >

    const fieldMetadata = {
      $client: {
        source: 'relation',
        mode,
        relationTsName: relationTsName,
        referencedTableTsName: referencedTableRelationalConfig.tsName,
        sourceTableTsName: sourceTableRelationalConfig.tsName,
        primaryColumnTsName: primaryColumnTsName as string,
      },
      $server: {
        source: 'relation',
        relation: relation,
        primaryColumn: primaryColumn as GetReferencedPrimaryColumn<
          TTableRelationConfigByTableTsName,
          TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
        >,
      },
    } satisfies FieldRelationBase

    return {
      ...fieldMetadata,
      ...options,
    }
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
> = TField['$server'] extends { source: 'column' }
  ? TField['$server']['column']['notNull'] extends true
    ? ZodOptional<TSchema>
    : TSchema
  : TSchema

type FieldToZodScheama<TField extends AnyField> =
  TField extends FieldColumnString<any>
    ? CastOptionalFieldToZodSchema<TField, z.ZodString>
    : TField extends FieldColumnStringArray<any>
      ? CastOptionalFieldToZodSchema<TField, z.ZodArray<z.ZodString>>
      : TField extends FieldColumnNumber<any>
        ? CastOptionalFieldToZodSchema<TField, z.ZodNumber>
        : TField extends FieldColumnNumberArray<any>
          ? CastOptionalFieldToZodSchema<TField, z.ZodArray<z.ZodNumber>>
          : TField extends FieldColumnBoolean
            ? CastOptionalFieldToZodSchema<TField, z.ZodBoolean>
            : TField extends FieldColumnDate
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
      if (!field.$server.column.notNull) {
        return z.string().optional() as FieldToZodScheama<TField>
      }

      return z.string() as FieldToZodScheama<TField>
    case 'email':
      if (!field.$server.column.notNull) {
        return z.string().email().optional() as FieldToZodScheama<TField>
      }

      return z.string().email() as FieldToZodScheama<TField>
    // string[] input
    case 'comboboxText':
      if (!field.$server.column.notNull) {
        return z.array(z.string()).optional() as FieldToZodScheama<TField>
      }
      return z.array(z.string()) as FieldToZodScheama<TField>
    // number input
    case 'number':
    case 'selectNumber':
      if (!field.$server.column.notNull) {
        return z.number().optional() as FieldToZodScheama<TField>
      }
      return z.number() as FieldToZodScheama<TField>
    // number[] input
    case 'comboboxNumber':
      if (!field.$server.column.notNull) {
        return z.array(z.number()).optional() as FieldToZodScheama<TField>
      }
      return z.array(z.number()) as FieldToZodScheama<TField>
    // boolean input
    case 'checkbox':
    case 'switch':
      if (!field.$server.column.notNull) {
        return z.boolean().optional() as FieldToZodScheama<TField>
      }
      return z.boolean() as FieldToZodScheama<TField>
    // date input
    case 'date':
      if (!field.$server.column.notNull) {
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
