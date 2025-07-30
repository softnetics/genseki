import { withNextJs } from '@genseki/next'
import { auth, GensekiApp, StorageAdapterS3 } from '@genseki/react'

import { categoriesCollection } from './collections/categories'
import { foodsCollection } from './collections/foods'
import { manyCategoriesCollection } from './collections/manyCategories'
import { postsCollection } from './collections/posts'
import { usersCollection } from './collections/users'
import { context, db } from './helper'

import * as schema from '../db/schema'

const app = new GensekiApp({
  title: 'Genseki ERP Example',
  version: '0.0.0',
  storageAdapter: StorageAdapterS3.initailize({
    bucket: process.env.AWS_BUCKET_NAME!,
    clientConfig: {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    },
  }),
  sidebar: {
    type: 'section',
    label: 'Collections',
    items: [
      {
        type: 'item',
        label: 'Users',
        path: '/admin/collections/users',
      },
      {
        type: 'item',
        label: 'Foods',
        path: '/admin/collections/foods',
      },
      {
        type: 'item',
        label: 'Categories',
        path: '/admin/collections/categories',
      },
      {
        type: 'item',
        label: 'Posts',
        path: '/admin/collections/posts',
      },
      {
        type: 'item',
        label: 'Many Categories',
        path: '/admin/collections/manyCategories',
      },
    ],
  },
})
  .apply(
    auth(context, {
      db: db,
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
      method: {
        emailAndPassword: {
          enabled: true,
          resetPassword: {
            enabled: true,
            sendEmailResetPassword: async (email, token) => {
              console.log('sendEmailResetPassword config', email, token)
              return
            },
          },
        },
      },
    })
  )
  .apply(usersCollection)
  .apply(foodsCollection)
  .apply(categoriesCollection)
  .apply(postsCollection)
  .apply(manyCategoriesCollection)
  .build()

// {
//   db: db,
//   schema: schema,
//   context: context,
//   storageAdapter: StorageAdapterS3.initailize({
//     bucket: process.env.AWS_BUCKET_NAME!,
//     clientConfig: {
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_KEY!,
//       },
//     },
//   }),
//   auth: {
//     resetPassword: {
//       enabled: true,
//       async sendEmailResetPassword(email, token) {
//         console.log('sendEmailResetPassword config', email, token)
//         return
//       },
//     },
//     user: {
//       model: schema.user,
//     },
//     session: {
//       model: schema.session,
//     },
//     account: {
//       model: schema.account,
//     },
//     verification: {
//       model: schema.verification,
//     },
//     emailAndPassword: {
//       enabled: true,
//     },
//     secret: '',
//   },
//   plugins: [
//     phone({
//       db: db,
//       schema: schema,
//       context: context,
//       sendOtp: async (phone) => {
//         console.log(`Sending OTP to phone: ${phone}`)
//         return {
//           status: 'success',
//           token: '1234567890abcdef',
//           refno: 'ref123456',
//         }
//       },
//       verifyOtp: async (args: { token: string; pin: string }) => {
//         console.log(`Verifying OTP: ${args.pin} for token: ${args.token}`)
//         return true // Simulate successful verification
//       },
//       signUpOnVerification: {
//         getTempEmail: (phoneNumber) => `${phoneNumber.replace(/\D/g, '')}@example.com`,
//         getTempName: (phoneNumber) => `User ${phoneNumber.replace(/\D/g, '')}`,
//       },
//     }),
//   ],
//   collections: {
//     users: usersCollection,
//     foods: foodsCollection,
//   },
//   endpoints: {
//     customOne: builder.endpoint(
//       {
//         path: '/hello',
//         query: z.object({
//           name: z.string().optional(),
//         }),
//         method: 'GET',
//         responses: {
//           200: z.object({
//             message: z.string(),
//           }),
//         },
//       },
//       ({ query }) => {
//         return {
//           status: 200 as const,
//           body: {
//             message: `Hello ${query.name ?? 'World'}`,
//           },
//         }
//       }
//     ),
//     customTwo: builder.endpoint(
//       {
//         path: '/hello2',
//         query: z.object({
//           name: z.string().optional(),
//         }),
//         method: 'GET',
//         responses: {
//           200: z.object({
//             message: z.string(),
//           }),
//         },
//       },
//       ({ query }) => {
//         return {
//           status: 200 as const,
//           body: {
//             message: `Hello2 ${query.name ?? 'World'}`,
//           },
//         }
//       }
//     ),
//   },
// }

const nextjsApp = withNextJs(app)

export { nextjsApp }
