import type { Icon } from '@phosphor-icons/react'
import { DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr'
import { createColumnHelper, type Row } from '@tanstack/react-table'
import * as R from 'remeda'

import {
  BaseIcon,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '../../../../components'
import { type NavigationContextValue, useNavigation } from '../../../../providers'
import type { BaseData } from '../../types'
import { useCollectionList } from '../context'

type ActionItem = (
  context: ReturnType<typeof useCollectionList>,
  row: Row<BaseData>,
  key: string
) => React.ReactNode

export function createActionItem(
  render: (
    context: ReturnType<typeof useCollectionList>,
    row: Row<BaseData>,
    key: string
  ) => React.ReactNode
) {
  return render
}

function createDefaultActionItem(
  title: string,
  icon?: Icon,
  onAction?: (
    context: ReturnType<typeof useCollectionList>,
    row: Row<BaseData>,
    navigation: NavigationContextValue
  ) => string | void,
  isDanger?: boolean
) {
  return createActionItem((context, row, key) => {
    const navigation = useNavigation()
    return (
      <MenuItem
        aria-label={title}
        key={key}
        isDanger={isDanger}
        onAction={() => {
          if (onAction) {
            onAction(context, row, navigation)
          }
        }}
      >
        <div className="flex items-center gap-2">
          {icon && <BaseIcon icon={icon} size="sm" />}
          {title}
        </div>
      </MenuItem>
    )
  })
}

export function createViewActionItem(title: string = 'View', icon: Icon | undefined = undefined) {
  return createDefaultActionItem(title, icon, (context, row, navigation) =>
    navigation.navigate(`./${context.slug}/${row.original.__id}`)
  )
}

export function createEditActionItem(title: string = 'Edit', icon: Icon | undefined = undefined) {
  return createDefaultActionItem(title, icon, (context, row, navigation) =>
    navigation.navigate(`./${context.slug}/update/${row.original.__id}`)
  )
}

export function createDeleteActionItem(
  title: string = 'Delete',
  icon: Icon | undefined = undefined
) {
  return createDefaultActionItem(
    title,
    icon,
    (context) => {
      if (context.deleteRows) {
        context.deleteRows()
      }
    },
    true
  )
}

export function createSeparatorItem() {
  return createActionItem((context, row, key) => <MenuSeparator key={key} />)
}

export function actionsColumn(actionItems: ActionItem[] = []) {
  const columnHelper = createColumnHelper<BaseData>()

  return columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      const context = useCollectionList()

      return (
        <div className="grid place-items-center">
          <Menu>
            <MenuTrigger aria-label="Actions Icon" className="cursor-pointer">
              <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
            </MenuTrigger>
            {actionItems.length !== 0 ? (
              <MenuContent aria-label="Actions" placement="left top">
                {(actionItems ?? []).map((createActionItem) => {
                  return createActionItem(context, row, R.randomString(6))
                })}
              </MenuContent>
            ) : null}
          </Menu>
        </div>
      )
    },
  })
}
