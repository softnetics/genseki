import { Typography } from '@genseki/react'
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@genseki/react/v2'

function NavHeader() {
  const ctx = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem className="border-border m-0 size-auto! border-b pl-6 h-auto! w-full!">
        {/* <div className="flex h-[68px] items-center gap-x-4">
          <div className="bg-primary/15 dark:bg-primary/20 border-primary dark:border-primary/40 relative flex overflow-clip rounded-md border p-4">
            <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 -translate-x-4 -translate-y-4 -rotate-45 blur-[3px]" />
            <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 translate-x-4 translate-y-4 -rotate-45 blur-[3px]" />
            <BaseIcon icon={MoonStarsIcon} size="lg" weight="duotone" className="text-primary" />
          </div>
          <div className="flex flex-col group-data-[sidebar-state=collapsed]/sidebar-container:hidden group-data-[sidebar-state=collapsed]/sidebar-container:translate-x-full">
            <Typography type="body" weight="semibold" className="text-text-primary">
              {props.title}
            </Typography>
            <Typography type="label" weight="medium" className="text-text-secondary">
              {props.version}
            </Typography>
          </div>
        </div> */}

        <div className="w-full bg-primary overflow-clip">
          <Typography type="h3" weight="bold">
            BRV
          </Typography>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { NavHeader }
