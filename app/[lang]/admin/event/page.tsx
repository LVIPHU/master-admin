import { initLingui, PageLangParam } from '@/i18n/initLingui'
import EventTemplate from '@/components/templates/event'

export default async function EventPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)
  return <EventTemplate />
}
