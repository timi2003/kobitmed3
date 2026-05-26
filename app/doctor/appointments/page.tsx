'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, User, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Appointment {
  id: string
  patient_name: string
  patient_email: string
  date: string
  time: string
  duration: number
  status: string
  reason?: string
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id, date, time, duration, status, reason,
            patient:patients(full_name, email)
          `)
          .eq('doctor_id', user.id)
          .order('date')
          .order('time')

        if (error) throw error

        const formatted = data?.map((app: any) => ({
          id: app.id,
          patient_name: app.patient?.full_name || 'Unknown',
          patient_email: app.patient?.email || '',
          date: app.date,
          time: app.time,
          duration: app.duration,
          status: app.status,
          reason: app.reason,
        })) || []

        setAppointments(formatted)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading appointments...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-2">Manage your schedule</p>
          </div>
          <Button>Add New Slot</Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-6">Upcoming Appointments</h2>

        <div className="space-y-4">
          {appointments.map((appt) => (
            <Card key={appt.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-28">
                    <div className="font-semibold text-primary">{appt.time}</div>
                    <div className="text-sm text-muted-foreground">{appt.date}</div>
                    <div className="text-xs mt-1">{appt.duration} mins</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <p className="font-medium">{appt.patient_name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{appt.patient_email}</p>
                    {appt.reason && <p className="text-sm mt-2">Reason: {appt.reason}</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-1" /> Call
                    </Button>
                    <Button variant="outline" size="sm">Reschedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {appointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No upcoming appointments</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}