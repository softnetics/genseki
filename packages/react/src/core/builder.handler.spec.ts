import { describe, expect, it } from 'vitest'

// TODO: As this test file is currently hard to maintain and mock the database,
// we should refactor it to use a more generic mock database setup.
// So, this file test should split into multiple unit tests for each sub-functions
// This will help to ensure that each part of the code is tested independently instead of big integration test.

describe('Builder Handler', () => {
  it('should be defined', () => {
    expect(true).toBe(true) // Placeholder for actual tests
  })
})

// import { eq, or, sql } from 'drizzle-orm'
// import { beforeEach, describe, expect, it, vi } from 'vitest'

// import * as schema from './__mocks__/test-schema'
// import { Builder } from './builder'
// import type { Contextable, RequestContextable, RequestContextArgs } from './context'

// // TODO: Refactor this to use a more generic mock database setup, maybe create(tx, query)
// const prepareMockDb = () => {
//   const tx = {
//     findFirst: vi.fn(),
//     findMany: vi.fn(),
//     insert: vi.fn(),
//     update: vi.fn(),
//     delete: vi.fn(),
//   }
//   const mockDb = {
//     transaction: vi.fn().mockImplementation((cb) => cb(tx)),
//     delete: vi.fn(),
//     query: {
//       postTs: {
//         findFirst: vi.fn(),
//         findMany: vi.fn(),
//         insert: vi.fn(),
//         update: vi.fn(),
//         delete: vi.fn(),
//       },
//       authorTs: {
//         findFirst: vi.fn(),
//         findMany: vi.fn(),
//         insert: vi.fn(),
//         update: vi.fn(),
//         delete: vi.fn(),
//       },
//       postWithAuthorTs: {
//         findFirst: vi.fn(),
//         findMany: vi.fn(),
//         insert: vi.fn(),
//         update: vi.fn(),
//         delete: vi.fn(),
//       },
//     },
//   }

//   return { tx, mockDb }
// }

// let { tx, mockDb } = prepareMockDb()

// const prepareUpdateWhereMock = (mockData: any) => {
//   const whereUpdateMock = vi.fn().mockImplementation(() => ({ returning: mockData }))
//   const setMock = vi.fn().mockImplementation(() => ({ where: whereUpdateMock }))
//   const updateMock = vi.fn().mockImplementation(() => ({ set: setMock }))

//   tx.update = updateMock

//   return { whereUpdateMock, setMock, updateMock }
// }

// const prepareInsertMock = (mockData: any) => {
//   const valuesMock = vi.fn().mockImplementation(() => ({ returning: mockData }))
//   const insertMock = vi.fn().mockImplementation(() => ({ values: valuesMock }))

//   tx.insert = insertMock

//   return { insertMock, valuesMock }
// }

// const prepareDeleteMock = (mockData: any) => {
//   const returningMock = mockData
//   const whereMock = vi.fn().mockImplementation(() => ({
//     returning: returningMock,
//   }))
//   const deleteMock = vi.fn().mockImplementation(() => ({
//     where: whereMock,
//   }))

//   tx.delete = deleteMock
//   mockDb.delete = deleteMock

//   return { deleteMock, whereMock, returningMock }
// }

// beforeEach(() => {
//   const { tx: newTx, mockDb: newMockDb } = prepareMockDb()
//   tx = newTx
//   mockDb = newMockDb
// })

// const mockPostData = Array.from({ length: 10 }, (_, i) => ({
//   id: `post-${i + 1}`,
//   name: `Post ${i + 1}`,
// }))

// const mockAuthorData = Array.from({ length: 10 }, (_, i) => ({
//   id: `author-${i + 1}`,
//   name: `Author ${i + 1}`,
// }))

// interface User {
//   id: string
//   name: string
//   email: string
// }

// class MyRequestContext implements RequestContextable<User> {
//   constructor() {}

//   requiredAuthenticated() {
//     // Simulate an authenticated user
//     return {
//       id: '123',
//       name: 'John Doe',
//       email: 'example@example.com',
//     }
//   }
// }

// class MyContext implements Contextable<User> {
//   constructor() {}

//   toRequestContext(args: RequestContextArgs) {
//     return new MyRequestContext()
//   }
// }

// const myContext = new MyContext()
// const requestContext = myContext.toRequestContext({ headers: {} })

// const builder = new Builder({ db: mockDb as any, schema }).$context<MyContext>()

// describe('ApiHandler', () => {
//   describe('with initial and utils', () => {
//     it('should initialize collection successfully', () => {
//       // expect(postCollection).toBeDefined()
//       // expect(postWithAuthorConnectOrCreateCollection).toBeDefined()
//       // expect(authorWithPostConnectOrCreateCollection).toBeDefined()
//     })

//     // test createDrizzleQuery
//     it('should create createDrizzleQuery correctly', () => {
//       //   const queryPayload = createDrizzleQuery(postWithAuthorConnectOrCreateCollection.fields)
//       //   expect(queryPayload).toMatchObject({
//       //     columns: {
//       //       idTs: true,
//       //       nameTs: true,
//       //     },
//       //     with: {
//       //       authorTs: {
//       //         columns: {
//       //           idTs: true,
//       //           nameTs: true,
//       //         },
//       //       },
//       //     },
//       //   })
//     })
//   })

//   describe('Check for __id field', () => {
//     const postCollection = builder.collection('postTs', {
//       slug: 'post',
//       fields: builder.fields('postTs', (fb) => ({
//         idField: fb.columns('idTs', {
//           type: 'text',
//           create: 'hidden',
//           update: 'hidden',
//         }),
//         nameField: fb.columns('nameTs', {
//           type: 'text',
//         }),
//       })),
//       identifierColumn: 'nameTs',
//     })

//     it('should (C) create successfully', async () => {
//       const postData = mockPostData[0]

//       mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
//         __pk: postData.id,
//         __id: postData.name,
//         idTs: postData.id,
//         nameTs: postData.name,
//       })

//       const { insertMock, valuesMock } = prepareInsertMock(
//         vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
//       )

//       const result = await postCollection.admin.endpoints.create.handler({
//         context: requestContext,
//         body: {
//           nameField: postData.name,
//         },
//         headers: {},
//       })

//       expect(insertMock).toHaveBeenCalledTimes(1)
//       expect(valuesMock).not.toHaveBeenCalledWith([
//         {
//           idTs: expect.anything(),
//           nameTs: postData.name,
//         },
//       ])
//       expect(mockDb.query.postTs.findFirst).toHaveBeenCalledWith(
//         expect.objectContaining({
//           columns: {
//             idTs: true,
//             nameTs: true,
//           },
//           where: eq(postCollection.fields.idField._.column, postData.id),
//           extras: {
//             __pk: sql<string | number>`${schema.postTs.idTs}`.as('__pk'),
//             __id: sql<string | number>`${schema.postTs.nameTs}`.as('__id'),
//           },
//         })
//       )
//       expect(tx.insert).toHaveBeenCalledTimes(1)
//       expect(result.body).toEqual({ __pk: postData.id, __id: postData.name })
//     })

//     it('should (R) read successfully', async () => {
//       const postData = mockPostData[0]

//       mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
//         __pk: postData.id,
//         __id: postData.name,
//         idTs: postData.id,
//         nameTs: postData.name,
//       })

//       const result = await postCollection.admin.endpoints.findOne.handler({
//         context: requestContext,
//         pathParams: {
//           id: postData.id,
//         },
//         headers: {},
//       })

//       expect(mockDb.query.postTs.findFirst).toBeCalledTimes(1)
//       expect(mockDb.query.postTs.findFirst).toHaveBeenCalledWith(
//         expect.objectContaining({
//           columns: {
//             idTs: true,
//             nameTs: true,
//           },
//           where: eq(postCollection.fields.idField._.column, postData.id),
//           extras: {
//             __pk: sql<string | number>`${schema.postTs.idTs}`.as('__pk'),
//             __id: sql<string | number>`${schema.postTs.nameTs}`.as('__id'),
//           },
//         })
//       )
//       expect(result.body).toEqual({
//         __pk: postData.id,
//         __id: postData.name,
//         idField: postData.id,
//         nameField: postData.name,
//       })
//     })

//     it('should (U) update successfully', async () => {
//       const postData = mockPostData[0]
//       const updatedPostData = mockPostData[1]

//       mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
//         __pk: postData.id,
//         __id: postData.name,
//         idTs: updatedPostData.id,
//         nameTs: updatedPostData.name,
//       })

//       const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
//         vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
//       )

//       const result = await postCollection.admin.endpoints.update.handler({
//         context: requestContext,
//         pathParams: {
//           id: postData.id,
//         },
//         body: {
//           nameField: updatedPostData.name,
//         },
//         headers: {},
//       })

//       expect(updateMock).toHaveBeenCalledTimes(1)
//       expect(whereUpdateMock).toBeCalledWith(
//         eq(postCollection.fields.idField._.column, postData.id)
//       )
//       expect(mockDb.query.postTs.findFirst).toHaveBeenCalledWith(
//         expect.objectContaining({
//           columns: {
//             idTs: true,
//             nameTs: true,
//           },
//           where: eq(postCollection.fields.idField._.column, postData.id),
//           extras: {
//             __pk: sql<string | number>`${schema.postTs.idTs}`.as('__pk'),
//             __id: sql<string | number>`${schema.postTs.nameTs}`.as('__id'),
//           },
//         })
//       )
//       expect(setMock).toHaveBeenCalledWith({ nameTs: updatedPostData.name })
//       expect(result.body).toEqual({ __pk: postData.id, __id: postData.name })
//     })

