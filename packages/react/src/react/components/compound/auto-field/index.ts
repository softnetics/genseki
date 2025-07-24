import { type Fields } from '../../../../core'
import type { AnyRequestContextable } from '../../../../core/context'

export * from './client'

export async function createOptionsRecord(
  context: AnyRequestContextable,
  fields: Fields,
  prefix: string = ''
): Promise<Record<string, any[]>> {
  const promises = Object.values(fields.shape).flatMap(async (field) => {
    if ('options' in field) {
      if (field.type === 'connect' || field.type === 'connectOrCreate') {
        const childOptions = await createOptionsRecord(
          context,
          field.fields,
          `${prefix}${field.$client.fieldName}.`
        )

        const options = await field.options(context)

        return [
          [`${prefix}${field.$client.fieldName}`, options],
          ...Object.entries(childOptions).map(([key, value]) => [
            `${prefix}${field.$client.fieldName}.${key}`,
            value,
          ]),
        ]
      }

      const options = await field.options(context)
      return [[`${prefix}${field.$client.fieldName}`, options]]
    }

    return []
  })

  const result = (await Promise.all(promises)).flat()
  return Object.fromEntries(result)
}
