import { DatabaseIcon, MoonStarsIcon } from '@phosphor-icons/react/dist/ssr'

import {
  BaseIcon,
  Sidebar,
  SidebarContent,
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarRail,
  Typography,
} from '../../primitives'

export * from './nav'
export * from './sections'

export type AppSidebarItem = {
  type: 'item'
  label: string
  path: string
  icon?: React.ReactNode
}

export type AppSidebarSectionItem = {
  type: 'section'
  label: string
  items: (AppSidebarSectionItem | AppSidebarItem)[]
}

export type AppSideBarBuilderProps = AppSidebarSectionItem

export interface AppSidebarProps {
  title: string
  version: string
  pathname: string
  sidebar?: AppSideBarBuilderProps
}

// TODO: Revise this component
export function AppSidebar(props: AppSidebarProps) {
  return (
    <Sidebar
      collapsible="dock"
      intent="inset"
      className="flex gap-y-12 p-0 py-6 group-[:not([data-sidebar-state=collapsed])]/sidebar-container:p-6"
    >
      {/* TODO: Make sidebar variations, so we won't need an important css flag */}
      <SidebarHeader className="border-border m-0 size-auto! border-b pl-6 h-auto! w-full!">
        <div className="flex h-[68px] items-center gap-x-4">
          <div className="bg-primary/15 dark:bg-primary/20 border-primary dark:border-primary/40 relative flex overflow-clip rounded-md border p-4">
            <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 -translate-x-4 -translate-y-4 -rotate-45 blur-[3px]" />
            <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 translate-x-4 translate-y-4 -rotate-45 blur-[3px]" />
            <BaseIcon icon={MoonStarsIcon} size="lg" weight="duotone" className="text-primary" />
          </div>
          <div className="flex flex-col group-data-[sidebar-state=collapsed]/sidebar-container:hidden group-data-[sidebar-state=collapsed]/sidebar-container:translate-x-full">
            <Typography type="body" weight="semibold" className="text-text-nontrivial">
              {props.title}
            </Typography>
            <Typography type="label" weight="medium" className="text-text-trivial">
              {props.version}
            </Typography>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {props.sidebar && (
          <SidebarDisclosureGroup className="mt-4" defaultExpandedKeys={[1]}>
            <SidebarDisclosure id={1}>
              <SidebarDisclosureTrigger className="in-data-[sidebar-state=collapsed]:rounded-none rounded-md">
                <BaseIcon icon={DatabaseIcon} size="sm" weight="duotone" className="size-8!" />
                <SidebarLabel className="text-text-body text-sm">Collections</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                <SidebarBuilder pathname={props.pathname} {...props.sidebar} />
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
          </SidebarDisclosureGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function CurveLine({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="17"
      height="15"
      viewBox="0 0 17 15"
      fill="none"
    >
      <path d="M16 14C2.5 14 1 6.68747 1 1" className="stroke-primary" strokeLinecap="round" />
    </svg>
  )
}

export function SidebarBuilder(props: AppSideBarBuilderProps & { pathname: string }) {
  const isCurrentPage = (path: string) => {
    return props.pathname.includes(path)
  }

  return props.items.map((item, index) =>
    item.type === 'section' ? (
      <SidebarBuilder pathname={props.pathname} {...item} />
    ) : (
      <SidebarItem key={index} ghost isCurrent={isCurrentPage(item.path)} href={item.path}>
        <CurveLine className="absolute inset-y-0 left-7 my-auto -translate-y-3" />
        <SidebarLabel className="ml-6">{item.label}</SidebarLabel>
      </SidebarItem>
    )
  )
}
