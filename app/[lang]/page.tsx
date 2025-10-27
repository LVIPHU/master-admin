import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import linguiConfig from '@/lingui.config'

export default async function RootPage() {
  const cookieStore = await cookies() // ✅ cần await
  const token = cookieStore.get('token')?.value
  const locale = linguiConfig.locales[0] || 'en'

  redirect(`/${locale}${token ? '/dashboard' : '/sign-in'}`)
}
