import { describe, expect, it } from 'vitest'

import {
  transformFieldPayloadToPrismaCreatePayload,
  transformFieldPayloadToPrismaUpdatePayload,
  transformFieldsToPrismaSelectPayload,
  transformPrismaResultToFieldsPayload,
} from '.'

import { mockContext } from '../__mocks__/context'
import { FullModelSchemas } from '../__mocks__/unsanitized'
import { Builder } from '../builder'
import type { InferCreateFields, InferFields, InferUpdateFields } from '../collection'

const builder = new Builder({
  context: mockContext,
  schema: FullModelSchemas,
})

const userFields = builder.fields('user', (fb) => ({
  nameField: fb.columns('name', {
    type: 'text',
  }),
  roles: fb.columns('roles', {
    type: 'comboboxText',
    options: 'roles',
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
        options: 'posts',
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
  staffInfo: fb.relations('staffInfo', (fb) => ({
    type: 'connect',
    required: false,
    fields: fb.fields('staffInfo', (fb) => ({
      position: fb.columns('position', {
        type: 'text',
      }),
      department: fb.columns('department', {
        type: 'text',
      }),
    })),
    options: 'staff',
  })),
}))

const userFieldsOptional = builder.fields('user', (fb) => ({
  nameField: fb.columns('name', {
    type: 'text',
  }),
  roles: fb.columns('roles', {
    type: 'comboboxText',
    options: 'roles',
    required: false,
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
        options: 'posts',
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
  staffInfo: fb.relations('staffInfo', (fb) => ({
    type: 'connect',
    required: false,
    fields: fb.fields('staffInfo', (fb) => ({
      position: fb.columns('position', {
        type: 'text',
      }),
      department: fb.columns('department', {
        type: 'text',
      }),
    })),
    options: 'staff',
  })),
}))

describe('transformer', () => {
  describe('transformToPrismaCreatePayload', () => {
    it('should transform payload correctly', () => {
      const input = {
        nameField: 'John Doe',
        staffInfo: undefined,
        roles: ['admin'],
        postsField: [
          {
            create: {
              titleField: 'Hello World',
              contentField: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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
      } satisfies InferCreateFields<typeof userFields>

      const expected = {
        name: 'John Doe',
        roles: ['admin'],
        posts: {
          create: [
            {
              title: 'Hello World',
              content: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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

    it('should transform payload correctly (with optional undefined)', () => {
      const input = {
        nameField: 'John Doe',
        staffInfo: undefined,
        roles: undefined,
        postsField: [
          {
            create: {
              titleField: 'Hello World',
              contentField: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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
      } satisfies InferCreateFields<typeof userFieldsOptional>

      const expected = {
        name: 'John Doe',
        posts: {
          create: [
            {
              title: 'Hello World',
              content: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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

      const output = transformFieldPayloadToPrismaCreatePayload(userFieldsOptional, input)
      expect(output).toEqual(expected)
    })

    it('should transform payload correctly (with optional null)', () => {
      const input = {
        nameField: 'John Doe',
        staffInfo: undefined,
        roles: null,
        postsField: [
          {
            create: {
              titleField: 'Hello World',
              contentField: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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
      } satisfies InferCreateFields<typeof userFieldsOptional>

      const expected = {
        name: 'John Doe',
        roles: null,
        posts: {
          create: [
            {
              title: 'Hello World',
              content: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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

      const output = transformFieldPayloadToPrismaCreatePayload(userFieldsOptional, input)
      expect(output).toEqual(expected)
    })
  })

  describe('transformToPrismaUpdatePayload', () => {
    it('should transform payload correctly', () => {
      const input = {
        nameField: 'John Doe',
        staffInfo: undefined,
        roles: ['admin'],
        postsField: [
          {
            create: {
              titleField: 'Hello World',
              contentField: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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
      } satisfies InferUpdateFields<typeof userFields>

      const expected = {
        name: 'John Doe',
        roles: ['admin'],
        posts: {
          create: [
            {
              title: 'Hello World',
              content: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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

    it('should transform payload correctly (with optional undefined)', () => {
      const input = {
        nameField: 'John Doe',
        staffInfo: undefined,
        roles: undefined,
        postsField: [
          {
            create: {
              titleField: 'Hello World',
              contentField: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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
      } satisfies InferUpdateFields<typeof userFieldsOptional>

      const expected = {
        name: 'John Doe',
        posts: {
          create: [
            {
              title: 'Hello World',
              content: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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

      const output = transformFieldPayloadToPrismaUpdatePayload(userFieldsOptional, input)
      expect(output).toEqual(expected)
    })

    it('should transform payload correctly (with optional null)', () => {
      const input = {
        nameField: 'John Doe',
        staffInfo: undefined,
        roles: null,
        postsField: [
          {
            create: {
              titleField: 'Hello World',
              contentField: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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
      } satisfies InferUpdateFields<typeof userFieldsOptional>

      const expected = {
        name: 'John Doe',
        roles: null,
        posts: {
          create: [
            {
              title: 'Hello World',
              content: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    attrs: { textAlign: 'left', level: 1 },
                    content: [{ type: 'text', text: 'Hello' }],
                  },
                ],
              },
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

      const output = transformFieldPayloadToPrismaUpdatePayload(userFieldsOptional, input)
      expect(output).toEqual(expected)
    })
  })

  describe('transformFieldsToPrismaSelectPayload', () => {
    it('should transform fields to Prisma select payload', () => {
      const expected = {
        id: true,
        name: true,
        roles: true,
        staffInfo: {
          select: {
            department: true,
            id: true,
            position: true,
          },
        },
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        profile: {
          select: {
            id: true,
            userId: true,
          },
        },
      }

      const output = transformFieldsToPrismaSelectPayload(userFields)
      expect(output).toEqual(expected)
    })
    it('should transform fields to Prisma select payload (with optional (roles is optional))', () => {
      const expected = {
        id: true,
        name: true,
        roles: true,
        staffInfo: {
          select: {
            department: true,
            id: true,
            position: true,
          },
        },
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        profile: {
          select: {
            id: true,
            userId: true,
          },
        },
      }

      const output = transformFieldsToPrismaSelectPayload(userFieldsOptional)
      expect(output).toEqual(expected)
    })
  })

  describe('transformPrismaResultToFieldsPayload', () => {
    it('should transform prisma result to fields payload', () => {
      const payload = {
        id: 'mock-user-id',
        name: 'John Doe',
        roles: ['admin'],
        posts: [
          {
            id: 'mock-post-id',
            title: 'Hello World',
            content: {
              type: 'doc',
              content: [
                {
                  type: 'heading',
                  attrs: { textAlign: 'left', level: 1 },
                  content: [{ type: 'text', text: 'Hello' }],
                },
              ],
            },
            tags: [
              { id: 'mock-tag-id', name: 'Tag 1' },
              { id: 'mock-tag-id-2', name: 'Tag 2' },
            ],
          },
        ],
        profile: {
          id: 'mock-profile-id',
          userId: 'mock-user-id',
        },
      }

      const expected = {
        __pk: 'mock-user-id',
        __id: 'mock-user-id',
        nameField: 'John Doe',
        roles: ['admin'],
        staffInfo: undefined,
        postsField: [
          {
            __id: 'mock-post-id',
            __pk: 'mock-post-id',
            titleField: 'Hello World',
            contentField: {
              type: 'doc',
              content: [
                {
                  type: 'heading',
                  attrs: { textAlign: 'left', level: 1 },
                  content: [{ type: 'text', text: 'Hello' }],
                },
              ],
            },
            tagsField: [
              {
                __id: 'mock-tag-id',
                __pk: 'mock-tag-id',
                nameField: 'Tag 1',
              },
              {
                __id: 'mock-tag-id-2',
                __pk: 'mock-tag-id-2',
                nameField: 'Tag 2',
              },
            ],
          },
        ],
        profileField: {
          __id: 'mock-profile-id',
          __pk: 'mock-profile-id',
          userIdField: 'mock-user-id',
        },
      } satisfies InferFields<typeof userFields>

      const output = transformPrismaResultToFieldsPayload(userFields, payload)
      expect(output).toEqual(expected)
    })
    it('should transform prisma result to fields payload (with optional undefined)', () => {
      const payload = {
        id: 'mock-user-id',
        name: 'John Doe',
        roles: undefined,
        posts: [
          {
            id: 'mock-post-id',
            title: 'Hello World',
            content: {
              type: 'doc',
              content: [
                {
                  type: 'heading',
                  attrs: { textAlign: 'left', level: 1 },
                  content: [{ type: 'text', text: 'Hello' }],
                },
              ],
            },
            tags: [
              { id: 'mock-tag-id', name: 'Tag 1' },
              { id: 'mock-tag-id-2', name: 'Tag 2' },
            ],
          },
        ],
        profile: {
          id: 'mock-profile-id',
          userId: 'mock-user-id',
        },
      }

      const expected = {
        __pk: 'mock-user-id',
        __id: 'mock-user-id',
        nameField: 'John Doe',
        staffInfo: undefined,
        postsField: [
          {
            __id: 'mock-post-id',
            __pk: 'mock-post-id',
            titleField: 'Hello World',
            contentField: {
              type: 'doc',
              content: [
                {
                  type: 'heading',
                  attrs: { textAlign: 'left', level: 1 },
                  content: [{ type: 'text', text: 'Hello' }],
                },
              ],
            },
            tagsField: [
              {
                __id: 'mock-tag-id',
                __pk: 'mock-tag-id',
                nameField: 'Tag 1',
              },
              {
                __id: 'mock-tag-id-2',
                __pk: 'mock-tag-id-2',
                nameField: 'Tag 2',
              },
            ],
          },
        ],
        profileField: {
          __id: 'mock-profile-id',
          __pk: 'mock-profile-id',
          userIdField: 'mock-user-id',
        },
      } satisfies InferFields<typeof userFieldsOptional>

      const output = transformPrismaResultToFieldsPayload(userFieldsOptional, payload)
      expect(output).toEqual(expected)
    })
    it('should transform prisma result to fields payload (with optional null)', () => {
      const payload = {
        id: 'mock-user-id',
        name: 'John Doe',
        roles: null,
        posts: [
          {
            id: 'mock-post-id',
            title: 'Hello World',
            content: {
              type: 'doc',
              content: [
                {
                  type: 'heading',
                  attrs: { textAlign: 'left', level: 1 },
                  content: [{ type: 'text', text: 'Hello' }],
                },
              ],
            },
            tags: [
              { id: 'mock-tag-id', name: 'Tag 1' },
              { id: 'mock-tag-id-2', name: 'Tag 2' },
            ],
          },
        ],
        profile: {
          id: 'mock-profile-id',
          userId: 'mock-user-id',
        },
      }

      const expected = {
        __pk: 'mock-user-id',
        __id: 'mock-user-id',
        nameField: 'John Doe',
        staffInfo: undefined,
        postsField: [
          {
            __id: 'mock-post-id',
            __pk: 'mock-post-id',
            titleField: 'Hello World',
            contentField: {
              type: 'doc',
              content: [
                {
                  type: 'heading',
                  attrs: { textAlign: 'left', level: 1 },
                  content: [{ type: 'text', text: 'Hello' }],
                },
              ],
            },
            tagsField: [
              {
                __id: 'mock-tag-id',
                __pk: 'mock-tag-id',
                nameField: 'Tag 1',
              },
              {
                __id: 'mock-tag-id-2',
                __pk: 'mock-tag-id-2',
                nameField: 'Tag 2',
              },
            ],
          },
        ],
        profileField: {
          __id: 'mock-profile-id',
          __pk: 'mock-profile-id',
          userIdField: 'mock-user-id',
        },
      } satisfies InferFields<typeof userFieldsOptional>

      const output = transformPrismaResultToFieldsPayload(userFieldsOptional, payload)
      expect(output).toEqual(expected)
    })
  })
})
