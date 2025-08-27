import { withNextJs } from '@genseki/next'
import { admin } from '@genseki/plugins'
import {
  createPlugin,
  emailAndPasswordPlugin,
  GensekiApp,
  mePlugin,
  StorageAdapterS3,
} from '@genseki/react'

import { accessControl } from './access-control'
import { SetupPage } from './auth/setup/setup'
import { setupApi } from './auth/setup/setup-api'
import { postsCollection } from './collections/posts'
import { tagsCollection } from './collections/tags'
import { usersCollection } from './collections/users'
import { context } from './helper'

import { FullModelSchemas } from '../generated/genseki/unsanitized'

const app = new GensekiApp({
  title: 'Genseki ERP Example',
  version: '0.0.0',
  appBaseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  appPathPrefix: '/admin',
  apiPathPrefix: '/admin/api',
  storageAdapter: StorageAdapterS3.initialize(context, {
    bucket: process.env.AWS_BUCKET_NAME!,
    imageBaseUrl: process.env.NEXT_PUBLIC_AWS_IMAGE_URL!,
    clientConfig: {
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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
      {
        type: 'item',
        label: 'Tags',
        path: '/admin/collections/tags',
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
  .apply(admin(context, { user: FullModelSchemas.user }, { accessControl: accessControl }))
  .apply(usersCollection)
  .apply(postsCollection)
  .apply(tagsCollection)
  .apply(
    createPlugin('common', (app) => {
      return app.addApiRouter({
        auth: { setup: setupApi },
      })
    })
  )

const nextjsApp = withNextJs(app)

export { nextjsApp }
