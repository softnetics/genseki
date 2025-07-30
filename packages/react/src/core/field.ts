import type { Simplify } from 'type-fest'
import z from 'zod/v4'

import { type MaybePromise } from './collection'
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

export interface FieldOptionsShapeBase {
  type: string
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
}

export interface FieldColumnShapeClientBase extends Omit<FieldOptionsShapeBase, 'type'> {
  $client: FieldColumnClientMetadata
}
export interface FieldColumnShapeBase extends FieldColumnShapeClientBase {
  $server: FieldColumnMetadata
}
export interface FieldRelationShapeClientBase extends Omit<FieldOptionsShapeBase, 'type'> {
  $client: FieldRelationClientMetadata
}
export interface FieldRelationShapeBase extends FieldRelationShapeClientBase {
  $server: FieldRelationMetadata
}
export type FieldShapeBase =
  | (FieldColumnShapeBase & {
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
  | (FieldRelationShapeBase & {
      type: 'connect' | 'create' | 'connectOrCreate'
    })
export type FieldClientBase =
  | (FieldColumnShapeClientBase & {
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
  | (FieldRelationShapeClientBase & {
      type: 'connect' | 'create' | 'connectOrCreate'
    })

// JSON field types
export interface FieldColumnJsonRichTextOptions extends FieldOptionsShapeBase {
  type: 'richText'
  default?: string
  editor: EditorProviderProps
}
export interface FieldColumnJsonRichTextShapeClient
  extends Omit<FieldColumnJsonRichTextOptions, 'editor'>,
    FieldColumnShapeClientBase {
  editor: EditorProviderClientProps
}
export interface FieldColumnJsonRichTextShape
  extends FieldColumnJsonRichTextOptions,
    FieldColumnShapeBase {}

export type FieldColumnJsonOptions = FieldColumnJsonRichTextOptions
export type FieldColumnJsonShapeClient = FieldColumnJsonRichTextShapeClient
export type FieldColumnJsonShape = FieldColumnJsonRichTextShape

// String field types
export interface FieldColumnStringTextOptions extends FieldOptionsShapeBase {
  type: 'text'
  default?: string
}
export interface FieldColumnStringTextShapeClient
  extends FieldColumnStringTextOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringTextShape
  extends FieldColumnStringTextOptions,
    FieldColumnShapeBase {}

export interface FieldColumnStringPasswordOptions extends FieldOptionsShapeBase {
  type: 'password'
  default?: string
}
export interface FieldColumnStringPasswordShapeClient
  extends FieldColumnStringPasswordOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringPasswordShape
  extends FieldColumnStringPasswordOptions,
    FieldColumnShapeBase {}

export interface FieldColumnStringEmailOptions extends FieldOptionsShapeBase {
  type: 'email'
  default?: string
}
export interface FieldColumnStringEmailShapeClient
  extends FieldColumnStringEmailOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringEmailShape
  extends FieldColumnStringEmailOptions,
    FieldColumnShapeBase {}

export interface FieldColumnStringSelectTextOptions<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldOptionsShapeBase {
  type: 'selectText'
  default?: string
  options: OptionCallback<string, TContext>
}
export interface FieldColumnStringSelectTextShapeClient
  extends Omit<FieldColumnStringSelectTextOptions, 'options'>,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringSelectTextShape<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldColumnStringSelectTextOptions<TContext>,
    FieldColumnShapeBase {}

export interface FieldColumnStringTimeOptions extends FieldOptionsShapeBase {
  type: 'time'
  default?: Date
}
export interface FieldColumnStringTimeShapeClient
  extends FieldColumnStringTimeOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringTimeShape
  extends FieldColumnStringTimeOptions,
    FieldColumnShapeBase {}

export interface FieldColumnStringDateOptions extends FieldOptionsShapeBase {
  type: 'date'
  default?: Date
}
export interface FieldColumnStringDateShapeClient
  extends FieldColumnStringDateOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringDateShape
  extends FieldColumnStringDateOptions,
    FieldColumnShapeBase {}

export interface FieldColumnStringMediaOptions extends FieldOptionsShapeBase {
  type: 'media'
  uploadOptions?: FileUploadOptionsProps
}
export interface FieldColumnStringMediaShapeClient
  extends FieldColumnStringMediaOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringMediaShape
  extends FieldColumnStringMediaOptions,
    FieldColumnShapeBase {}

export type FieldColumnStringOptions<TContext extends AnyContextable> =
  | FieldColumnStringTextOptions
  | FieldColumnStringPasswordOptions
  | FieldColumnStringEmailOptions
  | FieldColumnStringSelectTextOptions<TContext>
  | FieldColumnStringTimeOptions
  | FieldColumnStringDateOptions
  | FieldColumnStringMediaOptions
export type FieldColumnStringShapeClient =
  | FieldColumnStringTextShapeClient
  | FieldColumnStringPasswordShapeClient
  | FieldColumnStringEmailShapeClient
  | FieldColumnStringSelectTextShapeClient
  | FieldColumnStringTimeShapeClient
  | FieldColumnStringDateShapeClient
  | FieldColumnStringMediaShapeClient
export type FieldColumnStringShape<TContext extends AnyContextable> =
  | FieldColumnStringTextShape
  | FieldColumnStringPasswordShape
  | FieldColumnStringEmailShape
  | FieldColumnStringSelectTextShape<TContext>
  | FieldColumnStringTimeShape
  | FieldColumnStringDateShape
  | FieldColumnStringMediaShape

export interface FieldColumnStringArrayComboboxTextOptions<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldOptionsShapeBase {
  type: 'comboboxText'
  label?: string
  options: OptionCallback<string, TContext>
}
export interface FieldColumnStringArrayComboboxTextShapeClient
  extends Omit<FieldColumnStringArrayComboboxTextOptions, 'options'>,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringArrayComboboxTextShape<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldColumnStringArrayComboboxTextOptions<TContext>,
    FieldColumnShapeBase {}

export type FieldColumnStringArrayOptions<TContext extends AnyContextable> =
  FieldColumnStringArrayComboboxTextOptions<TContext>
export type FieldColumnStringArrayShapeClient = FieldColumnStringArrayComboboxTextShapeClient
export type FieldColumnStringArrayShape<TContext extends AnyContextable> =
  FieldColumnStringArrayComboboxTextShape<TContext>

// Number field types
export interface FieldColumnNumberNumberOptions extends FieldOptionsShapeBase {
  type: 'number'
  default?: number
}
export interface FieldColumnNumberNumberShapeClient
  extends FieldColumnNumberNumberOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnNumberNumberShape
  extends FieldColumnNumberNumberOptions,
    FieldColumnShapeBase {}
export interface FieldColumnNumberSelectNumberOptions<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldOptionsShapeBase {
  type: 'selectNumber'
  default?: number
  options: OptionCallback<number, TContext>
}
export interface FieldColumnNumberSelectNumberShapeClient
  extends Omit<FieldColumnNumberSelectNumberOptions, 'options'>,
    FieldColumnShapeClientBase {}
export interface FieldColumnNumberSelectNumberShape<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldColumnNumberSelectNumberOptions<TContext>,
    FieldColumnShapeBase {}

export type FieldColumnNumberOptions<TContext extends AnyContextable> =
  | FieldColumnNumberNumberOptions
  | FieldColumnNumberSelectNumberOptions<TContext>
export type FieldColumnNumberShapeClient =
  | FieldColumnNumberNumberShapeClient
  | FieldColumnNumberSelectNumberShapeClient
export type FieldColumnNumberShape<TContext extends AnyContextable> =
  | FieldColumnNumberNumberShape
  | FieldColumnNumberSelectNumberShape<TContext>

// Number array field types
export interface FieldColumnNumberArrayComboboxNumberOptions<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldOptionsShapeBase {
  type: 'comboboxNumber'
  label?: string
  options: OptionCallback<number, TContext>
}
export interface FieldColumnNumberArrayComboboxNumberShapeClient
  extends Omit<FieldColumnNumberArrayComboboxNumberOptions, 'options'>,
    FieldColumnShapeClientBase {}
export interface FieldColumnNumberArrayComboboxNumberShape<
  in TContext extends AnyContextable = AnyContextable,
> extends FieldColumnNumberArrayComboboxNumberOptions<TContext>,
    FieldColumnShapeBase {}

export type FieldColumnNumberArrayOptions<TContext extends AnyContextable> =
  FieldColumnNumberArrayComboboxNumberOptions<TContext>
export type FieldColumnNumberArrayShapeClient = FieldColumnNumberArrayComboboxNumberShapeClient
export type FieldColumnNumberArrayShape<TContext extends AnyContextable> =
  FieldColumnNumberArrayComboboxNumberShape<TContext>

// Boolean field types
export interface FieldColumnBooleanCheckboxOptions extends FieldOptionsShapeBase {
  type: 'checkbox'
  default?: boolean
}
export interface FieldColumnBooleanCheckboxShapeClient
  extends FieldColumnBooleanCheckboxOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnBooleanCheckboxShape
  extends FieldColumnBooleanCheckboxOptions,
    FieldColumnShapeBase {}
export interface FieldColumnBooleanSwitchOptions extends FieldOptionsShapeBase {
  type: 'switch'
  default?: boolean
}
export interface FieldColumnBooleanSwitchShapeClient
  extends FieldColumnBooleanSwitchOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnBooleanSwitchShape
  extends FieldColumnBooleanSwitchOptions,
    FieldColumnShapeBase {}

export type FieldColumnBooleanOptions =
  | FieldColumnBooleanCheckboxOptions
  | FieldColumnBooleanSwitchOptions
export type FieldColumnBooleanShapeClient =
  | FieldColumnBooleanCheckboxShapeClient
  | FieldColumnBooleanSwitchShapeClient
export type FieldColumnBooleanShape =
  | FieldColumnBooleanCheckboxShape
  | FieldColumnBooleanSwitchShape

// Date field types
export interface FieldColumnDataDateOptions extends FieldOptionsShapeBase {
  type: 'date'
  default?: Date
}
export interface FieldColumnDataDateClient
  extends FieldColumnDataDateOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnDataDate extends FieldColumnDataDateOptions, FieldColumnShapeBase {}

export type FieldColumnDateOptions = FieldColumnDataDateOptions
export type FieldColumnDateShapeClient = FieldColumnDataDateClient
export type FieldColumnDateShape = FieldColumnDataDate

// All field columns types
export type FieldColumnOptions<TContext extends AnyContextable> =
  | FieldColumnJsonOptions
  | FieldColumnStringOptions<TContext>
  | FieldColumnStringArrayOptions<TContext>
  | FieldColumnNumberOptions<TContext>
  | FieldColumnNumberArrayOptions<TContext>
  | FieldColumnBooleanOptions
  | FieldColumnDateOptions
export type FieldColumnShapeClient =
  | FieldColumnJsonShapeClient
  | FieldColumnStringShapeClient
  | FieldColumnStringArrayShapeClient
  | FieldColumnNumberShapeClient
  | FieldColumnNumberArrayShapeClient
  | FieldColumnBooleanShapeClient
  | FieldColumnDateShapeClient
export type FieldColumnShape<TContext extends AnyContextable> =
  | FieldColumnJsonShape
  | FieldColumnStringShape<TContext>
  | FieldColumnStringArrayShape<TContext>
  | FieldColumnNumberShape<TContext>
  | FieldColumnNumberArrayShape<TContext>
  | FieldColumnBooleanShape
  | FieldColumnDateShape

// Relation field types
export interface FieldRelationConnectOptions<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldOptionsShapeBase {
  type: 'connect'
  fields: Fields
  options: OptionCallback<TInputType, TContext>
}
export interface FieldRelationConnectShapeClient
  extends Omit<FieldRelationConnectOptions<any>, 'options' | 'fields'>,
    FieldRelationShapeClientBase {
  fields: FieldsClient
}

export interface FieldRelationConnectShape<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldRelationConnectOptions<TContext, TInputType>,
    FieldRelationShapeBase {}

export interface FieldRelationCreateOptions extends FieldOptionsShapeBase {
  type: 'create'
  fields: Fields
}
export interface FieldRelationCreateShapeClient
  extends Omit<FieldRelationCreateOptions, 'fields'>,
    FieldRelationShapeBase {
  fields: FieldsClient
}
export interface FieldRelationCreateShape
  extends FieldRelationCreateOptions,
    FieldRelationShapeBase {}

export interface FieldRelationConnectOrCreateOptions<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldOptionsShapeBase {
  type: 'connectOrCreate'
  fields: Fields
  options: OptionCallback<TInputType, TContext>
}
export interface FieldRelationConnectOrCreateShapeClient
  extends Omit<FieldRelationConnectOrCreateOptions<any>, 'options' | 'fields'>,
    FieldRelationShapeClientBase {
  fields: FieldsClient
}
export interface FieldRelationConnectOrCreateShape<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> extends FieldRelationConnectOrCreateOptions<TContext, TInputType>,
    FieldRelationShapeBase {}

export type FieldRelationOptions<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> =
  | FieldRelationCreateOptions
  | FieldRelationConnectOptions<TContext, TInputType>
  | FieldRelationConnectOrCreateOptions<TContext, TInputType>
export type FieldRelationShapeClient =
  | FieldRelationCreateShapeClient
  | FieldRelationConnectShapeClient
  | FieldRelationConnectOrCreateShapeClient
export type FieldRelationShape<
  TContext extends AnyContextable = AnyContextable,
  TInputType extends string | number = string | number,
> =
  | FieldRelationCreateShape
  | FieldRelationConnectShape<TContext, TInputType>
  | FieldRelationConnectOrCreateShape<TContext, TInputType>

// Define field types
export type FieldShapeClient = FieldColumnShapeClient | FieldRelationShapeClient
export type FieldShape<TContext extends AnyContextable = AnyContextable> =
  | FieldColumnShape<TContext>
  | FieldRelationShape<TContext>

// Define fields (which is fields with fieldName)
export interface FieldsBase {
  config: {
    prismaModelName: string
  }
}
export interface FieldsShapeClient extends Record<string, FieldShapeClient> {}
export interface FieldsClient extends FieldsBase {
  shape: FieldsShapeClient
}
export interface FieldsShape<TContext extends AnyContextable = AnyContextable>
  extends Record<string, FieldShape<TContext>> {}
export interface Fields<TContext extends AnyContextable = AnyContextable> extends FieldsBase {
  shape: FieldsShape<TContext>
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
    } satisfies FieldColumnShapeBase

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
    } satisfies FieldRelationShapeBase

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
  TField extends FieldShapeBase,
  TSchema extends z.ZodTypeAny,
> = TField['$server'] extends { source: 'column' }
  ? TField['$server']['column']['isRequired'] extends true
    ? z.ZodOptional<TSchema>
    : TSchema
  : TSchema

type FieldRelationToZodSchema<TField extends FieldRelationShape> =
  TField extends FieldRelationConnectShape
    ? TField['$server']['relation']['isList'] extends true
      ? z.ZodArray<FieldsShapeToZodObject<TField['fields']['shape']>>
      : FieldsShapeToZodObject<TField['fields']['shape']>
    : TField extends FieldRelationCreateShape
      ? TField['$server']['relation']['isList'] extends true
        ? z.ZodArray<FieldsShapeToZodObject<TField['fields']['shape']>>
        : FieldsShapeToZodObject<TField['fields']['shape']>
      : TField extends FieldRelationConnectOrCreateShape
        ? TField['$server']['relation']['isList'] extends true
          ? z.ZodArray<FieldsShapeToZodObject<TField['fields']['shape']>>
          : FieldsShapeToZodObject<TField['fields']['shape']>
        : never

export type FieldShapeToZodSchema<TField extends FieldShapeBase> =
  TField extends FieldColumnJsonShape
    ? CastOptionalFieldToZodSchema<TField, z.ZodJSONSchema>
    : TField extends FieldColumnStringShape<any>
      ? CastOptionalFieldToZodSchema<TField, z.ZodString>
      : TField extends FieldColumnStringArrayShape<any>
        ? CastOptionalFieldToZodSchema<TField, z.ZodArray<z.ZodString>>
        : TField extends FieldColumnNumberShape<any>
          ? CastOptionalFieldToZodSchema<TField, z.ZodNumber>
          : TField extends FieldColumnNumberArrayShape<any>
            ? CastOptionalFieldToZodSchema<TField, z.ZodArray<z.ZodNumber>>
            : TField extends FieldColumnBooleanShape
              ? CastOptionalFieldToZodSchema<TField, z.ZodBoolean>
              : TField extends FieldColumnDateShape
                ? CastOptionalFieldToZodSchema<TField, z.ZodISODate>
                : TField extends FieldRelationShape
                  ? FieldRelationToZodSchema<TField>
                  : never

export type FieldsShapeToZodObject<TFieldsShape extends FieldsShape> = z.ZodObject<{
  [TKey in keyof TFieldsShape]: TFieldsShape[TKey] extends FieldShape
    ? FieldShapeToZodSchema<TFieldsShape[TKey]>
    : never
}>

export function fieldToZodScheama<TFieldShape extends FieldShapeBase>(
  fieldShape: TFieldShape
): FieldShapeToZodSchema<TFieldShape> {
  // TODO: More options
  switch (fieldShape.type) {
    // Richtext JSON
    case 'richText': {
      return z.json() as FieldShapeToZodSchema<TFieldShape>
    }
    // string input
    case 'text':
    case 'selectText':
    case 'time':
    case 'password':
    case 'media': {
      if (!fieldShape.$server.column.isRequired) {
        return z.string().optional() as FieldShapeToZodSchema<TFieldShape>
      }

      return z.string() as FieldShapeToZodSchema<TFieldShape>
    }
    case 'email': {
      if (!fieldShape.$server.column.isRequired) {
        return z.string().email().optional() as FieldShapeToZodSchema<TFieldShape>
      }
      return z.string().email() as FieldShapeToZodSchema<TFieldShape>
    }
    // string[] input
    case 'comboboxText': {
      if (!fieldShape.$server.column.isRequired) {
        return z.array(z.string()).optional() as FieldShapeToZodSchema<TFieldShape>
      }
      return z.array(z.string()) as FieldShapeToZodSchema<TFieldShape>
    }
    // number input
    case 'number':
    case 'selectNumber': {
      if (!fieldShape.$server.column.isRequired) {
        return z.number().optional() as FieldShapeToZodSchema<TFieldShape>
      }
      return z.number() as FieldShapeToZodSchema<TFieldShape>
    }
    // number[] input
    case 'comboboxNumber': {
      if (!fieldShape.$server.column.isRequired) {
        return z.array(z.number()).optional() as FieldShapeToZodSchema<TFieldShape>
      }
      return z.array(z.number()) as FieldShapeToZodSchema<TFieldShape>
    }
    // boolean input
    case 'checkbox':
    case 'switch': {
      if (!fieldShape.$server.column.isRequired) {
        return z.boolean().optional() as FieldShapeToZodSchema<TFieldShape>
      }
      return z.boolean() as FieldShapeToZodSchema<TFieldShape>
    }
    // date input
    case 'date': {
      if (!fieldShape.$server.column.isRequired) {
        return z.iso.date().optional() as FieldShapeToZodSchema<TFieldShape>
      }
      return z.iso.date() as FieldShapeToZodSchema<TFieldShape>
    }
    // TODO: relation input
    case 'connect': {
      return z.any() as unknown as FieldShapeToZodSchema<TFieldShape>
    }
    case 'create': {
      return z.any() as unknown as FieldShapeToZodSchema<TFieldShape>
    }
    case 'connectOrCreate': {
      return z.any() as unknown as FieldShapeToZodSchema<TFieldShape>
    }
    default: {
      throw new Error(`Unknown field type: ${(fieldShape as any).type}`)
    }
  }
}

export function fieldsShapeToZodObject<TFieldsShape extends FieldsShape>(
  fieldsShape: TFieldsShape
): FieldsShapeToZodObject<TFieldsShape> {
  const zodObject = Object.entries(fieldsShape).reduce(
    (acc, [key, field]) => {
      acc[key] = fieldToZodScheama(field) as any
      return acc
    },
    {} as Record<string, z.ZodTypeAny>
  )

  return z.object(zodObject) as FieldsShapeToZodObject<TFieldsShape>
}
