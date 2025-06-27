import { assertType, describe, it } from 'vitest'

import type { VaryCollectionFields } from './__mocks__/vary-collection-server-config'
import type { WhereExpression } from './filter'

type VaryCollectionWhereExpr = WhereExpression<VaryCollectionFields>

describe('assertType: WhereExpression', () => {
  it('For numeric fields, it should support CompareOperators, NullOperators, and ListOperator', () => {
    // CompareOperators
    assertType<VaryCollectionWhereExpr>({
      smallint: { $gt: 1 },
      integer: { $gte: 1 },
      serial: { $lt: 2 },
      smallserial: { $lte: 2 },
      bigserialNumber: { $between: [1, 2] },
      real: { $notBetween: [1, 2] },
      doublePrecision: { $gt: 1 },
    })

    // NullOperators
    assertType<VaryCollectionWhereExpr>({
      smallint: '$isNotNull',
      integer: '$isNull',
      serial: '$isNotNull',
      smallserial: '$isNull',
      bigserialNumber: '$isNotNull',
      real: '$isNull',
      doublePrecision: '$isNotNull',
    })

    // ListOperator
    assertType<VaryCollectionWhereExpr>({
      smallint: {
        $inArray: [1, 2, 3],
      },
      integer: {
        $notInArray: [1, 2, 3],
      },
      serial: {
        $inArray: [1, 2, 3],
      },
      smallserial: {
        $notInArray: [1, 2, 3],
      },
      bigserialNumber: {
        $inArray: [1, 2, 3],
      },
      real: {
        $notInArray: [1, 2, 3],
      },
      doublePrecision: {
        $inArray: [1, 2, 3],
      },
    })
  })

  it('For string fields, it should support StringOperators, NullOperators, EqualityOperator, ListOperator', () => {
    // StringOperators
    assertType<VaryCollectionWhereExpr>({
      text: { $like: '%' },
      textEnum: { $ilike: '%' },
      varchar: { $notIlike: '%' },
      char: { $like: '%' },
    })

    // NullOperators
    assertType<VaryCollectionWhereExpr>({
      text: '$isNotNull',
      textEnum: '$isNull',
      varchar: '$isNotNull',
      char: '$isNull',
    })

    // EqualityOperator
    assertType<VaryCollectionWhereExpr>({
      text: { $eq: 'text' },
      textEnum: { $eq: 'textEnum' },
      varchar: { $eq: 'varchar' },
      char: { $eq: 'char' },
    })

    // ListOperator
    assertType<VaryCollectionWhereExpr>({
      text: { $inArray: ['text', 'textEnum', 'varchar', 'char'] },
      textEnum: { $notInArray: ['text', 'textEnum', 'varchar', 'char'] },
      varchar: { $inArray: ['text', 'textEnum', 'varchar', 'char'] },
      char: { $notInArray: ['text', 'textEnum', 'varchar', 'char'] },
    })
  })

  it('For boolean fields, it should support NullOperators, EqualityOperator', () => {
    // EqualityOperator
    assertType<VaryCollectionWhereExpr>({
      boolean: { $eq: true },
    })
    assertType<VaryCollectionWhereExpr>({
      boolean: { $ne: false },
    })

    // NullOperators
    assertType<VaryCollectionWhereExpr>({
      boolean: '$isNotNull',
    })
    assertType<VaryCollectionWhereExpr>({
      boolean: '$isNull',
    })
  })

  it('For JSON, JSONB, and Array fields, it should support ArrayOperators, NullOperators, and ListOperator', () => {
    // ArrayOperators
    assertType<VaryCollectionWhereExpr>({
      json: { $arrayContained: [1, '2'] },
      jsonb: { $arrayContains: [2, true] },
      jsonType: { $arrayOverlaps: [3, 5, null] },
      jsonbType: { $arrayContained: [false, 3] },
      arrayOfBooleans: { $arrayContained: [1, '2'] },
      arrayOfDates: { $arrayContains: [2, true] },
      arrayOfEnums: { $arrayOverlaps: [3, 5, null] },
      arrayOfNumbers: { $arrayContained: [1, '2'] },
      arrayOfText: { $arrayContains: [2, true] },
      arrayOfTimes: { $arrayOverlaps: [3, 5, null] },
    })

    // NullOperators
    assertType<VaryCollectionWhereExpr>({
      json: '$isNull',
      jsonb: '$isNotNull',
      jsonType: '$isNull',
      jsonbType: '$isNotNull',
      arrayOfBooleans: '$isNull',
      arrayOfDates: '$isNotNull',
      arrayOfEnums: '$isNull',
      arrayOfNumbers: '$isNull',
      arrayOfText: '$isNotNull',
      arrayOfTimes: '$isNull',
    })

    // ListOperator
    assertType<VaryCollectionWhereExpr>({
      json: { $inArray: [1, false] },
      jsonb: { $notInArray: [0, true] },
      jsonType: { $inArray: [1, false] },
      jsonbType: { $notInArray: [0, true] },
      arrayOfBooleans: { $inArray: [1, false] },
      arrayOfDates: { $notInArray: [0, true] },
      arrayOfEnums: { $inArray: [1, false] },
      arrayOfNumbers: { $notInArray: [1, false] },
      arrayOfText: { $inArray: [0, true] },
      arrayOfTimes: { $notInArray: [1, false] },
    })
  })

  it('For date, time, datetime fields, it should support CompareOperators, NullOperators, and ListOperator', () => {
    // CompareOperators
    assertType<VaryCollectionWhereExpr>({
      time: { $between: [new Date(), new Date()] },
      timestamp: { $gt: new Date() },
      date: { $gte: new Date() },
    })

    // NullOperators
    assertType<VaryCollectionWhereExpr>({
      time: { $eq: new Date() },
      timestamp: { $ne: new Date() },
      date: { $eq: new Date() },
    })

    // ListOperator
    assertType<VaryCollectionWhereExpr>({
      time: { $inArray: [new Date()] },
      timestamp: { $notInArray: [new Date()] },
      date: { $inArray: [new Date()] },
    })
  })
})
