import { initLingui, PageLangParam } from '@/i18n/initLingui'
import VoucherTemplate from '@/components/templates/voucher'

export default async function VoucherPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)
  return <VoucherTemplate />
}
