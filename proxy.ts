/*
 * For more info see
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 * */
import { type NextRequest, NextResponse } from 'next/server'

import Negotiator from 'negotiator'
import linguiConfig from './lingui.config'

const { locales } = linguiConfig
const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/forgot-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ---- 1️⃣ Check locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (!pathnameHasLocale) {
    // Redirect if there is no locale
    const locale = getRequestLocale(request.headers)
    request.nextUrl.pathname = `/${locale}${pathname}`
    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(request.nextUrl)
  }

  // ---- 2️⃣ Check auth
  const token = request.cookies.get('token')?.value
  const isPublic = PUBLIC_PATHS.some((p) => pathname.includes(p))

  // Lấy locale hiện tại (vd: /en/admin/dashboard → locale=en)
  const currentLocale = locales.find((l) => pathname.startsWith(`/${l}`)) || locales[0]

  if (!token && !isPublic) {
    // Nếu chưa đăng nhập → redirect về trang login kèm locale
    const redirectUrl = new URL(`/${currentLocale}/sign-in`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (token && isPublic) {
    // Nếu đã đăng nhập mà vào /sign-in → redirect về dashboard theo locale
    const redirectUrl = new URL(`/${currentLocale}/admin/dashboard`, request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

function getRequestLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages(locales.slice())

  return languages[0] || locales[0] || 'en'
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
