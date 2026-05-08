'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User } from 'lucide-react'

export default function AppointmentsPage() {
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'General Practitioner',
      date: '2026-05-10',
      time: '14:00',
      status: 'scheduled',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      date: '2026-05-15',
      time: '10:30',
      status: 'scheduled',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-2">
              Schedule and manage your healthcare appointments
            </p>
          </div>
          <Button>Book New Appointment</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Appointments</h2>
          </div>

          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <p className="font-semibold text-foreground">{appointment.doctor}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Appointments */}
        {appointments.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground mb-4">No upcoming appointments</p>
              <Button>Schedule Your First Appointment</Button>
            </CardContent>
          </Card>
        )}

        {/* How to Book */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Book an Appointment</CardTitle>
            <CardDescription>
              Follow these steps to schedule a consultation with a healthcare provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1</span>
                <span className="text-muted-foreground">Click &quot;Book New Appointment&quot;</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2</span>
                <span className="text-muted-foreground">Select a healthcare provider</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3</span>
                <span className="text-muted-foreground">Choose your preferred date and time</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4</span>
                <span className="text-muted-foreground">Confirm your appointment</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
