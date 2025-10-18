'use client'

import type { ReactElement, ReactNode } from 'react'
import { Children, useEffect, useState } from 'react'

import type { DragEndEvent } from '@dnd-kit/core'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconChevronLgDown } from '@intentui/icons'
import { DotsSixIcon } from '@phosphor-icons/react'

import { BaseIcon, Button, Typography } from '../../primitives'

/**
 * @deprecated Implement yourselves
 */
interface ReorderGroupProps {
  title?: string
  children: ReactNode
  onReorder?: (newOrder: string[]) => void
}

/**
 * @deprecated Implement yourselves
 */
interface SortableItemProps {
  id: string
  children: ReactElement
  title?: string
  order?: number
}

/**
 * @deprecated Implement yourselves
 */
const ReorderGroup = ({ children, onReorder, title }: ReorderGroupProps) => {
  // convert children to array of ReactElement
  const elements = Children.toArray(children) as ReactElement[]

  // prepare map by strip prefix key
  const elementMap = new Map<string, ReactElement>()
  elements.forEach((el, idex) => {
    const rawKey = el.key != null ? String(el.key) : `__idx_${idex}`
    // remove prefix . or .$
    const id = rawKey.replace(/^\.\$?/, '')
    elementMap.set(id, el)
  })

  // default order is keys of map
  const initialOrder = Array.from(elementMap.keys())
  const [order, setOrder] = useState<string[]>(initialOrder)

  // if children change, reset order
  useEffect(() => {
    setOrder(initialOrder)
  }, [children])

  // sensors for drag
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // calculate newOrder
    const oldIndex = order.indexOf(active.id as string)
    const newIndex = order.indexOf(over.id as string)
    const newOrder = arrayMove(order, oldIndex, newIndex)

    // update state
    setOrder(newOrder)
    onReorder?.(newOrder)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        {order.map((id, index) => {
          const element = elementMap.get(id)
          if (!element) return null
          return (
            <SortableItem key={id} id={id} title={title} order={index + 1}>
              {element}
            </SortableItem>
          )
        })}
      </SortableContext>
    </DndContext>
  )
}

/**
 * @deprecated Implement yourselves
 */
const SortableItem = ({ id, children, title, order }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as const

  const [isShowContent, setIsShowContent] = useState(true)

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex flex-col w-full">
        <div
          className={`p-6 w-full border border-bluegray-300 bg-surface-primary-hover rounded-t-lg overflow-hidden flex items-center gap-12 justify-between ${
            isShowContent ? 'rounded-b-none' : 'rounded-b-lg'
          }`}
        >
          <div className="flex items-center gap-12">
            {/* drag area */}
            <div
              className="size-10 shrink-0 flex items-center justify-center cursor-grab"
              {...attributes}
              {...listeners}
            >
              <BaseIcon icon={DotsSixIcon} size="sm" className="rotate-90 text-text-secondary" />
            </div>

            <Typography type="body" weight="semibold" className="text-text-secondary">
              {order} {title}
            </Typography>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setIsShowContent((prev) => !prev)}>
            <IconChevronLgDown
              className={`size-6 transition-transform duration-300 ${
                isShowContent ? '-rotate-180' : ''
              }`}
              fontSize={16}
            />
          </Button>
        </div>

        {isShowContent && children}
      </div>
    </div>
  )
}

export { ReorderGroup, SortableItem }
