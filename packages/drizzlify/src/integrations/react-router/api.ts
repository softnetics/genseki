// import { ActionFunction, LoaderFunction } from 'react-router'

// import { NodePgDatabase } from 'drizzle-orm/node-postgres'

// import { Collection, InferFields } from '~/core/collection'
// import { ServerConfig } from '~/core/config'
// import { createServerApiHandler } from '~/core/server'

// /*
//   Path pattern:
//   Read        /:prefix/:slug/:id
//   ReadMany    /:prefix/:slug
//   Create      /:prefix/:slug/new
//   Update      /:prefix/:slug/:id/edit
//   Delete      /:prefix/:slug/:id/delete
// */
// export function createReactRouterApiHandler<
//   TFullSchema extends Record<string, any>,
//   TDatabase extends NodePgDatabase<Record<string, any>>,
//   TContext extends Record<string, unknown>,
//   TCollections extends Collection<any, any, TFullSchema>[],
// >(config: ServerConfig<TDatabase, TContext, TCollections>) {
//   const { db, context, collections } = config

//   const collectionApiHandlersMap = new Map(
//     collections.map((collection) => {
//       return [collection.slug, createServerApiHandler({ collection })]
//     })
//   )

//   const loader: LoaderFunction<any> = async (args) => {
//     const { params, request } = args
//     const slug = params.slug

//     const url = new URL(request.url)
//     const pathname = url.pathname

//     if (!slug) throw new Error('Collection slug is required')

//     const collectionHandler = collectionApiHandlersMap.get(slug)
//     if (!collectionHandler) throw new Error(`Collection ${slug} not found`)

//     const collection = collectionHandler.collection

//     // Handle ReadMany route
//     if (pathname.endsWith(`/${slug}`)) {
//       const limit = parseInt(url.searchParams.get('limit') ?? '10')
//       const offset = parseInt(url.searchParams.get('offset') ?? '0')
//       const orderBy = url.searchParams.get('orderBy') ?? undefined
//       const orderType = (url.searchParams.get('orderType') ?? 'desc') as 'asc' | 'desc'

//       return collectionHandler.findMany({
//         db,
//         context,
//         fields: collection.fields,
//         slug,
//         limit,
//         offset,
//         orderBy,
//         orderType,
//       })
//     }

//     const id = params.id
//     if (!id) throw new Error('ID is required')

//     // Handle ReadOne route
//     if (pathname.endsWith(`/${slug}/${id}`)) {
//       return collectionHandler.findOne({
//         db,
//         context,
//         fields: collection.fields,
//         slug,
//         id,
//       })
//     }

//     throw new Error('Invalid route')
//   }

//   const action: ActionFunction<any> = async (args) => {
//     const { params, request } = args
//     const slug = params.slug

//     const url = new URL(request.url)
//     const pathname = url.pathname

//     if (!slug) throw new Error('Collection slug is required')

//     const collectionHandler = collectionApiHandlersMap.get(slug)
//     if (!collectionHandler) throw new Error(`Collection ${slug} not found`)

//     const collection = collectionHandler.collection
//     const method = request.method

//     // Handle Create route
//     if (method === 'POST' && pathname.endsWith(`/${slug}`)) {
//       const data = await request.json()
//       return collectionHandler.create({
//         db,
//         context,
//         fields: collection.fields,
//         slug,
//         data: data as InferFields<typeof collection.fields>,
//       })
//     }

//     const id = params.id
//     if (!id) throw new Error('ID is required')

//     // Handle Update route
//     if (method === 'PUT' && pathname.endsWith(`/${slug}/${id}`)) {
//       const data = await request.json()
//       return collectionHandler.update({
//         db,
//         context,
//         fields: collection.fields,
//         slug,
//         id,
//         data: data as InferFields<typeof collection.fields>,
//       })
//     }

//     // Handle Delete route
//     if (method === 'DELETE' && pathname.endsWith(`/${slug}/${id}`)) {
//       return collectionHandler.delete({
//         db,
//         context,
//         fields: collection.fields,
//         slug,
//         id,
//       })
//     }

//     throw new Error('Invalid route')
//   }

//   return {
//     loader,
//     action,
//   }
// }
