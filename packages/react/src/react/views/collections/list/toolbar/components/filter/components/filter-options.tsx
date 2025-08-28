import { useState } from 'react'

import { BaseFilterBox, type BaseFilterBoxInterface } from './base'

import {
  Label,
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectTrigger,
} from '../../../../../../../components'
import { useOptionsHelperQuery } from '../../../../../../../components/compound/auto-field/query-options-helper'
import { useDebounce } from '../../../../../../../hooks/use-debounce'

interface FilterOptionsInterface extends BaseFilterBoxInterface {
  optionsFetchPath: string
  optionsName: string
  updateThisFilter: (id: string) => void
}

export function FilterOptions(props: FilterOptionsInterface) {
  const optionsFetchPath = props.optionsFetchPath
  const optionsName = props.optionsName

  const incorrectOptionsData = optionsFetchPath === '' || optionsName === ''

  const optionKey = `${optionsFetchPath} - ${optionsName}`

  const { query } = useOptionsHelperQuery({
    optionsFetchPath: optionsFetchPath,
    optionsName: optionsName,
    retryCount: 2,
  })

  useDebounce(
    optionKey,
    () => {
      if (incorrectOptionsData) return
      query.refetch()
    },
    500
  )

  const result = query.data?.body

  const [select, setSelect] = useState<{ value: string | number; label: string }>()

  return (
    <BaseFilterBox {...props}>
      <div className="flex items-end gap-2 my-2">
        {incorrectOptionsData && <p>Cannot find filter for {props.label}</p>}
        {result && (
          <Select
            isRequired
            aria-label={'Select field'}
            className="h-auto grow"
            selectedKey={select?.value || null}
            items={result.options}
            onSelectionChange={(value) => {
              const res = result.options.find((e) => e.value === value)
              if (res) {
                setSelect(res)
                props.updateThisFilter(res.value.toString())
              }
            }}
          >
            <Label>Filter by "{props.label}"</Label>
            <SelectTrigger className="h-auto" />
            <SelectList items={result.options}>
              {(item) => (
                <SelectOption key={item.value} id={item.value} textValue={item.label}>
                  <SelectLabel>{item.label}</SelectLabel>
                </SelectOption>
              )}
            </SelectList>
          </Select>
        )}
      </div>
    </BaseFilterBox>
  )
}
