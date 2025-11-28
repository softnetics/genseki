import { CaretUpDownIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuItem,
  Typography,
} from '@genseki/ui'

import { cn } from '../../../../../../../../legacies/react/src/react/utils/cn'

function NavFooter() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                // pl-2 because using internal user icon ml-2 (2+2) = 4
                'w-full flex items-center p-4 pl-2 gap-4 bg-background rounded-lg shadow transition-all duration-100 focus-within:ring-ring focus-within:ring-[2px] outline-none',
                'group-data-[state=collapsed]:bg-transparent group-data-[state=collapsed]:shadow-none group-data-[state=collapsed]:px-0 overflow-clip'
              )}
            >
              <div
                className={cn(
                  'rounded-full min-w-18 !min-h-18 grid place-items-center border border-border bg-background ml-2'
                )}
              >
                <UserIcon className="size-10 text-text-tertiary" />
              </div>
              <div className="flex-1 flex items-start flex-col -mt-1 group-data-[state=collapsed]:hidden">
                <Typography weight="medium" className="text-text-primary">
                  Siriwannawaree
                </Typography>
                <Typography type="caption" className="text-text-tertiary leading-[90%]">
                  User Permission
                </Typography>
              </div>
              <CaretUpDownIcon className="size-8 group-data-[state=collapsed]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-(--radix-popper-anchor-width)">
            <DropdownMenuItem variant="destructive">
              <SignOutIcon />
              Signout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { NavFooter }
