import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    if (error) {
      console.error('[v0] Fitbit OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/patient/health-metrics?error=${error}`, request.url)
      )
    }

    if (!code) {
      console.error('[v0] No authorization code received')
      return NextResponse.redirect(
        new URL('/patient/health-metrics?error=no_code', request.url)
      )
    }

    // Get user from session/cookies
    // Note: In production, get userId from authenticated session, not cookies
    const userId = request.cookies.get('userId')?.value
    if (!userId) {
      console.error('[v0] No user ID found')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Exchange authorization code for access token
    const clientId = process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID || '23VC24'
    const clientSecret = process.env.FITBIT_CLIENT_SECRET || '4497a4c10b48fa9c2fa7331cb76a651f'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kobitmed.vercel.app'
    const redirectUri = `${appUrl}/api/fitbit/callback`

    // Prepare Basic Auth header
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    console.log('[v0] Exchanging code for token:', {
      clientId,
      redirectUri,
      hasClientSecret: !!clientSecret,
    })

    const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('[v0] Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
      })
      return NextResponse.redirect(
        new URL('/patient/health-metrics?error=token_failed&message=check_credentials', request.url)
      )
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('[v0] No access token in response:', tokenData)
      return NextResponse.redirect(
        new URL('/patient/health-metrics?error=no_token', request.url)
      )
    }

    console.log('[v0] Successfully obtained access token')

    // Get Fitbit user ID
    const userResponse = await fetch('https://api.fitbit.com/1/user/-/profile.json', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('[v0] Failed to get user profile:', {
        status: userResponse.status,
        error: errorText,
      })
      return NextResponse.redirect(
        new URL('/patient/health-metrics?error=user_failed', request.url)
      )
    }

    const userData = await userResponse.json()

    if (!userData.user?.encodedId) {
      console.error('[v0] Invalid user profile data:', userData)
      return NextResponse.redirect(
        new URL('/patient/health-metrics?error=invalid_profile', request.url)
      )
    }

    console.log('[v0] Got Fitbit user ID:', userData.user.encodedId)

    // Store Fitbit credentials in Supabase
    const client = await createClient()

    const expiresAt = new Date(Date.now() + (tokenData.expires_in || 3600) * 1000)

    const { error: dbError } = await client
      .from('fitbit_credentials')
      .upsert({
        user_id: userId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
        fitbit_user_id: userData.user.encodedId,
      } as any)   // Fixed TypeScript error

    if (dbError) {
      console.error('[v0] Database error storing credentials:', dbError)
      return NextResponse.redirect(
        new URL('/patient/health-metrics?error=db_failed', request.url)
      )
    }

    console.log('[v0] Fitbit credentials stored successfully')

    // Redirect back to health metrics page with success
    return NextResponse.redirect(
      new URL('/patient/health-metrics?success=fitbit_connected', request.url)
    )
  } catch (error) {
    console.error('[v0] Fitbit callback error:', error)
    return NextResponse.redirect(
      new URL(`/patient/health-metrics?error=unknown&message=${encodeURIComponent(String(error))}`, request.url)
    )
  }
}