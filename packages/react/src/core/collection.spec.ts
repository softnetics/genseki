import type { JsonValue } from 'type-fest'
import { describe, expectTypeOf, it } from 'vitest'

import { mockContext } from './__mocks__/context'
import { FullModelSchemas } from './__mocks__/unsanitized'
import { Builder } from './builder'
import type { InferCreateFields, InferFields, InferUpdateFields } from './collection'

type Expect<A, B> = A extends B ? (B extends A ? true : never) : never

const builder = new Builder({
  context: mockContext,
  schema: FullModelSchemas,
})

const userFields = builder.fields('user', (fb) => ({
  nameField: fb.columns('name', {
    type: 'text',
  }),
  postsField: fb.relations('posts', (fb) => ({
    type: 'create',
    fields: fb.fields('post', (fb) => ({
      titleField: fb.columns('title', {
        type: 'text',
      }),
      contentField: fb.columns('content', {
        type: 'richText',
        editor: {},
      }),
      tagsField: fb.relations('tags', (fb) => ({
        type: 'connectOrCreate',
        fields: fb.fields('tag', (fb) => ({
          nameField: fb.columns('name', {
            type: 'text',
          }),
        })),
        options: 'tags',
      })),
    })),
  })),
  profileField: fb.relations('profile', (fb) => ({
    type: 'connect',
    fields: fb.fields('profile', (fb) => ({
      userIdField: fb.columns('userId', {
        type: 'text',
      }),
    })),
    options: 'profile',
  })),
}))

describe('Collection', () => {
  it('should InferFields correctly', () => {
    expectTypeOf<{ wow: string }>().toEqualTypeOf<{ wow: string }>()

    type Input = InferFields<typeof userFields>

    type Expected = {
      __pk: string | number
      __id: string | number
      nameField?: string | null
      postsField: {
        __pk: string | number
        __id: string | number
        titleField: string
        contentField: JsonValue
        tagsField: {
          __id: string | number
          __pk: string | number
          nameField: string
        }[]
      }[]
      profileField?: {
        __id: string | number
        __pk: string | number
        userIdField: string
      } | null
    }

    expectTypeOf<Expect<Input, Expected>>().toEqualTypeOf<true>()
  })

  it('should InferCreateFields correctly', () => {
    type Input = InferCreateFields<typeof userFields>

    type Expected = {
      nameField?: string | null
      postsField: {
        create?: {
          titleField: string
          contentField: JsonValue
          tagsField: {
            connect?: string
            create?: {
              nameField: string
            }
          }[]
        }
      }[]
      profileField: {
        connect?: string
      }
    }

    expectTypeOf<Expect<Input, Expected>>().toEqualTypeOf<true>()
  })

  it('should InferUpdateFields correctly', () => {
    type Input = InferUpdateFields<typeof userFields>

    type Expected = {
      nameField?: string | null
      postsField: {
        create?: {
          titleField: string
          contentField: JsonValue
          tagsField: {
            connect?: string
            create?: {
              nameField: string
            }
            disconnect?: string
          }[]
        }
        connect?: string
        disconnect?: string
      }[]
      profileField: {
        connect?: string
        disconnect?: string
      }
    }

    expectTypeOf<Expect<Input, Expected>>().toEqualTypeOf<true>()
  })
})
