'use client'

import type { Icon } from '@phosphor-icons/react'
import { CaretRightIcon } from '@phosphor-icons/react'
import Link from 'next/link'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  Typography,
} from '@genseki/react/v2'

import { cn } from '../../../../../../../../packages/react/src/react/utils/cn'

function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup className="py-6 px-6 group-data-[state=collapsed]:px-0">
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem className="w-full group-data-[state=collapsed]:grid group-data-[state=collapsed]:pl-6">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    'p-0 h-fit',
                    'data-[state=closed]:mb-6 group-data-[state=collapsed]:data-[state=closed]:mb-0'
                  )}
                >
                  {item.icon && (
                    <item.icon weight="duotone" className="text-icon-secondary !size-10" />
                  )}
                  <Typography
                    type="caption"
                    weight="normal"
                    className="text-text-secondary whitespace-nowrap"
                  >
                    {item.title}
                  </Typography>
                  <CaretRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-icon-secondary !size-8" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="border-0 mx-0 px-0 pl-2 gap-3 mt-4">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className="hover:bg-surface-brand-soft-2 duration-100 group/sub-button p-4 pl-10 h-[32px] flex items-center before:inset-4 relative hover:before:block before:absolute before:left-4 before:hidden before:w-1 before:rounded-full before:bg-primary"
                      >
                        <Link href={subItem.url}>
                          <Typography
                            type="body"
                            weight="medium"
                            className="text-text-secondary group-hover/sub-button:text-text-brand whitespace-nowrap"
                          >
                            {subItem.title}
                          </Typography>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export { NavMain }
