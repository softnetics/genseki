import { describe, expect, it } from 'vitest'

import {
  transformFieldPayloadToPrismaCreatePayload,
  transformFieldPayloadToPrismaUpdatePayload,
  transformFieldPayloadToUpdateOrderPayload,
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

const postFields = builder.fields('post', (fb) => ({
  title: fb.columns('title', {
    type: 'text',
  }),
  content: fb.columns('content', {
    type: 'richText',
    editor: {},
  }),
  published: fb.columns('published', {
    type: 'checkbox',
  }),
  user: fb.relations('author', (fb) => ({
    type: 'connect',
    options: 'user',
    fields: fb.fields('user', (fb) => ({
      name: fb.columns('name', {
        type: 'text',
      }),
    })),
  })),
  tags: fb.relations(
    'tags',
    (fb) => ({
      type: 'connect',
      options: 'tag',
      fields: fb.fields('tag', (fb) => ({
        name: fb.columns('name', {
          type: 'text',
        }),
      })),
    }),
    {
      orderColumn: 'order',
    }
  ),
}))

const postCreateFields = builder.fields('post', (fb) => ({
  title: fb.columns('title', {
    type: 'text',
  }),
  content: fb.columns('content', {
    type: 'richText',
    editor: {},
  }),
  published: fb.columns('published', {
    type: 'checkbox',
  }),
  user: fb.relations('author', (fb) => ({
    type: 'connect',
    options: 'user',
    fields: fb.fields('user', (fb) => ({
      name: fb.columns('name', {
        type: 'text',
      }),
    })),
  })),
  tags: fb.relations(
    'tags',
    (fb) => ({
      type: 'create',
      options: 'tag',
      fields: fb.fields('tag', (fb) => ({
        name: fb.columns('name', {
          type: 'text',
        }),
      })),
    }),
    {
      orderColumn: 'order',
    }
  ),
}))

const postConnectOrCreateFields = builder.fields('post', (fb) => ({
  title: fb.columns('title', {
    type: 'text',
  }),
  content: fb.columns('content', {
    type: 'richText',
    editor: {},
  }),
  published: fb.columns('published', {
    type: 'checkbox',
  }),
  user: fb.relations('author', (fb) => ({
    type: 'connect',
    options: 'user',
    fields: fb.fields('user', (fb) => ({
      name: fb.columns('name', {
        type: 'text',
      }),
    })),
  })),
  tags: fb.relations(
    'tags',
    (fb) => ({
      type: 'connectOrCreate',
      options: 'tag',
      fields: fb.fields('tag', (fb) => ({
        name: fb.columns('name', {
          type: 'text',
        }),
      })),
    }),
    {
      orderColumn: 'order',
    }
  ),
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

    it('should transform payload to update order payload correctly', () => {
      const input = {
        user: {
          connect: 'user-id-1',
        },
        title: 'Post 1',
        content: {},
        published: true,
        tags: [
          { connect: 'tag-id-1', __order: '12314' },
          { connect: 'tag-id-1', __order: '12313' },
          { connect: 'tag-id-1', __order: '12315' },
        ],
      } satisfies InferCreateFields<typeof postFields>

      const expected = {
        tag: [
          { where: { id: 'tag-id-1' }, data: { order: '12314' } },
          { where: { id: 'tag-id-1' }, data: { order: '12313' } },
          { where: { id: 'tag-id-1' }, data: { order: '12315' } },
        ],
      }

      const output = transformFieldPayloadToUpdateOrderPayload(postFields, input)
      expect(output).toEqual(expected)
    })

    it('should handle empty tags array in update order payload', () => {
      const input = {
        user: {
          connect: 'user-id-1',
        },
        title: 'Post 1',
        content: {},
        published: true,
        tags: [],
      } satisfies InferCreateFields<typeof postFields>

      const expected = {
        tag: [],
      }

      const output = transformFieldPayloadToUpdateOrderPayload(postFields, input)
      expect(output).toEqual(expected)
    })

    it('should return empty array when tags only contain create in update order payload', () => {
      const input = {
        user: {
          connect: 'user-id-1',
        },
        title: 'Post 1',
        content: {},
        published: true,
        tags: [
          {
            __order: '12314',
            create: {
              name: 'Tag 1',
            },
          },
          {
            __order: '12313',
            create: {
              name: 'Tag 2',
            },
          },
        ],
      } satisfies InferCreateFields<typeof postCreateFields>

      const expected = {}

      const output = transformFieldPayloadToUpdateOrderPayload(postCreateFields, input)
      expect(output).toEqual(expected)
    })

    it('should only include connect items in update order payload when both create and connect are present', () => {
      const input = {
        user: {
          connect: 'user-id-1',
        },
        title: 'Post 1',
        content: {},
        published: true,
        tags: [
          {
            __order: '12314',
            create: {
              name: 'Tag 1',
            },
          },
          {
            __order: '12313',
            connect: 'tag-id-1',
          },
        ],
      } satisfies InferCreateFields<typeof postConnectOrCreateFields>

      const expected = {
        tag: [
          {
            where: { id: 'tag-id-1' },
            data: { order: '12313' },
          },
        ],
      }

      const output = transformFieldPayloadToUpdateOrderPayload(postConnectOrCreateFields, input)
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

    it('should transform post fields to Prisma select payload with order column', () => {
      const expected = {
        id: true,
        title: true,
        content: true,
        published: true,
        author: { select: { id: true, name: true } },
        tags: {
          orderBy: {
            order: 'asc',
          },
          select: { id: true, name: true, order: true },
        },
      }
      const output = transformFieldsToPrismaSelectPayload(postFields)
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
    it('should transform post prisma result to fields payload with order column', () => {
      const payload = {
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
        published: true,
        author: {
          id: 'mock-user-id',
          name: 'John Doe',
        },
        tags: [
          { id: 'mock-tag-id', name: 'Tag 1', order: '12314' },
          { id: 'mock-tag-id-2', name: 'Tag 2', order: '12315' },
        ],
      }

      const expected = {
        __pk: 'mock-post-id',
        __id: 'mock-post-id',
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
        published: true,
        user: {
          __id: 'mock-user-id',
          __pk: 'mock-user-id',
          name: 'John Doe',
        },
        tags: [
          {
            __id: 'mock-tag-id',
            __pk: 'mock-tag-id',
            name: 'Tag 1',
            __order: '12314',
          },
          {
            __id: 'mock-tag-id-2',
            __pk: 'mock-tag-id-2',
            name: 'Tag 2',
            __order: '12315',
          },
        ],
      }

      const output = transformPrismaResultToFieldsPayload(postFields, payload)
      expect(output).toEqual(expected)
    })
  })
})
