import type { Simplify } from 'type-fest'
import z from 'zod/v4'

import { ApiDefaultMethod, type MaybePromise } from './collection'
import type { AnyContextable, ContextToRequestContext } from './context'
import {
  type DataType,
  type FieldColumnSchema,
  type FieldRelationSchema,
  type ModelSchemas,
  type SanitizedFieldColumnSchema,
  type SanitizedFieldRelationSchema,
  sanitizedFieldRelationSchema,
} from './model'
import type {
  EditorProviderClientProps,
  ServerConfigEditorProviderProps as EditorProviderProps,
} from './richtext/types'
import { appendFieldNameToFields as renameFieldsFieldName } from './utils'

import type { FileUploadOptionsProps } from '../react/components/compound/file-upload-field'

export type OptionCallback<TType extends string | number, in TContext extends AnyContextable> = (
  args: ContextToRequestContext<TContext>
) => MaybePromise<Array<{ label: string; value: TType }>>

export interface FieldColumnClientMetadata {
  source: 'column'
  fieldName: string
  column: SanitizedFieldColumnSchema
}
export interface FieldColumnMetadata extends Omit<FieldColumnClientMetadata, 'column'> {
  column: FieldColumnSchema
}

export interface FieldRelationClientMetadata {
  source: 'relation'
  fieldName: string
  relation: SanitizedFieldRelationSchema
}
export interface FieldRelationMetadata extends Omit<FieldRelationClientMetadata, 'relation'> {
  relation: FieldRelationSchema
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
  type: string
  label?: string
  description?: string
  placeholder?: string
  isRequired?: boolean
  update?: FieldMutateMode
  create?: FieldMutateMode
}

export interface FieldColumnClientBase extends Omit<FieldOptionsBase, 'type'> {
  $client: FieldColumnClientMetadata
}
export interface FieldColumnBase extends FieldColumnClientBase {
  $server: FieldColumnMetadata
}
export interface FieldRelationClientBase extends Omit<FieldOptionsBase, 'type'> {
  $client: FieldRelationClientMetadata
}
export interface FieldRelationBase extends FieldRelationClientBase {
  $server: FieldRelationMetadata
}
export type FieldBase =
  | (FieldColumnBase & {
      type:
        | 'text'
        | 'password'
        | 'email'
        | 'selectText'
        | 'time'
        | 'media'
        | 'richText'
        | 'comboboxText'
        | 'date'
        | 'number'
        | 'selectNumber'
        | 'comboboxNumber'
        | 'checkbox'
        | 'switch'
    })
  | (FieldRelationBase & {
      type: 'connect' | 'create' | 'connectOrCreate'
    })
export type FieldClientBase =
  | (FieldColumnClientBase & {
      type:
        | 'text'
        | 'password'
        | 'email'
        | 'selectText'
        | 'time'
        | 'media'
        | 'richText'
        | 'comboboxText'
        | 'date'
        | 'number'
        | 'selectNumber'
        | 'comboboxNumber'
        | 'checkbox'
        | 'switch'
    })
  | (FieldRelationClientBase & {
      type: 'connect' | 'create' | 'connectOrCreate'
    })

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
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldOptionsBase {
  type: 'connect'
  fields: Fields
  options: OptionCallback<TInputType, TContext>
}
export interface FieldRelationConnectClient
  extends Omit<FieldRelationConnectOptions<any>, 'options' | 'fields'>,
    FieldRelationClientBase {
  fields: FieldsClient
}

export interface FieldRelationConnect<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldRelationConnectOptions<TContext, TInputType>,
    FieldRelationBase {}

export interface FieldRelationCreateOptions extends FieldOptionsBase {
  type: 'create'
  fields: Fields
}
export interface FieldRelationCreateClient
  extends Omit<FieldRelationCreateOptions, 'fields'>,
    FieldRelationBase {
  fields: FieldsClient
}
export interface FieldRelationCreate extends FieldRelationCreateOptions, FieldRelationBase {}

