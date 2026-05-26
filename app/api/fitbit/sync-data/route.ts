// app/api/fitbit/sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

async function refreshGoogleToken(refreshToken: string) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_HEALTH_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_HEALTH_CLIENT_SECRET!

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Refresh failed: ${err}`)
  }
  return res.json()
}

async function fetchDailyData(accessToken: string, dataType: string, date: string) {
  try {
    const res = await fetch(
      `https://health.googleapis.com/v4/users/me/dataTypes/${dataType}/dataPoints:dailyRollUp`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          range: { start: { date }, end: { date } }, 
          windowSize: '1d' 
        }),
      }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ==================== KEY FIX: Reusable Sync Function ====================
async function syncHealthData(
  supabaseAdmin: any, 
  userId: string, 
  accessToken: string, 
  date: string
) {
  try {
    const [stepsData, heartData, sleepData] = await Promise.all([
      fetchDailyData(accessToken, 'steps', date),
      fetchDailyData(accessToken, 'heart-rate', date),
      fetchDailyData(accessToken, 'sleep', date),
    ])

    const healthData = {
      user_id: userId,
      date,
      steps: stepsData?.dailyRollup?.steps?.value ?? null,
      heart_rate: heartData?.dailyRollup?.restingHeartRate?.value ?? null,
      sleep_duration: sleepData?.dailyRollup?.sleep?.durationMinutes 
        ? Math.round((sleepData.dailyRollup.sleep.durationMinutes / 60) * 10) / 10 
        : null,
      sleep_quality: sleepData?.dailyRollup?.sleep?.efficiency ?? null,
      source: 'google_health',
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabaseAdmin
      .from('health_data')
      .upsert(healthData, { onConflict: 'user_id,date' })

    if (error) {
      console.error('Health data upsert error:', error)
      return false
    }
    return true
  } catch (err: any) {
    console.error('SyncHealthData Error:', err)
    return false
  }
}

// ===================== MAIN POST HANDLER =====================
export async function POST(request: NextRequest) {
  try {
    const { userId, date } = await request.json()

    if (!userId || !date) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get stored credentials
    const { data: cred, error: credError } = await supabaseAdmin
      .from('google_health_credentials')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (credError || !cred) {
      return NextResponse.json({ error: 'Credentials not found' }, { status: 404 })
    }

    let accessToken = cred.access_token

    // ================= TOKEN REFRESH (Fixed & Logged) =================
    if (new Date(cred.expires_at) < new Date()) {
      if (!cred.refresh_token) {
        return NextResponse.json({ 
          error: 'Token expired. Please reconnect.' 
        }, { status: 401 })
      }

      console.log(`🔄 Refreshing token for user: ${userId}`)

      const newTokens = await refreshGoogleToken(cred.refresh_token)
      const expiresAt = new Date(Date.now() + (newTokens.expires_in || 3600) * 1000)

      const { error: updateError } = await supabaseAdmin
        .from('google_health_credentials')
        .update({
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token || cred.refresh_token,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Token update error:', updateError)
      } else {
        accessToken = newTokens.access_token
        console.log('✅ Token refreshed and saved successfully')
      }
    }

    // ================= SYNC DATA TO DATABASE =================
    const success = await syncHealthData(supabaseAdmin, userId, accessToken, date)

    return NextResponse.json({ 
      success, 
      message: success ? 'Health data synced successfully' : 'Sync completed with issues'
    })

  } catch (error: any) {
    console.error('Full Sync Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Server error' 
    }, { status: 500 })
  }
}