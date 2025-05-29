import type { Fields, ServerConfig } from '@kivotos/core'

export async function createOptionsRecord(
  serverConfig: ServerConfig,
  fields: Fields,
  prefix: string = ''
): Promise<Record<string, any[]>> {
  const promises = Object.values(fields).flatMap(async (field) => {
    if ('options' in field) {
      if (field.type === 'connect' || field.type === 'connectOrCreate') {
        const childOptions = await createOptionsRecord(
          serverConfig,
          field.fields,
          `${prefix}${field.fieldName}.`
        )

        const options = await field.options({ db: serverConfig.db })

        return [
          [`${prefix}${field.fieldName}`, options],
          ...Object.entries(childOptions).map(([key, value]) => [
            `${prefix}${field.fieldName}.${key}`,
            value,
          ]),
        ]
      }

      const options = await field.options({ db: serverConfig.db })
      return [[`${prefix}${field.fieldName}`, options]]
    }

    return []
  })

  const result = (await Promise.all(promises)).flat()
  return Object.fromEntries(result)
}
