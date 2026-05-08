'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManualFitbitConnection() {
  const [accessToken, setAccessToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/fitbit/store-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      })

      if (!response.ok) {
        throw new Error('Failed to store token')
      }

      setSuccess(true)
      setAccessToken('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect Fitbit Manually</CardTitle>
          <CardDescription>Temporary workaround due to Fitbit OAuth issues</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-accent/10 text-accent-foreground text-sm rounded-md">
                Fitbit token stored successfully!
              </div>
            )}

            <div className="space-y-2 text-sm">
              <p className="font-medium">How to get your Fitbit access token:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Go to <a href="https://dev.fitbit.com/app-manage" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Fitbit Developer App</a></li>
                <li>Log in with your Fitbit account</li>
                <li>Copy your <strong>Access Token</strong></li>
                <li>Paste it below</li>
              </ol>
            </div>

            <div className="space-y-1">
              <label htmlFor="token" className="text-sm font-medium">
                Access Token
              </label>
              <Input
                id="token"
                type="password"
                placeholder="Paste your Fitbit access token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Storing...' : 'Connect Fitbit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}