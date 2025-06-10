import type { RequestContext } from '../../../../core'
import { type Fields } from '../../../../core'

export async function createOptionsRecord(
  context: RequestContext,
  fields: Fields,
  prefix: string = ''
): Promise<Record<string, any[]>> {
  const promises = Object.values(fields).flatMap(async (field) => {
    if ('options' in field) {
      if (field.type === 'connect' || field.type === 'connectOrCreate') {
        const childOptions = await createOptionsRecord(
          context,
          field.fields,
          `${prefix}${field.fieldName}.`
        )

        const options = await field.options(context)

        return [
          [`${prefix}${field.fieldName}`, options],
          ...Object.entries(childOptions).map(([key, value]) => [
            `${prefix}${field.fieldName}.${key}`,
            value,
          ]),
        ]
      }

      const options = await field.options(context)
      return [[`${prefix}${field.fieldName}`, options]]
    }

    return []
  })

  const result = (await Promise.all(promises)).flat()
  return Object.fromEntries(result)
}
