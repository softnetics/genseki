import { XIcon } from '@phosphor-icons/react'

import { BaseIcon, Button } from '../../../../../../../components'

export interface BaseFilterBoxInterface {
  label: string
  removeThisFilter: () => void
}

interface BaseFilterBoxProps extends BaseFilterBoxInterface {
  children: React.ReactNode
}

export function BaseFilterBox(props: BaseFilterBoxProps) {
  return (
    <div className="flex items-center gap-4 border-l-4 border-border p-4 hover:bg-secondary">
      <div className="flex-1">{props.children}</div>
      <Button
        size="sm"
        variant="destruction"
        onClick={() => {
          props.removeThisFilter()
        }}
      >
        <BaseIcon icon={XIcon} size="md" />
      </Button>
    </div>
  )
}
