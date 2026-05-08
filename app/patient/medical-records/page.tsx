'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

export default function MedicalRecordsPage() {
  const records = [
    {
      id: 1,
      title: 'Annual Checkup Report',
      type: 'diagnosis',
      date: '2026-04-15',
      doctor: 'Dr. Sarah Johnson',
    },
    {
      id: 2,
      title: 'Prescription - Vitamins',
      type: 'prescription',
      date: '2026-04-10',
      doctor: 'Dr. Sarah Johnson',
    },
    {
      id: 3,
      title: 'Blood Test Results',
      type: 'lab_result',
      date: '2026-03-28',
      doctor: 'Lab Results',
    },
  ]

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'diagnosis':
        return 'Diagnosis'
      case 'prescription':
        return 'Prescription'
      case 'lab_result':
        return 'Lab Result'
      case 'note':
        return 'Note'
      default:
        return 'Document'
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
              View and manage your medical history
            </p>
          </div>
          <Button>Upload Record</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Medical Records List */}
        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">{record.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getRecordIcon(record.type)} • {record.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Added by: {record.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Document Organization */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Organize Your Records</CardTitle>
            <CardDescription>
              Filter your medical records by type and date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['All', 'Diagnosis', 'Prescription', 'Lab Results'].map((filter) => (
                  <Button
                    key={filter}
                    variant={filter === 'All' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Info */}
        <Card className="mt-8 bg-accent/5 border-accent/30">
          <CardHeader>
            <CardTitle className="text-base">Your Privacy is Protected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All your medical records are encrypted and only accessible to you and your healthcare providers. Your data is protected by HIPAA regulations and industry-standard security practices.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
