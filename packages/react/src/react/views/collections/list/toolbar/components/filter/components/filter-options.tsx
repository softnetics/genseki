import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { BaseFilterBox, type BaseFilterBoxInterface } from './base'

import type { FieldOptionsCallbackReturn } from '../../../../../../../../core/field'
import {
  Label,
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectTrigger,
} from '../../../../../../../components'
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

  const query = useQuery<{ status: 200; body: FieldOptionsCallbackReturn }>({
    queryKey: ['POST', optionsFetchPath, { pathParams: { name: optionsName } }],
    queryFn: async () => {
      const response = await fetch(`/api/${optionsFetchPath}?name=${optionsName}`, {
        method: 'POST',
        // body: JSON.stringify(value),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch options')
      return response.json()
    },
    enabled: false,
    retry: 2,
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
