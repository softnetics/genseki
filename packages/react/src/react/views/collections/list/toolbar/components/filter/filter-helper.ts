import type { FieldShapeClient } from '../../../../../../../core'
import type {
  FieldColumnShapeClient,
  FieldRelationShapeClient,
} from '../../../../../../../core/field'

export interface MinimalFilter {
  fieldShape: FieldShapeClient
  options: string
  value: {
    filterValue: string
    endFilterValue?: string
  }
}

export type FilterChoiceComponent = 'datetime' | 'toggle' | 'singleselect' | ''

export const isThisFilterAllowed = (target: string, allowedList: string[]) => {
  // Depends on if you want "No filter list given" to allow all filter or allow none
  // Can change it here
  return allowedList.includes(target)
}

export const whatFilterChoiceToChoose = (item: FieldShapeClient): FilterChoiceComponent => {
  switch (item.type) {
    case 'richText':
    case 'text':
    case 'password':
    case 'email':
    case 'number':
    case 'comboboxNumber':
    case 'comboboxText':
    case 'media':
    case 'create':
      return ''

    case 'time':
    case 'date':
      return 'datetime' // as range

    case 'checkbox':
    case 'switch':
      return 'toggle' // as toggle ?

    case 'selectNumber':
    case 'selectText':
    case 'connect':
    case 'connectOrCreate': {
      if (!item.options || (Array.isArray(item.options) && item.options.length === 0)) {
        throw new Error('Missing options for select/connect field')
      }
      return 'singleselect'
    }

    default:
      return ''
  }
}

export const isThisTypeFilterable = (item: FieldShapeClient) => {
  switch (item.type) {
    case 'richText':
    case 'text':
    case 'password':
    case 'email':
    case 'number':
    case 'comboboxNumber':
    case 'comboboxText':
    case 'media':
    case 'create':
      return false

    case 'time':
    case 'date':
      return true

    case 'checkbox':
    case 'switch':
      return false // not ready

    case 'selectNumber':
    case 'selectText':
    case 'connect':
    case 'connectOrCreate': {
      if (!item.options) throw new Error('Missing optionsFetchPath')
      return true
    }

    default:
      throw new Error(`Unsupported field type: ${JSON.stringify(item)}`)
  }
}

export const optionsFetchPathName = (item: FieldShapeClient) => {
  switch (item.type) {
    case 'richText':
      return undefined
    case 'text':
      return undefined
    case 'password':
      return undefined
    case 'email':
      return undefined
    case 'number':
      return undefined
    case 'time':
      return undefined
    case 'date':
      return undefined
    case 'checkbox':
      return undefined
    case 'switch':
      return undefined

    case 'selectNumber':
    case 'selectText': {
      if (!item.options) throw new Error('Missing optionsFetchPath')
      return item.options
    }
    case 'comboboxNumber':
    case 'comboboxText': {
      return undefined
    }
    case 'media': {
      return undefined
    }
    case 'create': {
      return undefined
    }
    case 'connect':
    case 'connectOrCreate': {
      if (!item.options) throw new Error('Missing optionsFetchPath')
      return item.options
    }
    default:
      throw new Error(`Unsupported field type: ${JSON.stringify(item)}`)
  }
}

export const assertTypeFieldRelationShapeClientToTarget = (
  target: any
): FieldRelationShapeClient | null => {
  const tryAssert = target as FieldRelationShapeClient
  if (tryAssert.$client.relation) {
    return tryAssert
  }
  return null
}

export const assertTypeFieldColumnShapeClient = (target: any): FieldColumnShapeClient | null => {
  const tryAssert = target as FieldColumnShapeClient
  if (tryAssert.$client.column) {
    return tryAssert
  }
  return null
}

export const transformFilterToPrismaString = (filters: MinimalFilter[]) => {
  // In case false data gets in, filter it out
  const filteredFilters = filters.filter((f) => {
    const targetType = whatFilterChoiceToChoose(f.fieldShape)
    switch (targetType) {
      case 'datetime':
        return !!f.value.filterValue && !!f.value.endFilterValue
      case 'singleselect':
        return !!f.value.filterValue
      case 'toggle':
        return !!f.value.filterValue
      default:
        return false
    }
  })

  const relationalArray: typeof filteredFilters = []
  const selfArray: typeof filteredFilters = []

  for (const f of filteredFilters) {
    if (f && f.fieldShape.$client.source === 'relation') relationalArray.push(f)
    else selfArray.push(f)
  }

  const finalFilterObject: any = {}

  for (const rItem of relationalArray) {
    const typeCasted = assertTypeFieldRelationShapeClientToTarget(rItem.fieldShape)
    if (typeCasted?.$client.relation.name) {
      finalFilterObject[typeCasted.$client.relation.name] = {
        // Relational should only takes ID instead of column
        id: rItem.value.filterValue,
      }
    }
  }

  const selfPrismaObjectGenerator = (sItem: MinimalFilter) => {
    const targetType = whatFilterChoiceToChoose(sItem.fieldShape)
    switch (targetType) {
      case 'datetime':
        return { gte: sItem.value.filterValue, lte: sItem.value.endFilterValue }
      case 'singleselect':
        return { contains: sItem.value.filterValue }
      case 'toggle':
        return sItem.value.filterValue
      default:
        return false
    }
  }

  for (const sItem of selfArray) {
    const typeCasted = assertTypeFieldColumnShapeClient(sItem.fieldShape)
    if (typeCasted?.$client.column.name) {
      finalFilterObject[typeCasted.$client.column.name] = selfPrismaObjectGenerator(sItem)
    }
  }

  return JSON.stringify(finalFilterObject)
}
