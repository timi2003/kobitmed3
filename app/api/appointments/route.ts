import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'   // ← Adjust path if needed

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const userType = request.nextUrl.searchParams.get('userType')

    if (!userId || !userType) {
      return NextResponse.json(
        { error: 'Missing userId or userType' },
        { status: 400 }
      )
    }

    const client = await createClient()

    let query = client.from('appointments').select('*')

    if (userType === 'patient') {
      query = query.eq('patient_id', userId)
    } else if (userType === 'doctor') {
      query = query.eq('doctor_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      )
    }

    return NextResponse.json({ appointments: data })
  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      durationMinutes,
      reason,
    } = body

    if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await createClient()

    const { data, error } = await client
      .from('appointments')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        duration_minutes: durationMinutes || 30,
        reason,
        status: 'scheduled',
      } satisfies Database['public']['Tables']['appointments']['Insert'])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { appointment: data, message: 'Appointment created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}