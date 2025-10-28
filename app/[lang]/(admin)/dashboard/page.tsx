import { initLingui, PageLangParam } from '@/i18n/initLingui'
import DashboardTemplate from '@/components/templates/dashboard'

export default async function DashboardPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)
  return (<DashboardTemplate/>)
}
