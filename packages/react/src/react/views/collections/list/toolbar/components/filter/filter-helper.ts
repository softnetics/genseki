import type { FieldShapeClient } from '../../../../../../../core'
import {
  isColumnFieldShapeClient,
  isRelationFieldShapeClient,
} from '../../../../../../../core/utils'

export interface MinimalFilter {
  fieldShape: FieldShapeClient
  options: string
  value: {
    filterValue?: string
    endFilterValue?: string
  }
}

export type FilterChoiceComponent = 'datetime' | 'toggle' | 'singleselect' | null

export const isThisFilterAllowed = (target: string, allowedList: string[]) => {
  // Depends on if you want "No filter list given" to allow all filter or allow none
  // Can change it here
  return allowedList.includes(target)
}

export function getLabelFromFieldShape(fieldShape: FieldShapeClient, userFriendlyText: boolean) {
  const isRelational = isRelationFieldShapeClient(fieldShape)
  let columnOrRelationName = ''
  if (isRelational) {
    columnOrRelationName = fieldShape.$client.relation.name
  } else {
    columnOrRelationName = fieldShape.$client.column.name
  }
  if (userFriendlyText) {
    return `${fieldShape.label || fieldShape.$client.fieldName} (${columnOrRelationName})`
  }
  return `${columnOrRelationName}`
}

export function mapFieldShapeClient(fieldShape: FieldShapeClient): {
  filterChoice: FilterChoiceComponent
  optionsFetchPathName: string
} {
  switch (fieldShape.type) {
    // case 'richText':
    // case 'text':
    // case 'password':
    // case 'email':
    // case 'number':
    // case 'comboboxNumber':
    // case 'comboboxText':
    // case 'media':
    // case 'create':

    case 'time':
    case 'date':
      return {
        filterChoice: 'datetime',
        optionsFetchPathName: '',
      }

    case 'checkbox':
    case 'switch':
      // this component is not ready yet
      return {
        filterChoice: 'toggle',
        optionsFetchPathName: '',
      }

    case 'selectNumber':
    case 'selectText':
    case 'connect':
    case 'connectOrCreate': {
      if (
        !fieldShape.options ||
        (Array.isArray(fieldShape.options) && fieldShape.options.length === 0)
      ) {
        // `optionsFetchPathName` will not be completed without `options`, won't be able to fetch for choices
        // Act as if it is non-filterable
        return {
          filterChoice: null,
          optionsFetchPathName: '',
        }
      }
      return {
        filterChoice: 'singleselect',
        optionsFetchPathName: fieldShape.options,
      }
    }

    default:
      return {
        filterChoice: null,
        optionsFetchPathName: '',
      }
  }
}

export function selectFilterChoiceWithFieldShape(
  fieldShape: FieldShapeClient
): FilterChoiceComponent {
  return mapFieldShapeClient(fieldShape).filterChoice
}

export function isThisFieldShapeFilterable(fieldShape: FieldShapeClient): boolean {
  return !!mapFieldShapeClient(fieldShape).filterChoice
}

export function getOptionsFetchPathNameWithFieldShape(fieldShape: FieldShapeClient): string {
  return mapFieldShapeClient(fieldShape).optionsFetchPathName
}

export const transformFilterToPrismaString = (filters: MinimalFilter[]) => {
  // In case false data gets in, filter it out
  const filteredFilters = filters.filter((f) => {
    const targetType = selectFilterChoiceWithFieldShape(f.fieldShape)
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
    if (isRelationFieldShapeClient(rItem.fieldShape)) {
      finalFilterObject[rItem.fieldShape.$client.relation.name] = {
        // Relational should only takes ID instead of column
        id: rItem.value.filterValue,
      }
    }
  }

  const selfPrismaObjectGenerator = (sItem: MinimalFilter) => {
    const targetType = selectFilterChoiceWithFieldShape(sItem.fieldShape)
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
    if (isColumnFieldShapeClient(sItem.fieldShape)) {
      finalFilterObject[sItem.fieldShape.$client.column.name] = selfPrismaObjectGenerator(sItem)
    }
  }

  return JSON.stringify(finalFilterObject)
}
