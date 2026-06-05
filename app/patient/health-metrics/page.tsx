'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link as LinkIcon, Calendar, FileText, Heart } from 'lucide-react'

export default function HealthMetricsPage() {
  const [isFitbitConnected, setIsFitbitConnected] = useState(false)

  const handleConnectFitbit = () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID || '23VC24'
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const redirectUri = `${appUrl}/api/fitbit/callback`
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('fitbit_oauth_state', state)
      console.log('[v0] Initiating Fitbit OAuth with:', { clientId, redirectUri, state: state.substring(0, 8) + '...' })
      const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: 'activity heartrate sleep',
        state: state,
        expires_in: '604800',
      })
      window.location.href = `https://accounts.fitbit.com/oauth2/authorize?${params.toString()}`
    } catch (error) {
      console.error('[v0] Error initiating Fitbit OAuth:', error)
      alert('Failed to connect to Fitbit. Please try again.')
    }
  }

  const METRICS = [
    { name: 'Heart Rate', description: 'Continuous heart rate monitoring' },
    { name: 'Steps', description: 'Daily step count and activity' },
    { name: 'Sleep Data', description: 'Sleep duration and quality' },
    { name: 'Calories', description: 'Calories burned and expenditure' },
    { name: 'Active Minutes', description: 'Time spent in active exercise' },
    { name: 'Distance', description: 'Distance traveled daily' },
  ]

  const FEATURES = [
    { name: 'Manual Health Entry', desc: 'Add health metrics manually' },
    { name: 'Health Trends', desc: 'View detailed charts and trends' },
    { name: 'Export Reports', desc: 'Generate health reports for doctors' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 pb-20 md:pb-0">

      {/* ── DESKTOP HEADER (hidden on mobile) ── */}
      <div className="hidden md:block bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">Health Metrics</h1>
          <p className="text-muted-foreground mt-2">Monitor your health data from your Fitbit device</p>
        </div>
      </div>

      {/* ── MOBILE HEADER (hidden on desktop) ── */}
      <div className="md:hidden bg-primary px-4 pt-12 pb-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <h1 className="text-xl font-bold text-white">Health Metrics</h1>
        <p className="text-white/50 text-xs mt-0.5">Monitor your Fitbit health data</p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">

        {/* ── FITBIT CONNECTION ── */}
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <LinkIcon className="w-4 h-4 md:w-5 md:h-5" />
              Fitbit Device Connection
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Connect your Fitbit smartwatch to sync health metrics automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {isFitbitConnected ? (
              <div className="p-3 md:p-4 bg-accent/10 border border-accent/30 rounded-xl md:rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="font-semibold text-sm text-foreground">Connected</p>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Your Fitbit data is being synced automatically
                </p>
                <Button
                  variant="outline"
                  className="mt-3 h-9 text-sm"
                  onClick={() => setIsFitbitConnected(false)}
                >
                  Disconnect Device
                </Button>
              </div>
            ) : (
              <div className="p-3 md:p-4 bg-muted rounded-xl md:rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" />
                  <p className="font-semibold text-sm text-foreground">Not Connected</p>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Connect your Fitbit device to start syncing your health data
                </p>
                {/* Mobile: stacked full-width buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleConnectFitbit} className="flex-1 h-10 text-sm">
                    Connect via OAuth
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 text-sm"
                    onClick={() => window.location.href = '/patient/connect-fitbit'}
                  >
                    Manual Connection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── SUPPORTED METRICS ── */}
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">Supported Health Metrics</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              The following metrics will be synced from your Fitbit device
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile: 2-col compact grid */}
            <div className="grid grid-cols-2 gap-2 md:hidden">
              {METRICS.map((metric) => (
                <div key={metric.name} className="p-3 bg-primary/5 rounded-xl border border-border">
                  <p className="font-semibold text-[12.5px] text-foreground">{metric.name}</p>
                  <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-snug">{metric.description}</p>
                </div>
              ))}
            </div>
            {/* Desktop: 2-col standard grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              {METRICS.map((metric) => (
                <div key={metric.name} className="p-3 border border-border rounded-lg">
                  <p className="font-medium text-foreground">{metric.name}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── ADDITIONAL FEATURES ── */}
        <Card>
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">Additional Features</CardTitle>
            <CardDescription className="text-xs md:text-sm">More ways to track your health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {FEATURES.map((feat) => (
                <div key={feat.name} className="p-3 bg-muted rounded-xl md:rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[13px] md:font-medium md:text-base text-foreground">{feat.name}</p>
                    <p className="text-[11.5px] md:text-sm text-muted-foreground mt-0.5">{feat.desc}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground bg-background border border-border rounded-lg px-2 py-1 flex-shrink-0">
                    Soon
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex z-50">
        <Link href="/patient/dashboard" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span className="text-[10px] text-muted-foreground">Dashboard</span>
        </Link>
        <Link href="/patient/health-metrics" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <Heart className="h-5 w-5 text-primary" />
          <span className="text-[10px] font-semibold text-primary">Metrics</span>
        </Link>
        <Link href="/patient/appointments" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Appointments</span>
        </Link>
        <Link href="/patient/medical-records" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Records</span>
        </Link>
      </nav>
    </div>
  )
}