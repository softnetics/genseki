'use client'

import React from 'react'

import { IconChevronLgRight } from '@intentui/icons'
import { CubeIcon, Folder } from '@phosphor-icons/react'

import { BaseIcon } from './base-icon'

import { BadgeOrange } from '../../icons/badge-orange'
import { DotsCard } from '../../icons/dots-card'

interface CardProps {
  title: string
  description: string
  itemNumber?: number
  buttonTitle?: string
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({ title, itemNumber, description, buttonTitle, onClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-2 max-w-sm w-[296px] border border-bluegray-300 relative">
      <BadgeOrange className="size-24 absolute top-0 left-6 -translate-y-1/2 z-[1]" />
      <BaseIcon
        icon={CubeIcon}
        size="md"
        className="text-text-accent size-10 absolute top-0 left-8 -translate-y-1/2 z-[2] translate-x-1/2"
      />
      {/* Header */}
      <div className="flex justify-between items-center px-8 pb-4 pt-14 border-b border-bluegray-300 relative overflow-hidden">
        {/* Dots */}
        <div className="absolute top-0 left-0">
          <DotsCard />
        </div>
        <p className="text-lg font-semibold text-bluegray-800">{title}</p>
        {itemNumber && (
          <div className="flex items-center gap-2">
            <BaseIcon icon={Folder} size="md" className="text-bluegray-600" />
            <span className="text-sm text-bluegray-600">{itemNumber} items</span>
          </div>
        )}
      </div>

      <div className="px-8 pb-8 pt-6">
        <p className="text-bluegray-600 leading-snug">{description}</p>
      </div>

      <button
        onClick={onClick}
        className="w-full py-6 px-8 bg-gradient-to-b from-pumpkin-50 to-pumpkin-200 rounded-lg text-bluegray-600 font-medium flex items-center justify-end hover:from-pumpkin-100 hover:to-pumpkin-300 transition cursor-pointer gap-3"
      >
        <span>{buttonTitle ?? 'View'}</span>
        <IconChevronLgRight fontSize={24} className="size-10 text-bluegray-600" />
      </button>
    </div>
  )
}

export type { CardProps }
export { Card }
