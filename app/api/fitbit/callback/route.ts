// app/api/fitbit/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// ===================== TOKEN REFRESH =====================
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

  if (!res.ok) throw new Error(`Refresh failed: ${await res.text()}`)
  return res.json()
}

// ===================== HELPERS =====================
function getNextDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().split('T')[0]
}

function toCivilDateTime(dateStr: string, isEnd = false) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return {
    date: { year, month, day },
    time: isEnd
      ? { hours: 23, minutes: 59, seconds: 59, nanos: 0 }
      : { hours: 0, minutes: 0, seconds: 0, nanos: 0 },
  }
}

async function getRequest(url: string, accessToken: string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  })
  if (!res.ok) {
    console.warn(`❌ GET failed (${res.status}): ${await res.text()}`)
    return null
  }
  return res.json()
}

async function postRequest(url: string, accessToken: string, body: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    console.warn(`❌ POST failed (${res.status}): ${await res.text()}`)
    return null
  }
  return res.json()
}

// ===================== FETCH FUNCTIONS =====================

async function fetchSteps(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching steps for ${dateStr}`)
  const data = await postRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints:dailyRollUp`,
    accessToken,
    {
      range: {
        start: toCivilDateTime(dateStr, false),
        end: toCivilDateTime(dateStr, true),
      },
      windowSizeDays: 1,
    }
  )
  console.log(`✅ steps RAW:`, JSON.stringify(data, null, 2))
  return data
}

async function fetchRestingHeartRate(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching resting heart rate for ${dateStr}`)
  const nextDay = getNextDay(dateStr)
  const filter = `daily_resting_heart_rate.date >= "${dateStr}" AND daily_resting_heart_rate.date < "${nextDay}"`
  const data = await getRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/daily-resting-heart-rate/dataPoints?filter=${encodeURIComponent(filter)}`,
    accessToken
  )
  console.log(`✅ resting heart rate RAW:`, JSON.stringify(data, null, 2))
  return data
}

async function fetchSleep(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching sleep for ${dateStr}`)
  const nextDay = getNextDay(dateStr)
  const filter = `sleep.interval.civil_end_time >= "${dateStr}" AND sleep.interval.civil_end_time < "${nextDay}"`
  const data = await getRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/sleep/dataPoints:reconcile?filter=${encodeURIComponent(filter)}`,
    accessToken
  )
  console.log(`✅ sleep RAW:`, JSON.stringify(data, null, 2))
  return data
}

async function fetchOxygenSaturation(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching oxygen saturation for ${dateStr}`)
  const nextDay = getNextDay(dateStr)
  const filter = `daily_oxygen_saturation.date >= "${dateStr}" AND daily_oxygen_saturation.date < "${nextDay}"`
  const data = await getRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/daily-oxygen-saturation/dataPoints?filter=${encodeURIComponent(filter)}`,
    accessToken
  )
  console.log(`✅ oxygen saturation RAW:`, JSON.stringify(data, null, 2))
  return data
}

async function fetchRespiratoryRate(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching respiratory rate for ${dateStr}`)
  const nextDay = getNextDay(dateStr)
  const filter = `daily_respiratory_rate.date >= "${dateStr}" AND daily_respiratory_rate.date < "${nextDay}"`
  const data = await getRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/daily-respiratory-rate/dataPoints?filter=${encodeURIComponent(filter)}`,
    accessToken
  )
  console.log(`✅ respiratory rate RAW:`, JSON.stringify(data, null, 2))
  return data
}

async function fetchHeartRateVariability(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching HRV for ${dateStr}`)
  const nextDay = getNextDay(dateStr)
  const filter = `daily_heart_rate_variability.date >= "${dateStr}" AND daily_heart_rate_variability.date < "${nextDay}"`
  const data = await getRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/daily-heart-rate-variability/dataPoints?filter=${encodeURIComponent(filter)}`,
    accessToken
  )
  console.log(`✅ HRV RAW:`, JSON.stringify(data, null, 2))
  return data
}

