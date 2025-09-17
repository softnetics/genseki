import { useCallback } from 'react'

import {
  type DefaultError,
  type InvalidateOptions,
  type InvalidateQueryFilters,
  useMutation as useTanstackMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery as useTanstackQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import type { PartialDeep } from 'type-fest'

import type {
  ApiRoute,
  ApiRouteHandlerPayload,
  ApiRouteResponse,
  FilterByMethod,
  FlatApiRouter,
  GensekiAppCompiled,
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

type UseQuery<TApiRoute extends ApiRoute> = {
  <
    const TMethod extends QueryMethod,
    const TPath extends FilterByMethod<TApiRoute, TMethod>['schema']['path'],
    const TPayload extends ApiRouteHandlerPayload<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>
    >,
    const TResponse extends ApiRouteResponse<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>['responses']
    >,
    const TError extends DefaultError = DefaultError,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload,
    options?: Omit<UseQueryOptions<TResponse, TError, TPayload>, 'queryKey'>
  ): UseQueryResult<TResponse, TError>
}

type QueryOptions<TApiRoute extends ApiRoute> = {
  <
    const TMethod extends QueryMethod,
    const TPath extends FilterByMethod<TApiRoute, TMethod>['schema']['path'],
    const TPayload extends ApiRouteHandlerPayload<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>
    >,
    const TResponse extends ApiRouteResponse<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>['responses']
    >,
    const TError extends DefaultError = DefaultError,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload,
    options?: Omit<UseQueryOptions<TResponse, TError, TPayload>, 'queryKey'>
  ): UseQueryOptions<TResponse, TError, TPayload>
}

type UseMutation<TApiRoute extends ApiRoute> = {
  <
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
  ): UseMutationResult<TResponse, TError, TPayload, TContext>
}

type MutationOptions<TApiRoute extends ApiRoute> = {
  <
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
  ): UseMutationResult<TResponse, TError, TPayload, TContext>
}

type UseInvalidateQueries<TApiRoute extends ApiRoute> = {
  <
    const TMethod extends QueryMethod,
    const TPath extends FilterByMethod<TApiRoute, TMethod>['schema']['path'],
    const TPayload extends ApiRouteHandlerPayload<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>
    >,
  >(
    method: TMethod,
    path: TPath,
    payload?: PartialDeep<TPayload>,
    options?: {
      filters?: Omit<InvalidateQueryFilters<any>, 'queryKey'>
      options?: InvalidateOptions
    }
  ): () => Promise<void>
}

type UseGetQueryData<TApiRoute extends ApiRoute> = {
  <
    const TMethod extends QueryMethod,
    const TPath extends FilterByMethod<TApiRoute, TMethod>['schema']['path'],
    const TPayload extends ApiRouteHandlerPayload<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>
    >,
    const TResponse extends ApiRouteResponse<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>['responses']
    >,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload
  ): () => TResponse | undefined
}

type UseSetQueryData<TApiRoute extends ApiRoute> = {
  <
    const TMethod extends QueryMethod,
    const TPath extends FilterByMethod<TApiRoute, TMethod>['schema']['path'],
    const TPayload extends ApiRouteHandlerPayload<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>
    >,
    const TResponse extends ApiRouteResponse<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>['responses']
    >,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload
  ): (data: TResponse) => void
}

type UseOptimisticUpdateQuery<TApiRoute extends ApiRoute> = {
  <
    const TMethod extends QueryMethod,
    const TPath extends FilterByMethod<TApiRoute, TMethod>['schema']['path'],
    const TPayload extends ApiRouteHandlerPayload<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>
    >,
    const TResponse extends ApiRouteResponse<
      ApiRouteSchemaFromMethodAndPath<TApiRoute, TMethod, TPath>['responses']
    >,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload
  ): (updater: (prev: TResponse) => TResponse) =>
    | {
        previous: TResponse
        updated: TResponse
        revert: () => void
      }
    | undefined
}

type ValueOf<T> = T[keyof T]

export type QueryClient<TApiRouter extends FlatApiRouter> =
  ValueOf<TApiRouter> extends infer TApiRoute extends ApiRoute
    ? {
        useQuery: UseQuery<TApiRoute>
        queryOptions: QueryOptions<TApiRoute>
        useMutation: UseMutation<TApiRoute>
        mutationOptions: MutationOptions<TApiRoute>
        useInvalidateQueries: UseInvalidateQueries<TApiRoute>
        useGetQueryData: UseGetQueryData<TApiRoute>
        useSetQueryData: UseSetQueryData<TApiRoute>
        useOptimisticUpdateQuery: UseOptimisticUpdateQuery<TApiRoute>
      }
    : never

