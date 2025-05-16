// import {
//   DefaultError,
//   DefinedInitialDataOptions,
//   QueryClient,
//   QueryKey,
//   queryOptions,
//   useMutation,
//   UseMutationOptions,
//   UseMutationResult,
//   useQuery,
//   UseQueryOptions,
//   UseQueryResult,
// } from '@tanstack/react-query'
// import { Simplify } from 'drizzle-orm'

// import { createClientApiHandlers } from '~/core/client'
// import {
//   ApiHandlerReturnType,
//   ClientApiHandlerParameters,
//   Collection,
//   CollectionAdminApiHandlerConfig,
// } from '~/core/collection'

// type ReactQueryClientOptions<TCollections extends Collection[]> = {
//   baseUrl: string
//   collections: TCollections
// }

// type ReactQueryClient<TCollections extends Collection[]> = {
//   [K in TCollections[number]['slug']]: ReactQueryClientApiHandler<
//     Extract<TCollections[number], { slug: K }>
//   >
// }

// function createReactQueryClientApiHandler<TCollection extends Collection>(
//   baseUrl: string,
//   collection: TCollection
// ): ReactQueryClientApiHandler<TCollection> {
//   const handlers = createClientApiHandlers(baseUrl, collection)

//   const readOne: ReactQueryClientApiHandler<TCollection>['readOne'] = {
//     query: handlers.findOne,
//     queryOptions: (args) =>
//       queryOptions({
//         queryFn: () => handlers.findOne(args),
//         queryKey: ['drizzlify', collection.slug, 'readOne'],
//       }) as any,
//     useQuery: (args, options, queryClient) =>
//       useQuery(
//         {
//           ...options,
//           queryFn: () => handlers.findOne(args),
//           queryKey: ['drizzlify', collection.slug, 'readOne'] as any,
//         },
//         queryClient
//       ),
//   }

//   const readMany: ReactQueryClientApiHandler<TCollection>['readMany'] = {
//     query: handlers.findMany,
//     queryOptions: (args) =>
//       queryOptions({
//         queryFn: () => handlers.findMany(args),
//         queryKey: ['drizzlify', collection.slug, 'readMany'],
//       }) as any,
//     useQuery: (args, options, queryClient) =>
//       useQuery(
//         {
//           ...options,
//           queryFn: () => handlers.findMany(args) as any,
//           queryKey: ['drizzlify', collection.slug, 'readMany'] as any,
//         },
//         queryClient
//       ),
//   }

//   const create: ReactQueryClientApiHandler<TCollection>['create'] = {
//     mutation: handlers.create,
//     useMutation: (args, options) =>
//       useMutation({
//         ...options,
//         mutationFn: () => handlers.create(args) as any,
//         mutationKey: ['drizzlify', collection.slug, 'create'] as any,
//       }),
//   }

//   const update: ReactQueryClientApiHandler<TCollection>['update'] = {
//     mutation: handlers.update,
//     useMutation: (args, options) =>
//       useMutation({
//         ...options,
//         mutationFn: () => handlers.update(args) as any,
//         mutationKey: ['drizzlify', collection.slug, 'update'] as any,
//       }),
//   }

//   const _delete: ReactQueryClientApiHandler<TCollection>['delete'] = {
//     mutation: handlers.delete,
//     useMutation: (args, options) =>
//       useMutation({
//         ...options,
//         mutationFn: () => handlers.delete(args) as any,
//         mutationKey: ['drizzlify', collection.slug, 'delete'] as any,
//       }),
//   }

//   const value: ReactQueryClientApiHandler<TCollection> = {
//     readOne,
//     readMany,
//     create,
//     update,
//     delete: _delete,
//   }

//   return value
// }

// export function reactQueryClient<const TCollections extends Collection[]>(
//   options: ReactQueryClientOptions<TCollections>
// ): ReactQueryClient<TCollections> {
//   const { baseUrl, collections } = options

//   const client = Object.fromEntries(
//     collections.map((collection) => {
//       const slug = collection.slug
//       return [slug, createReactQueryClientApiHandler(baseUrl, collection)]
//     })
//   )

//   return client as unknown as ReactQueryClient<TCollections>
// }

// export type ClientApiHandler<
//   TCollection extends Collection,
//   TMethod extends keyof CollectionAdminApiHandlerConfig,
// > = (
//   args: Simplify<ClientApiHandlerParameters<TCollection, TMethod>>
// ) => ApiHandlerReturnType<TCollection, TMethod>

// type ReactQueryQueryForApi<
//   TCollection extends Collection,
//   TMethod extends Extract<keyof CollectionAdminApiHandlerConfig, 'readOne' | 'readMany'>,
// > = {
//   query: ClientApiHandler<TCollection, TMethod>
//   queryOptions: (
//     args: Simplify<ClientApiHandlerParameters<TCollection, TMethod>>
//   ) => DefinedInitialDataOptions<
//     ApiHandlerReturnType<TCollection, TMethod>,
//     DefaultError,
//     Simplify<ClientApiHandlerParameters<TCollection, TMethod>>,
//     QueryKey
//   >
//   useQuery: <
//     TQueryFnData = ApiHandlerReturnType<TCollection, TMethod>,
//     TError = DefaultError,
//     TData = Simplify<ClientApiHandlerParameters<TCollection, TMethod>>,
//     TQueryKey extends QueryKey = QueryKey,
//   >(
//     args: Simplify<ClientApiHandlerParameters<TCollection, TMethod>>,
//     options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>,
//     queryClient?: QueryClient
//   ) => UseQueryResult<TData, TError>
// }

// type ReactQueryMutationForApi<
//   TCollection extends Collection,
//   TMethod extends Extract<keyof CollectionAdminApiHandlerConfig, 'create' | 'update' | 'delete'>,
// > = {
//   mutation: ClientApiHandler<TCollection, TMethod>
//   useMutation: <
//     TData = ApiHandlerReturnType<TCollection, TMethod>,
//     TError = DefaultError,
//     TVariables = Simplify<ClientApiHandlerParameters<TCollection, TMethod>>,
//     TContext = unknown,
//   >(
//     args: Simplify<ClientApiHandlerParameters<TCollection, TMethod>>,
//     options: Omit<
//       UseMutationOptions<TData, TError, TVariables, TContext>,
//       'mutationKey' | 'mutationFn'
//     >
//   ) => UseMutationResult<TData, TError, TVariables, TContext>
// }

// export type ReactQueryClientApiHandler<TCollection extends Collection> = {
//   readOne: ReactQueryQueryForApi<TCollection, 'readOne'>
//   readMany: ReactQueryQueryForApi<TCollection, 'readMany'>
//   create: ReactQueryMutationForApi<TCollection, 'create'>
//   update: ReactQueryMutationForApi<TCollection, 'update'>
//   delete: ReactQueryMutationForApi<TCollection, 'delete'>
// }
