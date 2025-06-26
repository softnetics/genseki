import { drizzle } from 'drizzle-orm/node-postgres'

import { allFieldTypes } from './all-type-schema'
import * as baseSchema from './complex-schema'

import { Builder } from '../builder'
import { defineBaseConfig, defineServerConfig } from '../config'

const schema = {
  ...baseSchema,
  vary: allFieldTypes,
}
const db = drizzle({
  connection: '',
  schema: schema,
})

export const baseConfig = defineBaseConfig({
  db: db,
  schema: schema,
  context: { example: 'example' },
  auth: {
    user: {
      model: schema.user,
    },
    session: {
      model: schema.session,
    },
    account: {
      model: schema.account,
    },
    verification: {
      model: schema.verification,
    },
    emailAndPassword: {
      enabled: true,
    },
    oauth2: {
      google: {
        enabled: true,
        clientId: '',
        clientSecret: '',
      },
    },
    secret: '',
  },
})
const builder = new Builder({ schema }).$context<typeof baseConfig.context>()
const vary = builder.collection('vary', {
  slug: 'allFields',
  identifierColumn: 'bigserialBigInt',
  fields: builder.fields('vary', (fb) => ({
    integer: fb.columns('integer', {
      type: 'number',
    }),
    smallint: fb.columns('smallint', { type: 'number' }),
    // bigint: fb.columns('bigint', { type: 'number' }), // Not supported yet
    serial: fb.columns('serial', { type: 'number' }),
    smallserial: fb.columns('smallserial', { type: 'number' }),
    bigserial_number: fb.columns('bigserialNumber', { type: 'number' }),
    // bigserialBigInt: fb.columns('bigserialBigInt', { type: 'number' }), // Not supported yet
    boolean: fb.columns('boolean', { type: 'switch' }),
    text: fb.columns('text', { type: 'text' }),
    text_enum: fb.columns('textEnum', { type: 'text' }),
    varchar: fb.columns('varchar', { type: 'text' }),
    char: fb.columns('char', { type: 'text' }),
  })),
})
export const serverConfig = defineServerConfig(baseConfig, {
  collections: {
    vary,
  },
})

export type VaryCollectionFields = typeof serverConfig.collections.vary.fields
export type ServerConfigContext = typeof serverConfig.context
