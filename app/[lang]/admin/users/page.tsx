import { initLingui, PageLangParam } from '@/i18n/initLingui'
import UsersTemplate from '@/components/templates/users'

export default async function UsersPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)
  return <UsersTemplate />
}
