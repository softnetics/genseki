'use client'

import { format, parse } from 'date-fns'
import Image from 'next/image'

import type { serverConfig } from '~/drizzlify/config'
import type { FieldsRenderFn } from '~/src/components/list.client'

const formatDate: (data: string) => React.ReactNode = (date) => format(date, 'dd MMM yyyy')
const formatTime = (time: string): string =>
  format(parse(time, 'HH:mm:ss', new Date()), "H 'hr(s)', m 'minutes'")

const typeDisplay = {
  fruit: '🍌',
  vegetable: '🥗',
  meat: '🍖',
  dairy: '🥛',
  grain: '🌾',
  other: '...',
}

export const renderFoodsCells: FieldsRenderFn<typeof serverConfig.collections.foods> = {
  name: String,
  cookingDate: formatDate,
  cookingTime: formatTime,
  isCooked: (cooked) => (cooked ? '✅' : '❌'),
  cookingTypes: (type) => typeDisplay[type as unknown as keyof typeof typeDisplay],
  foodAvatar: (src) => (src === 'Unknown' ? 'N/A' : <Image alt="" src={src} />),
  description: () => 'N/A',
}
