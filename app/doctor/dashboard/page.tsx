'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, TrendingUp, Clock } from 'lucide-react'

interface PatientStats {
  totalPatients: number
  appointmentsToday: number
  pendingReviews: number
  activeAlerts: number
}

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState('Doctor')
  const [stats, setStats] = useState<PatientStats>({
    totalPatients: 0,
    appointmentsToday: 0,
    pendingReviews: 0,
    activeAlerts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load doctor data from localStorage
    const userId = localStorage.getItem('userId')
    if (!userId) return

    // Simulate loading statistics
    setStats({
      totalPatients: 24,
      appointmentsToday: 5,
      pendingReviews: 3,
      activeAlerts: 2,
    })

    setDoctorName('Dr. Johnson')
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {doctorName}!
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s an overview of your practice today
              </p>
            </div>
            <Link href="/doctor/appointments">
              <Button>Schedule Appointment</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active patient list
              </p>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Scheduled for today
              </p>
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Medical records to review
              </p>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Clock className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Patient health alerts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>View Patient List</CardTitle>
              <CardDescription>
                Manage your patients and view their health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/doctor/patients">
                <Button className="w-full">View Patients</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Appointments</CardTitle>
              <CardDescription>
                Schedule and manage patient appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/doctor/appointments">
                <Button className="w-full" variant="outline">
                  View Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Health Alerts</CardTitle>
            <CardDescription>
              Recent alerts from your patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.activeAlerts > 0 ? (
                <>
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground">
                      High Heart Rate Alert - John Smith
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Patient&apos;s heart rate exceeded 120 bpm at 2:30 PM today
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground">
                      Unusual Activity Pattern - Jane Doe
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Patient&apos;s activity level is significantly below average
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">
                    No Active Alerts
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All your patients are doing well!
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
