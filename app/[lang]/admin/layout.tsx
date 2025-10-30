'use client'
import { PropsWithChildren } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/organisms/app-sidebar'
import AppHeader from '@/components/organisms/app-header'
import { useBuyerCommission } from '@/providers/buyer-commission.provider'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import * as React from 'react'
import { Button } from '@/components/ui/button'

export default function AdminLayout({ children }: Readonly<PropsWithChildren>) {
  const { tbcPrice, setTbcPrice } = useBuyerCommission()
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <AppHeader />

        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <form
              className='flex gap-2 p-4 md:p-6'
              onSubmit={(e) => {
                e.preventDefault()

                const input = e.currentTarget.querySelector('input')
                const value = input?.value

                if (!value) return

                setTbcPrice(Number(value))

                toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
                  loading: `Saving TBC Price`,
                  success: 'Done',
                  error: 'Error',
                })
              }}
            >
              <Label htmlFor={`tbc-price`}>TBC Price</Label>
              <Input
                type='number'
                className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
                defaultValue={tbcPrice}
                id={`tbc-price`}
              />
              <Button type='submit'>Save</Button>
            </form>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