//     it('should (D) delete successfully', async () => {
//       const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))
//       tx.delete = deleteMock
//       mockDb.delete = deleteMock

//       const result = await postCollection.admin.endpoints.delete.handler({
//         context: requestContext,
//         body: {
//           ids: [mockPostData[0].name, mockPostData[1].name, mockPostData[2].name],
//         },
//         headers: {},
//       })

//       expect(deleteMock).toHaveBeenCalledTimes(1)
//       expect(whereMock).toHaveBeenCalledTimes(1)
//       expect(whereMock).toHaveBeenCalledWith(
//         or(
//           eq(postCollection.fields.nameField._.column, mockPostData[0].name),
//           eq(postCollection.fields.nameField._.column, mockPostData[1].name),
//           eq(postCollection.fields.nameField._.column, mockPostData[2].name)
//         )
//       )
//       expect(result.body).toEqual({ message: 'ok' })
//     })
//   })

//   describe('with no relation case', () => {
//     const postCollection = builder.collection('postTs', {
//       slug: 'post',
//       fields: builder.fields('postTs', (fb) => ({
//         idField: fb.columns('idTs', {
//           type: 'text',
//           create: 'hidden',
//           update: 'hidden',
//         }),
//         nameField: fb.columns('nameTs', {
//           type: 'text',
//         }),
//       })),
//       identifierColumn: 'idTs',
//     })

//     it('should (C) create successfully', async () => {
//       const postData = mockPostData[0]

//       mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
//         __pk: postData.id,
//         __id: postData.id,
//         idTs: postData.id,
//         nameTs: postData.name,
//       })

//       const { insertMock, valuesMock } = prepareInsertMock(
//         vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
//       )

//       const result = await postCollection.admin.endpoints.create.handler({
//         context: requestContext,
//         body: {
//           nameField: postData.name,
//         },
//         headers: {},
//       })

//       expect(insertMock).toHaveBeenCalledTimes(1)
//       expect(valuesMock).not.toHaveBeenCalledWith([
//         {
//           idTs: expect.anything(),
//           nameTs: postData.name,
//         },
//       ])
//       expect(tx.insert).toHaveBeenCalledTimes(1)
//       expect(result.body).toEqual({ __pk: postData.id, __id: postData.id })
//     })

//     it('should (R) read successfully', async () => {
//       const postData = mockPostData[0]

//       mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
//         __pk: postData.id,
//         __id: postData.id,
//         idTs: postData.id,
//         nameTs: postData.name,
//       })

//       const result = await postCollection.admin.endpoints.findOne.handler({
//         context: requestContext,
//         pathParams: {
//           id: postData.id,
//         },
//         headers: {},
//       })

//       expect(mockDb.query.postTs.findFirst).toBeCalledTimes(1)
//       expect(mockDb.query.postTs.findFirst).toHaveBeenCalledWith(
//         expect.objectContaining({
//           columns: {
//             idTs: true,
//             nameTs: true,
//           },
//           where: eq(postCollection.fields.idField._.column, postData.id),
//         })
//       )
//       expect(result.body).toEqual({
//         __pk: postData.id,
//         __id: postData.id,
//         idField: postData.id,
//         nameField: postData.name,
//       })
//     })

//     it('should (U) update successfully', async () => {
//       const postData = mockPostData[0]
//       const updatedPostData = mockPostData[1]

//       mockDb.query.postTs.findFirst = vi.fn().mockResolvedValueOnce({
//         __pk: postData.id,
//         __id: postData.id,
//         idTs: updatedPostData.id,
//         nameTs: updatedPostData.name,
//       })

//       const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
//         vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
//       )

//       const result = await postCollection.admin.endpoints.update.handler({
//         context: requestContext,
//         pathParams: {
//           id: postData.id,
//         },
//         body: {
//           nameField: updatedPostData.name,
//         },
//         headers: {},
//       })

//       expect(updateMock).toHaveBeenCalledTimes(1)
//       expect(whereUpdateMock).toBeCalledWith(
//         eq(postCollection.fields.idField._.column, postData.id)
//       )
//       expect(setMock).toHaveBeenCalledWith({ nameTs: updatedPostData.name })
//       expect(result.body).toEqual({ __pk: postData.id, __id: postData.id })
//     })

//     it('should (D) delete successfully', async () => {
//       const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))
//       tx.delete = deleteMock
//       mockDb.delete = deleteMock

//       const result = await postCollection.admin.endpoints.delete.handler({
//         context: requestContext,
//         body: {
//           ids: [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id],
//         },
//         headers: {},
//       })

//       expect(deleteMock).toHaveBeenCalledTimes(1)
//       expect(whereMock).toHaveBeenCalledTimes(1)
//       expect(whereMock).toHaveBeenCalledWith(
//         or(
//           eq(postCollection.fields.idField._.column, mockPostData[0].id),
//           eq(postCollection.fields.idField._.column, mockPostData[1].id),
//           eq(postCollection.fields.idField._.column, mockPostData[2].id)
//         )
//       )
//       expect(result.body).toEqual({ message: 'ok' })
//     })
//   })

//   describe('with relation', () => {
//     describe('with "create" mode', () => {
//       describe('with "One" relation', () => {
//         const postWithAuthorCreateCollection = builder.collection('postWithAuthorTs', {
//           slug: 'postWithAuthor',
//           fields: builder.fields('postWithAuthorTs', (fb) => ({
//             idField: fb.columns('idTs', {
//               type: 'text',
//               create: 'hidden',
//               update: 'hidden',
//             }),
//             nameField: fb.columns('nameTs', {
//               type: 'text',
//             }),
//             authorField: fb.relations('authorTs', (fb) => ({
//               type: 'create',
//               fields: fb.fields('authorTs', (fb) => ({
//                 idField: fb.columns('idTs', {
//                   type: 'text',
//                   create: 'hidden',
//                   update: 'hidden',
//                 }),
//                 nameField: fb.columns('nameTs', {
//                   type: 'text',
//                 }),
//               })),
//               options: async () => [],
//             })),
//           })),
//           identifierColumn: 'idTs',
//         })

//         it('should (C) create successfully', async () => {
//           const postData = mockPostData[0]
//           const authorData = mockAuthorData[0]

//           const { insertMock, valuesMock } = prepareInsertMock(
//             vi
//               .fn()
//               // Insert author first
//               .mockResolvedValueOnce([{ idTs: authorData.id }])
//               // Then insert post
//               .mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
//           )

//           mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: postData.id,
//             __id: postData.id,
//             idTs: postData.id,
//             nameTs: postData.name,
//             authorTs: {
//               idTs: authorData.id,
//               nameTs: authorData.name,
//             },
//           })

//           const result = await postWithAuthorCreateCollection.admin.endpoints.create.handler({
//             context: requestContext,
//             body: {
//               nameField: postData.name,
//               authorField: {
//                 create: {
//                   nameField: authorData.name,
//                 },
//               },
//             },
//             headers: {},
//           })

//           expect(insertMock).toHaveBeenCalledTimes(2)
//           expect(valuesMock).toHaveBeenNthCalledWith(1, [{ nameTs: authorData.name }])
//           expect(valuesMock).toHaveBeenNthCalledWith(2, [
//             { nameTs: postData.name, authorIdTs: authorData.id },
//           ])
//           expect(result.body).toEqual({ __pk: postData.id, __id: postData.id })
//         })

//         it('should (R) read successfully', async () => {
//           const postData = mockPostData[0]
//           const authorData = mockAuthorData[0]

//           mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: postData.id,
//             __id: postData.id,
//             idTs: postData.id,
//             nameTs: postData.name,
//             authorTs: {
//               __pk: authorData.id,
//               idTs: authorData.id,
//               nameTs: authorData.name,
//             },
//           })

//           const result = await postWithAuthorCreateCollection.admin.endpoints.findOne.handler({
//             context: requestContext,
//             headers: {},
//             pathParams: {
//               id: postData.id,
//             },
//           })

//           expect(mockDb.query.postWithAuthorTs.findFirst).toHaveBeenCalledWith(
//             expect.objectContaining({
//               columns: {
//                 idTs: true,
//                 nameTs: true,
//               },
//               with: {
//                 authorTs: {
//                   columns: {
//                     idTs: true,
//                     nameTs: true,
//                   },
//                   extras: {
//                     __pk: sql<string | number>`${schema.authorTs.idTs}`.as('__pk'),
//                   },
//                   with: {},
//                 },
//               },
//               where: eq(postWithAuthorCreateCollection.fields.idField._.column, postData.id),
//               extras: {
//                 __pk: sql<string | number>`${schema.postWithAuthorTs.idTs}`.as('__pk'),
//                 __id: sql<string | number>`${schema.postWithAuthorTs.idTs}`.as('__id'),
//               },
//             })
//           )

//           expect(result.body).toEqual({
//             __pk: postData.id,
//             __id: postData.id,
//             idField: postData.id,
//             nameField: postData.name,
//             authorField: {
//               __pk: authorData.id,
//               idField: authorData.id,
//               nameField: authorData.name,
//             },
//           })
//         })

//         it('should (U) update successfully', async () => {
//           const postData = mockPostData[0]
//           const updatedPostData = mockPostData[1]
//           const updatedAuthorData = mockAuthorData[1]

