import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const userType = request.nextUrl.searchParams.get('userType')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    const client = await createClient()

    let query = client.from('medical_records').select('*')

    if (userType === 'patient') {
      query = query.eq('patient_id', userId)
    } else if (userType === 'doctor') {
      query = query.eq('doctor_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch medical records' },
        { status: 500 }
      )
    }

    return NextResponse.json({ records: data })
  } catch (error) {
    console.error('Get medical records error:', error)
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
      title,
      description,
      recordType,
      recordDate,
      fileUrl,
    } = body

    if (!patientId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await createClient()

    const { data, error } = await client
      .from('medical_records')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId || null,
        title,
        description,
        record_type: recordType || 'note',
        record_date: recordDate || new Date().toISOString().split('T')[0],
        file_url: fileUrl || null,
      } as any)           // ← Fixed the type error
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create medical record' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { record: data, message: 'Medical record created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create medical record error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}