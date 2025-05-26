import { MoonStarsIcon } from '@phosphor-icons/react/dist/ssr'

import type { Collection } from '@kivotos/core'

import { CollectionSection } from './sections/collection-section'
import { NavigationSection } from './sections/navigations-section'
import { PluginSection } from './sections/plugin-section'

import {
  Sidebar,
  SidebarContent,
  SidebarDisclosureGroup,
  SidebarHeader,
  SidebarRail,
} from '../../intentui/ui/sidebar'
import { BaseIcon } from '../primitives/base-icon'
import { Typography } from '../primitives/typography'

export async function AppSidebar({ collections }: { collections: Record<string, Collection> }) {
  const collectionSlugs = Object.values(collections).map((collection) => collection.slug)

  return (
    <Sidebar
      collapsible="dock"
      intent="inset"
      className="flex gap-y-12 p-0 py-6 group-[:not([data-sidebar-state=collapsed])]/sidebar-container:p-6"
    >
      <SidebarHeader className="border-border m-0 size-auto border-b pl-6">
        <div className="flex h-[68px] items-center gap-x-4">
          <div className="bg-primary/15 dark:bg-primary/20 border-primary dark:border-primary/40 relative flex overflow-clip rounded-md border p-4">
            <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 -translate-x-4 -translate-y-4 -rotate-45 blur-[3px]" />
            <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 translate-x-4 translate-y-4 -rotate-45 blur-[3px]" />
            <BaseIcon icon={MoonStarsIcon} size="lg" weight="duotone" className="text-primary" />
          </div>
          <div className="flex flex-col group-data-[sidebar-state=collapsed]/sidebar-container:hidden group-data-[sidebar-state=collapsed]/sidebar-container:translate-x-full">
            <Typography type="body" weight="semibold" className="text-text-nontrivial">
              Kivotos
            </Typography>
            <Typography type="label" weight="medium" className="text-text-trivial">
              V.1.0.0
            </Typography>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarDisclosureGroup defaultExpandedKeys={[2]} className="mt-4">
          <NavigationSection id={0} />
          <PluginSection id={1} />
          <CollectionSection id={2} slugs={collectionSlugs} />
        </SidebarDisclosureGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
