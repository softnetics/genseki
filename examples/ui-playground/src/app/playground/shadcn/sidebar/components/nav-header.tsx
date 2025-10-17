import { MoonStarsIcon } from '@phosphor-icons/react'

import { Typography } from '@genseki/react'
import { SidebarMenu, SidebarMenuItem, SidebarTrigger } from '@genseki/react/v2'

function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="border-borderborder-b py-4 border-b border-border-primary h-18 group-data-[state=collapsed]:h-24 box-content">
        <div className="flex justify-between">
          <div className="overflow-clip flex w-full transition-all duration-200 group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0 ease-out group-data-[state=collapsed]:-translate-x-2">
            <div className="bg-primary/15 dark:bg-primary/15 border-primary dark:border-primary/40 relative overflow-clip rounded-md border-1 w-fit size-18! min-w-18 min-h-18">
              <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 -translate-x-4 -translate-y-4 -rotate-45 blur-[3px]" />
              <div className="bg-primary/20 absolute -inset-x-[25%] inset-y-0 m-auto h-2 translate-x-4 translate-y-4 -rotate-45 blur-[3px]" />
              <MoonStarsIcon
                weight="duotone"
                className="text-primary size-10 absolute inset-0 m-auto"
              />
            </div>

            <div className="grid grid-cols-1 ml-4">
              <Typography type="body" weight="semibold" className="text-text-primary -mb-2">
                BRV
              </Typography>
              <Typography type="label" weight="medium" className="text-text-tertiary">
                1.0.1
              </Typography>
            </div>
          </div>

          <SidebarTrigger className="size-18" variant="outline" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { NavHeader }
