'use client'

import { CubeIcon, DotsThreeIcon } from '@phosphor-icons/react'

import { useNavigation } from '../../../../providers'
import { formatSlug } from '../../../../utils/format-slug'
import { Menu, MenuContent, MenuItem, MenuLabel, MenuTrigger } from '../../../primitives'
import {
  Breadcrumbs as PrimitiveBreadCrumbs,
  BreadcrumbsItem as PrimitiveBreadCrumbsItem,
} from '../../../primitives'
import { BaseIcon } from '../../../primitives/base-icon'

export function AppSidebarBreadCrumbs() {
  const { getPathname } = useNavigation()
  const pathname = getPathname()

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
  // This should be fetched from the context or props
  const slugs = ['mockA', 'mockB']

  return (
    <Menu>
      <MenuTrigger className="ml-auto" aria-label="Open Menu">
        <BaseIcon icon={DotsThreeIcon} size="md" weight="bold" />
      </MenuTrigger>
      <MenuContent placement="bottom left" showArrow className="sm:min-w-64">
        {Object.values(slugs).map((slug) => (
          <MenuItem key={slug} href={`/admin/collections/${slug}`}>
            <BaseIcon icon={CubeIcon} weight="duotone" />
            <MenuLabel>{formatSlug(slug)}</MenuLabel>
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  )
}
