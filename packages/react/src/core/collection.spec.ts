import { assertType, test } from 'vitest'

import type { VaryCollectionFields } from './__mocks__/vary-collection-server-config'
import type { InferColumnsType } from './collection'

test('assertType: InferColumnWithTypes', () => {
  assertType<InferColumnsType<VaryCollectionFields>>({ integer: 'PgInteger' })
  assertType<InferColumnsType<VaryCollectionFields>>({ smallint: 'PgSmallInt' })
  assertType<InferColumnsType<VaryCollectionFields>>({ serial: 'PgSerial' })
  assertType<InferColumnsType<VaryCollectionFields>>({ smallserial: 'PgSmallSerial' })
  assertType<InferColumnsType<VaryCollectionFields>>({ bigserialNumber: 'PgBigSerial53' })
  assertType<InferColumnsType<VaryCollectionFields>>({ boolean: 'PgBoolean' })
  assertType<InferColumnsType<VaryCollectionFields>>({ text: 'PgText' })
  assertType<InferColumnsType<VaryCollectionFields>>({ textEnum: 'PgText' })
  assertType<InferColumnsType<VaryCollectionFields>>({ varchar: 'PgVarchar' })
  assertType<InferColumnsType<VaryCollectionFields>>({ char: 'PgChar' })
  assertType<InferColumnsType<VaryCollectionFields>>({ real: 'PgReal' })
  assertType<InferColumnsType<VaryCollectionFields>>({ doublePrecision: 'PgDoublePrecision' })
  assertType<InferColumnsType<VaryCollectionFields>>({ json: 'PgJson' })
  assertType<InferColumnsType<VaryCollectionFields>>({ jsonType: 'PgJson' })
  assertType<InferColumnsType<VaryCollectionFields>>({ jsonb: 'PgJsonb' })
  assertType<InferColumnsType<VaryCollectionFields>>({ jsonbType: 'PgJsonb' })
  assertType<InferColumnsType<VaryCollectionFields>>({ time: 'PgTime' })
  assertType<InferColumnsType<VaryCollectionFields>>({ timestamp: 'PgTimestamp' })
  assertType<InferColumnsType<VaryCollectionFields>>({ date: 'PgDateString' })
  assertType<InferColumnsType<VaryCollectionFields>>({ arrayOfText: 'PgArray' })
  assertType<InferColumnsType<VaryCollectionFields>>({ arrayOfNumbers: 'PgArray' })
  assertType<InferColumnsType<VaryCollectionFields>>({ arrayOfBooleans: 'PgArray' })
  assertType<InferColumnsType<VaryCollectionFields>>({ arrayOfDates: 'PgArray' })
  assertType<InferColumnsType<VaryCollectionFields>>({ arrayOfTimes: 'PgArray' })
  assertType<InferColumnsType<VaryCollectionFields>>({ arrayOfEnums: 'PgArray' })
})
