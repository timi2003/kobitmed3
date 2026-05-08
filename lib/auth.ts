import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signUpUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userType: 'patient' | 'doctor'
) {
  const client = await createClient()
  
  // Hash the password
  const passwordHash = await hashPassword(password)
  
  // Create user
  const { data: user, error: userError } = await client
    .from('users')
    .insert({
      email,
      password_hash: passwordHash,
    })
    .select()
    .single()

  if (userError) {
    throw new Error(`Failed to create user: ${userError.message}`)
  }

  // Create user profile
  const { error: profileError } = await client
    .from('user_profiles')
    .insert({
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
    })

  if (profileError) {
    throw new Error(`Failed to create user profile: ${profileError.message}`)
  }

  return user
}

export async function signInUser(email: string, password: string) {
  const client = await createClient()
  
  // Get user by email
  const { data: user, error: userError } = await client
    .from('users')
    .select()
    .eq('email', email)
    .single()

  if (userError || !user) {
    throw new Error('Invalid email or password')
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash)
  if (!isValidPassword) {
    throw new Error('Invalid email or password')
  }

  return user
}

export async function getUserProfile(userId: string) {
  const client = await createClient()
  
  const { data: profile, error } = await client
    .from('user_profiles')
    .select()
    .eq('user_id', userId)
    .single()

  if (error) {
    throw new Error(`Failed to get user profile: ${error.message}`)
  }

  return profile
}

export async function updateUserProfile(userId: string, updates: Partial<Database['public']['Tables']['user_profiles']['Insert']>) {
  const client = await createClient()
  
  const { data: profile, error } = await client
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`)
  }

  return profile
}

export async function getUserById(userId: string) {
  const client = await createClient()
  
  const { data: user, error } = await client
    .from('users')
    .select('*, user_profiles(*)')
    .eq('id', userId)
    .single()

  if (error) {
    throw new Error(`Failed to get user: ${error.message}`)
  }

  return user
}
