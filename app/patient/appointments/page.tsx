'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Plus, Heart, TrendingUp, FileText } from 'lucide-react'
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

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
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

  useEffect(() => { fetchAppointments() }, [])

  const handleBookAppointment = () => { router.push('/patient/book-appointment') }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 pb-20 md:pb-0">

      {/* ── DESKTOP HEADER (hidden on mobile) ── */}
      <div className="hidden md:block bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage your healthcare appointments</p>
          </div>
          <Button onClick={handleBookAppointment} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Book New Appointment
          </Button>
        </div>
      </div>

      {/* ── MOBILE HEADER (hidden on desktop) ── */}
      <div className="md:hidden bg-primary px-4 pt-12 pb-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Appointments</h1>
            <p className="text-white/50 text-xs mt-0.5">Manage your healthcare appointments</p>
          </div>
          <button
            onClick={handleBookAppointment}
            className="bg-white text-primary font-semibold text-xs rounded-xl px-3 py-2 flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Book
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">

        {/* Section heading */}
        <h2 className="text-lg md:text-2xl font-semibold mb-4 md:mb-6">Upcoming Appointments</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Loading appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {appointments.map((appt) => (
              <Card key={appt.id} className="overflow-hidden">
                <CardContent className="p-0 md:pt-6 md:px-6 md:pb-6">

                  {/* ── MOBILE appointment row ── */}
                  <div className="md:hidden">
                    <div className="flex items-start gap-3 p-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[14px] text-foreground leading-tight">{appt.doctor_name}</p>
                        <p className="text-muted-foreground text-[12px] mt-0.5">{appt.specialty}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11.5px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(appt.appointment_date), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appt.appointment_time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 px-4 pb-4 border-t border-border pt-3">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-8">Reschedule</Button>
                      <Button variant="destructive" size="sm" className="flex-1 text-xs h-8">Cancel</Button>
                    </div>
                  </div>

                  {/* ── DESKTOP appointment row ── */}
                  <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button variant="destructive" size="sm">Cancel</Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 md:py-16 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-6">You have no upcoming appointments</p>
              <Button onClick={handleBookAppointment} className="text-sm">
                Book Your First Appointment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── HOW IT WORKS ── */}
        <Card className="mt-6 md:mt-8">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-base md:text-lg">How Appointments Work</CardTitle>
            <CardDescription className="text-xs md:text-sm">Simple steps to book with trusted doctors</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile: horizontal steps */}
            <div className="md:hidden grid grid-cols-2 gap-2">
              {[
                { n: '1', t: 'Click "Book New Appointment"' },
                { n: '2', t: 'Choose a doctor and specialty' },
                { n: '3', t: 'Select available date and time' },
                { n: '4', t: 'Confirm your booking' },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-2.5 p-3 bg-primary/5 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.n}
                  </div>
                  <p className="text-[11.5px] text-muted-foreground leading-snug">{step.t}</p>
                </div>
              ))}
            </div>
            {/* Desktop: numbered list */}
            <ol className="hidden md:block list-decimal pl-5 space-y-3 text-muted-foreground">
              <li>Click "Book New Appointment"</li>
              <li>Choose a doctor and specialty</li>
              <li>Select available date and time</li>
              <li>Confirm your booking</li>
            </ol>
          </CardContent>
        </Card>

        {/* Mobile: Book CTA floating-style */}
        <div className="md:hidden mt-4">
          <button
            onClick={handleBookAppointment}
            className="w-full bg-primary text-primary-foreground font-semibold text-sm rounded-2xl py-3.5 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Book New Appointment
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex z-50">
        <Link href="/patient/dashboard" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span className="text-[10px] text-muted-foreground">Dashboard</span>
        </Link>
        <Link href="/patient/health-metrics" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Metrics</span>
        </Link>
        <Link href="/patient/appointments" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-[10px] font-semibold text-primary">Appointments</span>
        </Link>
        <Link href="/patient/medical-records" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Records</span>
        </Link>
      </nav>
    </div>
  )
}