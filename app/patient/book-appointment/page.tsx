'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react'
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

  // Fetch available doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, specialization')
        .eq('user_type', 'doctor')

      if (error) {
        console.error('Error fetching doctors:', error)
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
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in first')
        return
      }

      const selectedDoctor = doctors.find(d => d.id === formData.doctor_id)

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          doctor_id: formData.doctor_id,
          doctor_name: selectedDoctor?.full_name || '',
          specialization: selectedDoctor?.specialization || '',
          appointment_date: format(formData.appointment_date, 'yyyy-MM-dd'),
          appointment_time: formData.appointment_time,
          reason: formData.reason,
          status: 'scheduled',
        })

      if (error) throw error

      toast.success('Appointment booked successfully!')
      
      // Redirect to appointments page
      setTimeout(() => {
        router.push('/patient/appointments')
      }, 1500)

    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to book appointment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Book Appointment</CardTitle>
            <CardDescription>
              Schedule a consultation with a qualified doctor
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Selection */}
              <div className="space-y-2">
                <Label>Select Doctor</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label>Appointment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
              <div className="space-y-2">
                <Label>Appointment Time</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, appointment_time: value })}>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label>Reason for Visit</Label>
                <Textarea
                  placeholder="Briefly describe your symptoms or reason for consultation..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Booking Appointment...' : 'Confirm Appointment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}