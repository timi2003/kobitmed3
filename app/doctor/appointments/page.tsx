'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Phone } from 'lucide-react'

export default function DoctorAppointmentsPage() {
  const appointments = [
    {
      id: 1,
      patientName: 'John Smith',
      patientEmail: 'john@example.com',
      date: '2026-05-10',
      time: '14:00',
      duration: 30,
      status: 'scheduled',
      reason: 'Regular checkup',
    },
    {
      id: 2,
      patientName: 'Jane Doe',
      patientEmail: 'jane@example.com',
      date: '2026-05-10',
      time: '15:00',
      duration: 30,
      status: 'scheduled',
      reason: 'Follow-up consultation',
    },
    {
      id: 3,
      patientName: 'Michael Brown',
      patientEmail: 'michael@example.com',
      date: '2026-05-11',
      time: '10:30',
      duration: 30,
      status: 'scheduled',
      reason: 'Heart rate monitoring',
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
              Manage your patient consultation schedule
            </p>
          </div>
          <Button>Add Appointment Slot</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar View (simplified) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Time Block */}
                    <div className="md:w-24 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {appointment.duration} min
                      </p>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-primary" />
                        <p className="font-semibold text-foreground">{appointment.patientName}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{appointment.patientEmail}</p>
                      <p className="text-sm text-muted-foreground">
                        Reason: {appointment.reason}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Appointments</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {appointments.slice(1).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{appointment.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
