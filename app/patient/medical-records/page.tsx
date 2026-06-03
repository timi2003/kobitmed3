'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Upload, Calendar } from 'lucide-react'
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

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'All' | 'Diagnosis' | 'Prescription' | 'Lab Results'>('All')

  const supabase = createClient()

  const fetchRecords = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in to view records')
        return
      }

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

  useEffect(() => {
    fetchRecords()
  }, [])

  const filteredRecords = records.filter(record => {
    if (filter === 'All') return true
    if (filter === 'Diagnosis') return record.type === 'diagnosis'
    if (filter === 'Prescription') return record.type === 'prescription'
    if (filter === 'Lab Results') return record.type === 'lab_result'
    return true
  })

  const handleDownload = (fileUrl?: string, title?: string) => {
    if (!fileUrl) {
      toast.error('No file attached to this record')
      return
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Medical Records</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your complete medical history
            </p>
          </div>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Record
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Diagnosis', 'Prescription', 'Lab Results'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f as any)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Records List */}
        {isLoading ? (
          <p className="text-center py-12">Loading medical records...</p>
        ) : filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">{record.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getTypeLabel(record.type)} • {format(new Date(record.record_date), 'MMMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Doctor: {record.doctor_name}
                        </p>
                        {record.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {record.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDownload(record.file_url, record.title)}
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
            <CardContent className="py-16 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No medical records found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Records will appear here once your doctors upload them or you upload manually.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Privacy Note */}
        <Card className="mt-8 bg-accent/5 border-accent/30">
          <CardHeader>
            <CardTitle className="text-base">🔒 Your Data is Secure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All your medical records are encrypted and stored securely. Only you and authorized healthcare providers can access them.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}