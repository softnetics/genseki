'use client'

import * as React from 'react'

import { CaretRightIcon, CubeIcon, FolderIcon } from '@phosphor-icons/react'

import { BadgeOrange } from '../../icons/badge-orange'
import { DotsCard } from '../../icons/dots-card'
import { cn } from '../../utils/cn'

function CollectionCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="collection-card"
      className={cn(
        'bg-white rounded-2xl shadow-sm p-2 w-full border border-bluegray-300 relative flex flex-col',
        className
      )}
      {...props}
    />
  )
}

function CollectionCardIcon({
  icon: Icon = CubeIcon,
  badgeClassName,
  iconClassName,
}: {
  icon?: React.ComponentType<React.ComponentProps<typeof CubeIcon>>
  badgeClassName?: string
  iconClassName?: string
}) {
  return (
    <>
      <BadgeOrange
        data-slot="collection-card-badge"
        className={cn('size-24 absolute top-0 left-6 -translate-y-1/2 z-[1]', badgeClassName)}
      />
      <Icon
        data-slot="collection-card-icon"
        className={cn(
          'text-text-brand size-10 absolute top-0 left-8 -translate-y-1/2 z-[2] translate-x-1/2',
          iconClassName
        )}
      />
    </>
  )
}

function CollectionCardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="collection-card-header"
      className={cn(
        'flex justify-between items-center px-8 pb-4 pt-14 border-b border-bluegray-300 relative overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0">
        <DotsCard />
      </div>
      {props.children}
    </div>
  )
}

function CollectionCardTitle({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="collection-card-title"
      className={cn('text-bluegray-800', className)}
      {...props}
    />
  )
}

function CollectionCardItemCount({
  className,
  itemNumber,
  ...props
}: React.ComponentProps<'div'> & {
  itemNumber: number
}) {
  return (
    <div
      data-slot="collection-card-item-count"
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <FolderIcon className="text-text-secondary" />
      <span className="text-sm text-text-secondary">{itemNumber} items</span>
    </div>
  )
}

function CollectionCardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="collection-card-description"
      className={cn('px-8 pb-8 pt-6 flex-grow text-text-secondary', className)}
      {...props}
    >
      {props.children}
    </div>
  )
}

function CollectionCardButton({
  className,
  children,
  title = 'View',
  ...props
}: React.ComponentProps<'button'> & {
  title?: string
}) {
  return (
    <button
      data-slot="collection-card-button"
      className={cn(
        'w-full py-6 px-8 bg-gradient-to-b from-pumpkin-50 to-pumpkin-100 rounded-lg text-text-secondary font-medium flex items-center justify-end hover:from-pumpkin-100 hover:to-pumpkin-300 transition cursor-pointer gap-3',
        className
      )}
      {...props}
    >
      <span>{children ?? title}</span>
      <CaretRightIcon fontSize={24} className="size-10 text-text-secondary" />
    </button>
  )
}

export {
  CollectionCard,
  CollectionCardButton,
  CollectionCardDescription,
  CollectionCardHeader,
  CollectionCardIcon,
  CollectionCardItemCount,
  CollectionCardTitle,
}
