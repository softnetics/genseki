import {
  and,
  arrayContained,
  arrayContains,
  arrayOverlaps,
  between,
  createTableRelationsHelpers,
  eq,
  extractTablesRelationalConfig,
  gt,
  gte,
  ilike,
  inArray,
  like,
  lt,
  lte,
  ne,
  notBetween,
  notIlike,
  notInArray,
  or,
} from 'drizzle-orm'
import { assertType, describe, expect, it } from 'vitest'

import { schema, type VaryCollectionFields } from './__mocks__/vary-collection-server-config'
import { transformQueryObjectToSQL, type WhereExpression } from './filter'

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

const tableRelationalConfig = extractTablesRelationalConfig(schema, createTableRelationsHelpers)

describe('mapExpressionToSQL', () => {
  const varyTable = tableRelationalConfig.tables['vary']
  const toSQL = transformQueryObjectToSQL<VaryCollectionFields>(varyTable)

  it('should map $eq expression correctly', () => {
    expect(toSQL({ integer: { $eq: 1 } })).toStrictEqual(eq(schema.vary.integer, 1))
  })
  it('should map $ne expression correctly', () => {
    expect(toSQL({ integer: { $ne: 1 } })).toStrictEqual(ne(schema.vary.integer, 1))
  })
  it('should map $gt expression correctly', () => {
    expect(toSQL({ integer: { $gt: 1 } })).toStrictEqual(gt(schema.vary.integer, 1))
  })
  it('should map $gte expression correctly', () => {
    expect(toSQL({ integer: { $gte: 1 } })).toStrictEqual(gte(schema.vary.integer, 1))
  })
  it('should map $lt expression correctly', () => {
    expect(toSQL({ integer: { $lt: 1 } })).toStrictEqual(lt(schema.vary.integer, 1))
  })
  it('should map $lte expression correctly', () => {
    expect(toSQL({ integer: { $lte: 1 } })).toStrictEqual(lte(schema.vary.integer, 1))
  })
  it('should map $inArray expression correctly', () => {
    expect(toSQL({ integer: { $inArray: [1, 2] } })).toStrictEqual(
      inArray(schema.vary.integer, [1, 2])
    )
  })
  it('should map $notInArray expression correctly', () => {
    expect(toSQL({ integer: { $notInArray: [1, 2] } })).toStrictEqual(
      notInArray(schema.vary.integer, [1, 2])
    )
  })
  it('should map $between expression correctly', () => {
    expect(toSQL({ integer: { $between: [1, 3] } })).toStrictEqual(
      between(schema.vary.integer, 1, 3)
    )
  })
  it('should map $notBetween expression correctly', () => {
    expect(toSQL({ integer: { $notBetween: [1, 3] } })).toStrictEqual(
      notBetween(schema.vary.integer, 1, 3)
    )
  })
  it('should map $like expression correctly', () => {
    expect(toSQL({ varchar: { $like: '%a%' } })).toStrictEqual(like(schema.vary.varchar, '%a%'))
  })
  it('should map $ilike expression correctly', () => {
    expect(toSQL({ varchar: { $ilike: '%a%' } })).toStrictEqual(ilike(schema.vary.varchar, '%a%'))
  })
  it('should map $notIlike expression correctly', () => {
    expect(toSQL({ varchar: { $notIlike: '%a%' } })).toStrictEqual(
      notIlike(schema.vary.varchar, '%a%')
    )
  })
  it('should map $arrayContains expression correctly', () => {
    expect(toSQL({ arrayOfText: { $arrayContains: ['a'] } })).toStrictEqual(
      arrayContains(schema.vary.arrayOfText, ['a'])
    )
  })
  it('should map $arrayContained expression correctly', () => {
    expect(toSQL({ arrayOfText: { $arrayContained: ['a'] } })).toStrictEqual(
      arrayContained(schema.vary.arrayOfText, ['a'])
    )
  })
  it('should map $arrayOverlaps expression correctly', () => {
    expect(toSQL({ arrayOfText: { $arrayOverlaps: ['a'] } })).toStrictEqual(
      arrayOverlaps(schema.vary.arrayOfText, ['a'])
    )
  })

  it('should map multiple fields object with $and conjuncture', () => {
    expect(
      toSQL({
        arrayOfText: { $arrayOverlaps: ['a'] },
        varchar: { $like: '%a%b' },
        integer: { $lte: 1000 },
      })
    ).toStrictEqual(
      and(
        arrayOverlaps(schema.vary.arrayOfText, ['a']),
        like(schema.vary.varchar, '%a%b'),
        lte(schema.vary.integer, 1000)
      )
    )
  })

  it('should map $or operation correctly', () => {
    expect(
      toSQL({
        $or: [
          { real: { $gte: 30 } },
          { text: { $like: '%A%' } },
          { smallint: { $inArray: [1, 2, 3, 4] } },
        ],
      })
    ).toStrictEqual(
      or(
        gte(schema.vary.real, 30),
        like(schema.vary.text, '%A%'),
        inArray(schema.vary.smallint, [1, 2, 3, 4])
      )
    )
  })

  it('should map nested query correctly', () => {
    expect(
      toSQL({
        $or: [
          { real: { $gte: 30 } },
          { text: { $like: '%A%' } },
          { smallint: { $inArray: [1, 2, 3, 4] } },
        ],
        boolean: { $eq: true },
      })
    ).toStrictEqual(
      and(
        or(
          gte(schema.vary.real, 30),
          like(schema.vary.text, '%A%'),
          inArray(schema.vary.smallint, [1, 2, 3, 4])
        ),
        eq(schema.vary.boolean, true)
      )
    )

    expect(
      toSQL({
        $or: [
          { real: { $gte: 30 } },
          {
            $and: [{ text: { $like: '%A%' } }, { smallint: { $inArray: [1, 2, 3, 4] } }],
          },
        ],
        boolean: { $eq: true },
      })
    ).toStrictEqual(
      and(
        or(
          gte(schema.vary.real, 30),
          and(like(schema.vary.text, '%A%'), inArray(schema.vary.smallint, [1, 2, 3, 4]))
        ),
        eq(schema.vary.boolean, true)
      )
    )

    expect(
      toSQL({
        $or: [
          {
            $and: [
              { text: { $like: '%A%' } },
              { $or: [{ smallint: { $inArray: [4, 3, 2, 1] } }, { real: { $gte: 30 } }] },
            ],
          },
        ],
        boolean: { $eq: true },
      })
    ).toStrictEqual(
      and(
        or(
          and(
            like(schema.vary.text, '%A%'),
            or(inArray(schema.vary.smallint, [4, 3, 2, 1]), gte(schema.vary.real, 30))
          )
        ),
        eq(schema.vary.boolean, true)
      )
    )

    expect(
      toSQL({
        $or: [
          {
            text: { $like: '%A%' },
            $or: [{ smallint: { $inArray: [9, 8, 7, 6] } }, { real: { $gte: 30 } }],
          },
        ],
        boolean: { $eq: true },
      })
    ).toStrictEqual(
      and(
        or(
          and(
            like(schema.vary.text, '%A%'),
            or(inArray(schema.vary.smallint, [9, 8, 7, 6]), gte(schema.vary.real, 30))
          )
        ),
        eq(schema.vary.boolean, true)
      )
    )
  })
})
