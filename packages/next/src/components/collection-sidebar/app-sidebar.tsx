import { MoonStars } from '@phosphor-icons/react/dist/ssr'

import type { Collection } from '@kivotos/core'

import CollectionSection from './collection-section'
import NavigationSection from './navigations-section'
import PluginSection from './plugin-section'

import {
  Sidebar,
  SidebarContent,
  SidebarDisclosureGroup,
  SidebarHeader,
  SidebarRail,
} from '../../intentui/ui/sidebar'
import BaseIcon from '../primitives/base-icon'
import Typography from '../primitives/typography'
type AppSidebarProps = {
  collections: Collection[]
}

export default async function AppSidebar({ collections }: AppSidebarProps) {
  const collectionSlugs = collections.map((collection) => collection.slug)

  return (
    <Sidebar
      collapsible="dock"
      intent="inset"
      className="gap-y-12! flex p-0 py-6 group-[:not([data-sidebar-state=collapsed])]/sidebar-container:p-6"
    >
      <SidebarHeader className="border-border size-auto! m-0! border-b pl-6">
        <div className="flex h-[68px] items-center gap-x-4">
          <div className="bg-primary/15 dark:bg-primary/20 border-primary dark:border-primary/40 relative flex overflow-clip rounded-md border p-4">
            <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 -translate-x-4 -translate-y-4 -rotate-45 blur-[3px]" />
            <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 translate-x-4 translate-y-4 -rotate-45 blur-[3px]" />
            <BaseIcon icon={MoonStars} size="lg" weight="duotone" className="text-primary" />
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
          <NavigationSection />
          <PluginSection />
          <CollectionSection slugs={collectionSlugs} />
        </SidebarDisclosureGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
