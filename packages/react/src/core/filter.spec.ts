import { assertType, test } from 'vitest'

import type { VaryCollectionFields } from './__mocks__/vary-collection-server-config'
import type { WhereExpression } from './filter'

test('assertType: WhereExpression', () => {
  assertType<WhereExpression<VaryCollectionFields>>({
    $and: [{ integer: { $eq: 1 } }, { $or: [{ boolean: '$isNotNull' }] }],
    bigserialNumber: { $eq: 1 },

    integer: { $between: [1, 2] },
    text: { $ilike: '23' },
    boolean: { $eq: true },
    char: { $like: '' },
    textEnum: { $inArray: [''] },
    varchar: { $ilike: '' },
  })
})
