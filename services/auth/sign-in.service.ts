'use server'
import { SignInDto } from '@/packages/models'
import { cookies } from 'next/headers'
import linguiConfig from '@/lingui.config'
import { redirect } from 'next/navigation'

export async function signIn(data: SignInDto) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'token',
    value: data.identifier,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  const locale = linguiConfig.locales[0] || 'en'
  redirect(`/${locale}/admin/dashboard`)
}
