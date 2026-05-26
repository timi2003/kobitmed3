// app/api/health/today/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dateParam = request.nextUrl.searchParams.get('date')
    const date = dateParam || new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('health_data')
      .select(`
        date,
        steps,
        heart_rate,
        sleep_duration,
        sleep_quality,
        calories_burned,
        source
      `)
      .eq('user_id', user.id)
      .eq('date', date)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found for today
        return NextResponse.json({
          date,
          steps: null,
          heart_rate: null,
          sleep_duration: null,
          sleep_quality: null,
          calories_burned: null,
          source: null
        })
      }
      throw error
    }

    return NextResponse.json(data)

  } catch (error: any) {
    console.error('Health Today API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health data' }, 
      { status: 500 }
    )
  }
}