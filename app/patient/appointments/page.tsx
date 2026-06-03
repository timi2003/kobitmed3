'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

interface Appointment {
  id: string
  doctor_name: string
  specialty: string
  appointment_date: string
  appointment_time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  reason?: string
}

export default function AppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Fetch real appointments
  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (err) {
      console.error('Error fetching appointments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Navigate to booking page
  const handleBookAppointment = () => {
    router.push('/patient/book-appointment')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Manage your healthcare appointments
            </p>
          </div>
          
          {/* Updated Button - Now navigates to booking page */}
          <Button onClick={handleBookAppointment} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Book New Appointment
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <Card key={appt.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{appt.doctor_name}</p>
                          <p className="text-muted-foreground">{appt.specialty}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(appt.appointment_date), 'MMMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {appt.appointment_time}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="destructive" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground mb-6">You have no upcoming appointments</p>
                <Button onClick={handleBookAppointment}>
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How Appointments Work</CardTitle>
            <CardDescription>Simple steps to book with trusted doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-3 text-muted-foreground">
              <li>Click "Book New Appointment"</li>
              <li>Choose a doctor and specialty</li>
              <li>Select available date and time</li>
              <li>Confirm your booking</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}