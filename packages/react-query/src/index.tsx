import type {
  DefaultError,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ValueOf } from 'type-fest'

import type { ApiRouter } from '@kivotos/core'
import {
  type FilterByMethod,
  type RestClient,
  type RestPayload,
  type RestResponse,
} from '@kivotos/rest'

export interface KivotosQueryClient<TApiRouter extends ApiRouter> {
  useQuery: <
    const TMethod extends keyof RestClient<TApiRouter>,
    const TPath extends ValueOf<FilterByMethod<TApiRouter, TMethod>>['schema']['path'],
    const TPayload = RestPayload<TApiRouter, TPath>,
    const TResponse = RestResponse<TApiRouter, TPath>,
    const TError = DefaultError,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload,
    options?: Omit<UseQueryOptions<TResponse, TError, TPayload>, 'queryKey'>
  ) => UseQueryResult<TResponse, TError>
  useMutation: <
    const TMethod extends keyof RestClient<TApiRouter>,
    const TPath extends ValueOf<FilterByMethod<TApiRouter, TMethod>>['schema']['path'],
    const TPayload = RestPayload<TApiRouter, TPath>,
    const TResponse = RestResponse<TApiRouter, TPath>,
    const TError = DefaultError,
    const TContext = unknown,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload,
    options?: UseMutationOptions<TResponse, TError, TPayload, TContext>
  ) => UseMutationResult<TResponse, TError, TPayload, TContext>
  queryOptions: <
    const TMethod extends keyof RestClient<TApiRouter>,
    const TPath extends ValueOf<FilterByMethod<TApiRouter, TMethod>>['schema']['path'],
    const TPayload = RestPayload<TApiRouter, TPath>,
    const TResponse = RestResponse<TApiRouter, TPath>,
    const TError = DefaultError,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload,
    options?: Omit<UseQueryOptions<TResponse, TError, TPayload>, 'queryKey'>
  ) => UseQueryOptions<TResponse, TError, TPayload>
  mutationOptions: <
    const TMethod extends keyof RestClient<TApiRouter>,
    const TPath extends ValueOf<FilterByMethod<TApiRouter, TMethod>>['schema']['path'],
    const TPayload = RestPayload<TApiRouter, TPath>,
    const TResponse = RestResponse<TApiRouter, TPath>,
    const TError = DefaultError,
    const TContext = unknown,
  >(
    method: TMethod,
    path: TPath,
    payload: TPayload,
    options?: UseMutationOptions<TResponse, TError, TPayload, TContext>
  ) => UseMutationOptions<TResponse, TError, TPayload, TContext>
}

export function createKivotosQueryClient<TApiRouter extends ApiRouter<any>>(
  restClient: RestClient<TApiRouter>
): KivotosQueryClient<TApiRouter> {
  return {
    useQuery: function (method: string, path: string, body: any, options?: any) {
      return useQuery({
        queryKey: queryKey(method, path, body),
        queryFn: () => {
          return (restClient as any)[method](path, body)
        },
        ...options,
      }) as UseQueryResult<any, any>
    },
    useMutation: function (method: string, path: string, body: any, options?: any) {
      return useMutation({
        mutationKey: queryKey(method, path, body),
        mutationFn: (data) => {
          return (restClient as any)[method](path, data)
        },
        ...options,
      }) as UseMutationResult<any, any, any, any>
    },
    queryOptions: function (method: string, path: string, body: any, options?: any) {
      return {
        queryKey: queryKey(method, path, body),
        queryFn: () => {
          return (restClient as any)[method](path, body)
        },
        ...options,
      } as UseQueryOptions<any, any, any>
    },
    mutationOptions: function (method: string, path: string, body: any, options?: any) {
      return {
        mutationKey: queryKey(method, path, body),
        mutationFn: (data) => {
          return (restClient as any)[method](path, data)
        },
        ...options,
      } as UseMutationOptions<any, any, any, any>
    },
  }
}

export function queryKey(method: string, path: string | number | symbol, body: any) {
  return [method, path, body] as const
}
