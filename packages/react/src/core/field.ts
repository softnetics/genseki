import type { PartialDeep, Promisable, Simplify } from 'type-fest'
import z from 'zod'

import type { InferFields } from './collection'
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

export interface FieldColumnStringSelectTextOptions extends FieldOptionsShapeBase {
  type: 'selectText'
  default?: string
  options: string
}
export interface FieldColumnStringSelectTextShapeClient
  extends FieldColumnStringSelectTextOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringSelectTextShape
  extends FieldColumnStringSelectTextOptions,
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

export type FieldColumnStringOptions =
  | FieldColumnStringTextOptions
  | FieldColumnStringPasswordOptions
  | FieldColumnStringEmailOptions
  | FieldColumnStringSelectTextOptions
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
export type FieldColumnStringShape =
  | FieldColumnStringTextShape
  | FieldColumnStringPasswordShape
  | FieldColumnStringEmailShape
  | FieldColumnStringSelectTextShape
  | FieldColumnStringTimeShape
  | FieldColumnStringDateShape
  | FieldColumnStringMediaShape

export interface FieldColumnStringArrayComboboxTextOptions extends FieldOptionsShapeBase {
  type: 'comboboxText'
  label?: string
  options: string
}
export interface FieldColumnStringArrayComboboxTextShapeClient
  extends FieldColumnStringArrayComboboxTextOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnStringArrayComboboxTextShape
  extends FieldColumnStringArrayComboboxTextOptions,
    FieldColumnShapeBase {}

export type FieldColumnStringArrayOptions = FieldColumnStringArrayComboboxTextOptions
export type FieldColumnStringArrayShapeClient = FieldColumnStringArrayComboboxTextShapeClient
export type FieldColumnStringArrayShape = FieldColumnStringArrayComboboxTextShape

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
export interface FieldColumnNumberSelectNumberOptions extends FieldOptionsShapeBase {
  type: 'selectNumber'
  default?: number
  options: string
}
export interface FieldColumnNumberSelectNumberShapeClient
  extends FieldColumnNumberSelectNumberOptions,
    FieldColumnShapeClientBase {}
export interface FieldColumnNumberSelectNumberShape
  extends FieldColumnNumberSelectNumberOptions,
    FieldColumnShapeBase {}

export type FieldColumnNumberOptions =
  | FieldColumnNumberNumberOptions
  | FieldColumnNumberSelectNumberOptions
export type FieldColumnNumberShapeClient =
  | FieldColumnNumberNumberShapeClient
  | FieldColumnNumberSelectNumberShapeClient
export type FieldColumnNumberShape =
  | FieldColumnNumberNumberShape
  | FieldColumnNumberSelectNumberShape

// Number array field types
export interface FieldColumnNumberArrayComboboxNumberOptions extends FieldOptionsShapeBase {
  type: 'comboboxNumber'
  label?: string
  options: string
}
export interface FieldColumnNumberArrayComboboxNumberShapeClient
  extends Omit<FieldColumnNumberArrayComboboxNumberOptions, 'options'>,
    FieldColumnShapeClientBase {}
export interface FieldColumnNumberArrayComboboxNumberShape
  extends FieldColumnNumberArrayComboboxNumberOptions,
    FieldColumnShapeBase {}

export type FieldColumnNumberArrayOptions = FieldColumnNumberArrayComboboxNumberOptions
export type FieldColumnNumberArrayShapeClient = FieldColumnNumberArrayComboboxNumberShapeClient
export type FieldColumnNumberArrayShape = FieldColumnNumberArrayComboboxNumberShape

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
export type FieldColumnOptions =
  | FieldColumnJsonOptions
  | FieldColumnStringOptions
  | FieldColumnStringArrayOptions
  | FieldColumnNumberOptions
  | FieldColumnNumberArrayOptions
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
export type FieldColumnShape =
  | FieldColumnJsonShape
  | FieldColumnStringShape
  | FieldColumnStringArrayShape
  | FieldColumnNumberShape
  | FieldColumnNumberArrayShape
  | FieldColumnBooleanShape
  | FieldColumnDateShape

// Relation field types
export interface FieldRelationConnectOptions extends FieldOptionsShapeBase {
  type: 'connect'
  fields: Fields
  options: string
}
export interface FieldRelationConnectShapeClient
  extends Omit<FieldRelationConnectOptions, 'fields'>,
    FieldRelationShapeClientBase {
  fields: FieldsClient
}

export interface FieldRelationConnectShape
  extends FieldRelationConnectOptions,
    FieldRelationShapeBase {}

export interface FieldRelationCreateOptions extends FieldOptionsShapeBase {
  type: 'create'
  fields: Fields
}
export interface FieldRelationCreateShapeClient
  extends Omit<FieldRelationCreateOptions, 'fields'>,
    FieldRelationShapeClientBase {
  fields: FieldsClient
}
export interface FieldRelationCreateShape
  extends FieldRelationCreateOptions,
    FieldRelationShapeBase {}

export interface FieldRelationConnectOrCreateOptions extends FieldOptionsShapeBase {
  type: 'connectOrCreate'
  fields: Fields
  options: string
}
export interface FieldRelationConnectOrCreateShapeClient
  extends Omit<FieldRelationConnectOrCreateOptions, 'fields'>,
    FieldRelationShapeClientBase {
  fields: FieldsClient
}
export interface FieldRelationConnectOrCreateShape
  extends FieldRelationConnectOrCreateOptions,
    FieldRelationShapeBase {}

