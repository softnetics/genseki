import type {
  ApiRoute,
  ApiRouteHandlerPayload,
  ApiRouter,
  ApiRouteResponse,
  FilterByMethod,
  FlattenApiRouter,
  GensekiCore,
} from '@genseki/react'

import { withPathParams, withQueryParams } from './utils'

type Before = (request: Request) => void

export interface CreateRestClientConfig {
  baseUrl: string
  before?: Before[]
}

interface AnyPayload {
  body?: any
  query?: any
  headers?: any
  pathParams?: any
}

async function makeFetch(
  method: string,
  path: string,
  payload: AnyPayload,
  config: CreateRestClientConfig
) {
  const fullPath = withQueryParams(withPathParams(path, payload?.pathParams), payload?.query)

  const request = new Request(`${config.baseUrl}${fullPath}`, {
    method: method,
    // TODO: Support uploading file and plain text
    headers: { 'Content-Type': 'application/json', ...payload?.headers },
    body: payload.body ? JSON.stringify(payload.body) : null,
  })

  for (const before of config.before ?? []) {
    before(request)
  }

  const response = await fetch(request)

  return response.json() as any
}

export function createRestClient<TCore extends GensekiCore>(
  config: CreateRestClientConfig
): RestClient<TCore['api']> {
  return {
    GET: async (path: string, payload: AnyPayload) => {
      return makeFetch('GET', path, payload, config)
    },
    POST: async (path: string, payload: AnyPayload) => {
      return makeFetch('POST', path, payload, config)
    },
    PUT: async (path: string, payload: AnyPayload) => {
      return makeFetch('PUT', path, payload, config)
    },
    DELETE: async (path: string, payload: AnyPayload) => {
      return makeFetch('DELETE', path, payload, config)
    },
    PATCH: async (path: string, payload: AnyPayload) => {
      return makeFetch('PATCH', path, payload, config)
    },
  } as RestClient<TCore['api']>
}

export type ExtractApiRouterPath<TApiRoute extends ApiRoute> = TApiRoute['schema']['path']

export type RestResponse<TApiRoute extends ApiRoute, TPath extends string> = ApiRouteResponse<
  Extract<TApiRoute, { schema: { path: TPath } }>['schema']['responses']
>

export type RestPayload<TApiRoute extends ApiRoute, TPath extends string> = ApiRouteHandlerPayload<
  Extract<TApiRoute, { schema: { path: TPath } }>['schema']
>

export type RestMethod<TApiRoute extends ApiRoute> = <
  TPath extends ExtractApiRouterPath<TApiRoute>,
>(
  path: TPath,
  payload: RestPayload<TApiRoute, TPath>
) => Promise<RestResponse<TApiRoute, TPath>>

export type RestClient<TApiRouter extends ApiRouter> =
  FlattenApiRouter<TApiRouter> extends infer TApiRoute extends ApiRoute
    ? {
        GET: RestMethod<FilterByMethod<TApiRoute, 'GET'>>
        POST: RestMethod<FilterByMethod<TApiRoute, 'POST'>>
        PUT: RestMethod<FilterByMethod<TApiRoute, 'PUT'>>
        DELETE: RestMethod<FilterByMethod<TApiRoute, 'DELETE'>>
        PATCH: RestMethod<FilterByMethod<TApiRoute, 'PATCH'>>
      }
    : never