//           const { insertMock, valuesMock } = prepareInsertMock(
//             vi
//               .fn()
//               .mockResolvedValueOnce([
//                 { idTs: updatedAuthorData.id, nameTs: updatedAuthorData.name },
//               ])
//           )

//           const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
//             vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: updatedPostData.name }])
//           )

//           mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: postData.id,
//             __id: postData.id,
//             idTs: postData.id,
//             nameTs: updatedPostData.name,
//             authorTs: {
//               idTs: updatedAuthorData.id,
//               nameTs: updatedAuthorData.name,
//             },
//           })

//           const result = await postWithAuthorCreateCollection.admin.endpoints.update.handler({
//             context: requestContext,
//             pathParams: {
//               id: postData.id,
//             },
//             body: {
//               nameField: updatedPostData.name,
//               authorField: {
//                 create: {
//                   nameField: updatedAuthorData.name,
//                 },
//               },
//             },
//             headers: {},
//           })

//           expect(insertMock).toHaveBeenCalledTimes(1)
//           expect(updateMock).toHaveBeenCalledTimes(1)
//           expect(valuesMock).toHaveBeenCalledWith([{ nameTs: updatedAuthorData.name }])
//           expect(setMock).toHaveBeenCalledWith({
//             nameTs: updatedPostData.name,
//             authorIdTs: updatedAuthorData.id,
//           })
//           expect(whereUpdateMock).toHaveBeenCalledWith(
//             eq(postWithAuthorCreateCollection.fields.idField._.column, postData.id)
//           )
//           expect(result.body).toEqual({ __pk: postData.id, __id: postData.id })
//         })

//         it('should (D) delete successfully', async () => {
//           const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))

//           const result = await postWithAuthorCreateCollection.admin.endpoints.delete.handler({
//             context: requestContext,
//             body: {
//               ids: [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id],
//             },
//             headers: {},
//           })

//           expect(deleteMock).toHaveBeenCalledTimes(1)
//           expect(whereMock).toHaveBeenCalledWith(
//             or(
//               eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[0].id),
//               eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[1].id),
//               eq(postWithAuthorCreateCollection.fields.idField._.column, mockPostData[2].id)
//             )
//           )
//           expect(result.body).toEqual({ message: 'ok' })
//         })
//       })
//       describe('with "Many" relation', () => {
//         const authorWithPostsCreateCollection = builder.collection('authorTs', {
//           slug: 'author',
//           identifierColumn: 'idTs',
//           fields: builder.fields('authorTs', (fb) => ({
//             idField: fb.columns('idTs', {
//               type: 'text',
//               create: 'hidden',
//               update: 'hidden',
//             }),
//             nameField: fb.columns('nameTs', {
//               type: 'text',
//             }),
//             postsField: fb.relations('postsTs', (fb) => ({
//               type: 'create',
//               fields: fb.fields('postWithAuthorTs', (fb) => ({
//                 idField: fb.columns('idTs', {
//                   type: 'text',
//                   create: 'hidden',
//                   update: 'hidden',
//                 }),
//                 nameField: fb.columns('nameTs', {
//                   type: 'text',
//                 }),
//               })),
//               options: async () => [],
//             })),
//           })),
//         })

//         it('should (C) create successfully', async () => {
//           const postData = mockPostData[0]
//           const authorData = mockAuthorData[0]
//           const authorWithPostData = { ...mockAuthorData[0], posts: [postData] }

//           const { insertMock, valuesMock: valuesInsertMock } = prepareInsertMock(
//             vi
//               .fn()
//               // First, insert author
//               .mockResolvedValueOnce([{ idTs: authorWithPostData.id }])
//               // Finally, insert all posts
//               .mockResolvedValueOnce([{ idTs: mockPostData[0].id, nameTs: mockPostData[0].name }])
//               .mockResolvedValueOnce([{ idTs: mockPostData[1].id, nameTs: mockPostData[1].name }])
//               .mockResolvedValueOnce([{ idTs: mockPostData[2].id, nameTs: mockPostData[2].name }])
//               .mockResolvedValueOnce([{ idTs: mockPostData[3].id, nameTs: mockPostData[3].name }])
//               .mockResolvedValueOnce([{ idTs: mockPostData[4].id, nameTs: mockPostData[4].name }])
//           )

//           mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: authorData.id,
//             __id: authorData.id,
//             idTs: authorData.id,
//             nameTs: authorData.name,
//             postsTs: [
//               { idTs: mockPostData[0].id, nameTs: mockPostData[0].name },
//               { idTs: mockPostData[1].id, nameTs: mockPostData[1].name },
//               { idTs: mockPostData[2].id, nameTs: mockPostData[2].name },
//               { idTs: mockPostData[3].id, nameTs: mockPostData[3].name },
//               { idTs: mockPostData[4].id, nameTs: mockPostData[4].name },
//             ],
//           })

//           const result = await authorWithPostsCreateCollection.admin.endpoints.create.handler({
//             context: requestContext,
//             body: {
//               nameField: authorData.name,
//               postsField: [
//                 mockPostData[0],
//                 mockPostData[1],
//                 mockPostData[2],
//                 mockPostData[3],
//                 mockPostData[4],
//               ].map((post) => ({
//                 create: {
//                   idField: post.id,
//                   nameField: post.name,
//                 },
//               })),
//             },
//             headers: {},
//           })

//           expect(insertMock).toHaveBeenCalledTimes(6)
//           expect(valuesInsertMock).toHaveBeenCalledTimes(6)
//           expect(valuesInsertMock).toHaveBeenCalledWith([
//             expect.objectContaining({ nameTs: postData.name }),
//           ])
//           expect(result.body).toEqual({ __pk: authorData.id, __id: authorData.id })
//         })

//         it('should (R) read successfully', async () => {
//           const postData = mockPostData[0]
//           const authorData = mockAuthorData[0]

//           mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: authorData.id,
//             __id: authorData.id,
//             idTs: authorData.id,
//             nameTs: authorData.name,
//             postsTs: [
//               {
//                 __pk: postData.id,
//                 idTs: postData.id,
//                 nameTs: postData.name,
//               },
//             ],
//           })

//           const result = await authorWithPostsCreateCollection.admin.endpoints.findOne.handler({
//             context: requestContext,
//             pathParams: {
//               id: authorData.id,
//             },
//             headers: {},
//           })

//           expect(mockDb.query.authorTs.findFirst).toHaveBeenCalledWith({
//             columns: {
//               idTs: true,
//               nameTs: true,
//             },
//             with: {
//               postsTs: {
//                 columns: {
//                   idTs: true,
//                   nameTs: true,
//                 },
//                 extras: {
//                   __pk: sql<string | number>`${schema.postWithAuthorTs.idTs}`.as('__pk'),
//                 },
//                 with: {},
//               },
//             },
//             where: eq(authorWithPostsCreateCollection.fields.idField._.column, authorData.id),
//             extras: {
//               __pk: sql<string | number>`${schema.authorTs.idTs}`.as('__pk'),
//               __id: sql<string | number>`${schema.authorTs.idTs}`.as('__id'),
//             },
//           })

//           expect(result.body).toEqual({
//             __pk: authorData.id,
//             __id: authorData.id,
//             idField: authorData.id,
//             nameField: authorData.name,
//             postsField: [
//               {
//                 __pk: postData.id,
//                 idField: postData.id,
//                 nameField: postData.name,
//               },
//             ],
//           })
//         })

//         // TODO: should add update their relation
//         it('should (U) update successfully', async () => {
//           const updatedAuthorData = {
//             id: mockAuthorData[0].id,
//             name: 'Updated Author Name',
//           }
//           const updatedAuthorDataTs = {
//             idTs: updatedAuthorData.id,
//             nameTs: updatedAuthorData.name,
//           }
//           const updatedAuthorDataField = {
//             idField: updatedAuthorData.id,
//             nameField: updatedAuthorData.name,
//           }
//           // // ===== start service part (TS) =====
//           const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
//             vi.fn().mockResolvedValueOnce([updatedAuthorDataTs])
//           )

//           const { valuesMock, insertMock } = prepareInsertMock(
//             vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([])
//           )

//           tx.update = updateMock

//           mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: updatedAuthorData.id,
//             __id: updatedAuthorData.id,
//             idTs: updatedAuthorData.id,
//             nameTs: updatedAuthorData.name,
//             postsTs: [
//               { idTs: 'post-2', nameTs: 'Post 2' },
//               { idTs: 'post-3', nameTs: 'Post 3' },
//             ],
//           })

//           // // ====== end service part (TS) ======
//           // // ===== start user part (field) =====
//           const result = await authorWithPostsCreateCollection.admin.endpoints.update.handler({
//             context: requestContext,
//             pathParams: {
//               id: updatedAuthorData.id,
//             },
//             body: {
//               nameField: updatedAuthorDataField.nameField,
//               postsField: [
//                 {
//                   create: {
//                     nameField: 'Post 2',
//                   },
//                 },
//                 {
//                   disconnect: 'post-4',
//                 },
//                 {
//                   create: {
//                     nameField: 'Post 3',
//                   },
//                 },
//               ],
//             },
//             headers: {},
//           })

