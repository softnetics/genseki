import type { IsAny, Join } from 'type-fest'
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
export type WithIsList<T> = T & { isList: true }

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

type IsContains<TInput extends any[], TCheck extends any[] | undefined> = (
  IsAny<TCheck> extends true
    ? true[]
    : TCheck extends any[]
      ? { [K in keyof TCheck]: TCheck[K] extends TInput[number] ? true : false }
      : true[]
) extends true[]
  ? true
  : false

export type IsValidTable<TRequiredTable extends AnyTable, TInputTable extends AnyTable> =
  IsContains<
    TInputTable['shape']['uniqueFields'],
    TRequiredTable['shape']['uniqueFields']
  > extends true
    ? IsContains<
        TInputTable['shape']['primaryFields'],
        TRequiredTable['shape']['primaryFields']
      > extends true
      ? TInputTable['shape']['columns'] extends TRequiredTable['shape']['columns']
        ? true
        : "Columns of InputTable do not match the required table's columns"
      : `Primary fields of InputTable do not match the required table's primary fields. Required: ${Join<TRequiredTable['shape']['primaryFields'], '.'>}, Input: ${Join<TInputTable['shape']['primaryFields'], '.'>}`
    : `Unique fields of InputTable do not match the required table's unique fields. Required: ${Join<TRequiredTable['shape']['uniqueFields'][number], '.'>}, Input: ${Join<TInputTable['shape']['uniqueFields'][number], '.'>}`
