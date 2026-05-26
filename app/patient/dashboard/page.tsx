'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Activity, Zap, Clock, TrendingUp, RefreshCw, Wind, Droplets, Timer } from 'lucide-react'

interface HealthSummary {
  todaySteps: number | null
  restingHeartRate: number | null
  sleepHours: number | null
  caloriesBurned: number | null
  oxygenSaturation: number | null
  respiratoryRate: number | null
  heartRateVariability: number | null
  activeMinutes: number | null
  distance: number | null
  date: string
  source?: string
}

export default function PatientDashboard() {
  const [userName, setUserName] = useState('Patient')
  const [healthData, setHealthData] = useState<HealthSummary>({
    todaySteps: null,
    restingHeartRate: null,
    sleepHours: null,
    caloriesBurned: null,
    oxygenSaturation: null,
    respiratoryRate: null,
    heartRateVariability: null,
    activeMinutes: null,
    distance: null,
    date: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // ==================== DEBUG: Dashboard Mount ====================
  useEffect(() => {
    console.log('🏠 DASHBOARD MOUNTED - Checking why we are here')
    console.log('Time:', new Date().toISOString())
  }, [])
  // ============================================================

  // ==================== STRONG AUTH PROTECTION ====================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = await import('@/lib/supabase/client').then((m) => m.createClient())
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          console.log('❌ No valid session in dashboard → Redirecting to login')
          window.location.href = '/auth/login'
          return
        }

        console.log('✅ Valid session confirmed in dashboard')
      } catch (err) {
        console.error('Auth check error in dashboard:', err)
      }
    }

    checkAuth()
  }, [])
  // ============================================================

  const fetchTodayHealthData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      setError('')
      const supabase = await import('@/lib/supabase/client').then((m) => m.createClient())
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        console.log('❌ No user found in dashboard')
        setError('Please log in to view your health data')
        return
      }

      let displayName = 'Patient'
      if (user.user_metadata?.full_name) displayName = user.user_metadata.full_name
      else if (user.user_metadata?.first_name) displayName = user.user_metadata.first_name
      else if (user.email) displayName = user.email.split('@')[0]
      
      setUserName(displayName.split(' ')[0])

      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/health/today?date=${today}`)
      if (!response.ok) throw new Error('Failed to fetch health data')
      
      const data = await response.json()

      setHealthData({
        todaySteps: data.steps ?? null,
        restingHeartRate: data.resting_heart_rate ?? data.heart_rate ?? null,
        sleepHours: data.sleep_duration ?? null,
        caloriesBurned: data.calories_burned ?? null,
        oxygenSaturation: data.oxygen_saturation ?? null,
        respiratoryRate: data.respiratory_rate ?? null,
        heartRateVariability: data.heart_rate_variability ?? null,
        activeMinutes: data.active_minutes ?? null,
        distance: data.distance ?? null,
        date: data.date || today,
        source: data.source,
      })
    } catch (err: any) {
      console.error('Dashboard fetch error:', err)
      setError(err.message || 'Failed to load health data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTodayHealthData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading your health data...</p>
      </div>
    )
  }

  const steps = healthData.todaySteps || 0
  const heartRate = healthData.restingHeartRate || 0
  const sleepHours = healthData.sleepHours || 0
  const spo2 = healthData.oxygenSaturation || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {userName}!
              </h1>
              <p className="text-muted-foreground">Here&apos;s your health summary for today</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => fetchTodayHealthData(true)} variant="outline" size="sm" disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/patient/health-metrics">
                <Button>View All Metrics</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => fetchTodayHealthData(true)}>Try Again</Button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Row 1 — Primary Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Steps Today</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{steps.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {steps >= 10000 ? 'Goal Achieved! 🎉' : `${Math.round((steps / 10000) * 100)}% to daily goal`}
              </p>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-300" style={{ width: `${Math.min((steps / 10000) * 100, 100)}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resting Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{heartRate || '—'} <span className="text-sm font-normal">bpm</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                {heartRate > 100 ? '⚠️ High' : heartRate >= 60 ? '✅ Normal' : heartRate > 0 ? '⚠️ Low' : 'No data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sleep Duration</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sleepHours || '—'} <span className="text-sm font-normal">hrs</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                {sleepHours >= 7 ? '✅ Healthy' : sleepHours > 0 ? '⚠️ Below target' : 'No data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.caloriesBurned ?? '—'} <span className="text-sm font-normal">kcal</span></div>
              <p className="text-xs text-muted-foreground mt-1">Daily expenditure</p>
            </CardContent>
          </Card>
        </div>

        {/* Row 2 — Secondary Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Oxygen (SpO2)</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{spo2 || '—'} <span className="text-sm font-normal">%</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                {spo2 >= 95 ? '✅ Normal' : spo2 > 0 ? '⚠️ Below normal' : 'No data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respiratory Rate</CardTitle>
              <Wind className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.respiratoryRate || '—'} <span className="text-sm font-normal">br/min</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthData.respiratoryRate
                  ? healthData.respiratoryRate >= 12 && healthData.respiratoryRate <= 20 ? '✅ Normal' : '⚠️ Abnormal'
                  : 'No data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate Variability</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.heartRateVariability || '—'} <span className="text-sm font-normal">ms</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthData.heartRateVariability
                  ? healthData.heartRateVariability >= 20 ? '✅ Good' : '⚠️ Low'
                  : 'No data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
              <Timer className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.activeMinutes || '—'} <span className="text-sm font-normal">min</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthData.activeMinutes
                  ? healthData.activeMinutes >= 30 ? '✅ Goal reached' : '⚠️ Keep moving'
                  : 'No data'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Health Alerts remain the same */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>Schedule a consultation with a healthcare provider</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patient/appointments"><Button className="w-full">Book Now</Button></Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sync Google Health</CardTitle>
              <CardDescription>Connect your wearable via Google Health Connect</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patient/health-metrics">
                <Button className="w-full" variant="outline">Connect Device</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>View and manage your medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patient/medical-records">
                <Button className="w-full" variant="outline">Access Records</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Health Alerts
            </CardTitle>
            <CardDescription>Important health notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {heartRate > 100 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm font-medium text-yellow-700">⚠️ Elevated Heart Rate</p>
                  <p className="text-xs text-muted-foreground mt-1">Your resting heart rate is above 100 bpm. Consider relaxing and hydrating.</p>
                </div>
              )}
              {spo2 > 0 && spo2 < 95 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm font-medium text-red-700">🚨 Low Blood Oxygen</p>
                  <p className="text-xs text-muted-foreground mt-1">Your SpO2 is below 95%. Please consult a healthcare provider.</p>
                </div>
              )}
              {steps < 5000 && steps > 0 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm font-medium">🚶 Activity Reminder</p>
                  <p className="text-xs text-muted-foreground mt-1">You're below today's step goal. Take a walk!</p>
                </div>
              )}
              {sleepHours < 7 && sleepHours > 0 && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm font-medium">😴 Sleep Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">You're getting less than the recommended 7-9 hours of sleep.</p>
                </div>
              )}
              {heartRate <= 100 && heartRate > 0 && steps >= 5000 && sleepHours >= 7 && spo2 >= 95 && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm font-medium text-green-700">✅ All Good!</p>
                  <p className="text-xs text-muted-foreground mt-1">Your health metrics are looking great today!</p>
                </div>
              )}
              {steps === 0 && heartRate === 0 && sleepHours === 0 && spo2 === 0 && (
                <div className="p-6 text-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    No health data available yet.<br />
                    Please connect your Google Health / wearable device.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}