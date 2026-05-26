import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Validate token
    const validateRes = await fetch('https://health.googleapis.com/v4/users/me/identity', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!validateRes.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    const identity = await validateRes.json()

    await supabase.from('google_health_credentials').upsert({
      user_id: user.id,
      access_token: accessToken,
      google_user_id: identity.userId || identity.fitbitUserId,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    })

    return NextResponse.json({ success: true, message: 'Google Health connected' })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}