'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, User, Heart, FileText, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Doctor {
  id: string
  full_name: string
  specialization: string
}

export default function BookAppointmentPage() {
  const router = useRouter()
  const supabase = createClient()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: new Date(),
    appointment_time: '',
    reason: '',
  })

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, specialization')
        .eq('user_type', 'doctor')
      if (error) { 
        console.error('Error fetching doctors:', error); 
        toast.error('Failed to load doctors') 
      } else { 
        setDoctors(data || []) 
      }
    }
    fetchDoctors()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.doctor_id || !formData.appointment_time || !formData.reason) {
      toast.error('Please fill all required fields'); 
      return
    }

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { 
        toast.error('Please log in first'); 
        return 
      }

      const selectedDoctor = doctors.find(d => d.id === formData.doctor_id)

      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: formData.doctor_id,
        doctor_name: selectedDoctor?.full_name || '',
        specialization: selectedDoctor?.specialization || '',
        appointment_date: format(formData.appointment_date, 'yyyy-MM-dd'),
        appointment_time: formData.appointment_time,
        reason: formData.reason,
        status: 'scheduled',
      } as any)        // ← Fixed the type error
      .select()
      .single()

      if (error) throw error

      toast.success('Appointment booked successfully!')
      setTimeout(() => { router.push('/patient/appointments') }, 1500)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to book appointment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 pb-20 md:pb-12">
      {/* ── MOBILE HEADER (hidden on desktop) ── */}
      <div className="md:hidden bg-primary px-4 pt-12 pb-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="bg-white/15 text-white rounded-xl p-2 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Book Appointment</h1>
            <p className="text-white/50 text-xs mt-0.5">Schedule with a qualified doctor</p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP WRAPPER ── */}
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-12">
        <Card className="border-0 shadow-none md:border md:shadow-sm">
          <CardHeader className="hidden md:block">
            <CardTitle className="text-3xl">Book Appointment</CardTitle>
            <CardDescription>Schedule a consultation with a qualified doctor</CardDescription>
          </CardHeader>

          <CardContent className="pt-4 md:pt-0 px-0 md:px-6 md:pb-6">
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Doctor Selection */}
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[13px] md:text-sm font-semibold">Select Doctor</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}>
                  <SelectTrigger className="h-11 md:h-10 rounded-xl md:rounded-md text-sm">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.full_name} — {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Picker */}
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[13px] md:text-sm font-semibold">Appointment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-11 md:h-10 rounded-xl md:rounded-md text-sm"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {format(formData.appointment_date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.appointment_date}
                      onSelect={(date) => date && setFormData({ ...formData, appointment_date: date })}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[13px] md:text-sm font-semibold">Appointment Time</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, appointment_time: value })}>
                  <SelectTrigger className="h-11 md:h-10 rounded-xl md:rounded-md text-sm">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = i + 8
                      return (
                        <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                          {hour}:00
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason */}
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[13px] md:text-sm font-semibold">Reason for Visit</Label>
                <Textarea
                  placeholder="Briefly describe your symptoms or reason for consultation..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                  className="rounded-xl md:rounded-md text-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 md:h-11 rounded-2xl md:rounded-md text-sm font-semibold"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Booking Appointment...' : 'Confirm Appointment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Nav */}
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
          <CalendarIcon className="h-5 w-5 text-primary" />
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