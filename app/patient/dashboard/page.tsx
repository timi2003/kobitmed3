'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Activity, Zap, Clock, TrendingUp } from 'lucide-react'

interface HealthSummary {
  todaySteps: number
  avgHeartRate: number
  sleepHours: number
  caloriesBurned: number
}

export default function PatientDashboard() {
  const [userName, setUserName] = useState('Patient')
  const [healthData, setHealthData] = useState<HealthSummary>({
    todaySteps: 0,
    avgHeartRate: 0,
    sleepHours: 0,
    caloriesBurned: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user data from localStorage
    const userId = localStorage.getItem('userId')
    if (!userId) return

    // Simulate loading health data
    setHealthData({
      todaySteps: 7420,
      avgHeartRate: 72,
      sleepHours: 7.5,
      caloriesBurned: 2240,
    })

    setUserName('John')
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  const getStepStatus = (steps: number) => {
    if (steps >= 10000) return 'Goal Achieved! 🎉'
    return `${Math.round((steps / 10000) * 100)}% to daily goal`
  }

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
              <p className="text-muted-foreground">
                Here&apos;s your health summary for today
              </p>
            </div>
            <Link href="/patient/health-metrics">
              <Button>View All Metrics</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Health Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Steps Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Steps Today</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.todaySteps.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {getStepStatus(healthData.todaySteps)}
              </p>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.min((healthData.todaySteps / 10000) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Heart Rate Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.avgHeartRate}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthData.avgHeartRate > 100 ? 'High' : 'Normal'} bpm
              </p>
            </CardContent>
          </Card>

          {/* Sleep Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sleep Duration</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.sleepHours}h</div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthData.sleepHours >= 7 ? 'Healthy' : 'Below target'}
              </p>
            </CardContent>
          </Card>

          {/* Calories Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.caloriesBurned}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Daily expenditure
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>
                Schedule a consultation with a healthcare provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patient/appointments">
                <Button className="w-full">Book Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sync Fitbit</CardTitle>
              <CardDescription>
                Connect your Fitbit device to sync health data automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patient/health-metrics">
                <Button className="w-full" variant="outline">
                  Connect Device
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>
                View and manage your medical history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patient/medical-records">
                <Button className="w-full" variant="outline">
                  Access Records
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Health Alerts
            </CardTitle>
            <CardDescription>
              Important health notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData.avgHeartRate > 100 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    Elevated Heart Rate
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your average heart rate is higher than usual. Consider relaxing and hydrating.
                  </p>
                </div>
              )}
              {healthData.todaySteps < 5000 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    Activity Reminder
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You&apos;re still below today&apos;s step goal. Take a walk to reach your target!
                  </p>
                </div>
              )}
              {healthData.sleepHours < 7 && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    Sleep Alert
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You&apos;re getting less sleep than recommended. Aim for 7-9 hours.
                  </p>
                </div>
              )}
              {healthData.avgHeartRate <= 100 && healthData.todaySteps >= 5000 && healthData.sleepHours >= 7 && (
                <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    All Good!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your health metrics are looking great today!
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
