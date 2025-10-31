'use client'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar'
import NavItems from '@/components/organisms/app-sidebar/nav-items'

export default function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.FC<React.SVGProps<SVGSVGElement>>
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Presale</SidebarGroupLabel>
      <SidebarMenu>
        <NavItems items={items} />
      </SidebarMenu>
    </SidebarGroup>
  )
}
