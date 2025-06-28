import {
  and,
  arrayContained,
  arrayContains,
  arrayOverlaps,
  between,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  not,
  notBetween,
  notIlike,
  notInArray,
  or,
  type SQL,
  type TableRelationalConfig,
} from 'drizzle-orm'
import { isObjectType } from 'remeda'
import type { IfAny } from 'type-fest'

import type { AnyFields } from '.'
import type { InferColumnsType } from './collection'
import type { FieldsWithFieldName } from './field'

/* === Primitive Operators === */

type eqOperator<Operand = unknown> = { $eq: Operand }
const isEqOperator = (op: PrimitiveOperators): op is eqOperator =>
  typeof op === 'object' && '$eq' in op

type neOperator<Operand = unknown> = { $ne: Operand }
const isNeOperator = (op: PrimitiveOperators): op is neOperator =>
  typeof op === 'object' && '$ne' in op

type gtOperator<Operand = unknown> = { $gt: Operand }
const isGtOperator = (op: PrimitiveOperators): op is gtOperator =>
  typeof op === 'object' && '$gt' in op

type gteOperator<Operand = unknown> = { $gte: Operand }
const isGteOperator = (op: PrimitiveOperators): op is gteOperator =>
  typeof op === 'object' && '$gte' in op

type ltOperator<Operand = unknown> = { $lt: Operand }
const isLtOperator = (op: PrimitiveOperators): op is ltOperator =>
  typeof op === 'object' && '$lt' in op

type lteOperator<Operand = unknown> = { $lte: Operand }
const isLteOperator = (op: PrimitiveOperators): op is lteOperator =>
  typeof op === 'object' && '$lte' in op

type inArrayOperator<Operand extends unknown[] = unknown[]> = { $inArray: Operand }
const isInArrayOperator = (op: PrimitiveOperators): op is inArrayOperator =>
  typeof op === 'object' && '$inArray' in op

type notInArrayOperator<Operand extends unknown[] = unknown[]> = { $notInArray: Operand }
const isNotInArrayOperator = (op: PrimitiveOperators): op is notInArrayOperator =>
  typeof op === 'object' && '$notInArray' in op

type betweenOperator<Operand extends [unknown, unknown] = [unknown, unknown]> = {
  $between: Operand
}
const isBetweenOperator = (op: PrimitiveOperators): op is betweenOperator =>
  typeof op === 'object' && '$between' in op

type notBetweenOperator<Operand extends [unknown, unknown] = [unknown, unknown]> = {
  $notBetween: Operand
}
const isNotBetweenOperator = (op: PrimitiveOperators): op is notBetweenOperator =>
  typeof op === 'object' && '$notBetween' in op

type likeOperator = { $like: string }
const isLikeOperator = (op: PrimitiveOperators): op is likeOperator =>
  typeof op === 'object' && '$like' in op

type ilikeOperator = { $ilike: string }
const isIlikeOperator = (op: PrimitiveOperators): op is ilikeOperator =>
  typeof op === 'object' && '$ilike' in op

type notIlikeOperator = { $notIlike: string }
const isNotIlikeOperator = (op: PrimitiveOperators): op is notIlikeOperator =>
  typeof op === 'object' && '$notIlike' in op

type arrayContainsOperator<Operand extends unknown[] = unknown[]> = { $arrayContains: Operand }
const isArrayContainsOperator = (op: PrimitiveOperators): op is arrayContainsOperator =>
  typeof op === 'object' && '$arrayContains' in op

type arrayContainedOperator<Operand extends unknown[] = unknown[]> = { $arrayContained: Operand }
const isArrayContainedOperator = (op: PrimitiveOperators): op is arrayContainedOperator =>
  typeof op === 'object' && '$arrayContained' in op

type arrayOverlapsOperator<Operand extends unknown[] = unknown[]> = { $arrayOverlaps: Operand }

const isArrayOverlapsOperator = (op: PrimitiveOperators): op is arrayOverlapsOperator =>
  typeof op === 'object' && '$arrayOverlaps' in op

