'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'

type Item = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
}

export default function NavItems({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: Item[]
  }[]
}) {
  const { open } = useSidebar()
  const Item = (item: Item) => {
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <Link href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }
  if (open) {
    return (
      <>
        {items.map((item) => {
          if (!item.items) {
            return Item(item)
          }
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </>
    )
  }
  return (
    <>
      {items.map((item) => (
        <DropdownMenu key={item.title}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>{item.icon && <item.icon />}</SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='right' align='start'>
            {item.items?.map((subItem) => (
              <DropdownMenuItem key={subItem.title} asChild>
                <a href={subItem.url}>{subItem.title}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </>
  )
}
