import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development'
  const isComingSoonPage = request.nextUrl.pathname.startsWith('/coming-soon')

  if (!isDev && !isComingSoonPage) {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  return NextResponse.next()
}
