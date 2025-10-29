import linguiConfig from '@/lingui.config'
import { getI18nInstance } from '@/i18n/i18n'
import { Geist, Geist_Mono } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { PageLangParam } from '@/i18n/initLingui'
import ProviderRegistry from '@/providers'
import { msg } from '@lingui/core/macro'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageLangParam): Promise<Metadata> {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: i18n._(msg`Translation Demo`),
  }
}

export default async function RootLayout({ children, params }: PropsWithChildren<PageLangParam>) {
  const lang = (await params).lang
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
        <ProviderRegistry params={params}>{children}</ProviderRegistry>
        <Toaster />
      </body>
    </html>
  )
}