async function fetchActiveMinutes(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching active minutes for ${dateStr}`)
  const data = await postRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/active-minutes/dataPoints:dailyRollUp`,
    accessToken,
    {
      range: {
        start: toCivilDateTime(dateStr, false),
        end: toCivilDateTime(dateStr, true),
      },
      windowSizeDays: 1,
    }
  )
  console.log(`✅ active minutes RAW:`, JSON.stringify(data, null, 2))
  return data
}

async function fetchDistance(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching distance for ${dateStr}`)
  const data = await postRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/distance/dataPoints:dailyRollUp`,
    accessToken,
    {
      range: {
        start: toCivilDateTime(dateStr, false),
        end: toCivilDateTime(dateStr, true),
      },
      windowSizeDays: 1,
    }
  )
  console.log(`✅ distance RAW:`, JSON.stringify(data, null, 2))
  return data
}

async function fetchCalories(accessToken: string, dateStr: string) {
  console.log(`📡 Fetching calories for ${dateStr}`)
  const data = await postRequest(
    `https://health.googleapis.com/v4/users/me/dataTypes/total-calories/dataPoints:dailyRollUp`,
    accessToken,
    {
      range: {
        start: toCivilDateTime(dateStr, false),
        end: toCivilDateTime(dateStr, true),
      },
      windowSizeDays: 1,
    }
  )
  console.log(`✅ calories RAW:`, JSON.stringify(data, null, 2))
  return data
}

// ===================== PARSE RESPONSES =====================

function parseSteps(res: any): number {
  const points = res?.rollupDataPoints || []
  return points.reduce(
    (sum: number, p: any) => sum + Number(p?.steps?.countSum ?? 0),
    0
  )
}

function parseRestingHeartRate(res: any): number | null {
  const bpm = res?.dataPoints?.[0]?.dailyRestingHeartRate?.beatsPerMinute
  return bpm ? Math.round(Number(bpm)) : null
}

function parseSleepDuration(res: any): number | null {
  const points = res?.dataPoints || []
  let total = 0
  for (const p of points) {
    const mins = p?.sleep?.summary?.minutesAsleep ?? p?.sleep?.durationMinutes
    if (mins) total += Number(mins)
  }
  return total > 0 ? Math.round((total / 60) * 10) / 10 : null
}

function parseOxygenSaturation(res: any): number | null {
  const val = res?.dataPoints?.[0]?.dailyOxygenSaturation?.avgSaturationPercent
  return val ? Math.round(Number(val) * 10) / 10 : null
}

function parseRespiratoryRate(res: any): number | null {
  const val = res?.dataPoints?.[0]?.dailyRespiratoryRate?.breathsPerMinuteAverage
  return val ? Math.round(Number(val) * 10) / 10 : null
}

function parseHRV(res: any): number | null {
  const val = res?.dataPoints?.[0]?.dailyHeartRateVariability?.averageHeartRateVariabilityMilliseconds
  return val ? Math.round(Number(val) * 10) / 10 : null
}

function parseActiveMinutes(res: any): number {
  const points = res?.rollupDataPoints || []
  return points.reduce(
    (sum: number, p: any) => sum + Number(p?.activeMinutes?.minutesSum ?? 0),
    0
  )
}

function parseDistance(res: any): number | null {
  const points = res?.rollupDataPoints || []
  const totalMm = points.reduce(
    (sum: number, p: any) => sum + Number(p?.distance?.millimetersSum ?? 0),
    0
  )
  return totalMm > 0 ? Math.round((totalMm / 1000) * 10) / 10 : null
}

// ✅ FIXED: API returns kcalSum not kilocaloriesSum
function parseCalories(res: any): number | null {
  const points = res?.rollupDataPoints || []
  const total = points.reduce(
    (sum: number, p: any) => sum + Number(p?.totalCalories?.kcalSum ?? 0),
    0
  )
  return total > 0 ? Math.round(total) : null
}

