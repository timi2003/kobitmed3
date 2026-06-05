import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${appUrl}/api/auth/google/callback`

    if (!clientId) {
      console.error('[v0] Google Client ID not configured')
      return NextResponse.json(
        { error: 'Google OAuth not configured' },
        { status: 500 }
      )
    }

    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15)
    
    // Store state in response cookie
    const response = NextResponse.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
      }).toString()}`
    )

    // Set secure cookie with state
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
    })

    return response
  } catch (error) {
    console.error('[v0] Google OAuth initiation error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    )
  }
}