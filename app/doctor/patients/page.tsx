'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Heart, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const patients = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      joinDate: '2026-01-15',
      lastVisit: '2026-04-20',
      status: 'active',
      alerts: 1,
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      joinDate: '2026-02-10',
      lastVisit: '2026-04-18',
      status: 'active',
      alerts: 0,
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      joinDate: '2026-03-05',
      lastVisit: '2026-04-15',
      status: 'active',
      alerts: 2,
    },
  ]

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">My Patients</h1>
          <p className="text-muted-foreground mt-2">
            Manage your patient list and view their health data
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg border border-border">
          <Input
            placeholder="Search patients by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Patients List */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <p className="font-semibold text-foreground">{patient.name}</p>
                      {patient.alerts > 0 && (
                        <span className="ml-auto md:ml-2 px-2 py-1 bg-red-500/10 text-red-700 text-xs rounded">
                          {patient.alerts} alert{patient.alerts > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      <span>Joined: {patient.joinDate}</span>
                      <span>Last visit: {patient.lastVisit}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Health Data
                    </Button>
                    <Button size="sm">Message</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No patients found</p>
            </CardContent>
          </Card>
        )}

        {/* Patient Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{patients.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{patients.filter(p => p.status === 'active').length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{patients.reduce((sum, p) => sum + p.alerts, 0)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