// ===================== SYNC =====================
async function syncHealthData(
  supabaseAdmin: any,
  userId: string,
  accessToken: string,
  date: string
) {
  try {
    const [
      stepsRes,
      heartRes,
      sleepRes,
      oxygenRes,
      respiratoryRes,
      hrvRes,
      activeMinutesRes,
      distanceRes,
      caloriesRes,
    ] = await Promise.all([
      fetchSteps(accessToken, date),
      fetchRestingHeartRate(accessToken, date),
      fetchSleep(accessToken, date),
      fetchOxygenSaturation(accessToken, date),
      fetchRespiratoryRate(accessToken, date),
      fetchHeartRateVariability(accessToken, date),
      fetchActiveMinutes(accessToken, date),
      fetchDistance(accessToken, date),
      fetchCalories(accessToken, date),
    ])

    const healthData = {
      user_id: userId,
      date,
      steps: parseSteps(stepsRes),
      resting_heart_rate: parseRestingHeartRate(heartRes),
      heart_rate: parseRestingHeartRate(heartRes),
      sleep_duration: parseSleepDuration(sleepRes),
      sleep_quality: null,
      oxygen_saturation: parseOxygenSaturation(oxygenRes),
      respiratory_rate: parseRespiratoryRate(respiratoryRes),
      heart_rate_variability: parseHRV(hrvRes),
      active_minutes: parseActiveMinutes(activeMinutesRes),
      distance: parseDistance(distanceRes),
      calories_burned: parseCalories(caloriesRes), // ✅ now correctly parsed
      source: 'google_health',
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabaseAdmin
      .from('health_data')
      .upsert(healthData, { onConflict: 'user_id,date' })

    if (error) console.error('Upsert error:', error)
    else console.log(
      `✅ Saved ${date} | Steps: ${healthData.steps}, HR: ${healthData.resting_heart_rate}, Sleep: ${healthData.sleep_duration}h, SpO2: ${healthData.oxygen_saturation}%, RR: ${healthData.respiratory_rate}, HRV: ${healthData.heart_rate_variability}ms, Active: ${healthData.active_minutes}min, Dist: ${healthData.distance}m, Cal: ${healthData.calories_burned}`
    )

    return !error
  } catch (err: any) {
    console.error('Sync error:', err)
    return false
  }
}

// ===================== MAIN CALLBACK =====================
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const errorParam = request.nextUrl.searchParams.get('error')
  const state = request.nextUrl.searchParams.get('state')

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/patient/health-metrics?error=${errorParam}`, request.url)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/patient/health-metrics?error=missing_params', request.url)
    )
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_HEALTH_CLIENT_ID!
    const clientSecret = process.env.GOOGLE_HEALTH_CLIENT_SECRET!
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${appUrl}/api/fitbit/callback`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenRes.ok) {
      throw new Error(
        `Token exchange failed: ${tokenData.error_description || tokenData.error}`
      )
    }

    const userId = state
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabaseAdmin.from('google_health_credentials').upsert(
      {
        user_id: userId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(
          Date.now() + (tokenData.expires_in || 3600) * 1000
        ).toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

    console.log(`✅ Tokens saved for user: ${userId}`)

    // Sync last 7 days
    const days = Array.from({ length: 7 }, (_, i) =>
      new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    )

    for (const day of days) {
      await syncHealthData(supabaseAdmin, userId, tokenData.access_token, day)
    }

    return NextResponse.redirect(
      new URL('/patient/health-metrics?success=google_health_connected', request.url)
    )
  } catch (error: any) {
    console.error('Callback Error:', error)
    return NextResponse.redirect(
      new URL(
        `/patient/health-metrics?error=callback_failed&msg=${encodeURIComponent(
          error.message
        )}`,
        request.url
      )
    )
  }
}