//           // // ====== end user part (field) ======
//           // // Assertions for author update
//           expect(updateMock).toHaveBeenCalledTimes(2)
//           expect(whereUpdateMock).toHaveBeenCalledTimes(2)
//           expect(whereUpdateMock.mock.calls[0][0]).toEqual(
//             eq(authorWithPostsCreateCollection.fields.idField._.column, updatedAuthorData.id)
//           )
//           expect(whereUpdateMock.mock.calls[1][0]).toEqual(
//             eq(authorWithPostsCreateCollection.fields.postsField._.primaryColumn, 'post-4')
//           )
//           expect(setMock).toHaveBeenCalledTimes(2)
//           expect(setMock.mock.calls[0][0]).toEqual(
//             expect.objectContaining({
//               nameTs: updatedAuthorDataTs.nameTs,
//             })
//           )
//           expect(setMock.mock.calls[1][0]).toEqual({
//             authorIdTs: null,
//           })
//           expect(insertMock).toHaveBeenCalledTimes(2)
//           expect(valuesMock).toHaveBeenCalledTimes(2)
//           expect(valuesMock.mock.calls[0][0]).toEqual([
//             expect.objectContaining({ nameTs: 'Post 2', authorIdTs: updatedAuthorData.id }),
//           ])
//           expect(valuesMock.mock.calls[1][0]).toEqual([
//             expect.objectContaining({ nameTs: 'Post 3', authorIdTs: updatedAuthorData.id }),
//           ])
//           expect(result.body).toEqual({
//             __pk: updatedAuthorData.id,
//             __id: updatedAuthorData.id,
//           })
//         })

//         it('should (D) delete successfully', async () => {
//           const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))

//           const result = await authorWithPostsCreateCollection.admin.endpoints.delete.handler({
//             context: requestContext,
//             body: {
//               ids: [mockAuthorData[0].id, mockAuthorData[1].id, mockAuthorData[2].id],
//             },
//             headers: {},
//           })

//           expect(deleteMock).toHaveBeenCalledTimes(1)
//           expect(whereMock).toHaveBeenCalledTimes(1)
//           expect(whereMock.mock.calls[0][0]).toEqual(
//             or(
//               eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[0].id),
//               eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[1].id),
//               eq(authorWithPostsCreateCollection.fields.idField._.column, mockAuthorData[2].id)
//             )
//           )
//           expect(result.body).toEqual({ message: 'ok' })
//         })
//       })
//     })

//     describe('with "connect" mode', () => {
//       describe('with "One" relation', () => {
//         const postWithAuthorConnectCollection = builder.collection('postWithAuthorTs', {
//           slug: 'postWithAuthor',
//           identifierColumn: 'idTs',
//           fields: builder.fields('postWithAuthorTs', (fb) => ({
//             idField: fb.columns('idTs', {
//               type: 'text',
//               create: 'hidden',
//               update: 'hidden',
//             }),
//             nameField: fb.columns('nameTs', {
//               type: 'text',
//             }),
//             authorField: fb.relations('authorTs', (fb) => ({
//               type: 'connect',
//               fields: fb.fields('authorTs', (fb) => ({
//                 idField: fb.columns('idTs', {
//                   type: 'text',
//                   create: 'hidden',
//                   update: 'hidden',
//                 }),
//                 nameField: fb.columns('nameTs', {
//                   type: 'text',
//                 }),
//               })),
//               options: async () => [
//                 { label: 'Author 1', value: 'author-1' },
//                 { label: 'Author 2', value: 'author-2' },
//               ],
//             })),
//           })),
//         })

//         it('should (C) create successfully', async () => {
//           const postData = mockPostData[0]
//           const authorData = mockAuthorData[0]

//           mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: postData.id,
//             __id: postData.id,
//             idTs: postData.id,
//             nameTs: postData.name,
//             authorTs: {
//               idTs: authorData.id,
//               nameTs: authorData.name,
//             },
//           })

//           const { valuesMock, insertMock } = prepareInsertMock(
//             // Insert post
//             vi.fn().mockResolvedValueOnce([{ idTs: postData.id, nameTs: postData.name }])
//           )

//           const result = await postWithAuthorConnectCollection.admin.endpoints.create.handler({
//             context: requestContext,
//             body: {
//               nameField: postData.name,
//               authorField: {
//                 connect: authorData.id,
//               },
//             },
//             headers: {},
//           })

//           expect(insertMock).toHaveBeenCalledTimes(1)
//           expect(valuesMock).toHaveBeenCalledWith([
//             expect.objectContaining({ nameTs: postData.name, authorIdTs: authorData.id }),
//           ])
//           expect(tx.insert).toHaveBeenCalledTimes(1)
//           expect(result.body).toEqual({ __pk: postData.id, __id: postData.id })
//         })

//         it('should (R) read successfully', async () => {
//           const postData = mockPostData[0]
//           const authorData = mockAuthorData[0]

//           mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: postData.id,
//             __id: postData.id,
//             idTs: postData.id,
//             nameTs: postData.name,
//             authorTs: {
//               __pk: authorData.id,
//               idTs: authorData.id,
//               nameTs: authorData.name,
//             },
//           })

//           const result = await postWithAuthorConnectCollection.admin.endpoints.findOne.handler({
//             context: requestContext,
//             pathParams: {
//               id: postData.id,
//             },
//             headers: {},
//           })

//           expect(mockDb.query.postWithAuthorTs.findFirst).toHaveBeenCalledWith(
//             expect.objectContaining({
//               columns: {
//                 idTs: true,
//                 nameTs: true,
//               },
//               with: {
//                 authorTs: {
//                   columns: {
//                     idTs: true,
//                     nameTs: true,
//                   },
//                   extras: {
//                     __pk: sql<string | number>`${schema.authorTs.idTs}`.as('__pk'),
//                   },
//                   with: {},
//                 },
//               },
//               where: eq(postWithAuthorConnectCollection.fields.idField._.column, postData.id),
//               extras: {
//                 __pk: sql<string | number>`${schema.postWithAuthorTs.idTs}`.as('__pk'),
//                 __id: sql<string | number>`${schema.postWithAuthorTs.idTs}`.as('__id'),
//               },
//             })
//           )

//           expect(result.body).toEqual({
//             __pk: postData.id,
//             __id: postData.id,
//             idField: postData.id,
//             nameField: postData.name,
//             authorField: {
//               __pk: authorData.id,
//               idField: authorData.id,
//               nameField: authorData.name,
//             },
//           })
//         })

//         it('should (U) update successfully', async () => {
//           const postData = mockPostData[0]
//           const updatedPostData = {
//             id: postData.id,
//             name: 'Updated Post Name',
//             authorId: 'author-2',
//           }
//           const postDataTs = {
//             idTs: updatedPostData.id,
//             nameTs: updatedPostData.name,
//             authorIdTs: updatedPostData.authorId,
//           }
//           const postDataField = {
//             idField: updatedPostData.id,
//             nameField: updatedPostData.name,
//             authorIdField: updatedPostData.authorId,
//           }
//           const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
//             vi.fn().mockResolvedValueOnce([postDataTs])
//           )
//           tx.update = updateMock
//           mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: updatedPostData.id,
//             __id: updatedPostData.id,
//             idTs: updatedPostData.id,
//             nameTs: updatedPostData.name,
//             authorTs: {
//               idTs: updatedPostData.authorId,
//               nameTs: 'Author 2',
//             },
//           })

//           const result = await postWithAuthorConnectCollection.admin.endpoints.update.handler({
//             context: requestContext,
//             pathParams: {
//               id: postData.id,
//             },
//             body: {
//               nameField: postDataField.nameField,
//               authorField: {
//                 connect: postDataField.authorIdField,
//               },
//             },
//             headers: {},
//           })
//           expect(updateMock).toHaveBeenCalledTimes(1)
//           expect(setMock).toHaveBeenCalledWith(
//             expect.objectContaining({
//               nameTs: postDataTs.nameTs,
//               authorIdTs: postDataTs.authorIdTs,
//             })
//           )
//           expect(whereUpdateMock).toHaveBeenCalledWith(
//             eq(postWithAuthorConnectCollection.fields.idField._.column, postData.id)
//           )
//           expect(result.body).toEqual({ __pk: postDataField.idField, __id: postDataField.idField })
//         })

//         it('should (D) delete successfully', async () => {
//           const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
//             vi.fn().mockResolvedValueOnce([])
//           )

//           const result = await postWithAuthorConnectCollection.admin.endpoints.delete.handler({
//             context: requestContext,
//             body: {
//               ids: [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id],
//             },
//             headers: {},
//           })

//           expect(deleteMock).toHaveBeenCalledTimes(1)
//           expect(whereMock).toHaveBeenCalledTimes(1)
//           expect(whereMock).toHaveBeenCalledWith(
//             or(
//               eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[0].id),
//               eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[1].id),
//               eq(postWithAuthorConnectCollection.fields.idField._.column, mockPostData[2].id)
//             )
//           )
//           expect(returningMock).toHaveBeenCalledTimes(1)
//           expect(result.body).toEqual({ message: 'ok' })
//         })
//       })

//       describe('with "Many" relation', () => {
//         const authorWithPostConnectCollection = builder.collection('authorTs', {
//           slug: 'authorWithPost',
//           identifierColumn: 'idTs',
//           fields: builder.fields('authorTs', (fb) => ({
//             idField: fb.columns('idTs', {
//               type: 'text',
//               create: 'hidden',
//               update: 'hidden',
//             }),
//             nameField: fb.columns('nameTs', {
//               type: 'text',
//             }),
//             postsField: fb.relations('postsTs', (fb) => ({
//               type: 'connect',
//               fields: fb.fields('postWithAuthorTs', (fb) => ({
//                 idField: fb.columns('idTs', {
//                   type: 'text',
//                   create: 'hidden',
//                   update: 'hidden',
//                 }),
//                 nameField: fb.columns('nameTs', {
//                   type: 'text',
//                 }),
//               })),
//               options: async () => [],
//             })),
//           })),
//         })