export type FieldRelationOptions =
  | FieldRelationCreateOptions
  | FieldRelationConnectOptions
  | FieldRelationConnectOrCreateOptions
export type FieldRelationShapeClient =
  | FieldRelationCreateShapeClient
  | FieldRelationConnectShapeClient
  | FieldRelationConnectOrCreateShapeClient
export type FieldRelationShape =
  | FieldRelationCreateShape
  | FieldRelationConnectShape
  | FieldRelationConnectOrCreateShape

// Define field types
export type FieldShapeClient = FieldColumnShapeClient | FieldRelationShapeClient
export type FieldShape = FieldColumnShape | FieldRelationShape

// Define fields type (Record of field)
export interface FieldsBase {
  config: {
    primaryColumn: string
    identifierColumn: string
    prismaModelName: string
  }
}
export interface FieldsShapeClient extends Record<string, FieldShapeClient> {}
export interface FieldsClient extends FieldsBase {
  shape: FieldsShapeClient
}

export interface FieldsShape extends Record<string, FieldShape> {}
export interface Fields extends FieldsBase {
  shape: FieldsShape
}

// More type utilities
export type FieldColumnConfigFromSchema<TColumn extends FieldColumnSchema> =
  TColumn['dataType'] extends typeof DataType.STRING
    ? TColumn['isList'] extends true
      ? FieldColumnStringArrayOptions
      : FieldColumnStringOptions
    : TColumn['dataType'] extends typeof DataType.INT
      ? TColumn['isList'] extends true
        ? FieldColumnNumberArrayOptions
        : FieldColumnNumberOptions
      : TColumn['dataType'] extends typeof DataType.BOOLEAN
        ? // TODO: Boolean array type is not supported yet
          FieldColumnBooleanOptions
        : TColumn['dataType'] extends typeof DataType.DATETIME
          ? // TODO: Date array type is not supported yet
            FieldColumnDateOptions
          : TColumn['dataType'] extends typeof DataType.JSON
            ? FieldColumnJsonOptions
            : never

type FieldRelationOptionsFromSchema =
  | FieldRelationConnectOptions
  | FieldRelationConnectOrCreateOptions
  | FieldRelationCreateOptions

export interface FieldOptionsCallbackReturn<TType extends string | number = string | number> {
  options: { value: TType; label: string }[]
  disabled?: boolean
}

export type FieldOptionsCallback<
  TContext extends AnyContextable = AnyContextable,
  TType extends string | number = string | number,
  TBody = unknown,
> = (args: {
  context: ContextToRequestContext<TContext>
  body: TBody
}) => Promisable<FieldOptionsCallbackReturn<TType>>

export type FieldsOptions<
  TContext extends AnyContextable = AnyContextable,
  TFields extends Fields = Fields,
> = {
  [TFieldShapeKey in keyof TFields['shape'] as TFields['shape'][TFieldShapeKey] extends {
    options: infer TOptionsName extends string
  }
    ? TOptionsName
    : never]: FieldOptionsCallback<TContext, string | number, PartialDeep<InferFields<TFields>>>
}

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
    const TOptions extends FieldColumnConfigFromSchema<
      TModelSchemas[TModelName]['shape']['columns'][TFieldColumnName]
    >,
  >(fieldColumnName: TFieldColumnName, options: TOptions) {
    const column = this.model.shape.columns[
      fieldColumnName as string
    ] as TModelSchemas[TModelName]['shape']['columns'][TFieldColumnName]

    type Column = TOptions['required'] extends boolean
      ? Omit<TModelSchemas[TModelName]['shape']['columns'][TFieldColumnName], 'isRequired'> & {
          isRequired: TOptions['required']
        }
      : TModelSchemas[TModelName]['shape']['columns'][TFieldColumnName]

    const fieldMetadata = {
      $client: {
        source: 'column',
        // This field will be mutated by the builder to include the field name
        fieldName: '',
        column: {
          ...column,
          isRequired: options.required ?? column.isRequired,
        } as Column,
      },
      $server: {
        source: 'column',
        fieldName: '',
        column: {
          ...column,
          isRequired: options.required ?? column.isRequired,
        } as Column,
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
    const TOptions extends FieldRelationOptionsFromSchema,
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
    optionsFn: (fb: FieldBuilder<TContext, TModelSchemas, TModelName>) => TFieldsShape,
    config?: { identifierColumn?: string }
  ): Simplify<{
    shape: TFieldsShape
    config: {
      primaryColumn: string
      identifierColumn: string
      prismaModelName: TModelName
    }
  }> {
    const fb = new FieldBuilder({
      context: this.options.context,
      modelSchemas: this.options.modelSchemas,
      modelName,
    })
    const shape = renameFieldsFieldName(optionsFn(fb))
    const primaryColumn = this.model.shape.primaryFields[0]
    return {
      shape,
      config: {
        primaryColumn: primaryColumn,
        identifierColumn: config?.identifierColumn ?? primaryColumn,
        prismaModelName: modelName,
      },
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
    : TField extends FieldColumnStringShape
      ? CastOptionalFieldToZodSchema<TField, z.ZodString>
      : TField extends FieldColumnStringArrayShape
        ? CastOptionalFieldToZodSchema<TField, z.ZodArray<z.ZodString>>
        : TField extends FieldColumnNumberShape
          ? CastOptionalFieldToZodSchema<TField, z.ZodNumber>
          : TField extends FieldColumnNumberArrayShape
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
