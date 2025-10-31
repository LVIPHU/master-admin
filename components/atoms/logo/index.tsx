import { cn } from '@/lib/styles'
import LogoSVG from '@public/assets/logo.svg'
import { NavigationLink } from '@/components/atoms/navigation-link'

interface LogoProps {
  readonly className?: string
  readonly classNameIcon?: string
  readonly classNameLabel?: string
  readonly showText?: boolean
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

export function Logo({ className, classNameIcon, classNameLabel, showText = false, size = 'md' }: LogoProps) {
  const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-12',
    xl: 'size-16',
    '2xl': 'size-20',
    '3xl': 'size-24',
  }

  const textSizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }

  return (
    <NavigationLink href='/'>
      <div className={cn('flex flex-row items-center justify-center gap-2', className)}>
        <LogoSVG className={cn(sizeClasses[size], classNameIcon)} />
        {showText && (
          <span className={cn('text-foreground font-semibold', textSizeClasses[size], classNameLabel)}>TBC Wallet</span>
        )}
      </div>
    </NavigationLink>
  )
}
