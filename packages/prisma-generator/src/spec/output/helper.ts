import type { SanitizedSchema } from './sanitized.types'
import { type SanitizedModel, SchemaType } from './types'
import type { Schema } from './unsanitized'

function unsanitizedModel(schema: Record<string, SanitizedModel>, model: SanitizedModel) {
  const shape = Object.entries(model.shape).reduce((acc, [fieldName, field]) => {
    if (field.type === SchemaType.COLUMN) {
      return {
        ...acc,
        [fieldName]: field,
      }
    }

    const cloneField = { ...field }

    Object.defineProperty(cloneField, 'relatedTo', {
      get() {
        return unsanitizedModel(schema, schema[field.relatedTo])
      },
    })

    return {
      ...acc,
      [fieldName]: cloneField,
    }
  }, {})

  return { config: model.config, shape }
}

export function unsanitizeSchema(schema: SanitizedSchema): Schema {
  const unsanitizedSchema: Record<string, SanitizedModel> = {}

  for (const [modelName, model] of Object.entries(schema)) {
    unsanitizedSchema[modelName] = unsanitizedModel(schema, model)
  }

  return unsanitizedSchema as unknown as Schema
}
