import { withNextJs } from '@genseki/next'
import { admin } from '@genseki/plugins'
import {
  createFileUploadHandlers,
  emailAndPasswordPlugin,
  GensekiApp,
  mePlugin,
  StorageAdapterS3,
} from '@genseki/react'

import { accessControl } from './access-control'
import { SetupPage } from './auth/setup/setup'
import { setupApi } from './auth/setup/setup-api'
import { postsCollection } from './collections/posts'
import { usersCollection } from './collections/users'
import { context } from './helper'

import { FullModelSchemas } from '../generated/genseki/unsanitized'

const storageAdapter = StorageAdapterS3.initialize({
  bucket: process.env.AWS_BUCKET_NAME!,
  clientConfig: {
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  },
})

const { handlers: uploadHandlers } = createFileUploadHandlers(context, storageAdapter)

const app = new GensekiApp({
  title: 'Genseki ERP Example',
  version: '0.0.0',
  storageAdapter,
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
        label: 'Posts',
        path: '/admin/collections/posts',
      },
    ],
  },
})
  .apply(mePlugin(context))
  .apply(
    emailAndPasswordPlugin(
      context,
      {
        user: FullModelSchemas.user,
        session: FullModelSchemas.session,
        account: FullModelSchemas.account,
        verification: FullModelSchemas.verification,
      },
      {
        setup: {
          enabled: true,
          autoLogin: true,
          ui: SetupPage,
        },
        resetPassword: {
          enabled: true,
          sendEmailResetPassword: async ({ email, token, expiredAt }) => {
            console.log('sendEmailResetPassword config', email, token, expiredAt)
            return
          },
        },
      }
    )
  )
  .apply(
    admin(
      context,
      { user: FullModelSchemas.user },
      {
        accessControl: accessControl,
      }
    )
  )
  .apply(usersCollection)
  .apply(postsCollection)
  .apply({
    api: {
      auth: {
        setup: setupApi,
      },
    },
  })
  .apply({
    api: {
      storage: {
        putObjSignedUrl: uploadHandlers['file.generatePutObjSignedUrl'],
        getObjSignedUrl: uploadHandlers['file.generateGetObjSignedUrl'],
      },
    },
  })
  .build()

const nextjsApp = withNextJs(app)

export { nextjsApp }
