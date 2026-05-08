import { NextRequest, NextResponse } from 'next/server'
import { signInUser, getUserProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await signInUser(email, password)
    const profile = await getUserProfile(user.id)

    // In a production app, you'd create a session here
    // For now, we're returning the user info for client-side storage
    
    return NextResponse.json(
      {
        user,
        userType: profile.user_type,
        profile,
        message: 'Login successful',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    )
  }
}
