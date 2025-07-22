import type { Fields } from './field'

export function transformToPrismaCreatePayload(
  fields: Fields,
  payload: Record<string, any>
): Record<string, any> {
  const shape = fields.shape

  const transformedData = Object.entries(shape).reduce(
    (acc, [key, field]) => {
      if (field.$server.source === 'relation') {
        if (field.$server.relation.isList) {
          acc[key] = payload[key]?.map((item: any) => {
            return {
              id: item.id,
              // Add other fields if necessary
            }
          })
        } else {
          acc[key] = payload[key]?.id || null
        }
      } else {
        acc[key] = payload[key]
      }
      return acc
    },
    {} as Record<string, any>
  )

  return transformedData
}

export function transformToPrismaUpdatePayload(
  fields: Fields,
  payload: Record<string, any>
): Record<string, any> {
  const shape = fields.shape

  const transformedData = Object.entries(shape).reduce(
    (acc, [key, field]) => {
      if (field.$server.source === 'relation') {
        if (field.$server.relation.isList) {
          acc[key] = payload[key]?.map((item: any) => {
            return {
              id: item.id,
              // Add other fields if necessary
            }
          })
        } else {
          acc[key] = payload[key]?.id || null
        }
      } else {
        acc[key] = payload[key]
      }
      return acc
    },
    {} as Record<string, any>
  )

  return transformedData
}
