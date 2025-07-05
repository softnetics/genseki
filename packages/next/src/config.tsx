import type { ReactNode } from 'react'

import { redirect } from 'next/navigation'
import { createRouter } from 'radix3'

import {
  type AnyCollection,
  type AnyContextable,
  type ApiRouter,
  type AuthHandlers,
  AuthLayout,
  CollectionAppLayout,
  CreateView,
  ForgotPasswordView,
  HomeView,
  ListView,
  LoginView,
  OneView,
  ResetPasswordView,
  type ServerConfig,
  type ServerFunction,
  SignUpView,
  UpdateView,
} from '@genseki/react'

import { createApiResourceRouter } from './resource'

export type RouterData =
  | {
      view: (args: {
        user: any // TODO
        params: any
        headers: Headers
        serverConfig: ServerConfig
        serverFunction: ServerFunction
        searchParams: { [key: string]: string | string[] }
      }) => ReactNode
      requiredAuthentication: true
    }
  | {
      view: (args: {
        params: any
        serverConfig: ServerConfig
        serverFunction: ServerFunction
        searchParams: { [key: string]: string | string[] }
      }) => ReactNode
      requiredAuthentication: false
    }

export interface NextJsServerConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
  TCollections extends Record<string, AnyCollection> = Record<string, AnyCollection>,
  TApiRouter extends ApiRouter<TContext> = AuthHandlers & ApiRouter<any>,
> extends ServerConfig<TFullSchema, TContext, TCollections, TApiRouter> {
  radixRouter: ReturnType<typeof createRouter<RouterData>>
  resourceRouter: ReturnType<typeof createApiResourceRouter>
}

export function defineNextJsServerConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends AnyContextable = AnyContextable,
  TCollections extends Record<string, AnyCollection> = Record<string, AnyCollection>,
  TApiRouter extends ApiRouter<TContext> = ApiRouter<any>,
>(
  serverConfig: ServerConfig<TFullSchema, TContext, TCollections, TApiRouter>
): NextJsServerConfig<TFullSchema, TContext, TCollections, TApiRouter> {
  const radixRouter = createRouter<RouterData>()

  // Collection
  radixRouter.insert(`/collections`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionAppLayout serverConfig={args.serverConfig}>
        <HomeView serverConfig={args.serverConfig} />
      </CollectionAppLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug`, {
    requiredAuthentication: true,
    view: (args: {
      headers: Headers
      params: { slug: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionAppLayout serverConfig={args.serverConfig}>
        <ListView {...args} {...args.params} />
      </CollectionAppLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/:identifier`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string; identifier: string }
      headers: Headers
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionAppLayout serverConfig={args.serverConfig}>
        <OneView {...args} {...args.params} />
      </CollectionAppLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/create`, {
    requiredAuthentication: true,
    view: (args: {
      headers: Headers
      params: { slug: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionAppLayout serverConfig={args.serverConfig}>
        <CreateView {...args} {...args.params} />
      </CollectionAppLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/update`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string }
      headers: Headers
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => {
      redirect('.')
    },
  })
  radixRouter.insert(`/collections/:slug/update/:identifier`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string; identifier: string }
      headers: Headers
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionAppLayout serverConfig={args.serverConfig}>
        <UpdateView {...args} {...args.params} />
      </CollectionAppLayout>
    ),
  })

  // Auth
  radixRouter.insert(`/auth/login`, {
    requiredAuthentication: false,
    view: (args: {
      params: { slug: string; identifier: string }
      serverConfig: ServerConfig
      serverFunction: ServerFunction
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <LoginView {...args} {...args.params} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/sign-up`, {
    requiredAuthentication: false,
    view: (args: {
      params: { slug: string; identifier: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <SignUpView {...args} {...args.params} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/forgot-password`, {
    requiredAuthentication: false,
    view: (args: {
      params: { slug: string; identifier: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <ForgotPasswordView {...args} {...args.params} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/reset-password`, {
    requiredAuthentication: false,
    view: (args: {
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <ResetPasswordView {...args} />
      </AuthLayout>
    ),
  })

  return {
    ...serverConfig,
    radixRouter,
    resourceRouter: createApiResourceRouter(serverConfig),
  }
}
