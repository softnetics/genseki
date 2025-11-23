import type { FieldRelationShape, Fields } from '../field'
import { DataType } from '../model'
import { isRelationFieldShape } from '../utils'

export function transformFieldPayloadToPrismaCreatePayload(
  fields: Fields,
  payload: any
): Record<string, any> {
  return Object.entries(fields.shape).reduce((acc, [fieldKey, fieldShape]) => {
    const inputValue = payload[fieldKey]
    if (inputValue === undefined) return acc

    const schemaKey =
      fieldShape.$server.source === 'column'
        ? fieldShape.$server.column.name
        : fieldShape.$server.source === 'relation'
          ? fieldShape.$server.relation.name
          : undefined

    if (!schemaKey) {
      throw new Error(`Field "${fieldShape.$server.fieldName}" does not have a valid schema key`)
    }

    let transformedValue: any = undefined

    if (fieldShape.$server.source === 'column') {
      transformedValue = inputValue
      if (fieldShape.$server.column.dataType === DataType.JSON) {
        transformedValue = JSON.parse(JSON.stringify(transformedValue))
      }
    }
    if (isRelationFieldShape(fieldShape)) {
      transformedValue = transformFieldRelationPayloadToPrismaCreatePayload(fieldShape, inputValue)
    }

    if (transformedValue === undefined) return acc
    return { ...acc, [schemaKey]: transformedValue }
  }, {})
}

function transformFieldRelationPayloadToPrismaCreatePayload(
  fieldShape: FieldRelationShape,
  payload: any
): Record<string, any> | undefined {
  if (fieldShape.$server.source !== 'relation') {
    throw new Error(`Field "${fieldShape.$server.fieldName}" is not a relation field`)
  }

  switch (fieldShape.type) {
    case 'create': {
      return {
        create: fieldShape.$server.relation.isList
          ? (payload as any[]).map((v) =>
              transformFieldPayloadToPrismaCreatePayload(fieldShape.fields, v.create)
            )
          : transformFieldPayloadToPrismaCreatePayload(fieldShape.fields, payload.create),
      }
    }

    case 'connect': {
      // TODO: Only support single primary key
      const pkField = fieldShape.$server.relation.referencedModel.shape.primaryFields[0]

      if (fieldShape.$server.relation.isList) {
        return {
          connect: (payload as any[]).map((v) => ({ [pkField]: v.connect })),
        }
      }

      if (payload.connect) {
        return {
          connect: { [pkField]: payload.connect },
        }
      }

      return undefined
    }

    case 'connectOrCreate': {
      // TODO: Only support single primary key
      const pkField = fieldShape.$server.relation.referencedModel.shape.primaryFields[0]

      if (fieldShape.$server.relation.isList) {
        const { connect, create } = (payload as any[]).reduce(
          (acc, item) => {
            if (item.connect) {
              return {
                connect: [...acc.connect, { [pkField]: item.connect }],
                create: acc.create,
              }
            }

            const connect = item.connect
              ? [...acc.connect, { [pkField]: item.connect }]
              : acc.connect

            const create = item.create
              ? [
                  ...acc.create,
                  transformFieldPayloadToPrismaCreatePayload(fieldShape.fields, item.create),
                ]
              : acc.create

            return { connect, create }
          },
          { connect: [] as any[], create: [] as any[] }
        )

        return {
          ...(connect.length > 0 && { connect }),
          ...(create.length === 1 ? { create: create[0] } : create.length > 1 ? { create } : {}),
        }
      }

      return {
        connect: { [pkField]: payload.connect },
        create: transformFieldPayloadToPrismaCreatePayload(fieldShape.fields, payload.create),
      }
    }
    default:
      throw new Error(`Unsupported relation type: ${fieldShape}`)
  }
}

export function transformFieldPayloadToPrismaUpdatePayload(
  fields: Fields,
  payload: Record<string, any>
): Record<string, any> {
  return Object.entries(fields.shape).reduce((acc, [fieldKey, fieldShape]) => {
    const inputValue = payload[fieldKey]
    if (inputValue === undefined) return acc

    const schemaKey =
      fieldShape.$server.source === 'column'
        ? fieldShape.$server.column.name
        : fieldShape.$server.source === 'relation'
          ? fieldShape.$server.relation.name
          : undefined

    if (!schemaKey) {
      throw new Error(`Field "${fieldShape.$server.fieldName}" does not have a valid schema key`)
    }

    let transformedValue: any = undefined

    if (fieldShape.$server.source === 'column') {
      transformedValue = inputValue
      if (fieldShape.$server.column.dataType === DataType.JSON) {
        transformedValue = JSON.parse(JSON.stringify(transformedValue))
      }
    }
    if (isRelationFieldShape(fieldShape)) {
      transformedValue = transformFieldRelationPayloadToPrismaUpdatePayload(fieldShape, inputValue)
    }

    if (transformedValue === undefined) return acc
    return { ...acc, [schemaKey]: transformedValue }
  }, {})
}

