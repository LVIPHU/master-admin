import { initLingui, PageLangParam } from '@/i18n/initLingui'
import SignInTemplate from '@/components/templates/sign-in'

export default async function SignInPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)
  return <SignInTemplate />
}