type isNullOperator = '$isNull'
type isNotNullOperator = '$isNotNull'
type PrimitiveOperators =
  | eqOperator
  | neOperator
  | gtOperator
  | gteOperator
  | ltOperator
  | lteOperator
  | isNullOperator
  | isNotNullOperator
  | inArrayOperator
  | notInArrayOperator
  | betweenOperator
  | notBetweenOperator
  | likeOperator
  | ilikeOperator
  | notIlikeOperator
  | arrayContainsOperator
  | arrayContainedOperator
  | arrayOverlapsOperator

const isOperators = (obj: unknown): obj is PrimitiveOperators => {
  if (!obj) return false

  switch (typeof obj) {
    case 'object': {
      const [command] = Object.keys(obj)

      return command.startsWith('$') && !['$and', '$or', '$not'].includes(command)
    }

    case 'string':
      return obj === '$isNull' || obj === '$isNotNull'

    default:
      return false
  }
}

/* === Gropped Operators === */
type EqualityOperator<Operand> = eqOperator<Operand> | neOperator<Operand>

type CompareOperators<Operand> =
  | EqualityOperator<Operand>
  | gtOperator<Operand>
  | gteOperator<Operand>
  | ltOperator<Operand>
  | lteOperator<Operand>
  | betweenOperator<[Operand, Operand]>
  | notBetweenOperator<[Operand, Operand]>

type NullOperators = isNotNullOperator | isNullOperator

type ListOperator<Operand extends unknown[]> =
  | inArrayOperator<Operand>
  | notInArrayOperator<Operand>

type ArrayOperators<Operand extends unknown[]> =
  | arrayContainsOperator<Operand>
  | arrayContainedOperator<Operand>
  | arrayOverlapsOperator<Operand>

/* === Operations available to column type === */
type StringOperators = likeOperator | ilikeOperator | notIlikeOperator

type NumericOperations = NullOperators | CompareOperators<number> | ListOperator<number[]>
type StringOperations =
  | NullOperators
  | StringOperators
  | EqualityOperator<string>
  | ListOperator<string[]>
type BooleanOperations = NullOperators | EqualityOperator<boolean>

type ArrayableOperations = NullOperators | ArrayOperators<unknown[]> | ListOperator<unknown[]>

type DateTimeOperations =
  | NullOperators
  | EqualityOperator<Date>
  | CompareOperators<Date>
  | ListOperator<Date[]>

/* === Groupped PG-columns type */
type PgNumericType =
  | 'PgInteger'
  | 'PgNumeric'
  | 'PgNumericNumber'
  | 'PgNumericBigInt'
  | 'PgReal'
  | 'PgSerial'
  | 'PgSmallInt'
  | 'PgSmallSerial'
  | 'PgBigInt53'
  | 'PgBigInt64'
  | 'PgBigSerial53'
  | 'PgBigSerial64'
  | 'PgDoublePrecision'

type PgBooleanType = 'PgBoolean'

type PgStringType = 'PgUUID' | 'PgChar' | 'PgText' | 'PgVarchar'

type PgPossibleArrayType = 'PgArray' | 'PgJson' | 'PgJsonb'

type PgDateTimeType = 'PgDate' | 'PgDateString' | 'PgTime' | 'PgTimestamp' | 'PgTimestampString'

/**
 * TODO: Uncategorized types
 *
 * PgCidr
 * PgCustomColumn
 * PgEnumObjectColumn
 * PgEnumColumn
 * PgInet
 * PgInterval
 * PgLine
 * PgLineABC
 * PgMacaddr
 * PgMacaddr8
 * PgPointTuple
 * PgPointObject
 * PgGeometry
 * PgGeometryObject
 * PgBinaryVector
 * PgHalfVector
 * PgSparseVector
 * PgVector
 */

type OperationForType<TColumnType extends string> = TColumnType extends PgNumericType
  ? NumericOperations
  : TColumnType extends PgStringType
    ? StringOperations
    : TColumnType extends PgBooleanType
      ? BooleanOperations
      : TColumnType extends PgPossibleArrayType
        ? ArrayableOperations
        : TColumnType extends PgDateTimeType
          ? DateTimeOperations
          : any

type ColumnExpression<
  TFields extends AnyFields,
  ColumnTypes extends InferColumnsType<TFields> = InferColumnsType<TFields>,