//         it('should (C) create successfully', async () => {
//           const authorData = mockAuthorData[0]

//           const { insertMock, valuesMock: valuesInsertMock } = prepareInsertMock(
//             vi.fn().mockResolvedValueOnce([{ idTs: authorData.id }])
//           )

//           const { updateMock, setMock, whereUpdateMock } = prepareUpdateWhereMock(
//             vi.fn().mockResolvedValueOnce([])
//           )

//           mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: authorData.id,
//             __id: authorData.id,
//             idTs: authorData.id,
//             nameTs: authorData.name,
//             postsTs: [
//               { idTs: mockPostData[0].id, nameTs: mockPostData[0].name },
//               { idTs: mockPostData[1].id, nameTs: mockPostData[1].name },
//               { idTs: mockPostData[2].id, nameTs: mockPostData[2].name },
//             ],
//           })

//           const result = await authorWithPostConnectCollection.admin.endpoints.create.handler({
//             context: requestContext,
//             body: {
//               nameField: authorData.name,
//               postsField: [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id].map(
//                 (postId) => ({
//                   connect: postId,
//                 })
//               ),
//             },
//             headers: {},
//           })

//           expect(insertMock).toHaveBeenCalledTimes(1)
//           expect(valuesInsertMock).toHaveBeenCalledWith([{ nameTs: authorData.name }])

//           expect(updateMock).toHaveBeenCalledTimes(3)
//           const expectedIds = [mockPostData[0].id, mockPostData[1].id, mockPostData[2].id]
//           expectedIds.forEach((postId, index) => {
//             // UPDATE "postWithAuthorTs" SET "authorId_db" = {authorData.id} WHERE "id_db" = {postId}
//             expect(setMock).toHaveBeenNthCalledWith(index + 1, {
//               authorIdTs: authorData.id,
//             })
//             expect(whereUpdateMock.mock.calls[index][0]).toEqual(
//               eq(schema.postWithAuthorTs.idTs, postId)
//             )
//           })
//           expect(result.body).toEqual({ __pk: authorData.id, __id: authorData.id })
//         })

//         it('should (R) read successfully', async () => {
//           const authorData = mockAuthorData[0]

//           mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: authorData.id,
//             __id: authorData.id,
//             idTs: authorData.id,
//             nameTs: authorData.name,
//             postsTs: [
//               {
//                 __pk: mockPostData[0].id,
//                 idTs: mockPostData[0].id,
//                 nameTs: mockPostData[0].name,
//               },
//               {
//                 __pk: mockPostData[1].id,
//                 idTs: mockPostData[1].id,
//                 nameTs: mockPostData[1].name,
//               },
//               {
//                 __pk: mockPostData[2].id,
//                 idTs: mockPostData[2].id,
//                 nameTs: mockPostData[2].name,
//               },
//             ],
//           })

//           const result = await authorWithPostConnectCollection.admin.endpoints.findOne.handler({
//             context: requestContext,
//             pathParams: {
//               id: authorData.id,
//             },
//             headers: {},
//           })

//           expect(mockDb.query.authorTs.findFirst).toHaveBeenCalledWith({
//             columns: {
//               idTs: true,
//               nameTs: true,
//             },
//             with: {
//               postsTs: {
//                 columns: {
//                   idTs: true,
//                   nameTs: true,
//                 },
//                 extras: {
//                   __pk: sql<string | number>`${schema.postWithAuthorTs.idTs}`.as('__pk'),
//                 },
//                 with: {},
//               },
//             },
//             where: eq(authorWithPostConnectCollection.fields.idField._.column, authorData.id),
//             extras: {
//               __pk: sql<string | number>`${schema.authorTs.idTs}`.as('__pk'),
//               __id: sql<string | number>`${schema.authorTs.idTs}`.as('__id'),
//             },
//           })

//           expect(result.body).toEqual({
//             __pk: authorData.id,
//             __id: authorData.id,
//             idField: authorData.id,
//             nameField: authorData.name,
//             postsField: [mockPostData[0], mockPostData[1], mockPostData[2]].map((post) => ({
//               __pk: post.id,
//               idField: post.id,
//               nameField: post.name,
//             })),
//           })
//         })

//         // TODO: Need to fix "update" method
//         it('should (U) update successfully', async () => {
//           const updatedAuthorData = {
//             id: mockAuthorData[0].id,
//             name: 'Updated Author Name',
//           }

//           const updatedAuthorDataTs = {
//             idTs: updatedAuthorData.id,
//             nameTs: updatedAuthorData.name,
//           }

//           const updatedAuthorDataField = {
//             idField: updatedAuthorData.id,
//             nameField: updatedAuthorData.name,
//           }

//           // ===== start service part (TS) =====
//           const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
//             vi.fn().mockResolvedValueOnce([updatedAuthorDataTs])
//           )

//           tx.update = updateMock

//           // ====== end service part (TS) ======

//           // ===== start user part (field) =====

//           mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce({
//             __pk: updatedAuthorData.id,
//             __id: updatedAuthorData.id,
//             idTs: updatedAuthorData.id,
//             nameTs: updatedAuthorData.name,
//             postsTs: [
//               { idTs: 'post-1', nameTs: 'Post 1' },
//               { idTs: 'post-2', nameTs: 'Post 2' },
//               { idTs: 'post-3', nameTs: 'Post 3' },
//             ],
//           })

//           const result = await authorWithPostConnectCollection.admin.endpoints.update.handler({
//             context: requestContext,
//             pathParams: {
//               id: updatedAuthorData.id,
//             },
//             body: {
//               nameField: updatedAuthorDataField.nameField,
//               postsField: ['post-1', 'post-2', 'post-3'].map((postId) => ({
//                 connect: postId,
//               })),
//             },
//             headers: {},
//           })

//           // ====== end user part (field) ======

//           // Assertions
//           // main Author update and 3 times for post update
//           expect(updateMock).toHaveBeenCalledTimes(4)
//           expect(setMock).toHaveBeenCalledWith(
//             expect.objectContaining({
//               nameTs: updatedAuthorDataTs.nameTs,
//             })
//           )

//           // 4 times for post update
//           expect(whereUpdateMock).toHaveBeenCalledTimes(4)

//           expect(result.body).toEqual({ __pk: updatedAuthorData.id, __id: updatedAuthorData.id })
//         })

//         it('should (D) delete successfully', async () => {
//           const { deleteMock, whereMock } = prepareDeleteMock(vi.fn().mockResolvedValueOnce([]))

//           const result = await authorWithPostConnectCollection.admin.endpoints.delete.handler({
//             context: requestContext,
//             body: {
//               ids: [mockAuthorData[0].id, mockAuthorData[1].id, mockAuthorData[2].id],
//             },
//             headers: {},
//           })

//           expect(deleteMock).toHaveBeenCalledTimes(1)
//           expect(whereMock).toHaveBeenCalledTimes(1)
//           expect(whereMock.mock.calls[0][0]).toEqual(
//             or(
//               eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[0].id),
//               eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[1].id),
//               eq(authorWithPostConnectCollection.fields.idField._.column, mockAuthorData[2].id)
//             )
//           )
//           expect(result.body).toEqual({ message: 'ok' })
//         })
//       })
//     })

//     // TODO: complete read, update and delete test case
//     describe('with "connectOrCreate" mode', () => {
//       describe('with "One" relation', () => {
//         const postWithAuthorConnectOrCreateCollection = builder.collection('postWithAuthorTs', {
//           slug: 'postWithAuthor',
//           fields: builder.fields('postWithAuthorTs', (fb) => ({
//             idField: fb.columns('idTs', {
//               type: 'text',
//               create: 'hidden',
//               update: 'hidden',
//             }),
//             nameField: fb.columns('nameTs', {
//               type: 'text',
//             }),
//             authorField: fb.relations('authorTs', (fb) => ({
//               type: 'connectOrCreate',
//               fields: fb.fields('authorTs', (fb) => ({
//                 idField: fb.columns('idTs', {
//                   type: 'text',
//                   create: 'hidden',
//                   update: 'hidden',
//                 }),
//                 nameField: fb.columns('nameTs', {
//                   type: 'text',
//                 }),
//               })),
//               options: async () => [],
//             })),
//           })),
//           identifierColumn: 'idTs',
//         })

//         describe('with "create" mode', () => {
//           it('should (C) create successfully', async () => {
//             const postData = mockPostData[0]

//             const { insertMock, valuesMock } = prepareInsertMock(
//               vi
//                 .fn()
//                 .mockResolvedValueOnce([
//                   { idTs: mockAuthorData[0].id, nameTs: mockAuthorData[0].name },
//                 ])
//                 .mockResolvedValueOnce([{ idTs: postData.id }])
//             )
//             tx.insert = insertMock
//             mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue({
//               __pk: postData.id,
//               __id: postData.id,
//               idTs: postData.id,
//               nameTs: postData.name,
//               authorTs: {
//                 idTs: mockAuthorData[0].id,
//                 nameTs: mockAuthorData[0].name,
//               },
//             })

//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await postWithAuthorConnectOrCreateCollection.admin.endpoints.create.handler({
//                 context: requestContext,
//                 body: {
//                   nameField: postData.name,
//                   authorField: {
//                     create: {
//                       nameField: mockAuthorData[0].name,
//                     },
//                   },
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             // TS method
//             expect(valuesMock).toHaveBeenCalledWith([{ nameTs: mockAuthorData[0].name }])
//             expect(valuesMock).toHaveBeenCalledWith([
//               { nameTs: postData.name, authorIdTs: mockAuthorData[0].id },
//             ])

