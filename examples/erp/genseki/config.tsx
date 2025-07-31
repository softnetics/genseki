import { withNextJs } from '@genseki/next'
import { admin } from '@genseki/plugins'
import { emailAndPasswordPlugin, GensekiApp, StorageAdapterS3 } from '@genseki/react'

import { accessControl } from './access-control'
import { SetupPage } from './auth/setup/setup'
import { setupApi } from './auth/setup/setup-api'
import { postsCollection } from './collections/posts'
import { usersCollection } from './collections/users'
import { context } from './helper'

import { FullModelSchemas } from '../generated/genseki/unsanitized'

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
        label: 'Posts',
        path: '/admin/collections/posts',
      },
    ],
  },
})
  .apply(
    emailAndPasswordPlugin(context, {
      schema: {
        user: FullModelSchemas.user,
        session: FullModelSchemas.session,
        account: FullModelSchemas.account,
        verification: FullModelSchemas.verification,
      },
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
    })
  )
  .apply(
    admin(context, {
      schema: {
        user: FullModelSchemas.user,
      },
      accessControl: accessControl,
    })
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
  .build()

const nextjsApp = withNextJs(app)

export { nextjsApp }
