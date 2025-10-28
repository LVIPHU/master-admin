import { PropsWithChildren } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/organisms/app-sidebar'
import AppHeader from '@/components/organisms/app-header'

export default function AdminLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <AppHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
