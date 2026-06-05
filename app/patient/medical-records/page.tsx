'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Upload, Calendar, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface MedicalRecord {
  id: string
  title: string
  type: 'diagnosis' | 'prescription' | 'lab_result' | 'note' | 'other'
  record_date: string
  doctor_name: string
  description?: string
  file_url?: string
  created_at: string
}

const TYPE_COLORS: Record<string, string> = {
  diagnosis: 'bg-red-50 text-red-700 border-red-200',
  prescription: 'bg-blue-50 text-blue-700 border-blue-200',
  lab_result: 'bg-green-50 text-green-700 border-green-200',
  note: 'bg-amber-50 text-amber-700 border-amber-200',
  other: 'bg-gray-50 text-gray-600 border-gray-200',
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'All' | 'Diagnosis' | 'Prescription' | 'Lab Results'>('All')

  const supabase = createClient()

  const fetchRecords = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Please log in to view records'); return }
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', user.id)
        .order('record_date', { ascending: false })
      if (error) throw error
      setRecords(data || [])
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to load medical records')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchRecords() }, [])

  const filteredRecords = records.filter(record => {
    if (filter === 'All') return true
    if (filter === 'Diagnosis') return record.type === 'diagnosis'
    if (filter === 'Prescription') return record.type === 'prescription'
    if (filter === 'Lab Results') return record.type === 'lab_result'
    return true
  })

  const handleDownload = (fileUrl?: string) => {
    if (!fileUrl) { toast.error('No file attached to this record'); return }
    window.open(fileUrl, '_blank')
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'diagnosis': return 'Diagnosis'
      case 'prescription': return 'Prescription'
      case 'lab_result': return 'Lab Result'
      case 'note': return 'Doctor Note'
      default: return 'Record'
    }
  }

  const FILTERS = ['All', 'Diagnosis', 'Prescription', 'Lab Results'] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 pb-20 md:pb-0">

      {/* ── DESKTOP HEADER (hidden on mobile) ── */}
      <div className="hidden md:block bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Medical Records</h1>
            <p className="text-muted-foreground mt-2">View and manage your complete medical history</p>
          </div>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Record
          </Button>
        </div>
      </div>

      {/* ── MOBILE HEADER (hidden on desktop) ── */}
      <div className="md:hidden bg-primary px-4 pt-12 pb-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Medical Records</h1>
            <p className="text-white/50 text-xs mt-0.5">Your complete medical history</p>
          </div>
          <button className="bg-white text-primary font-semibold text-xs rounded-xl px-3 py-2 flex items-center gap-1.5 flex-shrink-0">
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">

        {/* ── FILTER TABS ── */}
        {/* Mobile: scrollable pill tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold border transition-all ${
                filter === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {/* Desktop: button group */}
        <div className="hidden md:flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* ── RECORDS LIST ── */}
        {isLoading ? (
          <p className="text-center py-12 text-sm text-muted-foreground">Loading medical records...</p>
        ) : filteredRecords.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="overflow-hidden">
                <CardContent className="p-0 md:pt-6 md:px-6 md:pb-6">

                  {/* ── MOBILE record row ── */}
                  <div className="md:hidden p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[13.5px] text-foreground leading-tight truncate">{record.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[record.type] || TYPE_COLORS.other}`}>
                              {getTypeLabel(record.type)}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(record.record_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-muted-foreground mt-1">Dr. {record.doctor_name}</p>
                          {record.description && (
                            <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{record.description}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(record.file_url)}
                        className="bg-primary/10 text-primary rounded-xl p-2 flex-shrink-0 mt-0.5"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* ── DESKTOP record row ── */}
                  <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">{record.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getTypeLabel(record.type)} • {format(new Date(record.record_date), 'MMMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground">Doctor: {record.doctor_name}</p>
                        {record.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{record.description}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDownload(record.file_url)}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 md:py-16 text-center">
              <FileText className="w-10 h-10 md:w-12 md:h-12 mx-auto text-muted-foreground mb-3 md:mb-4" />
              <p className="text-muted-foreground text-sm">No medical records found</p>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
                Records will appear here once your doctors upload them or you upload manually.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── PRIVACY NOTE ── */}
        <Card className="mt-6 md:mt-8 bg-accent/5 border-accent/30">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base">🔒 Your Data is Secure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-muted-foreground">
              All your medical records are encrypted and stored securely. Only you and authorized healthcare providers can access them.
            </p>
          </CardContent>
        </Card>
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
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Appointments</span>
        </Link>
        <Link href="/patient/medical-records" className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-[10px] font-semibold text-primary">Records</span>
        </Link>
      </nav>
    </div>
  )
}