function isEmptyObject(obj: any): boolean {
  return (
    obj != null && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0
  )
}

function sortObjectDeep(obj: any): any {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj
  }

  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortObjectDeep(obj[key])
      return result
    }, {} as any)
}

function normalizePayload(payload?: any): any {
  if (!payload) return undefined

  const normalized = {
    pathParams: payload.pathParams,
    query: payload.query,
    headers: payload.headers,
  }

  const filtered = Object.entries(normalized).reduce((acc, [key, value]) => {
    if (value != null && !isEmptyObject(value)) {
      acc[key] = sortObjectDeep(value)
    }
    return acc
  }, {} as any)

  return Object.keys(filtered).length > 0 ? filtered : undefined
}

export function queryKey(method: string, path: string | number | symbol, payload?: any) {
  const normalizedPayload = normalizePayload(payload)

  if (normalizedPayload) {
    return [method, path, normalizedPayload] as const
  }

  return [method, path] as const
}

export function createQueryClient<TApp extends GensekiAppCompiled>(
  config: CreateRestClientConfig
): QueryClient<TApp['api']> {
  const restClient = createRestClient(config)

  const useQuery = function (method: string, path: string, payload: any, options?: any) {
    return useTanstackQuery({
      queryKey: queryKey(method, path, payload),
      queryFn: () => {
        return (restClient as any)[method](path, payload)
      },
      ...options,
    })
  } as UseQuery<ApiRoute>

  const queryOptions = function (method: string, path: string, payload: any, options?: any) {
    return {
      queryKey: queryKey(method, path, payload),
      queryFn: () => {
        return (restClient as any)[method](path, payload)
      },
      ...options,
    }
  } as QueryOptions<ApiRoute>

  const useMutation = function (method: string, path: string, options?: any) {
    return useTanstackMutation({
      mutationKey: queryKey(method, path),
      mutationFn: (data: any) => {
        return (restClient as any)[method](path, data)
      },
      ...options,
    })
  } as UseMutation<ApiRoute>

  const mutationOptions = function (method: string, path: string, options?: any) {
    return {
      mutationKey: queryKey(method, path),
      mutationFn: (data: any) => {
        return (restClient as any)[method](path, data)
      },
      ...options,
    }
  } as MutationOptions<ApiRoute>

  const useInvalidateQueries = function (
    method: string,
    path: string,
    payload?: any,
    options?: any
  ) {
    const queryClient = useQueryClient()

    const invalidateQueries = useCallback(async () => {
      const key = queryKey(method, path, payload)
      return await queryClient.invalidateQueries(
        { ...(options?.filters ?? {}), queryKey: key },
        options?.options
      )
    }, [queryClient, method, path, payload, options])

    return invalidateQueries
  } as UseInvalidateQueries<ApiRoute>

  const useGetQueryData = function (method: string, path: string, payload: any) {
    const queryClient = useQueryClient()

    return useCallback(() => {
      const key = queryKey(method, path, payload)
      return queryClient.getQueryData(key)
    }, [queryClient, method, path, payload])
  } as UseGetQueryData<ApiRoute>

  const useSetQueryData = function (method: string, path: string, payload: any) {
    const queryClient = useQueryClient()
    return useCallback(
      (data: any) => {
        const key = queryKey(method, path, payload)
        queryClient.setQueryData(key, data)
      },
      [queryClient, method, path, payload]
    )
  } as UseSetQueryData<ApiRoute>

  const useOptimisticUpdateQuery = function (method: string, path: string, payload: any) {
    const queryClient = useQueryClient()

    const optimisticallyUpdate = useCallback(
      (updater: (prev: any) => any) => {
        const key = queryKey(method, path, payload)
        const previousData = queryClient.getQueryData(key) as
          | { status: string; body: any }
          | undefined

        if (!previousData) return

        const updatedData = updater(previousData)
        queryClient.setQueryData(key, updatedData)

        return {
          previous: previousData,
          updated: updatedData,
          revert: () => queryClient.setQueryData(key, previousData),
        }
      },
      [queryClient, method, path, payload]
    )

    return optimisticallyUpdate
  } as UseOptimisticUpdateQuery<ApiRoute>

  return {
    useQuery,
    queryOptions,
    useMutation,
    mutationOptions,
    useInvalidateQueries,
    useGetQueryData,
    useSetQueryData,
    useOptimisticUpdateQuery,
  } as QueryClient<TApp['api']>
}
