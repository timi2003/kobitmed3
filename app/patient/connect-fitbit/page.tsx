'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'

export default function GoogleHealthConnection() {
  const [accessToken, setAccessToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  // ===================== ROBUST AUTH CHECK =====================
  const checkAuth = async () => {
    setError('')
    try {
      const supabase = await import('@/lib/supabase/client').then((m) => m.createClient())

      const { data: { session } } = await supabase.auth.getSession()
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      if (session && currentUser?.id) {
        setUser(currentUser)
        setIsLoading(false)
        return true
      }

      // Redirect to login
      const currentPath = '/patient/connect-fitbit'
      router.push(`/auth/login?redirectTo=${encodeURIComponent(currentPath)}`)
      return false

    } catch (err: any) {
      console.error('Auth check failed:', err)
      setError('Failed to verify session')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Re-check when returning from login
  useEffect(() => {
    if (searchParams.get('refreshed') === 'true') {
      setIsLoading(true)
      setTimeout(checkAuth, 600)
    }
  }, [searchParams])

  // ===================== GOOGLE OAUTH =====================
  const startOAuthFlow = async () => {
    if (!user?.id) {
      setError('Session not found. Please refresh the page.')
      return
    }

    try {
      setIsConnecting(true)
      setError('')

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_HEALTH_CLIENT_ID
      if (!clientId) {
        alert('Google Health Client ID is missing. Check .env.local')
        return
      }

      const redirectUri = `${window.location.origin}/api/fitbit/callback`
      const state = user.id

      const scopes = [
        'https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly',
        'https://www.googleapis.com/auth/googlehealth.sleep.readonly',
        'https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly',
        'https://www.googleapis.com/auth/googlehealth.profile.readonly',
      ].join(' ')

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${encodeURIComponent(state)}`

      window.location.href = authUrl
    } catch (err: any) {
      setError('Failed to start Google connection')
    } finally {
      setIsConnecting(false)
    }
  }

  // ===================== MANUAL TOKEN =====================
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken.trim() || !user?.id) {
      setError("Please log in first")
      return
    }

    setIsConnecting(true)
    setError('')

    try {
      const res = await fetch('/api/fitbit/store-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: accessToken.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to store token')

      setSuccess(true)
      setAccessToken('')

      setTimeout(() => router.push('/patient/health-metrics?success=google_health_connected'), 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to store token')
    } finally {
      setIsConnecting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Verifying your session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect Google Health</CardTitle>
          <CardDescription>Sync your Fitbit / Google Health data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
              ✅ Token stored successfully!
            </div>
          )}

          <Button
            onClick={startOAuthFlow}
            className="w-full"
            size="lg"
            disabled={isConnecting || !user}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              'Connect with Google (Recommended)'
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Access Token (Manual)</label>
              <Input
                type="password"
                placeholder="Paste access token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                disabled={isConnecting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isConnecting || !accessToken.trim()}>
              {isConnecting ? 'Storing...' : 'Store Token Manually'}
            </Button>
          </form>

          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}