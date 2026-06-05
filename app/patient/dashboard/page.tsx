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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 pb-20 md:pb-0">

      {/* ── DESKTOP HEADER (hidden on mobile) ── */}
      <div className="hidden md:block bg-white border-b border-border">
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

      {/* ── MOBILE HERO HEADER (hidden on desktop) ── */}
      <div className="md:hidden bg-gradient-to-br from-primary to-primary/80 px-4 pt-12 pb-6 relative overflow-hidden">
        {/* decorative circle */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-6 top-16 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/60 text-xs mb-1">Good to see you,</p>
            <h1 className="text-xl font-bold text-white leading-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-white/50 text-xs mt-1">Here&apos;s your health summary for today</p>
          </div>
          <button
            onClick={() => fetchTodayHealthData(true)}
            disabled={isRefreshing}
            className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-1.5 flex-shrink-0"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <Link href="/patient/health-metrics">
          <button className="w-full bg-white text-primary font-semibold text-sm rounded-xl py-2.5 mt-1">
            View All Metrics
          </button>
        </Link>
      </div>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <Button variant="outline" size="sm" onClick={() => fetchTodayHealthData(true)}>Try Again</Button>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">

        {/* ── DESKTOP: Row 1 — Primary Metrics (4-col, hidden on mobile) ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* ── DESKTOP: Row 2 — Secondary Metrics (4-col, hidden on mobile) ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* ── MOBILE: 2-column metrics grid (hidden on desktop) ── */}
        <div className="md:hidden grid grid-cols-2 gap-2.5">
          {/* Steps */}
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-medium">Steps today</span>
              <Activity className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="text-[20px] font-bold text-foreground leading-none mb-1">{steps.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground mb-1.5">
              {steps >= 10000 ? 'Goal Achieved! 🎉' : `${Math.round((steps / 10000) * 100)}% to goal`}
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-300" style={{ width: `${Math.min((steps / 10000) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Calories */}
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-medium">Calories</span>
              <Zap className="h-3.5 w-3.5 text-yellow-500" />
            </div>
            <div className="text-[20px] font-bold text-foreground leading-none mb-1">
              {healthData.caloriesBurned ?? '—'}
            </div>
            <div className="text-[10px] text-muted-foreground">kcal · Daily</div>
          </div>

          {/* Heart Rate */}
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-medium">Heart rate</span>
              <Heart className="h-3.5 w-3.5 text-destructive" />
            </div>
            <div className={`text-[15px] font-bold leading-none mb-1 ${heartRate ? 'text-foreground' : 'text-muted-foreground'}`}>
              {heartRate || '—'}<span className="text-[11px] font-normal"> bpm</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {heartRate > 100 ? '⚠️ High' : heartRate >= 60 ? '✅ Normal' : heartRate > 0 ? '⚠️ Low' : 'No data'}
            </div>
          </div>

          {/* Blood Oxygen */}
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-medium">Blood oxygen</span>
              <Droplets className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className={`text-[15px] font-bold leading-none mb-1 ${spo2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              {spo2 || '—'}<span className="text-[11px] font-normal"> %</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {spo2 >= 95 ? '✅ Normal' : spo2 > 0 ? '⚠️ Below normal' : 'No data'}
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-medium">Sleep</span>
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className={`text-[15px] font-bold leading-none mb-1 ${sleepHours ? 'text-foreground' : 'text-muted-foreground'}`}>
              {sleepHours || '—'}<span className="text-[11px] font-normal"> hrs</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {sleepHours >= 7 ? '✅ Healthy' : sleepHours > 0 ? '⚠️ Below target' : 'No data'}
            </div>
          </div>

          {/* Active Minutes */}
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground font-medium">Active mins</span>
              <Timer className="h-3.5 w-3.5 text-green-500" />
            </div>
            <div className={`text-[15px] font-bold leading-none mb-1 ${healthData.activeMinutes ? 'text-foreground' : 'text-muted-foreground'}`}>
              {healthData.activeMinutes || '—'}<span className="text-[11px] font-normal"> min</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {healthData.activeMinutes
                ? healthData.activeMinutes >= 30 ? '✅ Goal reached' : '⚠️ Keep moving'
                : 'No data'}
            </div>
          </div>
        </div>

        {/* ── DESKTOP: Quick Actions & Health Alerts (hidden on mobile) ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
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

        {/* ── MOBILE: Quick Actions — horizontal rows (hidden on desktop) ── */}
        <div className="md:hidden flex flex-col gap-2">
          <Link href="/patient/appointments">
            <div className="bg-card border border-border rounded-2xl flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Book appointment</p>
                  <p className="text-[11px] text-muted-foreground">Consult a provider</p>
                </div>
              </div>
              <button className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-xl flex-shrink-0">Book</button>
            </div>
          </Link>

          <Link href="/patient/health-metrics">
            <div className="bg-card border border-border rounded-2xl flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Sync Google Health</p>
                  <p className="text-[11px] text-muted-foreground">Connect wearable</p>
                </div>
              </div>
              <button className="bg-card text-foreground border border-border text-xs font-semibold px-3 py-1.5 rounded-xl flex-shrink-0">Connect</button>
            </div>
          </Link>

          <Link href="/patient/medical-records">
            <div className="bg-card border border-border rounded-2xl flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Medical records</p>
                  <p className="text-[11px] text-muted-foreground">View your history</p>
                </div>
              </div>
              <button className="bg-card text-foreground border border-border text-xs font-semibold px-3 py-1.5 rounded-xl flex-shrink-0">Access</button>
            </div>
          </Link>
        </div>

        {/* ── HEALTH ALERTS (shared, responsive styling) ── */}
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Health Alerts
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Important health notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {heartRate > 100 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-xs md:text-sm font-medium text-yellow-700">⚠️ Elevated Heart Rate</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-1">Your resting heart rate is above 100 bpm. Consider relaxing and hydrating.</p>
                </div>
              )}
              {spo2 > 0 && spo2 < 95 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-xs md:text-sm font-medium text-red-700">🚨 Low Blood Oxygen</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-1">Your SpO2 is below 95%. Please consult a healthcare provider.</p>
                </div>
              )}
              {steps < 5000 && steps > 0 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <p className="text-xs md:text-sm font-medium">🚶 Activity Reminder</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-1">You're below today's step goal. Take a walk!</p>
                </div>
              )}
              {sleepHours < 7 && sleepHours > 0 && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <p className="text-xs md:text-sm font-medium">😴 Sleep Alert</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-1">You're getting less than the recommended 7-9 hours of sleep.</p>
                </div>
              )}
              {heartRate <= 100 && heartRate > 0 && steps >= 5000 && sleepHours >= 7 && spo2 >= 95 && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <p className="text-xs md:text-sm font-medium text-green-700">✅ All Good!</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-1">Your health metrics are looking great today!</p>
                </div>
              )}
              {steps === 0 && heartRate === 0 && sleepHours === 0 && spo2 === 0 && (
                <div className="p-4 md:p-6 text-center bg-muted rounded-xl">
                  <p className="text-muted-foreground text-xs md:text-sm">
                    No health data available yet.<br />
                    Please connect your Google Health / wearable device.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ── MOBILE BOTTOM NAV (hidden on desktop) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex z-50">
        <Link href="/patient/dashboard" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span className="text-[10px] font-semibold text-primary">Dashboard</span>
        </Link>
        <Link href="/patient/health-metrics" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Metrics</span>
        </Link>
        <Link href="/patient/appointments" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span className="text-[10px] text-muted-foreground">Appointments</span>
        </Link>
        <Link href="/patient/medical-records" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span className="text-[10px] text-muted-foreground">Records</span>
        </Link>
      </nav>

    </div>
  )
}