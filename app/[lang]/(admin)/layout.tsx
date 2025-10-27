import { PropsWithChildren } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/organisms/app-sidebar'
import AppHeader from '@/components/organisms/app-header'

export default function AdminLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
