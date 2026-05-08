import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken || typeof accessToken !== 'string') {
      return NextResponse.json(
        { error: 'Valid access token is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const client = await createClient()
    const { data: { user }, error: authError } = await client.auth.getUser()

    if (authError || !user) {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    console.log('[v0] Validating Fitbit token for user:', user.id)

    // Validate token by calling Fitbit API
    const validateResponse = await fetch(
      'https://api.fitbit.com/1/user/-/profile.json',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!validateResponse.ok) {
      const errorText = await validateResponse.text()
      console.error('[v0] Fitbit validation failed:', validateResponse.status, errorText)
      return NextResponse.json(
        { error: 'Invalid or expired Fitbit token. Please verify and try again.' },
        { status: 400 }
      )
    }

    const profile = await validateResponse.json()

    if (!profile.user?.encodedId) {
      console.error('[v0] Invalid profile response:', profile)
      return NextResponse.json(
        { error: 'Could not get Fitbit profile information' },
        { status: 400 }
      )
    }

    console.log('[v0] Token validated for Fitbit user:', profile.user.encodedId)

    // Store credentials in database
    const { error: dbError } = await client
      .from('fitbit_credentials')
      .upsert(
        {
          user_id: user.id,
          access_token: accessToken,
          fitbit_user_id: profile.user.encodedId,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        } as any,                    // ← Fixed TypeScript error
        { onConflict: 'user_id' }
      )

    if (dbError) {
      console.error('[v0] Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to store Fitbit credentials' },
        { status: 500 }
      )
    }

    console.log('[v0] Fitbit credentials stored successfully')

    return NextResponse.json({
      success: true,
      message: 'Fitbit account connected successfully',
      fitbitUserId: profile.user.encodedId,
    })
  } catch (error) {
    console.error('[v0] Error storing Fitbit token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}