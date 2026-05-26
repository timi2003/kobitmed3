'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, TrendingUp, Clock, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  totalPatients: number
  appointmentsToday: number
  pendingReviews: number
  activeAlerts: number
}

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState('Doctor')
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    appointmentsToday: 0,
    pendingReviews: 0,
    activeAlerts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // Set Doctor Name
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0]
        setDoctorName(fullName ? `Dr. ${fullName}` : 'Doctor')

        const today = new Date().toISOString().split('T')[0]

        // Fetch Real Data
        const [patientsRes, appointmentsRes, alertsRes] = await Promise.all([
          supabase.from('patients').select('id', { count: 'exact' }).eq('doctor_id', user.id),
          
          supabase.from('appointments')
            .select('id', { count: 'exact' })
            .eq('doctor_id', user.id)
            .eq('date', today)
            .eq('status', 'scheduled'),

          supabase.from('health_alerts')
            .select('id', { count: 'exact' })
            .eq('doctor_id', user.id)
            .eq('is_resolved', false)
        ])

        setStats({
          totalPatients: patientsRes.count || 0,
          appointmentsToday: appointmentsRes.count || 0,
          pendingReviews: 0, // You can expand this later
          activeAlerts: alertsRes.count || 0,
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
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
              <p className="text-muted-foreground">Here's your practice overview today</p>
            </div>
            <Button asChild>
              <Link href="/doctor/appointments">New Appointment</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Today’s Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.appointmentsToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.activeAlerts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingReviews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Patients</CardTitle>
              <CardDescription>Manage and monitor your patients</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/doctor/patients">View All Patients</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Schedule and manage consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/doctor/appointments">Manage Schedule</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}