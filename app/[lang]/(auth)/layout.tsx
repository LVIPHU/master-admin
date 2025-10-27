import { GalleryVerticalEnd } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            <div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
              <GalleryVerticalEnd className='size-4' />
            </div>
            TBC Admin
          </a>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>{children}</div>
        </div>
      </div>
      <AspectRatio className='bg-muted relative hidden lg:block'>
        <Image
          src='/assets/backgrounds/auth.jpg'
          alt='Photo by Drew Beamer'
          fill
          className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </AspectRatio>
    </div>
  )
}
