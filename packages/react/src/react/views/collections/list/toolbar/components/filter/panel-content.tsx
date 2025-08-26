import { useState } from 'react'

import { FilterDate } from './components/filter-date'
import { FilterOptions } from './components/filter-options'
import {
  assertTypeFieldColumnShapeClient,
  assertTypeFieldRelationShapeClientToTarget,
  type MinimalFilter,
  transformFilterToPrismaString,
  whatFilterChoiceToChoose,
} from './filter-helper'

import type { FieldShapeClient } from '../../../../../../../core'
import {
  Button,
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectTrigger,
  Typography,
} from '../../../../../../components'
import { cn } from '../../../../../../utils/cn'

export interface FilterFieldOptions {
  fieldShape: FieldShapeClient
  optionsName?: string
}

interface CollectionListFilterPanelProps {
  slug: string
  fetchList: FilterFieldOptions[]
  formulateList: FilterFieldOptions[]
  onApplyFilter: (newFilter: string) => void
  onClearFilter: () => void
}

export function CollectionListFilterPanel(props: CollectionListFilterPanelProps) {
  const generateLabel = (target: FieldShapeClient, userFriendlyText: boolean) => {
    const tryRelation = assertTypeFieldRelationShapeClientToTarget(target)
    const trySelf = assertTypeFieldColumnShapeClient(target)

    let columnOrRelationName = ''

    if (tryRelation?.$client.relation) {
      columnOrRelationName = tryRelation.$client.relation.name
    }

    if (trySelf?.$client.column.name) {
      columnOrRelationName = trySelf.$client.column.name
    }

    if (columnOrRelationName !== '') {
      if (userFriendlyText && columnOrRelationName !== '') {
        return `${target.label || target.$client.fieldName} (${columnOrRelationName})`
      }
      return `${columnOrRelationName}`
    }
    return target.label || target.$client.fieldName
  }

  const availableFields = [
    ...props.fetchList.map((e) => {
      return {
        field: e.fieldShape,
        label: generateLabel(e.fieldShape, true),
        options: e.optionsName,
      }
    }),
    ...props.formulateList.map((e) => {
      return {
        field: e.fieldShape,
        label: generateLabel(e.fieldShape, true),
        options: e.optionsName,
      }
    }),
  ]

  const [addFilterData, setAddFilterData] = useState<{
    fieldShape?: FieldShapeClient
    options: string
    label: string
  }>({
    fieldShape: undefined,
    options: '',
    label: '',
  })

  const [chosenFilter, setChosenFilter] = useState<MinimalFilter[]>([])

  const resetFilter = () => {
    setAddFilterData({
      fieldShape: undefined,
      options: '',
      label: '',
    })
    setChosenFilter([])
  }

  const filterChoice = availableFields
    .filter((e) => {
      // Remove already selected
      // May have to change if requirement change allows multiple select of the same field
      if (chosenFilter.find((r) => r.fieldShape === e.field)) return false
      return true
    })
    .map((af) => {
      return {
        label: af.label,
        value: af,
      }
    })

  const handleUpdateChosenFilter = (
    targetFieldName: FieldShapeClient,
    newFilterEntries: MinimalFilter
  ) => {
    setChosenFilter((prev) => {
      const idx = prev.findIndex(
        (item) => item.fieldShape.$client.fieldName === targetFieldName.$client.fieldName
      )
      if (idx === -1) return [...prev, newFilterEntries]

      const next = prev.slice()
      next[idx] = newFilterEntries
      return next
    })
  }

  const handleRemoveChosenFilter = (targetFieldName: FieldShapeClient) => {
    setChosenFilter((prev) =>
      prev.filter((item) => item.fieldShape.$client.fieldName !== targetFieldName.$client.fieldName)
    )
  }

  if (availableFields.length === 0)
    return (
      <div className="rounded-md bg-secondary p-5 min-w-[24rem] border border-black/60">
        <Typography type="body" weight="bold">
          No filters are allowed for this collection
        </Typography>
      </div>
    )

  return (
    <div className="rounded-md overflow-hidden border border-border mt-4">
      <div
        className={cn(
          'p-4 flex items-center justify-between',
          chosenFilter.length === 0 ? 'bg-danger/10' : 'bg-secondary'
        )}
      >
        <Typography
          type="body"
          weight="medium"
          className={chosenFilter.length === 0 ? 'text-danger' : ''}
        >
          {chosenFilter.length === 0 ? 'No filter selected' : 'Filter Condition'}
        </Typography>
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            className={'grow'}
            variant="primary"
            isDisabled={chosenFilter.length === 0}
            onClick={() => {
              props.onApplyFilter(transformFilterToPrismaString(chosenFilter))
            }}
          >
            Apply Filter
          </Button>
          <Button
            size="sm"
            className={'grow'}
            variant="secondary"
            onClick={() => {
              resetFilter()
              props.onClearFilter()
            }}
          >
            Clear Filter
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {chosenFilter.length > 0 && (
          <div className="space-y-2">
            {chosenFilter.map((filterField) => {
              const fieldLabel = generateLabel(filterField.fieldShape, true)
              const choiceType = whatFilterChoiceToChoose(filterField.fieldShape)
              switch (choiceType) {
                case 'datetime':
                  return (
                    <FilterDate
                      key={filterField.fieldShape.$client.fieldName}
                      removeThisFilter={() => {
                        handleRemoveChosenFilter(filterField.fieldShape)
                      }}
                      label={fieldLabel}
                      updateThisFilter={(start, end) => {
                        const target = chosenFilter.find(
                          (item) => item.fieldShape === filterField.fieldShape
                        )
                        if (target) {
                          const replacement: MinimalFilter = {
                            fieldShape: target.fieldShape,
                            options: target.options,
                            value: {
                              filterValue: start,
                              endFilterValue: end,
                            },
                          }
                          handleUpdateChosenFilter(filterField.fieldShape, replacement)
                        }
                      }}
                    />
                  )
                case 'singleselect':
                  return (
                    <FilterOptions
                      key={filterField.fieldShape.$client.fieldName}
                      updateThisFilter={(id) => {
                        const target = chosenFilter.find(
                          (item) => item.fieldShape === filterField.fieldShape
                        )
                        if (target) {
                          const replacement: MinimalFilter = {
                            fieldShape: target.fieldShape,
                            options: target.options,
                            value: {
                              filterValue: id,
                            },
                          }
                          handleUpdateChosenFilter(filterField.fieldShape, replacement)
                        }
                      }}
                      removeThisFilter={() => {
                        handleRemoveChosenFilter(filterField.fieldShape)
                      }}
                      label={fieldLabel}
                      optionsFetchPath={`${props.slug}/create/options`}
                      optionsName={filterField.options}
                    />
                  )
                case 'toggle':
                  return (
                    <div>
                      <Typography type="body" weight="normal">
                        This filter type is not available yet
                      </Typography>
                    </div>
                  )
                default:
                  return undefined
              }
            })}
            <div className="bg-primary h-[1px] my-2 w-full" />
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <Select
            aria-label={'Select field'}
            className="h-auto grow"
            placeholder="Select field to add to filter"
            selectedKey={addFilterData.fieldShape?.$client.fieldName ?? null}
            items={filterChoice}
            isDisabled={filterChoice.length === 0}
            onSelectionChange={(value) => {
              if (value == null) return
              const selectedKey = String(value)
              const result = availableFields.find(
                (field) => field.field.$client.fieldName === selectedKey
              )
              if (result) {
                setAddFilterData({
                  fieldShape: result.field,
                  options: result.options || '',
                  label: result.label,
                })
              }
            }}
          >
            <SelectTrigger className="h-auto" />
            <SelectList items={filterChoice}>
              {(item) => (
                <SelectOption
                  key={item.value.field.$client.fieldName}
                  id={item.value.field.$client.fieldName}
                  textValue={item.label}
                >
                  <SelectLabel>{item.label}</SelectLabel>
                </SelectOption>
              )}
            </SelectList>
          </Select>

          <Button
            size="sm"
            variant="primary"
            isDisabled={!addFilterData.fieldShape}
            onClick={() => {
              if (addFilterData.fieldShape !== undefined) {
                const res = {
                  fieldShape: addFilterData.fieldShape,
                  options: addFilterData.options,
                  value: {
                    filterValue: '',
                  },
                }
                setChosenFilter((p) => {
                  return [...p, res]
                })
              }

              setAddFilterData({ fieldShape: undefined, options: '', label: '' })
            }}
          >
            Add Filter
          </Button>
        </div>
      </div>
    </div>
  )
}
