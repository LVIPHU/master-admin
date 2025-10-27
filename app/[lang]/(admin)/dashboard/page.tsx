import { initLingui, PageLangParam } from '@/i18n/initLingui'

export default async function DashboardPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)
  return <div></div>
}
