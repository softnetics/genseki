import { assertType, test } from 'vitest'

import type { VaryCollectionFields } from './__mocks__/vary-collection-server-config'
import type { InferColumnsType } from './collection'

test('assertType: InferColumnWithTypes', () => {
  assertType<InferColumnsType<VaryCollectionFields>>({
    integer: 'PgInteger',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    smallint: 'PgSmallInt',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    serial: 'PgSerial',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    smallserial: 'PgSmallSerial',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    bigserialNumber: 'PgBigSerial53',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    boolean: 'PgBoolean',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    text: 'PgText',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    textEnum: 'PgText',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    varchar: 'PgVarchar',
  })
  assertType<InferColumnsType<VaryCollectionFields>>({
    char: 'PgChar',
  })
})
