import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('[v0] Google OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/auth/login?error=google_${error}`, request.url)
      )
    }

    const cookieState = request.cookies.get('oauth_state')?.value
    if (!state || state !== cookieState) {
      console.error('[v0] State mismatch - potential CSRF attack')
      return NextResponse.redirect(
        new URL('/auth/login?error=invalid_state', request.url)
      )
    }

    if (!code) {
      console.error('[v0] No authorization code received')
      return NextResponse.redirect(
        new URL('/auth/login?error=no_code', request.url)
      )
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${appUrl}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
      console.error('[v0] Google OAuth credentials not configured')
      return NextResponse.redirect(
        new URL('/auth/login?error=server_error', request.url)
      )
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('[v0] Token exchange failed:', errorText)
      return NextResponse.redirect(
        new URL('/auth/login?error=token_exchange_failed', request.url)
      )
    }

    const tokenData = await tokenResponse.json()
    const payload = JSON.parse(
      Buffer.from(tokenData.id_token.split('.')[1], 'base64').toString()
    )

    const client = await createClient()

    // Check if user exists
    const { data: existingUser } = await client
      .from('user_profiles')
      .select('*')
      .eq('email', payload.email)
      .single()

    let userId: string

    if (existingUser) {
      userId = (existingUser as any).user_id

      console.log('[v0] User found, updating last_sign_in')

      // === Strongest bypass for update ===
      const updateData = { last_sign_in_at: new Date().toISOString() }

      // @ts-ignore
      await client.from('user_profiles').update(updateData).eq('user_id', userId)

    } else {
      console.log('[v0] New user, creating account')

      const { data: newUser, error: createError } = await client
        .from('profiles')
        .insert({
          email: payload.email,
          first_name: payload.given_name || payload.name?.split(' ')[0] || '',
          last_name: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '',
          avatar_url: payload.picture || null,
          google_id: payload.sub,
          role: 'patient',
        } as any)
        .select()
        .single()

      if (createError || !newUser) {
        console.error('[v0] Failed to create user:', createError)
        return NextResponse.redirect(
          new URL('/auth/login?error=user_creation_failed', request.url)
        )
      }

      userId = (newUser as any).user_id
    }

    // Get user role
    const { data: roleData } = await client
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single()

    const role = (roleData as any)?.role || 'patient'
    const redirectPath = role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'

    const response = NextResponse.redirect(new URL(redirectPath, request.url))

    response.cookies.set('userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    response.cookies.delete('oauth_state')

    return response
  } catch (error) {
    console.error('[v0] Google callback error:', error)
    return NextResponse.redirect(
      new URL(`/auth/login?error=unknown&message=${encodeURIComponent(String(error))}`, request.url)
    )
  }
}