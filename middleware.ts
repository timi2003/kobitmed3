// app/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({ request })
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // === ALLOW ACCESS TO LOGIN AFTER SIGNUP OR LOGOUT ===
  if (pathname === '/auth/login') {
    // Allow access if user just signed up or logged out
    if (searchParams.has('message') || searchParams.has('logout') || searchParams.has('success')) {
      return response
    }

    // If user is already logged in and not coming from signup/logout → redirect to dashboard
    if (session) {
      return NextResponse.redirect(new URL('/patient/dashboard', request.url))
    }
  }

  // === PROTECTED ROUTES ===
  if (pathname.startsWith('/patient/') || pathname.startsWith('/doctor/')) {
    if (!session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // === ROLE-BASED REDIRECT AFTER LOGIN ===
  if (session) {
    const userType = session.user.user_metadata?.user_type || session.user.user_metadata?.role

    // If doctor tries to access patient routes
    if (userType === 'doctor' && pathname.startsWith('/patient/')) {
      return NextResponse.redirect(new URL('/doctor/dashboard', request.url))
    }

    // If patient tries to access doctor routes
    if (userType === 'patient' && pathname.startsWith('/doctor/')) {
      return NextResponse.redirect(new URL('/patient/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/patient/:path*',
    '/doctor/:path*',
    '/auth/login',
    '/auth/signup'
  ],
}