export interface FieldRelationConnectOrCreateOptions<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldOptionsBase {
  type: 'connectOrCreate'
  fields: Fields
  options: OptionCallback<TInputType, TContext>
}
export interface FieldRelationConnectOrCreateClient
  extends Omit<FieldRelationConnectOrCreateOptions<any>, 'options' | 'fields'>,
    FieldRelationClientBase {
  fields: FieldsClient
}
export interface FieldRelationConnectOrCreate<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldRelationConnectOrCreateOptions<TContext, TInputType>,
    FieldRelationBase {}

export type FieldRelationOptions<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> =
  | FieldRelationCreateOptions
  | FieldRelationConnectOptions<TContext, TInputType>
  | FieldRelationConnectOrCreateOptions<TContext, TInputType>
export type FieldRelationClient =
  | FieldRelationCreateClient
  | FieldRelationConnectClient
  | FieldRelationConnectOrCreateClient
export type FieldRelation<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> =
  | FieldRelationCreate
  | FieldRelationConnect<TContext, TInputType>
  | FieldRelationConnectOrCreate<TContext, TInputType>

// Define field types
export type FieldClient = FieldColumnClient | FieldRelationClient
export type Field<TContext extends AnyContextable = AnyContextable> =
  | FieldColumn<TContext>
  | FieldRelation<TContext>

// Define fields (which is fields with fieldName)
export interface FieldsBase {
  config: {
    prismaModelName: string
  }
}
export interface FieldsClientShape extends Record<string, FieldClient> {}
export interface FieldsClient extends FieldsBase {
  shape: FieldsClientShape
}
export interface FieldsShape extends Record<string, Field> {}
export interface Fields extends FieldsBase {
  shape: FieldsShape
}

// More type utilities
export type FieldColumnOptionsFromSchema<
  TContext extends AnyContextable,
  TColumn extends FieldColumnSchema,
> = TColumn['dataType'] extends typeof DataType.STRING
  ? TColumn['isList'] extends true
    ? FieldColumnStringArrayOptions<TContext>
    : FieldColumnStringOptions<TContext>
  : TColumn['dataType'] extends typeof DataType.INT
    ? TColumn['isList'] extends true
      ? FieldColumnNumberArrayOptions<TContext>
      : FieldColumnNumberOptions<TContext>
    : TColumn['dataType'] extends typeof DataType.BOOLEAN
      ? // TODO: Boolean array type is not supported yet
        FieldColumnBooleanOptions
      : TColumn['dataType'] extends typeof DataType.DATETIME
        ? // TODO: Date array type is not supported yet
          FieldColumnDateOptions
        : TColumn['dataType'] extends typeof DataType.JSON
          ? FieldColumnJsonOptions
          : never

// FIXME: Support only 1 foreign key relation for now
type FieldRelationOptionsFromSchema<
  TContext extends AnyContextable,
  TRelationFieldSchema extends FieldRelationSchema,
> = TRelationFieldSchema['relationDataTypes'][0] extends typeof DataType.STRING
  ?
      | FieldRelationConnectOptions<TContext, string>
      | FieldRelationConnectOrCreateOptions<TContext, string>
      | FieldRelationCreateOptions
  : TRelationFieldSchema['relationDataTypes'][0] extends typeof DataType.INT
    ?
        | FieldRelationConnectOptions<TContext, number>
        | FieldRelationConnectOrCreateOptions<TContext, number>
        | FieldRelationCreateOptions
    : never

export class FieldBuilder<
  const TContext extends AnyContextable,
  const TModelSchemas extends ModelSchemas,
  const TModelName extends keyof TModelSchemas,
