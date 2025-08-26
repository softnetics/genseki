'use client'

import { FunnelIcon, XIcon } from '@phosphor-icons/react'

import { BaseIcon, Button, type ButtonProps } from '../../../../../../components'

export interface FilterToggleProps extends Partial<ButtonProps> {
  isOpen: boolean
}

export function FilterToggle(props: FilterToggleProps) {
  return (
    <Button
      aria-label="Filter"
      variant={props.isOpen ? 'naked' : 'outline'}
      size="md"
      leadingIcon={<BaseIcon icon={props.isOpen ? XIcon : FunnelIcon} size="md" />}
      {...props}
    >
      {props.isOpen ? 'Close Filter' : 'Filter'}
    </Button>
  )
}
