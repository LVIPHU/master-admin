import { PropsWithChildren } from 'react'
import { initLingui, PageLangParam } from '@/i18n/initLingui'
import { allMessages } from '@/i18n/i18n'
import ThemeProvider from '@/providers/theme.provider'
import LocaleProvider from '@/providers/locale.provider'

export default async function ProviderRegistry({ children, params }: Readonly<PropsWithChildren<PageLangParam>>) {
  const lang = (await params).lang
  initLingui(lang)
  return (
    <LocaleProvider initialLocale={lang} initialMessages={allMessages[lang]!}>
      <ThemeProvider attribute='class' defaultTheme='light' enableColorScheme enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </LocaleProvider>
  )
}