> {
  private readonly model: TModelSchemas[TModelName]

  constructor(
    private readonly options: {
      context: TContext
      modelSchemas: TModelSchemas
      modelName: TModelName
    }
  ) {
    this.model = options.modelSchemas[options.modelName]
  }

  columns<
    const TFieldColumnName extends keyof TModelSchemas[TModelName]['shape']['columns'],
    const TOptions extends FieldColumnOptionsFromSchema<
      TContext,
      TModelSchemas[TModelName]['shape']['columns'][TFieldColumnName]
    >,
  >(fieldColumnName: TFieldColumnName, options: TOptions) {
    const column = this.model.shape.columns[
      fieldColumnName as string
    ] as TModelSchemas[TModelName]['shape']['columns'][TFieldColumnName]

    const fieldMetadata = {
      $client: {
        source: 'column',
        // This field will be mutated by the builder to include the field name
        fieldName: '',
        column: column,
      },
      $server: {
        source: 'column',
        fieldName: '',
        column: column,
      },
    } satisfies FieldColumnBase

    // TODO: Apply default value of column if it exists e.g. isRequired, isList, etc.
    return {
      ...fieldMetadata,
      ...options,
    }
  }

  relations<
    const TFieldRelationName extends keyof TModelSchemas[TModelName]['shape']['relations'],
    const TOptions extends FieldRelationOptionsFromSchema<
      TContext,
      TModelSchemas[TModelName]['shape']['relations'][TFieldRelationName]
    >,
  >(
    fieldRelationName: TFieldRelationName,
    optionsFn: (
      fb: FieldBuilder<
        TContext,
        TModelSchemas,
        TModelSchemas[TModelName]['shape']['relations'][TFieldRelationName]['referencedModel']['config']['prismaModelName']
      >
    ) => TOptions
  ) {
    const relation = this.model.shape.relations[
      fieldRelationName as string
    ] as TModelSchemas[TModelName]['shape']['relations'][TFieldRelationName]

    const fb = new FieldBuilder({
      context: this.options.context,
      modelSchemas: this.options.modelSchemas,
      modelName: relation.referencedModel.config
        .prismaModelName as TModelSchemas[TModelName]['shape']['relations'][TFieldRelationName]['referencedModel']['config']['prismaModelName'],
    })

    const options = optionsFn(fb)

    if (options.type === 'connectOrCreate' || options.type === 'create') {
      options.fields.shape = renameFieldsFieldName(options.fields.shape)
    }

    const fieldMetadata = {
      $client: {
        source: 'relation',
        // This field will be mutated by the builder to include the field name
        fieldName: '',
        // TODO: Conver to sanitized relation schema
        relation: sanitizedFieldRelationSchema(relation),
      },
      $server: {
        source: 'relation',
        // This field will be mutated by the builder to include the field name
        fieldName: '',
        relation: relation,
      },
    } satisfies FieldRelationBase

    return {
      ...fieldMetadata,
      ...options,
    }
  }

  fields<TFieldsShape extends FieldsShape>(
    modelName: TModelName,
    optionsFn: (fb: FieldBuilder<TContext, TModelSchemas, TModelName>) => TFieldsShape
  ): Simplify<{
    shape: TFieldsShape
    config: { prismaModelName: TModelName }
  }> {
    const fb = new FieldBuilder({
      context: this.options.context,
      modelSchemas: this.options.modelSchemas,
      modelName,
    })
    const shape = renameFieldsFieldName(optionsFn(fb))
    return {
      shape,
      config: { prismaModelName: modelName },
    }
  }
}

type CastOptionalFieldToZodSchema<
  TField extends FieldBase,
  TSchema extends z.ZodTypeAny,
> = TField['$server'] extends { source: 'column' }
  ? TField['$server']['column']['isRequired'] extends true
    ? z.ZodOptional<TSchema>
    : TSchema
  : TSchema

