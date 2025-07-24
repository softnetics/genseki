import type { UndefinedToOptional } from 'type-fest/source/internal'

import type {
  DataType,
  FieldColumnSchema,
  InferDataType,
  ModelConfig,
  ModelSchema,
  ModelShape,
} from './model'

export interface AnyTypedFieldColumn<T extends DataType> extends FieldColumnSchema {
  dataType: T
}

export type WithHasDefaultValue<T> = T & { hasDefaultValue: true }
export type WithIsRequired<T> = T & { isRequired: true }
export type WithIsUnique<T> = T & { isUnique: true }

export interface AnyTable<TShape extends ModelShape = ModelShape>
  extends ModelSchema<TShape, ModelConfig> {}

export type InferTableType<T extends AnyTable> = UndefinedToOptional<
  {
    [K in keyof T['shape']['columns']]: T['shape']['columns'][K]['isRequired'] extends true
      ? InferDataType<T['shape']['columns'][K]['dataType']>
      : InferDataType<T['shape']['columns'][K]['dataType']> | null | undefined
  } & {
    [K in keyof T['shape']['relations']]: T['shape']['relations'][K]['isRequired'] extends true
      ? // TODO: Only support one relation data type for now
        InferDataType<T['shape']['relations'][K]['relationDataTypes'][0]>
      : InferDataType<T['shape']['relations'][K]['relationDataTypes'][0]> | null | undefined
  }
>
