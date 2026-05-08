import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function refreshFitbitToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Fitbit token')
  }

  return response.json()
}

async function fetchFitbitData(
  accessToken: string,
  fitbitUserId: string,
  dataType: 'heart' | 'steps' | 'sleep' | 'activities',
  date: string
) {
  const endpoints: { [key: string]: string } = {
    heart: `/1/user/${fitbitUserId}/activities/heart/date/${date}.json`,
    steps: `/1/user/${fitbitUserId}/activities/steps/date/${date}.json`,
    sleep: `/1/user/${fitbitUserId}/sleep/date/${date}.json`,
    activities: `/1/user/${fitbitUserId}/activities/date/${date}.json`,
  }

  const response = await fetch(`https://api.fitbit.com${endpoints[dataType]}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Fitbit ${dataType} data`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, date } = body

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing userId or date' },
        { status: 400 }
      )
    }

    const client = await createClient()

    // Get Fitbit credentials
    const { data: credentials, error: credError } = await client
      .from('fitbit_credentials')
      .select()
      .eq('user_id', userId)
      .single()

    if (credError || !credentials) {
      return NextResponse.json(
        { error: 'Fitbit credentials not found' },
        { status: 404 }
      )
    }

    let accessToken = credentials.access_token

    // Check if token is expired and refresh if needed
    if (new Date(credentials.expires_at) < new Date()) {
      const clientId = process.env.FITBIT_CLIENT_ID || '23VC24'
      const clientSecret = process.env.FITBIT_CLIENT_SECRET || '4497a4c10b48fa9c2fa7331cb76a651f'

      try {
        const newTokens = await refreshFitbitToken(
          clientId,
          clientSecret,
          credentials.refresh_token
        )

        // Update credentials
        const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000)

        await client
          .from('fitbit_credentials')
          .update({
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
            expires_at: expiresAt.toISOString(),
          })
          .eq('user_id', userId)

        accessToken = newTokens.access_token
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to refresh Fitbit token' },
          { status: 401 }
        )
      }
    }

    // Fetch data from Fitbit
    const [heartData, stepsData, sleepData, activitiesData] = await Promise.all([
      fetchFitbitData(accessToken, credentials.fitbit_user_id, 'heart', date),
      fetchFitbitData(accessToken, credentials.fitbit_user_id, 'steps', date),
      fetchFitbitData(accessToken, credentials.fitbit_user_id, 'sleep', date),
      fetchFitbitData(accessToken, credentials.fitbit_user_id, 'activities', date),
    ])

    // Parse and store health data
    const healthData = {
      user_id: userId,
      date,
      heart_rate: heartData['activities-heart']?.[0]?.value?.restingHeartRate || null,
      steps: stepsData['activities-steps']?.[0]?.value || null,
      sleep_duration: sleepData.sleep?.[0]?.duration
        ? (sleepData.sleep[0].duration / 60000) // Convert milliseconds to hours
        : null,
      sleep_quality: sleepData.sleep?.[0]?.efficiency || null,
      calories_burned: activitiesData['activities-calories']?.[0]?.value || null,
      distance: activitiesData['activities-distance']?.[0]?.value || null,
      active_minutes: activitiesData['activities-activeMinutes']?.[0]?.value || null,
      source: 'fitbit' as const,
    }

    // Upsert health data
    const { error: dataError } = await client
      .from('health_data')
      .upsert(healthData)

    if (dataError) {
      console.error('Error storing health data:', dataError)
      return NextResponse.json(
        { error: 'Failed to store health data' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: healthData, message: 'Health data synced successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fitbit sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