function transformFieldRelationPayloadToPrismaUpdatePayload(
  fieldShape: FieldRelationShape,
  payload: any
): Record<string, any> | undefined {
  switch (fieldShape.type) {
    case 'create': {
      return {
        create: fieldShape.$server.relation.isList
          ? (payload as any[]).map((v) =>
              transformFieldPayloadToPrismaUpdatePayload(fieldShape.fields, v.create)
            )
          : transformFieldPayloadToPrismaUpdatePayload(fieldShape.fields, payload.create),
      }
    }

    case 'connect': {
      // TODO: Only support single primary key
      const pkField = fieldShape.$server.relation.referencedModel.shape.primaryFields[0]

      if (fieldShape.$server.relation.isList) {
        return {
          connect: (payload as any[]).map((v) => ({ [pkField]: v.connect })),
        }
      }

      if (payload.connect) {
        return {
          connect: { [pkField]: payload.connect },
        }
      }

      return undefined
    }

    case 'connectOrCreate': {
      // TODO: Only support single primary key
      const pkField = fieldShape.$server.relation.referencedModel.shape.primaryFields[0]

      if (fieldShape.$server.relation.isList) {
        const { connect, create } = (payload as any[]).reduce(
          (acc, item) => {
            if (item.connect) {
              return {
                connect: [...acc.connect, { [pkField]: item.connect }],
                create: acc.create,
              }
            }

            const connect = item.connect
              ? [...acc.connect, { [pkField]: item.connect }]
              : acc.connect

            const create = item.create
              ? [
                  ...acc.create,
                  transformFieldPayloadToPrismaUpdatePayload(fieldShape.fields, item.create),
                ]
              : acc.create

            return { connect, create }
          },
          { connect: [] as any[], create: [] as any[] }
        )

        return {
          ...(connect.length > 0 && { connect }),
          ...(create.length === 1 ? { create: create[0] } : create.length > 1 ? { create } : {}),
        }
      }

      return {
        connect: { [pkField]: payload.connect },
        create: transformFieldPayloadToPrismaUpdatePayload(fieldShape.fields, payload.create),
      }
    }
    default:
      throw new Error(`Unsupported relation type: ${fieldShape}`)
  }
}

export function transformFieldsToPrismaSelectPayload(fields: Fields) {
  const pkField = fields.config.primaryColumn
  const idField = fields.config.identifierColumn

  const initial: Record<string, any> = {
    ...{ [pkField]: true },
    ...{ [idField]: true },
  }

  return Object.entries(fields.shape).reduce((acc, [_, fieldShape]) => {
    if (fieldShape.$server.source === 'column') {
      acc[fieldShape.$server.column.name] = true
    } else if (isRelationFieldShape(fieldShape)) {
      acc[fieldShape.$server.relation.name] = {
        select: transformFieldsToPrismaSelectPayload(fieldShape.fields),
      }
    }
    return acc
  }, initial)
}

export function transformPrismaResultToFieldsPayload(
  fields: Fields,
  result: Record<string, any>
): Record<string, any> {
  const pkField = fields.config.primaryColumn
  const idField = fields.config.identifierColumn

  return Object.entries(fields.shape).reduce(
    (acc, [fieldKey, fieldShape]) => {
      const schemaKey =
        fieldShape.$server.source === 'column'
          ? fieldShape.$server.column.name
          : fieldShape.$server.source === 'relation'
            ? fieldShape.$server.relation.name
            : undefined

      if (!schemaKey) {
        throw new Error(`Field "${fieldShape.$server.fieldName}" does not have a valid schema key`)
      }

      let value = result[schemaKey]
      if (value === undefined || value === null) return acc

      if (
        fieldShape.$server.source === 'column' &&
        fieldShape.$server.column.dataType === DataType.JSON
      ) {
        value = JSON.parse(JSON.stringify(value))
      }

      if (isRelationFieldShape(fieldShape)) {
        if (fieldShape.$server.relation.isList) {
          if (!Array.isArray(value)) {
            throw new Error(
              `Expected an array for relation field "${fieldShape.$server.fieldName}", but got ${typeof value}`
            )
          }
          value = (value as any[]).map((v) =>
            transformPrismaResultToFieldsPayload(fieldShape.fields, v)
          )
        } else {
          value = transformPrismaResultToFieldsPayload(fieldShape.fields, value)
        }
      }

      return { ...acc, [fieldKey]: value }
    },
    { __pk: result[pkField], __id: result[idField] }
  )
}
