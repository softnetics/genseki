import type { DMMF } from '@prisma/generator-helper'

export function toCamelCase(input: string): string {
  return input
    .replace(/[_-](\w)/g, (_, c) => c.toUpperCase()) // handle snake_case and kebab-case
    .replace(/^([A-Z])/, (_, c) => c.toLowerCase()) // handle PascalCase start
}

export function getAllPrimaryFields(model: DMMF.Model): DMMF.Field[] {
  const primaryFields = model.fields.filter((field) => field.isId)
  const compoundPrimaryFields = model.fields.filter((field) =>
    model.primaryKey?.fields.includes(field.name)
  )
  return [...primaryFields, ...(compoundPrimaryFields ?? [])].flat()
}
