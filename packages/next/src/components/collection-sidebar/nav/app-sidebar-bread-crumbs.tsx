'use client'
import { CubeIcon, DotsThreeIcon } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'

import {
  Breadcrumbs as PrimitiveBreadCrumbs,
  BreadcrumbsItem as PrimitiveBreadCrumbsItem,
} from '../../../intentui/ui/breadcrumbs'
import { Menu, MenuContent, MenuItem, MenuLabel, MenuTrigger } from '../../../intentui/ui/menu'
import { useRootContext } from '../../../providers/root'
import { formatSlug } from '../../../utils/format-slug'
import { BaseIcon } from '../../primitives/base-icon'

export const AppSidebarBreadCrumbs = () => {
  const pathname = usePathname()
  const leadingPath = '/admin'

  const removeLeadingpath = pathname.split(leadingPath)[1]

  const sanitizedSegments = removeLeadingpath.slice(1).split('/')

  return (
    <PrimitiveBreadCrumbs separator="slash" className="hidden md:flex">
      {sanitizedSegments.map((segment, index) => {
        return (
          <PrimitiveBreadCrumbsItem
            key={segment}
            href={`${leadingPath}/${sanitizedSegments.slice(0, index + 1).join('/')}`}
            trailing={
              sanitizedSegments[0] === 'collections' && index === 1 ? <CollectionMenu /> : null
            }
          >
            {segment ?? 'unknown'}
          </PrimitiveBreadCrumbsItem>
        )
      })}
    </PrimitiveBreadCrumbs>
  )
}

function CollectionMenu() {
  const { clientConfig } = useRootContext()

  return (
    <Menu>
      <MenuTrigger className="ml-auto" aria-label="Open Menu">
        <BaseIcon icon={DotsThreeIcon} size="md" weight="bold" />
      </MenuTrigger>
      <MenuContent placement="bottom left" showArrow className="sm:min-w-64">
        {Object.values(clientConfig.collections).map((collection) => (
          <MenuItem key={collection.slug} href={`/admin/collections/${collection.slug}`}>
            <BaseIcon icon={CubeIcon} weight="duotone" />
            <MenuLabel>{formatSlug(collection.slug)}</MenuLabel>
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  )
}
