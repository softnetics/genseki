import { createColumnHelper } from '@tanstack/react-table'

import { Checkbox } from '../../../../components'
import type { BaseData } from '../../types'

export function selectColumn() {
  const columnHelper = createColumnHelper<BaseData>()

  return columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        isSelected={table.getIsAllRowsSelected()}
        isIndeterminate={table.getIsSomeRowsSelected()}
        onChange={(checked) => table.getToggleAllRowsSelectedHandler()({ target: { checked } })}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        isSelected={row.getIsSelected()}
        isDisabled={!row.getCanSelect()}
        onChange={(checked) => row.getToggleSelectedHandler()({ target: { checked } })}
      />
    ),
  })
}
