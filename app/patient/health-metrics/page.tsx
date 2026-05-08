'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link as LinkIcon } from 'lucide-react'

export default function HealthMetricsPage() {
  const [isFitbitConnected, setIsFitbitConnected] = useState(false)

  const handleConnectFitbit = () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID || '23VC24'
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const redirectUri = `${appUrl}/api/fitbit/callback`
      
      // Generate state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      
      // Store state in localStorage (survives redirect)
      localStorage.setItem('fitbit_oauth_state', state)
      
      console.log('[v0] Initiating Fitbit OAuth with:', {
        clientId,
        redirectUri,
        state: state.substring(0, 8) + '...',
      })

      // Standard OAuth 2.0 authorization code flow (no PKCE for web)
      // Fitbit OAuth: https://dev.fitbit.com/build/reference/web-api/oauth2-authorization/
      const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: 'activity heartrate sleep',
        state: state,
        expires_in: '604800', // 7 days
      })

      // Redirect to Fitbit OAuth
      window.location.href = `https://accounts.fitbit.com/oauth2/authorize?${params.toString()}`
    } catch (error) {
      console.error('[v0] Error initiating Fitbit OAuth:', error)
      alert('Failed to connect to Fitbit. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">Health Metrics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your health data from your Fitbit device
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Fitbit Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Fitbit Device Connection
            </CardTitle>
            <CardDescription>
              Connect your Fitbit smartwatch to sync health metrics automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isFitbitConnected ? (
              <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="font-medium text-foreground">Connected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Fitbit data is being synced automatically
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsFitbitConnected(false)}
                >
                  Disconnect Device
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <p className="font-medium text-foreground">Not Connected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect your Fitbit device to start syncing your health data
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleConnectFitbit}
                    className="flex-1"
                  >
                    Connect via OAuth
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.location.href = '/patient/connect-fitbit'}
                  >
                    Manual Connection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supported Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Health Metrics</CardTitle>
            <CardDescription>
              The following metrics will be synced from your Fitbit device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Heart Rate', description: 'Continuous heart rate monitoring' },
                { name: 'Steps', description: 'Daily step count and activity' },
                { name: 'Sleep Data', description: 'Sleep duration and quality' },
                { name: 'Calories', description: 'Calories burned and expenditure' },
                { name: 'Active Minutes', description: 'Time spent in active exercise' },
                { name: 'Distance', description: 'Distance traveled daily' },
              ].map((metric) => (
                <div key={metric.name} className="p-3 border border-border rounded-lg">
                  <p className="font-medium text-foreground">{metric.name}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Features</CardTitle>
            <CardDescription>
              More ways to track your health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">Manual Health Entry</p>
                <p className="text-sm text-muted-foreground">Add health metrics manually</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">Health Trends</p>
                <p className="text-sm text-muted-foreground">View detailed charts and trends</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">Export Reports</p>
                <p className="text-sm text-muted-foreground">Generate health reports for doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