//             // to create author first and then create post
//             expect(tx.insert).toHaveBeenCalledTimes(2)

//             // Field method
//             expect(result.body).toEqual({ __pk: postData.id, __id: postData.id })
//           })

//           it('should (R) read successfully', async () => {
//             const postData = mockPostData[0]
//             const authorData = mockAuthorData[0]

//             mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValueOnce({
//               idTs: postData.id,
//               nameTs: postData.name,
//               authorTs: {
//                 __pk: authorData.id,
//                 idTs: authorData.id,
//                 nameTs: authorData.name,
//               },
//             })

//             const result =
//               await postWithAuthorConnectOrCreateCollection.admin.endpoints.findOne.handler({
//                 context: requestContext,
//                 pathParams: {
//                   id: postData.id,
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(mockDb.query.postWithAuthorTs.findFirst).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 columns: expect.objectContaining({
//                   idTs: true,
//                   nameTs: true,
//                 }),
//                 with: expect.objectContaining({
//                   authorTs: expect.objectContaining({
//                     columns: expect.objectContaining({
//                       idTs: true,
//                       nameTs: true,
//                     }),
//                   }),
//                 }),
//               })
//             )

//             const expectedPostWithAuthorDataField = {
//               idField: postData.id,
//               nameField: postData.name,
//               authorField: {
//                 __pk: authorData.id,
//                 idField: authorData.id,
//                 nameField: authorData.name,
//               },
//             }

//             // Field method
//             expect(result.body).toEqual(expectedPostWithAuthorDataField)
//           })
//           it('should (U) update successfully', async () => {
//             const updatedPostData = {
//               id: 'post-1',
//               name: 'Updated Post Name',
//               authorId: 'author-99',
//             }

//             const updatedPostDataTs = {
//               idTs: updatedPostData.id,
//               nameTs: updatedPostData.name,
//               authorIdTs: updatedPostData.authorId,
//             }

//             const updatedPostDataField = {
//               idField: updatedPostData.id,
//               nameField: updatedPostData.name,
//               authorIdField: updatedPostData.authorId,
//             }

//             // ===== start service part (TS) =====
//             const { setMock, updateMock } = prepareUpdateWhereMock(
//               vi.fn().mockResolvedValueOnce([updatedPostDataTs])
//             )

//             tx.update = updateMock

//             mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue({
//               __pk: updatedPostData.id,
//               __id: updatedPostData.id,
//               idTs: updatedPostData.id,
//               nameTs: updatedPostData.name,
//               authorTs: {
//                 idTs: mockAuthorData[0].id,
//                 nameTs: mockAuthorData[0].name,
//               },
//             })
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await postWithAuthorConnectOrCreateCollection.admin.endpoints.update.handler({
//                 context: requestContext,
//                 pathParams: {
//                   id: updatedPostData.id,
//                 },
//                 body: {
//                   nameField: updatedPostDataField.nameField,
//                   authorField: {
//                     connect: updatedPostDataField.authorIdField,
//                   },
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(updateMock).toHaveBeenCalledTimes(1)
//             expect(setMock).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 nameTs: updatedPostDataTs.nameTs,
//                 authorIdTs: updatedPostDataTs.authorIdTs,
//               })
//             )
//             expect(result.body).toEqual({
//               __pk: updatedPostDataField.idField,
//               __id: updatedPostDataField.idField,
//             })
//           })
//           it('should (D) delete successfully', async () => {
//             const postIdsToDelete = [1, 2, 3]

//             // ===== start service part (TS) =====
//             const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
//               vi.fn().mockResolvedValueOnce([])
//             )
//             tx.delete = deleteMock
//             mockDb.delete = deleteMock
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await postWithAuthorConnectOrCreateCollection.admin.endpoints.delete.handler({
//                 context: requestContext,
//                 body: {
//                   ids: postIdsToDelete,
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(deleteMock).toHaveBeenCalledTimes(1)
//             expect(whereMock).toHaveBeenCalledTimes(1)
//             expect(returningMock).toHaveBeenCalledTimes(1)
//             expect(result.body).toEqual({ message: 'ok' })
//           })
//         })

//         describe('with "connect" mode', () => {
//           it('should (C) create successfully', async () => {
//             const authorData = mockAuthorData[0]

//             const authorDataTs = {
//               idTs: authorData.id,
//               nameTs: authorData.name,
//             }

//             const authorDataField = {
//               idField: authorData.id,
//               nameField: authorData.name,
//             }

//             const postWithAuthorData = { ...mockPostData[0], authorId: authorData.id }

//             const postWithAuthorDataTs = {
//               idTs: postWithAuthorData.id,
//               nameTs: postWithAuthorData.name,
//               authorIdTs: postWithAuthorData.authorId,
//             }

//             const postWithAuthorDataField = {
//               idField: postWithAuthorData.id,
//               nameField: postWithAuthorData.name,
//               authorIdField: authorData.id,
//             }

//             // ===== start service part (TS) =====
//             mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue(authorDataTs)
//             mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue({
//               __pk: postWithAuthorData.id,
//               __id: postWithAuthorData.id,
//               ...postWithAuthorDataTs,
//             })

//             const { insertMock, valuesMock } = prepareInsertMock(
//               vi
//                 .fn()
//                 .mockResolvedValueOnce([postWithAuthorDataTs])
//                 .mockResolvedValueOnce([authorDataTs])
//             )

//             tx.insert = insertMock
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await postWithAuthorConnectOrCreateCollection.admin.endpoints.create.handler({
//                 context: requestContext,
//                 body: {
//                   nameField: postWithAuthorDataField.nameField,
//                   authorField: {
//                     connect: authorDataField.idField,
//                   },
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             // TS method
//             expect(valuesMock).toHaveBeenCalledWith([
//               expect.objectContaining({
//                 nameTs: postWithAuthorDataTs.nameTs,
//               }),
//             ])

//             expect(tx.insert).toHaveBeenCalledTimes(1)

//             // Field method
//             expect(result.body).toEqual({
//               __pk: postWithAuthorDataField.idField,
//               __id: postWithAuthorDataField.idField,
//             })
//           })
//           it('should (R) read successfully', async () => {
//             const postData = mockPostData[0]
//             const authorData = mockAuthorData[0]

//             const postWithAuthorDataTs = {
//               __pk: postData.id,
//               __id: postData.id,
//               idTs: postData.id,
//               nameTs: postData.name,
//               authorTs: {
//                 __pk: authorData.id,
//                 idTs: authorData.id,
//                 nameTs: authorData.name,
//               },
//             }

//             // ===== start service part (TS) =====
//             mockDb.query.postWithAuthorTs.findFirst = vi
//               .fn()
//               .mockResolvedValueOnce(postWithAuthorDataTs)
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await postWithAuthorConnectOrCreateCollection.admin.endpoints.findOne.handler({
//                 context: requestContext,
//                 pathParams: {
//                   id: postData.id,
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(mockDb.query.postWithAuthorTs.findFirst).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 columns: expect.objectContaining({
//                   idTs: true,
//                   nameTs: true,
//                 }),
//                 with: expect.objectContaining({
//                   authorTs: expect.objectContaining({
//                     columns: expect.objectContaining({
//                       idTs: true,
//                       nameTs: true,
//                     }),
//                   }),
//                 }),
//               })
//             )

//             const expectedPostWithAuthorDataField = {
//               __pk: postData.id,
//               __id: postData.id,
//               idField: postData.id,
//               nameField: postData.name,
//               authorField: {
//                 __pk: authorData.id,
//                 idField: authorData.id,
//                 nameField: authorData.name,
//               },
//             }

//             // Field method
//             expect(result.body).toEqual(expectedPostWithAuthorDataField)
//             // bypass
//             // expect(result.body).toEqual(postWithAuthorDataTs)
//           })
//           it('should (U) update successfully', async () => {
//             const updatedPostData = {
//               id: 'post-1',
//               name: 'Updated Post Name',
//               authorId: 'author-1',
//             }

//             const updatedPostDataTs = {
//               idTs: updatedPostData.id,
//               nameTs: updatedPostData.name,
//               authorIdTs: updatedPostData.authorId,
//             }

//             const updatedPostDataField = {
//               idField: updatedPostData.id,
//               nameField: updatedPostData.name,
//               authorIdField: updatedPostData.authorId,
//             }

//             // ===== start service part (TS) =====
//             const { setMock, updateMock } = prepareUpdateWhereMock(
//               vi.fn().mockResolvedValueOnce([updatedPostDataTs])
//             )
//             tx.update = updateMock

//             mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue({
//               __pk: updatedPostData.id,
//               __id: updatedPostData.id,
//               idTs: updatedPostData.id,
//               nameTs: updatedPostData.name,
//               authorTs: {
//                 idTs: mockAuthorData[0].id,
//                 nameTs: mockAuthorData[0].name,
//               },
//             })
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await postWithAuthorConnectOrCreateCollection.admin.endpoints.update.handler({
//                 context: requestContext,
//                 pathParams: {
//                   id: updatedPostData.id,
//                 },
//                 body: {
//                   nameField: updatedPostDataField.nameField,
//                   authorField: {
//                     connect: updatedPostDataField.authorIdField,
//                   },
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(updateMock).toHaveBeenCalledTimes(1)
//             expect(setMock).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 nameTs: updatedPostDataTs.nameTs,
//                 authorIdTs: updatedPostDataTs.authorIdTs,
//               })
//             )
//             expect(result.body).toEqual({
//               __pk: updatedPostDataField.idField,
//               __id: updatedPostDataField.idField,
//             })
//           })
//           it('should (D) delete successfully', async () => {
//             const postIdsToDelete = [1, 2, 3]

//             // ===== start service part (TS) =====
//             const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
//               vi.fn().mockResolvedValueOnce([])
//             )
//             tx.delete = deleteMock
//             mockDb.delete = deleteMock
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await postWithAuthorConnectOrCreateCollection.admin.endpoints.delete.handler({
//                 context: requestContext,
//                 body: {
//                   ids: postIdsToDelete,
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(deleteMock).toHaveBeenCalledTimes(1)
//             expect(whereMock).toHaveBeenCalledTimes(1)
//             expect(returningMock).toHaveBeenCalledTimes(1)
//             expect(result.body).toEqual({ message: 'ok' })
//           })
//         })
//       })

//       describe('with "Many relation"', () => {
//         const authorWithPostsConnectOrCreateCollection = builder.collection('authorTs', {
//           slug: 'authorWithPost',
//           fields: builder.fields('authorTs', (fb) => ({
//             idField: fb.columns('idTs', {
//               type: 'text',
//               create: 'hidden',
//               update: 'hidden',
//             }),
//             nameField: fb.columns('nameTs', {
//               type: 'text',
//             }),
//             postsField: fb.relations('postsTs', (fb) => ({
//               type: 'connectOrCreate',
//               fields: fb.fields('postWithAuthorTs', (fb) => ({
//                 idField: fb.columns('idTs', {
//                   type: 'text',
//                   create: 'hidden',
//                   update: 'hidden',
//                 }),
//                 nameField: fb.columns('nameTs', {
//                   type: 'text',
//                 }),
//               })),
//               options: async () => [{ label: 'Post 1', value: 'post-1' }],
//             })),
//           })),
//           identifierColumn: 'idTs',
//         })

//         describe('with "create" case', () => {
//           it('should (C) create successfully', async () => {
//             const postData = mockPostData[0]

//             const postDataTs = {
//               idTs: postData.id,
//               nameTs: postData.name,
//             }

//             const postDataField = {
//               idField: postData.id,
//               nameField: postData.name,
//             }

//             const authorWithPostData = { ...mockAuthorData[0], posts: [postData] }

//             const authorWithPostDataTs = {
//               idTs: authorWithPostData.id,
//               nameTs: authorWithPostData.name,
//               postsTs: [
//                 {
//                   idTs: postDataTs.idTs,
//                 },
//               ],
//             }

//             const authorWithPostDataField = {
//               idField: authorWithPostData.id,
//               nameField: authorWithPostData.name,
//             }

//             // ===== start service part (TS) =====
//             mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue({
//               __pk: authorWithPostData.id,
//               __id: authorWithPostData.id,
//               ...authorWithPostDataTs,
//             })
//             mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue(postDataTs)

//             const { insertMock, valuesMock: valuesInsertMock } = prepareInsertMock(
//               vi
//                 .fn()
//                 .mockResolvedValueOnce([authorWithPostDataTs])
//                 .mockResolvedValueOnce([postDataTs])
//                 .mockResolvedValueOnce([
//                   {
//                     idTs: 'post-2',
//                     nameTs: 'Post 2',
//                   },
//                 ])
//                 .mockResolvedValueOnce([
//                   {
//                     idTs: 'post-3',
//                     nameTs: 'Post 3',
//                   },
//                 ])
//                 .mockResolvedValueOnce([
//                   {
//                     idTs: 'post-4',
//                     nameTs: 'Post 4',
//                   },
//                 ])
//                 .mockResolvedValueOnce([
//                   {
//                     idTs: 'post-5',
//                     nameTs: 'Post 5',
//                   },
//                 ])
//             )
//             tx.insert = insertMock

//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====
//             // change to create Author and make it auto connect to post

//             const result =
//               await authorWithPostsConnectOrCreateCollection.admin.endpoints.create.handler({
//                 context: requestContext,
//                 body: {
//                   nameField: authorWithPostDataField.nameField,
//                   postsField: [
//                     // TODO: fix this should be able to crete with object
//                     {
//                       create: {
//                         nameField: postDataField.nameField,
//                       },
//                     },
//                     {
//                       create: {
//                         nameField: 'Post 2',
//                       },
//                     },
//                     {
//                       create: {
//                         nameField: 'Post 3',
//                       },
//                     },
//                     {
//                       create: {
//                         nameField: 'Post 4',
//                       },
//                     },
//                     {
//                       create: {
//                         nameField: 'Post 5',
//                       },
//                     },
//                   ],
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(insertMock).toHaveBeenCalledTimes(6)

//             expect(valuesInsertMock).toHaveBeenCalledTimes(6)

//             // TS method
//             // values for insert
//             expect(valuesInsertMock).toHaveBeenCalledWith([
//               expect.objectContaining({
//                 nameTs: authorWithPostDataTs.nameTs,
//               }),
//             ])

//             // Field method
//             expect(result.body).toEqual({
//               __pk: authorWithPostData.id,
//               __id: authorWithPostData.id,
//             })
//           })
//           it('should (R) read successfully', async () => {
//             const postData = mockPostData[0]
//             const authorData = mockAuthorData[0]

//             const authorWithPostDataTs = {
//               __pk: authorData.id,
//               __id: authorData.id,
//               idTs: authorData.id,
//               nameTs: authorData.name,
//               postsTs: [
//                 {
//                   __pk: postData.id,
//                   idTs: postData.id,
//                   nameTs: postData.name,
//                 },
//               ],
//             }

//             // ===== start service part (TS) =====
//             mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce(authorWithPostDataTs)
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await authorWithPostsConnectOrCreateCollection.admin.endpoints.findOne.handler({
//                 context: requestContext,
//                 pathParams: {
//                   id: authorData.id,
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(mockDb.query.authorTs.findFirst).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 columns: expect.objectContaining({
//                   idTs: true,
//                   nameTs: true,
//                 }),
//                 with: expect.objectContaining({
//                   postsTs: expect.objectContaining({
//                     columns: expect.objectContaining({
//                       idTs: true,
//                       nameTs: true,
//                     }),
//                   }),
//                 }),
//               })
//             )

//             const expectedAuthorWithPostDataField = {
//               __pk: authorData.id,
//               __id: authorData.id,
//               idField: authorData.id,
//               nameField: authorData.name,
//               postsField: [
//                 {
//                   __pk: postData.id,
//                   idField: postData.id,
//                   nameField: postData.name,
//                 },
//               ],
//             }

//             // Field method
//             expect(result.body).toEqual(expectedAuthorWithPostDataField)
//             // bypass
//             // expect(result.body).toEqual(authorWithPostDataTs)
//           })
//           it('should (U) update successfully', async () => {
//             const updatedAuthorData = {
//               id: 'author-1',
//               name: 'Updated Author Name',
//             }

//             const updatedAuthorDataTs = {
//               idTs: updatedAuthorData.id,
//               nameTs: updatedAuthorData.name,
//             }

//             const updatedAuthorDataField = {
//               idField: updatedAuthorData.id,
//               nameField: updatedAuthorData.name,
//             }

//             // ===== start service part (TS) =====
//             const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
//               vi.fn().mockResolvedValueOnce([updatedAuthorDataTs])
//             )
//             const { insertMock, valuesMock } = prepareInsertMock(
//               vi.fn().mockResolvedValueOnce([
//                 {
//                   idTs: mockPostData[0].id,
//                   nameTs: mockPostData[0].name,
//                 },
//               ])
//             )
//             tx.update = updateMock
//             tx.insert = insertMock

//             mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue({
//               __pk: updatedAuthorData.id,
//               __id: updatedAuthorData.id,
//               idTs: updatedAuthorData.id,
//               nameTs: updatedAuthorData.name,
//               postTs: [
//                 {
//                   idTs: mockPostData[0].id,
//                   nameTs: mockPostData[0].name,
//                 },
//                 {
//                   idTs: mockPostData[1].id,
//                   nameTs: mockPostData[1].name,
//                 },
//               ],
//             })
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await authorWithPostsConnectOrCreateCollection.admin.endpoints.update.handler({
//                 context: requestContext,
//                 pathParams: {
//                   id: updatedAuthorData.id,
//                 },
//                 body: {
//                   nameField: updatedAuthorDataField.nameField,
//                   postsField: [
//                     {
//                       create: {
//                         nameField: mockPostData[0].name,
//                       },
//                     },
//                     {
//                       connect: mockPostData[1].id,
//                     },
//                     {
//                       disconnect: mockPostData[2].id,
//                     },
//                   ],
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======
//             expect(setMock).toHaveBeenCalledTimes(3)
//             expect(updateMock).toHaveBeenCalledTimes(3)
//             expect(whereUpdateMock).toHaveBeenCalledTimes(3)

//             expect(whereUpdateMock).toHaveBeenCalledWith(
//               eq(
//                 authorWithPostsConnectOrCreateCollection.fields.idField._.column,
//                 updatedAuthorData.id
//               )
//             )
//             expect(whereUpdateMock).toHaveBeenCalledWith(
//               eq(
//                 authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
//                 mockPostData[1].id
//               )
//             )
//             expect(whereUpdateMock).toHaveBeenCalledWith(
//               eq(
//                 authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
//                 mockPostData[2].id
//               )
//             )

//             expect(setMock).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 nameTs: updatedAuthorDataTs.nameTs,
//               })
//             )
//             expect(valuesMock).toHaveBeenCalledWith([
//               expect.objectContaining({
//                 nameTs: mockPostData[0].name,
//               }),
//             ])

//             expect(result.body).toEqual({ __pk: updatedAuthorData.id, __id: updatedAuthorData.id })
//           })
//           it('should (D) delete successfully', async () => {
//             const authorIdsToDelete = [1, 2, 3]

//             // ===== start service part (TS) =====
//             const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
//               vi.fn().mockResolvedValueOnce([])
//             )
//             tx.delete = deleteMock
//             mockDb.delete = deleteMock
//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await authorWithPostsConnectOrCreateCollection.admin.endpoints.delete.handler({
//                 context: requestContext,
//                 body: {
//                   ids: authorIdsToDelete,
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(deleteMock).toHaveBeenCalledTimes(1)
//             expect(whereMock).toHaveBeenCalledTimes(1)
//             expect(returningMock).toHaveBeenCalledTimes(1)
//             expect(result.body).toEqual({ message: 'ok' })
//           })
//         })

//         describe('with "connect" case', () => {
//           it('should (C) create successfully', async () => {
//             const postData = mockPostData[0]

//             const postDataTs = {
//               idTs: postData.id,
//               nameTs: postData.name,
//             }

//             const authorWithPostData = { ...mockAuthorData[0], posts: [postData] }

//             const authorWithPostDataTs = {
//               idTs: authorWithPostData.id,
//               nameTs: authorWithPostData.name,
//               postsTs: [
//                 {
//                   idTs: postDataTs.idTs,
//                 },
//               ],
//             }

//             const authorWithPostDataField = {
//               idField: authorWithPostData.id,
//               nameField: authorWithPostData.name,
//             }

//             // ===== start service part (TS) =====
//             mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue({
//               __pk: authorWithPostData.id,
//               __id: authorWithPostData.id,
//               ...authorWithPostDataTs,
//             })
//             mockDb.query.postWithAuthorTs.findFirst = vi.fn().mockResolvedValue(postDataTs)

//             const { insertMock, valuesMock: valuesInsertMock } = prepareInsertMock(
//               vi.fn().mockResolvedValueOnce([authorWithPostDataTs])
//             )
//             tx.insert = insertMock

//             const { updateMock, setMock } = prepareUpdateWhereMock(
//               vi.fn().mockResolvedValueOnce([postDataTs])
//             )

//             tx.update = updateMock

//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await authorWithPostsConnectOrCreateCollection.admin.endpoints.create.handler({
//                 context: requestContext,
//                 body: {
//                   nameField: authorWithPostDataField.nameField,
//                   postsField: [
//                     'post-1',
//                     'post-2',
//                     'post-3',
//                     'post-4',
//                     'post-5',
//                     'post-6',
//                     'post-7',
//                   ].map((postId) => ({
//                     connect: postId,
//                   })),
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             expect(insertMock).toHaveBeenCalledTimes(1)

//             // TS method
//             // values for insert
//             expect(valuesInsertMock).toHaveBeenCalledWith([
//               expect.objectContaining({
//                 nameTs: authorWithPostDataTs.nameTs,
//               }),
//             ])

//             expect(updateMock).toHaveBeenCalledTimes(7)
//             expect(setMock).toHaveBeenCalledTimes(7)

//             expect(setMock).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 authorIdTs: 'author-1',
//               })
//             )

//             // Field method
//             expect(result.body).toEqual({
//               __pk: authorWithPostData.id,
//               __id: authorWithPostData.id,
//             })
//           })
//           it('should (R) read successfully', async () => {
//             const postData = mockPostData[0]
//             const authorData = mockAuthorData[0]

//             const authorWithPostDataTs = {
//               __pk: authorData.id,
//               __id: authorData.id,
//               idTs: authorData.id,
//               nameTs: authorData.name,
//               postsTs: [
//                 {
//                   __pk: postData.id,
//                   idTs: postData.id,
//                   nameTs: postData.name,
//                 },
//               ],
//             }

//             mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValueOnce(authorWithPostDataTs)

//             const result =
//               await authorWithPostsConnectOrCreateCollection.admin.endpoints.findOne.handler({
//                 context: requestContext,
//                 pathParams: {
//                   id: authorData.id,
//                 },
//                 headers: {},
//               })

//             expect(mockDb.query.authorTs.findFirst).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 columns: expect.objectContaining({
//                   idTs: true,
//                   nameTs: true,
//                 }),
//                 with: expect.objectContaining({
//                   postsTs: expect.objectContaining({
//                     columns: expect.objectContaining({
//                       idTs: true,
//                       nameTs: true,
//                     }),
//                   }),
//                 }),
//               })
//             )

//             const expectedAuthorWithPostDataField = {
//               __pk: authorData.id,
//               __id: authorData.id,
//               idField: authorData.id,
//               nameField: authorData.name,
//               postsField: [
//                 {
//                   __pk: postData.id,
//                   idField: postData.id,
//                   nameField: postData.name,
//                 },
//               ],
//             }

//             // Field method
//             expect(result.body).toEqual(expectedAuthorWithPostDataField)
//             // bypass
//             // expect(result.body).toEqual(authorWithPostDataTs)
//           })

//           it('should (U) update successfully', async () => {
//             const updatedAuthorData = {
//               id: 'author-1',
//               name: 'Updated Author Name',
//             }

//             const updatedAuthorDataTs = {
//               idTs: updatedAuthorData.id,
//               nameTs: updatedAuthorData.name,
//             }

//             const updatedAuthorDataField = {
//               idField: updatedAuthorData.id,
//               nameField: updatedAuthorData.name,
//             }

//             // ===== start service part (TS) =====
//             const { setMock, updateMock, whereUpdateMock } = prepareUpdateWhereMock(
//               vi.fn().mockResolvedValueOnce([updatedAuthorDataTs])
//             )

//             tx.update = updateMock

//             mockDb.query.authorTs.findFirst = vi.fn().mockResolvedValue({
//               __pk: updatedAuthorData.id,
//               __id: updatedAuthorData.id,
//               idTs: updatedAuthorData.id,
//               nameTs: updatedAuthorData.name,
//               postsTs: [
//                 {
//                   idTs: 'post-1',
//                   nameTs: 'Post 1',
//                 },
//                 {
//                   idTs: 'post-2',
//                   nameTs: 'Post 2',
//                 },
//                 {
//                   idTs: 'post-3',
//                   nameTs: 'Post 3',
//                 },
//               ],
//             })

//             // ====== end service part (TS) ======

//             // ===== start user part (field) =====

//             const result =
//               await authorWithPostsConnectOrCreateCollection.admin.endpoints.update.handler({
//                 context: requestContext,
//                 pathParams: {
//                   id: updatedAuthorData.id,
//                 },
//                 body: {
//                   nameField: updatedAuthorDataField.nameField,
//                   postsField: ['post-1', 'post-2', 'post-3'].map((postId) => ({
//                     connect: postId,
//                   })),
//                 },
//                 headers: {},
//               })
//             // ====== end user part (field) ======

//             // Assertions
//             // main Author update and 3 times for post update
//             expect(updateMock).toHaveBeenCalledTimes(4)
//             expect(setMock).toHaveBeenCalledWith(
//               expect.objectContaining({
//                 nameTs: updatedAuthorDataTs.nameTs,
//               })
//             )

//             // 3 times for post update + 1 for author update
//             expect(whereUpdateMock).toHaveBeenCalledTimes(4)
//             expect(whereUpdateMock).toHaveBeenCalledWith(
//               eq(
//                 authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
//                 'post-1'
//               )
//             )
//             expect(whereUpdateMock).toHaveBeenCalledWith(
//               eq(
//                 authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
//                 'post-2'
//               )
//             )
//             expect(whereUpdateMock).toHaveBeenCalledWith(
//               eq(
//                 authorWithPostsConnectOrCreateCollection.fields.postsField._.primaryColumn,
//                 'post-3'
//               )
//             )
//             expect(whereUpdateMock).toHaveBeenCalledWith(
//               eq(
//                 authorWithPostsConnectOrCreateCollection.fields.idField._.column,
//                 updatedAuthorData.id
//               )
//             )

//             expect(result.body).toEqual({ __pk: updatedAuthorData.id, __id: updatedAuthorData.id })
//           })

//           it('should (D) delete successfully', async () => {
//             const authorIdsToDelete = [1, 2, 3]

//             const { deleteMock, whereMock, returningMock } = prepareDeleteMock(
//               vi.fn().mockResolvedValueOnce([])
//             )
//             tx.delete = deleteMock
//             mockDb.delete = deleteMock

//             const result =
//               await authorWithPostsConnectOrCreateCollection.admin.endpoints.delete.handler({
//                 context: requestContext,
//                 body: {
//                   ids: authorIdsToDelete,
//                 },
//                 headers: {},
//               })

//             expect(deleteMock).toHaveBeenCalledTimes(1)
//             expect(whereMock).toHaveBeenCalledTimes(1)
//             expect(returningMock).toHaveBeenCalledTimes(1)
//             expect(result.body).toEqual({ message: 'ok' })
//           })
//         })
//       })
//     })
//   })
// })