> =
  ColumnTypes extends Record<infer TColumnName, infer TColumnType extends string>
    ? Record<TColumnName, OperationForType<TColumnType>>
    : never

export type AndExpression<TFields extends AnyFields> = {
  $and: WhereExpression<TFields>[]
}
const isAndExpression = <TFields extends AnyFields>(op: unknown): op is AndExpression<TFields> =>
  typeof op === 'object' && !!op && '$and' in op

export type OrExpression<TFields extends AnyFields> = {
  $or: WhereExpression<TFields>[]
}
const isOrExpression = <TFields extends AnyFields>(op: unknown): op is OrExpression<TFields> =>
  typeof op === 'object' && !!op && '$or' in op

export type NotExpression<TFields extends AnyFields> = {
  $not: WhereExpression<TFields>
}
const isNotExpression = <TFields extends AnyFields>(op: unknown): op is NotExpression<TFields> =>
  typeof op === 'object' && !!op && '$not' in op
type BooleanExpressionOperations<TFields extends AnyFields> =
  | AndExpression<TFields>
  | OrExpression<TFields>
  | NotExpression<TFields>

export type WhereExpression<TFields extends AnyFields> =
  TFields extends FieldsWithFieldName<infer R>
    ? IfAny<R, any, BooleanExpressionOperations<TFields> | ColumnExpression<TFields>>
    : never

const operatorToSQL =
  (table: TableRelationalConfig) =>
  (columnName: keyof typeof table.columns, verb: PrimitiveOperators): SQL => {
    const column = table.columns[columnName]
    if (!isObjectType(verb)) return verb === '$isNotNull' ? isNotNull(column) : isNull(column)

    switch (true) {
      case isEqOperator(verb):
        return eq(column, verb['$eq'])
      case isNeOperator(verb):
        return ne(column, verb['$ne'])
      case isGtOperator(verb):
        return gt(column, verb['$gt'])
      case isGteOperator(verb):
        return gte(column, verb['$gte'])
      case isLtOperator(verb):
        return lt(column, verb['$lt'])
      case isLteOperator(verb):
        return lte(column, verb['$lte'])
      case isInArrayOperator(verb):
        return inArray(column, verb['$inArray'])
      case isNotInArrayOperator(verb):
        return notInArray(column, verb['$notInArray'])
      case isBetweenOperator(verb):
        return between(column, ...verb['$between'])
      case isNotBetweenOperator(verb):
        return notBetween(column, ...verb['$notBetween'])
      case isLikeOperator(verb):
        return like(column, verb['$like'])
      case isIlikeOperator(verb):
        return ilike(column, verb['$ilike'])
      case isNotIlikeOperator(verb):
        return notIlike(column, verb['$notIlike'])
      case isArrayContainsOperator(verb):
        return arrayContains(column, verb['$arrayContains'])
      case isArrayContainedOperator(verb):
        return arrayContained(column, verb['$arrayContained'])
      case isArrayOverlapsOperator(verb):
        return arrayOverlaps(column, verb['$arrayOverlaps'])
      default:
        throw new Error(`Unknown verb: ${columnName}: ${JSON.stringify(verb)}`)
    }
  }
export const transformQueryObjectToSQL = <TFields extends AnyFields>(
  table: TableRelationalConfig
) => {
  const toSQL = operatorToSQL(table)
  const sqlize = (exp: WhereExpression<TFields>): SQL | undefined => {
    const sqls = Object.entries(exp).map(([columnOrOperator, operands]) => {
      if (isOperators(operands)) return toSQL(columnOrOperator, operands)
      const expr = { [columnOrOperator]: operands }
      if (isAndExpression(expr)) return and(...expr['$and'].map(sqlize))
      if (isOrExpression(expr)) return or(...expr['$or'].map(sqlize))
      if (isNotExpression(expr)) {
        const sqlized = sqlize(expr['$not'])
        if (!sqlized) throw new Error(`${expr['$not']} is invalid`)

        return not(sqlized)
      }
      throw new Error(`Unknown expr: ${expr}`)
    })

    if (sqls.length > 1) return and(...sqls)
    return sqls[0]
  }
  return sqlize
}