type FieldRelationToZodSchema<TField extends FieldRelation> = TField extends FieldRelationConnect
  ? TField['$server']['relation']['isList'] extends true
    ? z.ZodArray<FieldsToZodObject<TField['fields']['shape']>>
    : FieldsToZodObject<TField['fields']['shape']>
  : TField extends FieldRelationCreate
    ? TField['$server']['relation']['isList'] extends true
      ? z.ZodArray<FieldsToZodObject<TField['fields']['shape']>>
      : FieldsToZodObject<TField['fields']['shape']>
    : TField extends FieldRelationConnectOrCreate
      ? TField['$server']['relation']['isList'] extends true
        ? z.ZodArray<FieldsToZodObject<TField['fields']['shape']>>
        : FieldsToZodObject<TField['fields']['shape']>
      : never

export type FieldToZodScheama<TField extends FieldBase> = TField extends FieldColumnJson
  ? CastOptionalFieldToZodSchema<TField, z.ZodJSONSchema>
  : TField extends FieldColumnString<any>
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
              : TField extends FieldRelation
                ? FieldRelationToZodSchema<TField>
                : never

export type FieldsToZodObject<TFieldsShape extends FieldsShape> = z.ZodObject<{
  [TKey in keyof TFieldsShape]: TFieldsShape[TKey] extends Field
    ? FieldToZodScheama<TFieldsShape[TKey]>
    : never
}>

export function fieldToZodScheama<TField extends FieldBase>(
  field: TField
): FieldToZodScheama<TField> {
  // TODO: More options
  switch (field.type) {
    // Richtext JSON
    case 'richText': {
      return z.json() as FieldToZodScheama<TField>
    }
    // string input
    case 'text':
    case 'selectText':
    case 'time':
    case 'password':
    case 'media': {
      if (!field.$server.column.isRequired) {
        return z.string().optional() as FieldToZodScheama<TField>
      }

      return z.string() as FieldToZodScheama<TField>
    }
    case 'email': {
      if (!field.$server.column.isRequired) {
        return z.string().email().optional() as FieldToZodScheama<TField>
      }
      return z.string().email() as FieldToZodScheama<TField>
    }
    // string[] input
    case 'comboboxText': {
      if (!field.$server.column.isRequired) {
        return z.array(z.string()).optional() as FieldToZodScheama<TField>
      }
      return z.array(z.string()) as FieldToZodScheama<TField>
    }
    // number input
    case 'number':
    case 'selectNumber': {
      if (!field.$server.column.isRequired) {
        return z.number().optional() as FieldToZodScheama<TField>
      }
      return z.number() as FieldToZodScheama<TField>
    }
    // number[] input
    case 'comboboxNumber': {
      if (!field.$server.column.isRequired) {
        return z.array(z.number()).optional() as FieldToZodScheama<TField>
      }
      return z.array(z.number()) as FieldToZodScheama<TField>
    }
    // boolean input
    case 'checkbox':
    case 'switch': {
      if (!field.$server.column.isRequired) {
        return z.boolean().optional() as FieldToZodScheama<TField>
      }
      return z.boolean() as FieldToZodScheama<TField>
    }
    // date input
    case 'date': {
      if (!field.$server.column.isRequired) {
        return z.iso.date().optional() as FieldToZodScheama<TField>
      }
      return z.iso.date() as FieldToZodScheama<TField>
    }
    // TODO: relation input
    case 'connect': {
      return z.any() as unknown as FieldToZodScheama<TField>
    }
    case 'create': {
      return z.any() as unknown as FieldToZodScheama<TField>
    }
    case 'connectOrCreate': {
      return z.any() as unknown as FieldToZodScheama<TField>
    }
    default: {
      throw new Error(`Unknown field type: ${(field as any).type}`)
    }
  }
}

export function fieldsToZodObject<TFieldsShape extends FieldsShape>(
  fieldsShape: TFieldsShape,
  method?: typeof ApiDefaultMethod.CREATE | typeof ApiDefaultMethod.UPDATE
): FieldsToZodObject<TFieldsShape> {
  const zodObject = Object.entries(fieldsShape).reduce(
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

  return z.object(zodObject) as FieldsToZodObject<TFieldsShape>
}
