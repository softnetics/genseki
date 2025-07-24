import { describe, expect, test } from 'vitest'

import {
  transformFieldPayloadToPrismaCreatePayload,
  transformFieldPayloadToPrismaUpdatePayload,
} from '.'

import { mockContext } from '../__mocks__/context'
import { FullModelSchemas } from '../__mocks__/unsanitized'
import { Builder } from '../builder'
import type { InferCreateFieldsShape } from '../collection'

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
        options: () => [],
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
    options: () => [],
  })),
}))

describe('transformToPrismaCreatePayload', () => {
  test('should transform payload correctly 1', () => {
    const input = {
      nameField: 'John Doe',
      postsField: [
        {
          create: {
            titleField: 'Hello World',
            contentField: {},
            tagsField: [
              { connect: 'mock-tag-id' },
              {
                create: {
                  nameField: 'New Tag',
                },
              },
            ],
          },
        },
      ],
      profileField: {
        connect: 'mock-profile-id',
      },
    } satisfies InferCreateFieldsShape<(typeof userFields)['shape']>

    const expected = {
      name: 'John Doe',
      posts: {
        create: [
          {
            title: 'Hello World',
            content: {},
            tags: {
              connect: [{ id: 'mock-tag-id' }],
              create: { name: 'New Tag' },
            },
          },
        ],
      },
      profile: {
        connect: {
          id: 'mock-profile-id',
        },
      },
    }

    const output = transformFieldPayloadToPrismaCreatePayload(userFields, input)
    expect(output).toEqual(expected)
  })
})

describe('transformToPrismaUpdatePayload', () => {
  test('should transform payload correctly', () => {
    const input = {
      nameField: 'John Doe',
      postsField: [
        {
          create: {
            titleField: 'Hello World',
            contentField: {},
            tagsField: [
              {
                connect: 'mock-tag-id',
              },
              {
                create: {
                  nameField: 'New Tag',
                },
              },
            ],
          },
        },
      ],
      profileField: {
        connect: 'mock-profile-id',
      },
    } satisfies InferCreateFieldsShape<(typeof userFields)['shape']>

    const expected = {
      name: 'John Doe',
      posts: {
        create: [
          {
            title: 'Hello World',
            content: {},
            tags: {
              connect: [{ id: 'mock-tag-id' }],
              create: { name: 'New Tag' },
            },
          },
        ],
      },
      profile: {
        connect: {
          id: 'mock-profile-id',
        },
      },
    }

    const output = transformFieldPayloadToPrismaUpdatePayload(userFields, input)
    expect(output).toEqual(expected)
  })
})
