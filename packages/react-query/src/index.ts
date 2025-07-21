import {
  type DefaultError,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'

import type {
  ApiRoute,
  ApiRouteHandlerPayload,
  ApiRouter,
  ApiRouteResponse,
  FilterByMethod,
  FlattenApiRouter,
  GensekiCore,
} from '@genseki/react'
import { createRestClient, type CreateRestClientConfig } from '@genseki/rest'

type QueryMethod = 'GET'
type MutationMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE'
type Method = QueryMethod | MutationMethod

type ApiRouteSchemaFromMethodAndPath<
  TApiRoute extends ApiRoute,
  TMethod extends Method,
  TPath extends string,
> = Extract<
  TApiRoute,
  {
    schema: {
      method: TMethod
      path: TPath
    }
  }
>['schema']

export type QueryClient<TApiRouter extends ApiRouter> =
  FlattenApiRouter<TApiRouter> extends infer TApiRoute extends ApiRoute
    ? {
        useQuery: <
          const TPath extends FilterByMethod<TApiRoute, QueryMethod>['schema']['path'],
          const TPayload extends ApiRouteHandlerPayload<
            ApiRouteSchemaFromMethodAndPath<TApiRoute, QueryMethod, TPath>
          >,
          const TResponse extends ApiRouteResponse<
            ApiRouteSchemaFromMethodAndPath<TApiRoute, QueryMethod, TPath>['responses']
          >,
          const TError extends DefaultError = DefaultError,
        >(
          path: TPath,
          payload: TPayload,
          options?: Omit<UseQueryOptions<TResponse, TError, TPayload>, 'queryKey'>
        ) => UseQueryResult<TResponse, TError>
        queryOptions: <
          const TPath extends FilterByMethod<TApiRoute, QueryMethod>['schema']['path'],
          const TPayload extends ApiRouteHandlerPayload<
            ApiRouteSchemaFromMethodAndPath<TApiRoute, QueryMethod, TPath>
          >,
          const TResponse extends ApiRouteResponse<
            ApiRouteSchemaFromMethodAndPath<TApiRoute, QueryMethod, TPath>['responses']
          >,
          const TError extends DefaultError = DefaultError,
        >(
          path: TPath,
          payload: TPayload,
          options?: Omit<UseQueryOptions<TResponse, TError, TPayload>, 'queryKey'>
        ) => UseQueryOptions<TResponse, TError, TPayload>
        useMutation: <
          const TMethod extends MutationMethod,
          const TPath extends FilterByMethod<TApiRoute, TMethod>['schema']['path'],
          const TPayload extends ApiRouteHandlerPayload<
            ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>
          >,
          const TResponse extends ApiRouteResponse<
            ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>['responses']
          >,
          const TError extends DefaultError = DefaultError,
          const TContext = unknown,
        >(
          method: TMethod,
          path: TPath,
          options?: UseMutationOptions<TResponse, TError, TPayload, TContext>
        ) => UseMutationResult<TResponse, TError, TPayload, TContext>
        mutationOptions: <
          const TMethod extends MutationMethod,
          const TPath extends FilterByMethod<TApiRoute, TMethod>['schema']['path'],
          const TPayload extends ApiRouteHandlerPayload<
            ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>
          >,
          const TResponse extends ApiRouteResponse<
            ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>['responses']
          >,
          const TError extends DefaultError = DefaultError,
          const TContext = unknown,
        >(
          method: TMethod,
          path: TPath,
          options?: UseMutationOptions<TResponse, TError, TPayload, TContext>
        ) => UseMutationResult<TResponse, TError, TPayload, TContext>
      }
    : never

export function queryKey(method: string, path: string | number | symbol, payload: any) {
  const payloadKey = {
    pathParams: payload?.pathParams ?? {},
    query: payload?.query ?? {},
    headers: payload?.headers ?? {},
  }
  return [method, path, payloadKey] as const
}

export function createQueryClient<TCore extends GensekiCore>(
  config: CreateRestClientConfig
): QueryClient<TCore['api']> {
  const restClient = createRestClient(config)
  return {
    useQuery: function (path: string, payload: any, options?: any) {
      return useQuery({
        queryKey: queryKey('GET', path, payload),
        queryFn: () => {
          return (restClient as any)['GET'](path, payload)
        },
        ...options,
      })
    },
    queryOptions: function (path: string, payload: any, options?: any) {
      return {
        queryKey: queryKey('GET', path, payload),
        queryFn: () => {
          return (restClient as any)['GET'](path, payload)
        },
        ...options,
      }
    },
    useMutation: function (method: string, path: string, payload: any, options?: any) {
      return useMutation({
        mutationKey: queryKey(method, path, payload),
        mutationFn: (data: any) => {
          return (restClient as any)[method](path, data)
        },
        ...options,
      })
    },
    mutationOptions: function (method: string, path: string, payload: any, options?: any) {
      return {
        mutationKey: queryKey(method, path, payload),
        mutationFn: (data: any) => {
          return (restClient as any)[method](path, data)
        },
        ...options,
      }
    },
  } as QueryClient<TCore['api']>
}
