import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/verify-email')
  
  // If the user is authenticated, redirect them from auth pages to the dashboard.
  if (isAuthPage) {
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protect the dashboard and all its sub-routes.
  if (pathname.startsWith('/dashboard')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect the root path to the appropriate page.
  if (pathname === '/') {
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/verify-email',
    '/dashboard/:path*',
  ],
}
