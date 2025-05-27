import { eq, or, sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as schema from './__mocks__/test-schema'
import { Builder } from './builder'

const prepareMockDb = () => {
  const tx = {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
  const mockDb = {
    transaction: vi.fn().mockImplementation((cb) => cb(tx)),
    delete: vi.fn(),
    query: {
      postTs: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      authorTs: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      postWithAuthorTs: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  }

  return { tx, mockDb }
}

let { tx, mockDb } = prepareMockDb()

const prepareUpdateWhereMock = (mockData: any) => {
  const whereUpdateMock = vi.fn().mockImplementation(() => ({ returning: mockData }))
  const setMock = vi.fn().mockImplementation(() => ({ where: whereUpdateMock }))
  const updateMock = vi.fn().mockImplementation(() => ({ set: setMock }))

  tx.update = updateMock

  return { whereUpdateMock, setMock, updateMock }
}

const prepareInsertMock = (mockData: any) => {
  const valuesMock = vi.fn().mockImplementation(() => ({ returning: mockData }))
  const insertMock = vi.fn().mockImplementation(() => ({ values: valuesMock }))

  tx.insert = insertMock

  return { insertMock, valuesMock }
}

const prepareDeleteMock = (mockData: any) => {
  const returningMock = mockData
  const whereMock = vi.fn().mockImplementation(() => ({
    returning: returningMock,
  }))
  const deleteMock = vi.fn().mockImplementation(() => ({
    where: whereMock,
  }))

  tx.delete = deleteMock
  mockDb.delete = deleteMock

  return { deleteMock, whereMock, returningMock }
}

beforeEach(() => {
  const { tx: newTx, mockDb: newMockDb } = prepareMockDb()
  tx = newTx
  mockDb = newMockDb
})

const mockPostData = Array.from({ length: 10 }, (_, i) => ({
  id: `post-${i + 1}`,
  name: `Post ${i + 1}`,
}))

const mockAuthorData = Array.from({ length: 10 }, (_, i) => ({
  id: `author-${i + 1}`,
  name: `Author ${i + 1}`,
}))

const builder = new Builder({ schema }).$context<{ db: NodePgDatabase<typeof schema> }>()

describe('ApiHandler', () => {
  describe('with initial and utils', () => {
    it('should initialize collection successfully', () => {
      // expect(postCollection).toBeDefined()
      // expect(postWithAuthorConnectOrCreateCollection).toBeDefined()
      // expect(authorWithPostConnectOrCreateCollection).toBeDefined()
    })

    // test createDrizzleQuery
    it('should create createDrizzleQuery correctly', () => {
      //   const queryPayload = createDrizzleQuery(postWithAuthorConnectOrCreateCollection.fields)
      //   expect(queryPayload).toMatchObject({
      //     columns: {
      //       idTs: true,
      //       nameTs: true,
      //     },
      //     with: {
      //       authorTs: {
      //         columns: {
      //           idTs: true,
      //           nameTs: true,
      //         },
      //       },
      //     },
      //   })
    })
  })

  describe('with no relation case', () => {
    const postCollection = builder.collection('postTs', {
      slug: 'post',
      fields: builder.fields('postTs', (fb) => ({
        idField: fb.columns('idTs', {
          type: 'text',
          create: 'hidden',
          update: 'hidden',
        }),
        nameField: fb.columns('nameTs', {
          type: 'text',
        }),
      })),
      identifierColumn: 'idTs',
    })

    it('should (C) create successfully', async () => {
      const postData = mockPostData[0]

      mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
        __pk: postData.id,
        __id: postData.id,
        idTs: postData.id,
        nameTs: postData.name,
      })

      const { insertMock, valuesMock } = prepareInsertMock(
        vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
      )

      const result = await postCollection.admin.api.create({
        slug: postCollection.slug,
        fields: postCollection.fields,
        context: { db: mockDb as any },
        data: {
          nameField: postData.name,
        },
      })

      expect(insertMock).toHaveBeenCalledTimes(1)
      expect(valuesMock).not.toHaveBeenCalledWith([
        {
          idTs: expect.anything(),
          nameTs: postData.name,
        },
      ])
      expect(tx.insert).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ __pk: postData.id, __id: postData.id })
    })

    it('should (R) read successfully', async () => {
      const postData = mockPostData[0]

      mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
        __pk: postData.id,
        __id: postData.id,
        idTs: postData.id,
        nameTs: postData.name,
      })

      const result = await postCollection.admin.api.findOne({
        slug: postCollection.slug,
        fields: postCollection.fields,
        context: { db: mockDb as any },
        id: postData.id,
      })

      expect(mockDb.query.postTs.findFirst).toBeCalledTimes(1)
      expect(mockDb.query.postTs.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: {
            idTs: true,
            nameTs: true,
          },
          where: eq(postCollection.fields.idField._.column, postData.id),
        })
      )
      expect(result).toEqual({
        __pk: postData.id,
        __id: postData.id,
        idField: postData.id,
        nameField: postData.name,
      })
    })

    it('should (U) update successfully', async () => {
      const postData = mockPostData[0]
      const updatedPostData = mockPostData[1]

      mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
        __pk: postData.id,
        __id: postData.id,
        idTs: updatedPostData.id,
        nameTs: updatedPostData.name,
      })

      const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
        vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
      )

      const result = await postCollection.admin.api.update({
        id: postData.id,
        context: { db: mockDb as any },
        slug: postCollection.slug,
        fields: postCollection.fields,
        data: {
          nameField: updatedPostData.name,
        },
      })

      expect(updateMock).toHaveBeenCalledTimes(1)
      expect(whereUpdateMock).toBeCalledWith(
        eq(postCollection.fields.idField._.column, postData.id)
      )
      expect(setMock).toHaveBeenCalledWith([{ nameTs: updatedPostData.name }])
      expect(result).toEqual({ __pk: postData.id, __id: postData.id })
    })

    it('should (D) delete successfully', async () => {
      const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))
      tx.delete = deleteMock
      mockDb.delete = deleteMock

      const result = await postCollection.admin.api.delete({
        slug: postCollection.slug,
        fields: postCollection.fields,
        context: { db: mockDb as any },
        ids: [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id],
      })

      expect(deleteMock).toHaveBeenCalledTimes(1)
      expect(whereMock).toHaveBeenCalledTimes(1)
      expect(whereMock).toHaveBeenCalledWith(
        or(
          eq(postCollection.fields.idField._.column, mockPostData[0].id),
          eq(postCollection.fields.idField._.column, mockPostData[0].id),
          eq(postCollection.fields.idField._.column, mockPostData[1].id),
          eq(postCollection.fields.idField._.column, mockPostData[1].id),
          eq(postCollection.fields.idField._.column, mockPostData[2].id),
          eq(postCollection.fields.idField._.column, mockPostData[2].id)
        )
      )
      expect(result).toEqual(undefined)
    })
  })

  describe('with relation', () => {
    describe('with "create" mode', () => {
      describe('with "One" relation', () => {
        const postWithAuthorCreateCollection = builder.collection('postWithAuthorTs', {
          slug: 'postWithAuthor',
          fields: builder.fields('postWithAuthorTs', (fb) => ({
            idField: fb.columns('idTs', {
              type: 'text',
              create: 'hidden',
              update: 'hidden',
            }),
            nameField: fb.columns('nameTs', {
              type: 'text',
            }),
            authorField: fb.relations('authorTs', (fb) => ({
              type: 'create',
              fields: fb.fields('authorTs', (fb) => ({
                idField: fb.columns('idTs', {
                  type: 'text',
                  create: 'hidden',
                  update: 'hidden',
                }),
                nameField: fb.columns('nameTs', {
                  type: 'text',
                }),
              })),
              options: async () => [],
            })),
          })),
          identifierColumn: 'idTs',
        })

        it('should (C) create successfully', async () => {
          const postData = mockPostData[0]
          const authorData = mockAuthorData[0]

          const { insertMock, valuesMock } = prepareInsertMock(
            vi
              .fn()
              // Insert author first
              .mockResolvedValueOnce([{ idTs: authorData.id }])
              // Then insert post
              .mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
          )

          mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: postData.id,
            __id: postData.id,
            idTs: postData.id,
            nameTs: postData.name,
            authorTs: {
              idTs: authorData.id,
              nameTs: authorData.name,
            },
          })

          const result = await postWithAuthorCreateCollection.admin.api.create({
            slug: postWithAuthorCreateCollection.slug,
            fields: postWithAuthorCreateCollection.fields,
            data: {
              nameField: postData.name,
              authorField: {
                create: {
                  nameField: authorData.name,
                },
              },
            },
            context: { db: mockDb as any },
          })

          expect(insertMock).toHaveBeenCalledTimes(2)
          expect(valuesMock).toHaveBeenNthCalledWith(1, [{ nameTs: authorData.name }])
          expect(valuesMock).toHaveBeenNthCalledWith(2, [
            { nameTs: postData.name, authorIdTs: authorData.id },
          ])
          expect(result).toEqual({ __pk: postData.id, __id: postData.id })
        })

        it('should (R) read successfully', async () => {
          const postData = mockPostData[0]
          const authorData = mockAuthorData[0]

          mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: postData.id,
            __id: postData.id,
            idTs: postData.id,
            nameTs: postData.name,
            authorTs: {
              idTs: authorData.id,
              nameTs: authorData.name,
            },
          })

          const result = await postWithAuthorCreateCollection.admin.api.findOne({
            slug: postWithAuthorCreateCollection.slug,
            fields: postWithAuthorCreateCollection.fields,
            id: postData.id,
            context: { db: mockDb as any },
          })

          expect(mockDb.query.postWithAuthorTs.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
              columns: {
                idTs: true,
                nameTs: true,
              },
              with: {
                authorTs: {
                  columns: {
                    idTs: true,
                    nameTs: true,
                  },
                  with: {},
                },
              },
              where: eq(postWithAuthorCreateCollection.fields.idField._.column, postData.id),
              extras: {
                __pk: sql<string | number>`${schema.postWithAuthorTs.idTs}`.as('__pk'),
                __id: sql<string | number>`${schema.postWithAuthorTs.idTs}`.as('__id'),
              },
            })
          )

          expect(result).toEqual({
            __pk: postData.id,
            __id: postData.id,
            idField: postData.id,
            nameField: postData.name,
            authorField: {
              __pk: authorData.id,
              idField: authorData.id,
              nameField: authorData.name,
            },
          })
        })

        it('should (U) update successfully', async () => {
          const postData = mockPostData[0]
          const updatedPostData = mockPostData[1]
          const updatedAuthorData = mockAuthorData[1]

          const { insertMock, valuesMock } = prepareInsertMock(
            vi
              .fn()
              .mockResolvedValueOnce([
                { idTs: updatedAuthorData.id, nameTs: updatedAuthorData.name },
              ])
          )

          const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
            vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: updatedPostData.name }])
          )

          mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: postData.id,
            __id: postData.id,
            idTs: postData.id,
            nameTs: updatedPostData.name,
            authorTs: {
              idTs: updatedAuthorData.id,
              nameTs: updatedAuthorData.name,
            },
          })

          const result = await postWithAuthorCreateCollection.admin.api.update({
            slug: postWithAuthorCreateCollection.slug,
            fields: postWithAuthorCreateCollection.fields,
            context: { db: mockDb as any },
            id: postData.id,
            data: {
              nameField: updatedPostData.name,
              authorField: {
                create: {
                  nameField: updatedAuthorData.name,
                },
              },
            },
          })

          expect(insertMock).toHaveBeenCalledTimes(1)
          expect(updateMock).toHaveBeenCalledTimes(1)
          expect(valuesMock).toHaveBeenCalledWith([{ nameTs: updatedAuthorData.name }])
          expect(setMock).toHaveBeenCalledWith([
            { nameTs: updatedPostData.name, authorIdTs: updatedAuthorData.id },
          ])
          expect(whereUpdateMock).toHaveBeenCalledWith(
            eq(postWithAuthorCreateCollection.fields.idField._.column, postData.id)
          )
          expect(result).toEqual({ __pk: postData.id, __id: postData.id })
        })

        it('should (D) delete successfully', async () => {
          const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))

          const result = await postWithAuthorCreateCollection.admin.api.delete({
            slug: postWithAuthorCreateCollection.slug,
            fields: postWithAuthorCreateCollection.fields,
            context: { db: mockDb as any },
            ids: [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id],
          })

          expect(deleteMock).toHaveBeenCalledTimes(1)
          expect(whereMock).toHaveBeenCalledWith(
            or(
              eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[0].id),
              eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[0].id),
              eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[1].id),
              eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[1].id),
              eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[2].id),
              eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[2].id)
            )
          )
          expect(result).toEqual(undefined)
        })
      })
      describe('with "Many" relation', () => {
        const authorWithPostsCreateCollection = builder.collection('authorTs', {
          slug: 'author',
          identifierColumn: 'idTs',
          fields: builder.fields('authorTs', (fb) => ({
            idField: fb.columns('idTs', {
              type: 'text',
              create: 'hidden',
              update: 'hidden',
            }),
            nameField: fb.columns('nameTs', {
              type: 'text',
            }),
            postsField: fb.relations('postsTs', (fb) => ({
              type: 'create',
              fields: fb.fields('postWithAuthorTs', (fb) => ({
                idField: fb.columns('idTs', {
                  type: 'text',
                  create: 'hidden',
                  update: 'hidden',
                }),
                nameField: fb.columns('nameTs', {
                  type: 'text',
                }),
              })),
              options: async () => [],
            })),
          })),
        })

        it('should (C) create successfully', async () => {
          const postData = mockPostData[0]
          const authorData = mockAuthorData[0]
          const authorWithPostData = { ...mockAuthorData[0], posts: [postData] }

          const { insertMock, valuesMock: valuesInsertMock } = prepareInsertMock(
            vi
              .fn()
              // First, insert author
              .mockResolvedValueOnce([{ idTs: authorWithPostData.id }])
              // Finally, insert all posts
              .mockResolvedValueOnce([{ idTs: mockPostData[0].id, nameTs: mockPostData[0].name }])
              .mockResolvedValueOnce([{ idTs: mockPostData[1].id, nameTs: mockPostData[1].name }])
              .mockResolvedValueOnce([{ idTs: mockPostData[2].id, nameTs: mockPostData[2].name }])
              .mockResolvedValueOnce([{ idTs: mockPostData[3].id, nameTs: mockPostData[3].name }])
              .mockResolvedValueOnce([{ idTs: mockPostData[4].id, nameTs: mockPostData[4].name }])
          )

          mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: authorData.id,
            __id: authorData.id,
            idTs: authorData.id,
            nameTs: authorData.name,
            postsTs: [
              { idTs: mockPostData[0].id, nameTs: mockPostData[0].name },
              { idTs: mockPostData[1].id, nameTs: mockPostData[1].name },
              { idTs: mockPostData[2].id, nameTs: mockPostData[2].name },
              { idTs: mockPostData[3].id, nameTs: mockPostData[3].name },
              { idTs: mockPostData[4].id, nameTs: mockPostData[4].name },
            ],
          })

          const result = await authorWithPostsCreateCollection.admin.api.create({
            fields: authorWithPostsCreateCollection.fields,
            slug: authorWithPostsCreateCollection.slug,
            context: { db: mockDb as any },
            data: {
              nameField: authorData.name,
              postsField: [
                mockPostData[0],
                mockPostData[1],
                mockPostData[2],
                mockPostData[3],
                mockPostData[4],
              ].map((post) => ({
                create: {
                  idField: post.id,
                  nameField: post.name,
                },
              })),
            },
          })

          expect(insertMock).toHaveBeenCalledTimes(6)
          expect(valuesInsertMock).toHaveBeenCalledTimes(6)
          expect(valuesInsertMock).toHaveBeenCalledWith([
            expect.objectContaining({ nameTs: postData.name }),
          ])
          expect(result).toEqual({ __pk: authorData.id, __id: authorData.id })
        })

        it('should (R) read successfully', async () => {
          const postData = mockPostData[0]
          const authorData = mockAuthorData[0]

          mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: authorData.id,
            __id: authorData.id,
            idTs: authorData.id,
            nameTs: authorData.name,
            postsTs: [
              {
                idTs: postData.id,
                nameTs: postData.name,
              },
            ],
          })

          const result = await authorWithPostsCreateCollection.admin.api.findOne({
            slug: authorWithPostsCreateCollection.slug,
            fields: authorWithPostsCreateCollection.fields,
            id: authorData.id,
            context: { db: mockDb as any },
          })

          expect(mockDb.query.authorTs.findFirst).toHaveBeenCalledWith({
            columns: {
              idTs: true,
              nameTs: true,
            },
            with: {
              postsTs: {
                columns: {
                  idTs: true,
                  nameTs: true,
                },
                with: {},
              },
            },
            where: eq(authorWithPostsCreateCollection.fields.idField._.column, authorData.id),
            extras: {
              __pk: sql<string | number>`${schema.authorTs.idTs}`.as('__pk'),
              __id: sql<string | number>`${schema.authorTs.idTs}`.as('__id'),
            },
          })

          expect(result).toEqual({
            __pk: authorData.id,
            __id: authorData.id,
            idField: authorData.id,
            nameField: authorData.name,
            postsField: [
              {
                __pk: postData.id,
                idField: postData.id,
                nameField: postData.name,
              },
            ],
          })
        })

        // TODO: should add update their relation
        it('should (U) update successfully', async () => {
          const updatedAuthorData = {
            id: mockAuthorData[0].id,
            name: 'Updated Author Name',
          }
          const updatedAuthorDataTs = {
            idTs: updatedAuthorData.id,
            nameTs: updatedAuthorData.name,
          }
          const updatedAuthorDataField = {
            idField: updatedAuthorData.id,
            nameField: updatedAuthorData.name,
          }
          // // ===== start service part (TS) =====
          const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
            vi.fn().mockResolvedValueOnce([updatedAuthorDataTs])
          )

          const { valuesMock, insertMock } = prepareInsertMock(
            vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([])
          )

          tx.update = updateMock

          mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: updatedAuthorData.id,
            __id: updatedAuthorData.id,
            idTs: updatedAuthorData.id,
            nameTs: updatedAuthorData.name,
            postsTs: [
              { idTs: 'post-2', nameTs: 'Post 2' },
              { idTs: 'post-3', nameTs: 'Post 3' },
            ],
          })

          // // ====== end service part (TS) ======
          // // ===== start user part (field) =====
          const result = await authorWithPostsCreateCollection.admin.api.update({
            slug: authorWithPostsCreateCollection.slug,
            fields: authorWithPostsCreateCollection.fields,
            context: { db: mockDb as any },
            id: updatedAuthorData.id,
            data: {
              nameField: updatedAuthorDataField.nameField,
              postsField: [
                {
                  create: {
                    nameField: 'Post 2',
                  },
                },
                {
                  disconnect: 'post-4',
                },
                {
                  create: {
                    nameField: 'Post 3',
                  },
                },
              ],
            },
          })

          // // ====== end user part (field) ======
          // // Assertions for author update
          expect(updateMock).toHaveBeenCalledTimes(2)
          expect(whereUpdateMock).toHaveBeenCalledTimes(2)
          expect(whereUpdateMock.mock.calls[0][0]).toEqual(
            eq(authorWithPostsCreateCollection.fields.idField._.column, updatedAuthorData.id)
          )
          expect(whereUpdateMock.mock.calls[1][0]).toEqual(
            eq(authorWithPostsCreateCollection.fields.postsField._.primaryColumn, 'post-4')
          )
          expect(setMock).toHaveBeenCalledTimes(2)
          expect(setMock.mock.calls[0][0]).toEqual([
            expect.objectContaining({
              nameTs: updatedAuthorDataTs.nameTs,
            }),
          ])
          expect(setMock.mock.calls[1][0]).toEqual({
            authorIdTs: null,
          })
          expect(insertMock).toHaveBeenCalledTimes(2)
          expect(valuesMock).toHaveBeenCalledTimes(2)
          expect(valuesMock.mock.calls[0][0]).toEqual([
            expect.objectContaining({ nameTs: 'Post 2', authorIdTs: updatedAuthorData.id }),
          ])
          expect(valuesMock.mock.calls[1][0]).toEqual([
            expect.objectContaining({ nameTs: 'Post 3', authorIdTs: updatedAuthorData.id }),
          ])
          expect(result).toEqual({
            __pk: updatedAuthorData.id,
            __id: updatedAuthorData.id,
          })
        })

        it('should (D) delete successfully', async () => {
          const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))

          const result = await authorWithPostsCreateCollection.admin.api.delete({
            slug: authorWithPostsCreateCollection.slug,
            fields: authorWithPostsCreateCollection.fields,
            context: { db: mockDb as any },
            ids: [mockAuthorData[0].id, mockAuthorData[1].id, mockAuthorData[2].id],
          })

          expect(deleteMock).toHaveBeenCalledTimes(1)
          expect(whereMock).toHaveBeenCalledTimes(1)
          expect(whereMock.mock.calls[0][0]).toEqual(
            or(
              eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[0].id),
              eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[0].id),
              eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[1].id),
              eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[1].id),
              eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[2].id),
              eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[2].id)
            )
          )
          expect(result).toEqual(undefined)
        })
      })
    })

    describe('with "connect" mode', () => {
      describe('with "One" relation', () => {
        const postWithAuthorConnectCollection = builder.collection('postWithAuthorTs', {
          slug: 'postWithAuthor',
          identifierColumn: 'idTs',
          fields: builder.fields('postWithAuthorTs', (fb) => ({
            idField: fb.columns('idTs', {
              type: 'text',
              create: 'hidden',
              update: 'hidden',
            }),
            nameField: fb.columns('nameTs', {
              type: 'text',
            }),
            authorField: fb.relations('authorTs', (fb) => ({
              type: 'connect',
              fields: fb.fields('authorTs', (fb) => ({
                idField: fb.columns('idTs', {
                  type: 'text',
                  create: 'hidden',
                  update: 'hidden',
                }),
                nameField: fb.columns('nameTs', {
                  type: 'text',
                }),
              })),
              options: async (args) => {
                const result = await args.db.query.authorTs.findMany()
                return result.map((author) => ({
                  label: author.nameTs,
                  value: author.idTs,
                }))
              },
            })),
          })),
        })

        it('should (C) create successfully', async () => {
          const postData = mockPostData[0]
          const authorData = mockAuthorData[0]

          mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: postData.id,
            __id: postData.id,
            idTs: postData.id,
            nameTs: postData.name,
            authorTs: {
              idTs: authorData.id,
              nameTs: authorData.name,
            },
          })

          const { valuesMock, insertMock } = prepareInsertMock(
            // Insert post
            vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
          )

          const result = await postWithAuthorConnectCollection.admin.api.create({
            slug: postWithAuthorConnectCollection.slug,
            fields: postWithAuthorConnectCollection.fields,
            context: { db: mockDb as any },
            data: {
              nameField: postData.name,
              authorField: {
                connect: authorData.id,
              },
            },
          })

          expect(insertMock).toHaveBeenCalledTimes(1)
          expect(valuesMock).toHaveBeenCalledWith([
            expect.objectContaining({ nameTs: postData.name, authorIdTs: authorData.id }),
          ])
          expect(tx.insert).toHaveBeenCalledTimes(1)
          expect(result).toEqual({ __pk: postData.id, __id: postData.id })
        })

        it('should (R) read successfully', async () => {
          const postData = mockPostData[0]
          const authorData = mockAuthorData[0]

          mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: postData.id,
            __id: postData.id,
            idTs: postData.id,
            nameTs: postData.name,
            authorTs: {
              __pk: authorData.id,
              idTs: authorData.id,
              nameTs: authorData.name,
            },
          })

          const result = await postWithAuthorConnectCollection.admin.api.findOne({
            slug: postWithAuthorConnectCollection.slug,
            fields: postWithAuthorConnectCollection.fields,
            id: postData.id,
            context: { db: mockDb as any },
          })

          expect(mockDb.query.postWithAuthorTs.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
              columns: {
                idTs: true,
                nameTs: true,
              },
              with: {
                authorTs: {
                  columns: {
                    idTs: true,
                    nameTs: true,
                  },
                  with: {},
                },
              },
              where: eq(postWithAuthorConnectCollection.fields.idField._.column, postData.id),
            })
          )

          expect(result).toEqual({
            __pk: postData.id,
            __id: postData.id,
            idField: postData.id,
            nameField: postData.name,
            authorField: {
              __pk: authorData.id,
              idField: authorData.id,
              nameField: authorData.name,
            },
          })
        })

        it('should (U) update successfully', async () => {
          const postData = mockPostData[0]
          const updatedPostData = {
            id: postData.id,
            name: 'Updated Post Name',
            authorId: 'author-2',
          }
          const postDataTs = {
            idTs: updatedPostData.id,
            nameTs: updatedPostData.name,
            authorIdTs: updatedPostData.authorId,
          }
          const postDataField = {
            idField: updatedPostData.id,
            nameField: updatedPostData.name,
            authorIdField: updatedPostData.authorId,
          }
          const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
            vi.fn().mockResolvedValueOnce([postDataTs])
          )
          tx.update = updateMock
          mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: updatedPostData.id,
            __id: updatedPostData.id,
            idTs: updatedPostData.id,
            nameTs: updatedPostData.name,
            authorTs: {
              idTs: updatedPostData.authorId,
              nameTs: 'Author 2',
            },
          })
          const result = await postWithAuthorConnectCollection.admin.api.update({
            slug: postWithAuthorConnectCollection.slug,
            fields: postWithAuthorConnectCollection.fields,
            context: { db: mockDb as any },
            id: postData.id,
            data: {
              nameField: postDataField.nameField,
              authorField: {
                connect: postDataField.authorIdField,
              },
            },
          })
          expect(updateMock).toHaveBeenCalledTimes(1)
          expect(setMock).toHaveBeenCalledWith([
            expect.objectContaining({
              nameTs: postDataTs.nameTs,
              authorIdTs: postDataTs.authorIdTs,
            }),
          ])
          expect(whereUpdateMock).toHaveBeenCalledWith(
            eq(postWithAuthorConnectCollection.fields.idField._.column, postData.id)
          )
          expect(result).toEqual({ __pk: postDataField.idField, __id: postDataField.idField })
        })

        it('should (D) delete successfully', async () => {
          const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
            vi.fn().mockResolvedValueOnce([])
          )

          const result = await postWithAuthorConnectCollection.admin.api.delete({
            slug: postWithAuthorConnectCollection.slug,
            fields: postWithAuthorConnectCollection.fields,
            context: { db: mockDb as any },
            ids: [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id],
          })

          expect(deleteMock).toHaveBeenCalledTimes(1)
          expect(whereMock).toHaveBeenCalledTimes(1)
          expect(whereMock).toHaveBeenCalledWith(
            or(
              eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[0].id),
              eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[0].id),
              eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[1].id),
              eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[1].id),
              eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[2].id),
              eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[2].id)
            )
          )
          expect(returningMock).toHaveBeenCalledTimes(1)
          expect(result).toEqual(undefined)
        })
      })

      describe('with "Many" relation', () => {
        const authorWithPostConnectCollection = builder.collection('authorTs', {
          slug: 'authorWithPost',
          identifierColumn: 'idTs',
          fields: builder.fields('authorTs', (fb) => ({
            idField: fb.columns('idTs', {
              type: 'text',
              create: 'hidden',
              update: 'hidden',
            }),
            nameField: fb.columns('nameTs', {
              type: 'text',
            }),
            postsField: fb.relations('postsTs', (fb) => ({
              type: 'connect',
              fields: fb.fields('postWithAuthorTs', (fb) => ({
                idField: fb.columns('idTs', {
                  type: 'text',
                  create: 'hidden',
                  update: 'hidden',
                }),
                nameField: fb.columns('nameTs', {
                  type: 'text',
                }),
              })),
              options: async (args) => {
                const result = await args.db.query.authorTs.findMany()
                return result.map((author) => ({
                  label: author.nameTs as string,
                  value: author.idTs,
                }))
              },
            })),
          })),
        })

        it('should (C) create successfully', async () => {
          const authorData = mockAuthorData[0]

          const { insertMock, valuesMock: valuesInsertMock } = prepareInsertMock(
            vi.fn().mockResolvedValueOnce([{ idTs: authorData.id }])
          )

          const { updateMock, setMock, whereUpdateMock } = prepareUpdateWhereMock(
            vi.fn().mockResolvedValueOnce([])
          )

          mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: authorData.id,
            __id: authorData.id,
            idTs: authorData.id,
            nameTs: authorData.name,
            postsTs: [
              { idTs: mockPostData[0].id, nameTs: mockPostData[0].name },
              { idTs: mockPostData[1].id, nameTs: mockPostData[1].name },
              { idTs: mockPostData[2].id, nameTs: mockPostData[2].name },
            ],
          })

          const result = await authorWithPostConnectCollection.admin.api.create({
            slug: authorWithPostConnectCollection.slug,
            fields: authorWithPostConnectCollection.fields,
            context: { db: mockDb as any },
            data: {
              nameField: authorData.name,
              postsField: [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id].map(
                (postId) => ({
                  connect: postId,
                })
              ),
            },
          })

          expect(insertMock).toHaveBeenCalledTimes(1)
          expect(valuesInsertMock).toHaveBeenCalledWith([{ nameTs: authorData.name }])

          expect(updateMock).toHaveBeenCalledTimes(3)
          const expectedIds = [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id]
          expectedIds.forEach((postId, index) => {
            // UPDATE "postWithAuthorTs" SET "authorId_db" = {authorData.id} WHERE "id_db" = {postId}
            expect(setMock).toHaveBeenNthCalledWith(index + 1, {
              authorIdTs: authorData.id,
            })
            expect(whereUpdateMock.mock.calls[index][0]).toEqual(
              eq(schema.postWithAuthorTs.idTs, postId)
            )
          })
          expect(result).toEqual({ __pk: authorData.id, __id: authorData.id })
        })

        it('should (R) read successfully', async () => {
          const authorData = mockAuthorData[0]

          mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: authorData.id,
            __id: authorData.id,
            idTs: authorData.id,
            nameTs: authorData.name,
            postsTs: [
              {
                __pk: mockPostData[0].id,
                __id: mockPostData[0].id,
                idTs: mockPostData[0].id,
                nameTs: mockPostData[0].name,
              },
              {
                __pk: mockPostData[1].id,
                __id: mockPostData[1].id,
                idTs: mockPostData[1].id,
                nameTs: mockPostData[1].name,
              },
              {
                __pk: mockPostData[2].id,
                __id: mockPostData[2].id,
                idTs: mockPostData[2].id,
                nameTs: mockPostData[2].name,
              },
            ],
          })

          const result = await authorWithPostConnectCollection.admin.api.findOne({
            slug: authorWithPostConnectCollection.slug,
            fields: authorWithPostConnectCollection.fields,
            id: authorData.id,
            context: { db: mockDb as any },
          })

          expect(mockDb.query.authorTs.findFirst).toHaveBeenCalledWith({
            columns: {
              idTs: true,
              nameTs: true,
            },
            with: {
              postsTs: {
                columns: {
                  idTs: true,
                  nameTs: true,
                },
                with: {},
              },
            },
            where: eq(authorWithPostConnectCollection.fields.idField._.column, authorData.id),
            extras: {
              __pk: sql<string | number>`${schema.authorTs.idTs}`.as('__pk'),
              __id: sql<string | number>`${schema.authorTs.idTs}`.as('__id'),
            },
          })

          expect(result).toEqual({
            __pk: authorData.id,
            __id: authorData.id,
            idField: authorData.id,
            nameField: authorData.name,
            postsField: [mockPostData[0], mockPostData[1], mockPostData[2]].map((post) => ({
              __pk: post.id,
              idField: post.id,
              nameField: post.name,
            })),
          })
        })

        // TODO: Need to fix "update" method
        it('should (U) update successfully', async () => {
          const updatedAuthorData = {
            id: mockAuthorData[0].id,
            name: 'Updated Author Name',
          }

          const updatedAuthorDataTs = {
            idTs: updatedAuthorData.id,
            nameTs: updatedAuthorData.name,
          }

          const updatedAuthorDataField = {
            idField: updatedAuthorData.id,
            nameField: updatedAuthorData.name,
          }

          // ===== start service part (TS) =====
          const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
            vi.fn().mockResolvedValueOnce([updatedAuthorDataTs])
          )

          tx.update = updateMock

          // ====== end service part (TS) ======

          // ===== start user part (field) =====

          mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
            __pk: updatedAuthorData.id,
            __id: updatedAuthorData.id,
            idTs: updatedAuthorData.id,
            nameTs: updatedAuthorData.name,
            postsTs: [
              { idTs: 'post-1', nameTs: 'Post 1' },
              { idTs: 'post-2', nameTs: 'Post 2' },
              { idTs: 'post-3', nameTs: 'Post 3' },
            ],
          })

          const result = await authorWithPostConnectCollection.admin.api.update({
            slug: authorWithPostConnectCollection.slug,
            fields: authorWithPostConnectCollection.fields,
            context: { db: mockDb as any },
            id: updatedAuthorData.id,
            data: {
              nameField: updatedAuthorDataField.nameField,
              postsField: ['post-1', 'post-2', 'post-3'].map((postId) => ({
                connect: postId,
              })),
            },
          })

          // ====== end user part (field) ======

          // Assertions
          // main Author update and 3 times for post update
          expect(updateMock).toHaveBeenCalledTimes(4)
          expect(setMock).toHaveBeenCalledWith([
            expect.objectContaining({
              nameTs: updatedAuthorDataTs.nameTs,
            }),
          ])

          // 4 times for post update
          expect(whereUpdateMock).toHaveBeenCalledTimes(4)

          expect(result).toEqual({ __pk: updatedAuthorData.id, __id: updatedAuthorData.id })
        })

        it('should (D) delete successfully', async () => {
          const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))

          const result = await authorWithPostConnectCollection.admin.api.delete({
            slug: authorWithPostConnectCollection.slug,
            fields: authorWithPostConnectCollection.fields,
            context: { db: mockDb as any },
            ids: [mockAuthorData[0].id, mockAuthorData[1].id, mockAuthorData[2].id],
          })

          expect(deleteMock).toHaveBeenCalledTimes(1)
          expect(whereMock).toHaveBeenCalledTimes(1)
          expect(whereMock.mock.calls[0][0]).toEqual(
            or(
              eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[0].id),
              eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[0].id),
              eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[1].id),
              eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[1].id),
              eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[2].id),
              eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[2].id)
            )
          )
          expect(result).toEqual(undefined)
        })
      })
    })

    // TODO: complete read, update and delete test case
    describe('with "connectOrCreate" mode', () => {
      describe('with "One" relation', () => {
        const postWithAuthorConnectOrCreateCollection = builder.collection('postWithAuthorTs', {
          slug: 'postWithAuthor',
          fields: builder.fields('postWithAuthorTs', (fb) => ({
            idField: fb.columns('idTs', {
              type: 'text',
              create: 'hidden',
              update: 'hidden',
            }),
            nameField: fb.columns('nameTs', {
              type: 'text',
            }),
            authorField: fb.relations('authorTs', (fb) => ({
              type: 'connectOrCreate',
              fields: fb.fields('authorTs', (fb) => ({
                idField: fb.columns('idTs', {
                  type: 'text',
                  create: 'hidden',
                  update: 'hidden',
                }),
                nameField: fb.columns('nameTs', {
                  type: 'text',
                }),
              })),
              options: async () => [],
            })),
          })),
          identifierColumn: 'idTs',
        })

        describe('with "create" mode', () => {
          it('should (C) create successfully', async () => {
            const postData = mockPostData[0]

            const { insertMock, valuesMock } = prepareInsertMock(
              vi
                .fn()
                .mockResolvedValueOnce([
                  { idTs: mockAuthorData[0].id, nameTs: mockAuthorData[0].name },
                ])
                .mockResolvedValueOnce([{ idTs: postData.id }])
            )
            tx.insert = insertMock
            mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue({
              __pk: postData.id,
              __id: postData.id,
              idTs: postData.id,
              nameTs: postData.name,
              authorTs: {
                idTs: mockAuthorData[0].id,
                nameTs: mockAuthorData[0].name,
              },
            })

            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await postWithAuthorConnectOrCreateCollection.admin.api.create({
              slug: postWithAuthorConnectOrCreateCollection.slug,
              fields: postWithAuthorConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              data: {
                nameField: postData.name,
                authorField: {
                  create: {
                    nameField: mockAuthorData[0].name,
                  },
                },
              },
            })
            // ====== end user part (field) ======

            // TS method
            expect(valuesMock).toHaveBeenCalledWith([{ nameTs: mockAuthorData[0].name }])
            expect(valuesMock).toHaveBeenCalledWith([
              { nameTs: postData.name, authorIdTs: mockAuthorData[0].id },
            ])

            // to create author first and then create post
            expect(tx.insert).toHaveBeenCalledTimes(2)

            // Field method
            expect(result).toEqual({ __pk: postData.id, __id: postData.id })
          })

          it('should (R) read successfully', async () => {
            const postData = mockPostData[0]
            const authorData = mockAuthorData[0]

            mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
              idTs: postData.id,
              nameTs: postData.name,
              authorTs: {
                __pk: authorData.id,
                idTs: authorData.id,
                nameTs: authorData.name,
              },
            })

            const result = await postWithAuthorConnectOrCreateCollection.admin.api.findOne({
              slug: postWithAuthorConnectOrCreateCollection.slug,
              fields: postWithAuthorConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              id: postData.id,
            })
            // ====== end user part (field) ======

            expect(mockDb.query.postWithAuthorTs.findFirst).toHaveBeenCalledWith(
              expect.objectContaining({
                columns: expect.objectContaining({
                  idTs: true,
                  nameTs: true,
                }),
                with: expect.objectContaining({
                  authorTs: expect.objectContaining({
                    columns: expect.objectContaining({
                      idTs: true,
                      nameTs: true,
                    }),
                  }),
                }),
              })
            )

            const expectedPostWithAuthorDataField = {
              idField: postData.id,
              nameField: postData.name,
              authorField: {
                __pk: authorData.id,
                idField: authorData.id,
                nameField: authorData.name,
              },
            }

            // Field method
            expect(result).toEqual(expectedPostWithAuthorDataField)
          })
          it('should (U) update successfully', async () => {
            const updatedPostData = {
              id: 'post-1',
              name: 'Updated Post Name',
              authorId: 'author-99',
            }

            const updatedPostDataTs = {
              idTs: updatedPostData.id,
              nameTs: updatedPostData.name,
              authorIdTs: updatedPostData.authorId,
            }

            const updatedPostDataField = {
              idField: updatedPostData.id,
              nameField: updatedPostData.name,
              authorIdField: updatedPostData.authorId,
            }

            // ===== start service part (TS) =====
            const { setMock, updateMock } = prepareUpdateWhereMock(
              vi.fn().mockResolvedValueOnce([updatedPostDataTs])
            )

            tx.update = updateMock

            mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue({
              __pk: updatedPostData.id,
              __id: updatedPostData.id,
              idTs: updatedPostData.id,
              nameTs: updatedPostData.name,
              authorTs: {
                idTs: mockAuthorData[0].id,
                nameTs: mockAuthorData[0].name,
              },
            })
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await postWithAuthorConnectOrCreateCollection.admin.api.update({
              id: updatedPostData.id,
              data: {
                nameField: updatedPostDataField.nameField,
                authorField: {
                  connect: updatedPostDataField.authorIdField,
                },
              },
              context: { db: mockDb as any },
              slug: postWithAuthorConnectOrCreateCollection.slug,
              fields: postWithAuthorConnectOrCreateCollection.fields,
            })
            // ====== end user part (field) ======

            expect(updateMock).toHaveBeenCalledTimes(1)
            expect(setMock).toHaveBeenCalledWith([
              expect.objectContaining({
                nameTs: updatedPostDataTs.nameTs,
                authorIdTs: updatedPostDataTs.authorIdTs,
              }),
            ])
            expect(result).toEqual({
              __pk: updatedPostDataField.idField,
              __id: updatedPostDataField.idField,
            })
          })
          it('should (D) delete successfully', async () => {
            const postIdsToDelete = [1, 2, 3]

            // ===== start service part (TS) =====
            const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
              vi.fn().mockResolvedValueOnce([])
            )
            tx.delete = deleteMock
            mockDb.delete = deleteMock
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await postWithAuthorConnectOrCreateCollection.admin.api.delete({
              slug: postWithAuthorConnectOrCreateCollection.slug,
              fields: postWithAuthorConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              ids: postIdsToDelete,
            })
            // ====== end user part (field) ======

            expect(deleteMock).toHaveBeenCalledTimes(1)
            expect(whereMock).toHaveBeenCalledTimes(1)
            expect(returningMock).toHaveBeenCalledTimes(1)
            expect(result).toEqual(undefined)
          })
        })

        describe('with "connect" mode', () => {
          it('should (C) create successfully', async () => {
            const authorData = mockAuthorData[0]

            const authorDataTs = {
              idTs: authorData.id,
              nameTs: authorData.name,
            }

            const authorDataField = {
              idField: authorData.id,
              nameField: authorData.name,
            }

            const postWithAuthorData = { ...mockPostData[0], authorId: authorData.id }

            const postWithAuthorDataTs = {
              idTs: postWithAuthorData.id,
              nameTs: postWithAuthorData.name,
              authorIdTs: postWithAuthorData.authorId,
            }

            const postWithAuthorDataField = {
              idField: postWithAuthorData.id,
              nameField: postWithAuthorData.name,
              authorIdField: authorData.id,
            }

            // ===== start service part (TS) =====
            mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue(authorDataTs)
            mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue({
              __pk: postWithAuthorData.id,
              __id: postWithAuthorData.id,
              ...postWithAuthorDataTs,
            })

            const { insertMock, valuesMock } = prepareInsertMock(
              vi
                .fn()
                .mockResolvedValueOnce([postWithAuthorDataTs])
                .mockResolvedValueOnce([authorDataTs])
            )

            tx.insert = insertMock
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await postWithAuthorConnectOrCreateCollection.admin.api.create({
              fields: postWithAuthorConnectOrCreateCollection.fields,
              slug: postWithAuthorConnectOrCreateCollection.slug,
              context: { db: mockDb as any },
              data: {
                nameField: postWithAuthorDataField.nameField,
                authorField: {
                  connect: authorDataField.idField,
                },
              },
            })
            // ====== end user part (field) ======

            // TS method
            expect(valuesMock).toHaveBeenCalledWith([
              expect.objectContaining({
                nameTs: postWithAuthorDataTs.nameTs,
              }),
            ])

            expect(tx.insert).toHaveBeenCalledTimes(1)

            // Field method
            expect(result).toEqual({
              __pk: postWithAuthorDataField.idField,
              __id: postWithAuthorDataField.idField,
            })
          })
          it('should (R) read successfully', async () => {
            const postData = mockPostData[0]
            const authorData = mockAuthorData[0]

            const postWithAuthorDataTs = {
              __pk: postData.id,
              __id: postData.id,
              idTs: postData.id,
              nameTs: postData.name,
              authorTs: {
                __pk: authorData.id,
                __id: authorData.id,
                idTs: authorData.id,
                nameTs: authorData.name,
              },
            }

            // ===== start service part (TS) =====
            mockDb.query.postWithAuthorTs.findFirst = vi
              .fn()
              .mockResolvedValueOnce(postWithAuthorDataTs)
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await postWithAuthorConnectOrCreateCollection.admin.api.findOne({
              slug: postWithAuthorConnectOrCreateCollection.slug,
              fields: postWithAuthorConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              id: postData.id,
            })
            // ====== end user part (field) ======

            expect(mockDb.query.postWithAuthorTs.findFirst).toHaveBeenCalledWith(
              expect.objectContaining({
                columns: expect.objectContaining({
                  idTs: true,
                  nameTs: true,
                }),
                with: expect.objectContaining({
                  authorTs: expect.objectContaining({
                    columns: expect.objectContaining({
                      idTs: true,
                      nameTs: true,
                    }),
                  }),
                }),
              })
            )

            const expectedPostWithAuthorDataField = {
              __pk: postData.id,
              __id: postData.id,
              idField: postData.id,
              nameField: postData.name,
              authorField: {
                __pk: authorData.id,
                idField: authorData.id,
                nameField: authorData.name,
              },
            }

            // Field method
            expect(result).toEqual(expectedPostWithAuthorDataField)
            // bypass
            // expect(result).toEqual(postWithAuthorDataTs)
          })
          it('should (U) update successfully', async () => {
            const updatedPostData = {
              id: 'post-1',
              name: 'Updated Post Name',
              authorId: 'author-1',
            }

            const updatedPostDataTs = {
              idTs: updatedPostData.id,
              nameTs: updatedPostData.name,
              authorIdTs: updatedPostData.authorId,
            }

            const updatedPostDataField = {
              idField: updatedPostData.id,
              nameField: updatedPostData.name,
              authorIdField: updatedPostData.authorId,
            }

            // ===== start service part (TS) =====
            const { setMock, updateMock } = prepareUpdateWhereMock(
              vi.fn().mockResolvedValueOnce([updatedPostDataTs])
            )
            tx.update = updateMock

            mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue({
              __pk: updatedPostData.id,
              __id: updatedPostData.id,
              idTs: updatedPostData.id,
              nameTs: updatedPostData.name,
              authorTs: {
                idTs: mockAuthorData[0].id,
                nameTs: mockAuthorData[0].name,
              },
            })
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await postWithAuthorConnectOrCreateCollection.admin.api.update({
              slug: postWithAuthorConnectOrCreateCollection.slug,
              fields: postWithAuthorConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              id: updatedPostData.id,
              data: {
                nameField: updatedPostDataField.nameField,
                authorField: {
                  connect: updatedPostDataField.authorIdField,
                },
              },
            })
            // ====== end user part (field) ======

            expect(updateMock).toHaveBeenCalledTimes(1)
            expect(setMock).toHaveBeenCalledWith([
              expect.objectContaining({
                nameTs: updatedPostDataTs.nameTs,
                authorIdTs: updatedPostDataTs.authorIdTs,
              }),
            ])
            expect(result).toEqual({
              __pk: updatedPostDataField.idField,
              __id: updatedPostDataField.idField,
            })
          })
          it('should (D) delete successfully', async () => {
            const postIdsToDelete = [1, 2, 3]

            // ===== start service part (TS) =====
            const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
              vi.fn().mockResolvedValueOnce([])
            )
            tx.delete = deleteMock
            mockDb.delete = deleteMock
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await postWithAuthorConnectOrCreateCollection.admin.api.delete({
              slug: postWithAuthorConnectOrCreateCollection.slug,
              fields: postWithAuthorConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              ids: postIdsToDelete,
            })
            // ====== end user part (field) ======

            expect(deleteMock).toHaveBeenCalledTimes(1)
            expect(whereMock).toHaveBeenCalledTimes(1)
            expect(returningMock).toHaveBeenCalledTimes(1)
            expect(result).toEqual(undefined)
          })
        })
      })

      describe('with "Many relation"', () => {
        const authorWithPostsConnectOrCreateCollection = builder.collection('authorTs', {
          slug: 'authorWithPost',
          fields: builder.fields('authorTs', (fb) => ({
            idField: fb.columns('idTs', {
              type: 'text',
              create: 'hidden',
              update: 'hidden',
            }),
            nameField: fb.columns('nameTs', {
              type: 'text',
            }),
            postsField: fb.relations('postsTs', (fb) => ({
              type: 'connectOrCreate',
              fields: fb.fields('postWithAuthorTs', (fb) => ({
                idField: fb.columns('idTs', {
                  type: 'text',
                  create: 'hidden',
                  update: 'hidden',
                }),
                nameField: fb.columns('nameTs', {
                  type: 'text',
                }),
              })),
              options: async (args) => {
                const result = await args.db.query.authorTs.findMany()
                return result.map((author) => ({
                  label: author.nameTs as string,
                  value: author.idTs as string,
                }))
              },
            })),
          })),
          identifierColumn: 'idTs',
        })

        describe('with "create" case', () => {
          it('should (C) create successfully', async () => {
            const postData = mockPostData[0]

            const postDataTs = {
              idTs: postData.id,
              nameTs: postData.name,
            }

            const postDataField = {
              idField: postData.id,
              nameField: postData.name,
            }

            const authorWithPostData = { ...mockAuthorData[0], posts: [postData] }

            const authorWithPostDataTs = {
              idTs: authorWithPostData.id,
              nameTs: authorWithPostData.name,
              postsTs: [
                {
                  idTs: postDataTs.idTs,
                },
              ],
            }

            const authorWithPostDataField = {
              idField: authorWithPostData.id,
              nameField: authorWithPostData.name,
            }

            // ===== start service part (TS) =====
            mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue({
              __pk: authorWithPostData.id,
              __id: authorWithPostData.id,
              ...authorWithPostDataTs,
            })
            mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue(postDataTs)

            const { insertMock, valuesMock: valuesInsertMock } = prepareInsertMock(
              vi
                .fn()
                .mockResolvedValueOnce([authorWithPostDataTs])
                .mockResolvedValueOnce([postDataTs])
                .mockResolvedValueOnce([
                  {
                    idTs: 'post-2',
                    nameTs: 'Post 2',
                  },
                ])
                .mockResolvedValueOnce([
                  {
                    idTs: 'post-3',
                    nameTs: 'Post 3',
                  },
                ])
                .mockResolvedValueOnce([
                  {
                    idTs: 'post-4',
                    nameTs: 'Post 4',
                  },
                ])
                .mockResolvedValueOnce([
                  {
                    idTs: 'post-5',
                    nameTs: 'Post 5',
                  },
                ])
            )
            tx.insert = insertMock

            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            // change to create Author and make it auto connect to post
            const result = await authorWithPostsConnectOrCreateCollection.admin.api.create({
              // TODO: fix create data shouldn't have primary key
              data: {
                nameField: authorWithPostDataField.nameField,
                postsField: [
                  // TODO: fix this should be able to crete with object
                  {
                    create: {
                      nameField: postDataField.nameField,
                    },
                  },
                  {
                    create: {
                      nameField: 'Post 2',
                    },
                  },
                  {
                    create: {
                      nameField: 'Post 3',
                    },
                  },
                  {
                    create: {
                      nameField: 'Post 4',
                    },
                  },
                  {
                    create: {
                      nameField: 'Post 5',
                    },
                  },
                ],
              },
              context: { db: mockDb as any },
              fields: authorWithPostsConnectOrCreateCollection.fields,
              slug: 'author-with-post',
            })
            // ====== end user part (field) ======

            expect(insertMock).toHaveBeenCalledTimes(6)

            expect(valuesInsertMock).toHaveBeenCalledTimes(6)

            // TS method
            // values for insert
            expect(valuesInsertMock).toHaveBeenCalledWith([
              expect.objectContaining({
                nameTs: authorWithPostDataTs.nameTs,
              }),
            ])

            // Field method
            expect(result).toEqual({ __pk: authorWithPostData.id, __id: authorWithPostData.id })
          })
          it('should (R) read successfully', async () => {
            const postData = mockPostData[0]
            const authorData = mockAuthorData[0]

            const authorWithPostDataTs = {
              __pk: authorData.id,
              __id: authorData.id,
              idTs: authorData.id,
              nameTs: authorData.name,
              postsTs: [
                {
                  __pk: postData.id,
                  idTs: postData.id,
                  nameTs: postData.name,
                },
              ],
            }

            // ===== start service part (TS) =====
            mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce(authorWithPostDataTs)
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await authorWithPostsConnectOrCreateCollection.admin.api.findOne({
              slug: authorWithPostsConnectOrCreateCollection.slug,
              fields: authorWithPostsConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              id: authorData.id,
            })
            // ====== end user part (field) ======

            expect(mockDb.query.authorTs.findFirst).toHaveBeenCalledWith(
              expect.objectContaining({
                columns: expect.objectContaining({
                  idTs: true,
                  nameTs: true,
                }),
                with: expect.objectContaining({
                  postsTs: expect.objectContaining({
                    columns: expect.objectContaining({
                      idTs: true,
                      nameTs: true,
                    }),
                  }),
                }),
              })
            )

            const expectedAuthorWithPostDataField = {
              __pk: authorData.id,
              __id: authorData.id,
              idField: authorData.id,
              nameField: authorData.name,
              postsField: [
                {
                  __pk: postData.id,
                  idField: postData.id,
                  nameField: postData.name,
                },
              ],
            }

            // Field method
            expect(result).toEqual(expectedAuthorWithPostDataField)
            // bypass
            // expect(result).toEqual(authorWithPostDataTs)
          })
          it('should (U) update successfully', async () => {
            const updatedAuthorData = {
              id: 'author-1',
              name: 'Updated Author Name',
            }

            const updatedAuthorDataTs = {
              idTs: updatedAuthorData.id,
              nameTs: updatedAuthorData.name,
            }

            const updatedAuthorDataField = {
              idField: updatedAuthorData.id,
              nameField: updatedAuthorData.name,
            }

            // ===== start service part (TS) =====
            const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
              vi.fn().mockResolvedValueOnce([updatedAuthorDataTs])
            )
            const { insertMock, valuesMock } = prepareInsertMock(
              vi.fn().mockResolvedValueOnce([
                {
                  idTs: mockPostData[0].id,
                  nameTs: mockPostData[0].name,
                },
              ])
            )
            tx.update = updateMock
            tx.insert = insertMock

            mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue({
              __pk: updatedAuthorData.id,
              __id: updatedAuthorData.id,
              idTs: updatedAuthorData.id,
              nameTs: updatedAuthorData.name,
              postTs: [
                {
                  idTs: mockPostData[0].id,
                  nameTs: mockPostData[0].name,
                },
                {
                  idTs: mockPostData[1].id,
                  nameTs: mockPostData[1].name,
                },
              ],
            })
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await authorWithPostsConnectOrCreateCollection.admin.api.update({
              slug: authorWithPostsConnectOrCreateCollection.slug,
              fields: authorWithPostsConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              id: updatedAuthorData.id,
              data: {
                nameField: updatedAuthorDataField.nameField,
                postsField: [
                  {
                    create: {
                      nameField: mockPostData[0].name,
                    },
                  },
                  {
                    connect: mockPostData[1].id,
                  },
                  {
                    disconnect: mockPostData[2].id,
                  },
                ],
              },
            })
            // ====== end user part (field) ======
            expect(setMock).toHaveBeenCalledTimes(3)
            expect(updateMock).toHaveBeenCalledTimes(3)
            expect(whereUpdateMock).toHaveBeenCalledTimes(3)

            expect(whereUpdateMock).toHaveBeenCalledWith(
              eq(
                authorWithPostsConnectOrCreateCollection.fields.idField._.column,
                updatedAuthorData.id
              )
            )
            expect(whereUpdateMock).toHaveBeenCalledWith(
              eq(
                authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
                mockPostData[1].id
              )
            )
            expect(whereUpdateMock).toHaveBeenCalledWith(
              eq(
                authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
                mockPostData[2].id
              )
            )

            expect(setMock).toHaveBeenCalledWith([
              expect.objectContaining({
                nameTs: updatedAuthorDataTs.nameTs,
              }),
            ])
            expect(valuesMock).toHaveBeenCalledWith([
              expect.objectContaining({
                nameTs: mockPostData[0].name,
              }),
            ])

            expect(result).toEqual({ __pk: updatedAuthorData.id, __id: updatedAuthorData.id })
          })
          it('should (D) delete successfully', async () => {
            const authorIdsToDelete = [1, 2, 3]

            // ===== start service part (TS) =====
            const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
              vi.fn().mockResolvedValueOnce([])
            )
            tx.delete = deleteMock
            mockDb.delete = deleteMock
            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await authorWithPostsConnectOrCreateCollection.admin.api.delete({
              slug: authorWithPostsConnectOrCreateCollection.slug,
              fields: authorWithPostsConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              ids: authorIdsToDelete,
            })
            // ====== end user part (field) ======

            expect(deleteMock).toHaveBeenCalledTimes(1)
            expect(whereMock).toHaveBeenCalledTimes(1)
            expect(returningMock).toHaveBeenCalledTimes(1)
            expect(result).toEqual(undefined)
          })
        })

        describe('with "connect" case', () => {
          it('should (C) create successfully', async () => {
            const postData = mockPostData[0]

            const postDataTs = {
              idTs: postData.id,
              nameTs: postData.name,
            }

            const authorWithPostData = { ...mockAuthorData[0], posts: [postData] }

            const authorWithPostDataTs = {
              idTs: authorWithPostData.id,
              nameTs: authorWithPostData.name,
              postsTs: [
                {
                  idTs: postDataTs.idTs,
                },
              ],
            }

            const authorWithPostDataField = {
              idField: authorWithPostData.id,
              nameField: authorWithPostData.name,
            }

            // ===== start service part (TS) =====
            mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue({
              __pk: authorWithPostData.id,
              __id: authorWithPostData.id,
              ...authorWithPostDataTs,
            })
            mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue(postDataTs)

            const { insertMock, valuesMock: valuesInsertMock } = prepareInsertMock(
              vi.fn().mockResolvedValueOnce([authorWithPostDataTs])
            )
            tx.insert = insertMock

            const { updateMock, setMock } = prepareUpdateWhereMock(
              vi.fn().mockResolvedValueOnce([postDataTs])
            )

            tx.update = updateMock

            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await authorWithPostsConnectOrCreateCollection.admin.api.create({
              slug: authorWithPostsConnectOrCreateCollection.slug,
              fields: authorWithPostsConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              data: {
                nameField: authorWithPostDataField.nameField,
                postsField: [
                  'post-1',
                  'post-2',
                  'post-3',
                  'post-4',
                  'post-5',
                  'post-6',
                  'post-7',
                ].map((postId) => ({
                  connect: postId,
                })),
              },
            })
            // ====== end user part (field) ======

            expect(insertMock).toHaveBeenCalledTimes(1)

            // TS method
            // values for insert
            expect(valuesInsertMock).toHaveBeenCalledWith([
              expect.objectContaining({
                nameTs: authorWithPostDataTs.nameTs,
              }),
            ])

            expect(updateMock).toHaveBeenCalledTimes(7)
            expect(setMock).toHaveBeenCalledTimes(7)

            expect(setMock).toHaveBeenCalledWith(
              expect.objectContaining({
                authorIdTs: 'author-1',
              })
            )

            // Field method
            expect(result).toEqual({
              __pk: authorWithPostData.id,
              __id: authorWithPostData.id,
            })
          })
          it('should (R) read successfully', async () => {
            const postData = mockPostData[0]
            const authorData = mockAuthorData[0]

            const authorWithPostDataTs = {
              __pk: authorData.id,
              __id: authorData.id,
              idTs: authorData.id,
              nameTs: authorData.name,
              postsTs: [
                {
                  __pk: postData.id,
                  idTs: postData.id,
                  nameTs: postData.name,
                },
              ],
            }

            mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce(authorWithPostDataTs)

            const result = await authorWithPostsConnectOrCreateCollection.admin.api.findOne({
              fields: authorWithPostsConnectOrCreateCollection.fields,
              slug: authorWithPostsConnectOrCreateCollection.slug,
              context: { db: mockDb as any },
              id: authorData.id,
            })

            expect(mockDb.query.authorTs.findFirst).toHaveBeenCalledWith(
              expect.objectContaining({
                columns: expect.objectContaining({
                  idTs: true,
                  nameTs: true,
                }),
                with: expect.objectContaining({
                  postsTs: expect.objectContaining({
                    columns: expect.objectContaining({
                      idTs: true,
                      nameTs: true,
                    }),
                  }),
                }),
              })
            )

            const expectedAuthorWithPostDataField = {
              __pk: authorData.id,
              __id: authorData.id,
              idField: authorData.id,
              nameField: authorData.name,
              postsField: [
                {
                  __pk: postData.id,
                  idField: postData.id,
                  nameField: postData.name,
                },
              ],
            }

            // Field method
            expect(result).toEqual(expectedAuthorWithPostDataField)
            // bypass
            // expect(result).toEqual(authorWithPostDataTs)
          })

          it('should (U) update successfully', async () => {
            const updatedAuthorData = {
              id: 'author-1',
              name: 'Updated Author Name',
            }

            const updatedAuthorDataTs = {
              idTs: updatedAuthorData.id,
              nameTs: updatedAuthorData.name,
            }

            const updatedAuthorDataField = {
              idField: updatedAuthorData.id,
              nameField: updatedAuthorData.name,
            }

            // ===== start service part (TS) =====
            const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
              vi.fn().mockResolvedValueOnce([updatedAuthorDataTs])
            )

            tx.update = updateMock

            mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue({
              __pk: updatedAuthorData.id,
              __id: updatedAuthorData.id,
              idTs: updatedAuthorData.id,
              nameTs: updatedAuthorData.name,
              postsTs: [
                {
                  idTs: 'post-1',
                  nameTs: 'Post 1',
                },
                {
                  idTs: 'post-2',
                  nameTs: 'Post 2',
                },
                {
                  idTs: 'post-3',
                  nameTs: 'Post 3',
                },
              ],
            })

            // ====== end service part (TS) ======

            // ===== start user part (field) =====
            const result = await authorWithPostsConnectOrCreateCollection.admin.api.update({
              slug: authorWithPostsConnectOrCreateCollection.slug,
              fields: authorWithPostsConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              id: updatedAuthorData.id,
              data: {
                nameField: updatedAuthorDataField.nameField,
                postsField: ['post-1', 'post-2', 'post-3'].map((postId) => ({
                  connect: postId,
                })),
              },
            })
            // ====== end user part (field) ======

            // Assertions
            // main Author update and 3 times for post update
            expect(updateMock).toHaveBeenCalledTimes(4)
            expect(setMock).toHaveBeenCalledWith([
              expect.objectContaining({
                nameTs: updatedAuthorDataTs.nameTs,
              }),
            ])

            // 3 times for post update + 1 for author update
            expect(whereUpdateMock).toHaveBeenCalledTimes(4)
            expect(whereUpdateMock).toHaveBeenCalledWith(
              eq(
                authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
                'post-1'
              )
            )
            expect(whereUpdateMock).toHaveBeenCalledWith(
              eq(
                authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
                'post-2'
              )
            )
            expect(whereUpdateMock).toHaveBeenCalledWith(
              eq(
                authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
                'post-3'
              )
            )
            expect(whereUpdateMock).toHaveBeenCalledWith(
              eq(
                authorWithPostsConnectOrCreateCollection.fields.idField._.column,
                updatedAuthorData.id
              )
            )

            expect(result).toEqual({ __pk: updatedAuthorData.id, __id: updatedAuthorData.id })
          })

          it('should (D) delete successfully', async () => {
            const authorIdsToDelete = [1, 2, 3]

            const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
              vi.fn().mockResolvedValueOnce([])
            )
            tx.delete = deleteMock
            mockDb.delete = deleteMock

            const result = await authorWithPostsConnectOrCreateCollection.admin.api.delete({
              slug: authorWithPostsConnectOrCreateCollection.slug,
              fields: authorWithPostsConnectOrCreateCollection.fields,
              context: { db: mockDb as any },
              ids: authorIdsToDelete,
            })

            expect(deleteMock).toHaveBeenCalledTimes(1)
            expect(whereMock).toHaveBeenCalledTimes(1)
            expect(returningMock).toHaveBeenCalledTimes(1)
            expect(result).toEqual(undefined)
          })
        })
      })
    })
  })
})
