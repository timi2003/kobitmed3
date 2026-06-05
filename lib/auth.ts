import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

// ====================== Password Utils ======================
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: any): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

// ====================== Auth Functions ======================

export async function signUpUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userType: 'patient' | 'doctor'
) {
  const client = await createClient();

  const passwordHash = await hashPassword(password);

  const insertData: any = { 
    email: email, 
    password_hash: passwordHash 
  };

  const { data: user, error: userError }: any = await client
    .from('users')
    .insert(insertData)
    .select()
    .single();

  if (userError || !user) {
    throw new Error(`Failed to create user: ${userError?.message || 'Unknown error'}`);
  }

  const profileData: any = {
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    user_type: userType,
  };

  const { error: profileError }: any = await client
    .from('user_profiles')
    .insert(profileData);

  if (profileError) {
    throw new Error(`Failed to create user profile: ${profileError.message}`);
  }

  return user;
}

// ======================

export async function signInUser(email: string, password: string) {
  const client = await createClient();

  const { data: user, error }: any = await client
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Invalid email or password');
  }

  const isValid = await verifyPassword(password, user?.password_hash);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  return user;
}

// ======================

export async function getUserProfile(userId: string) {
  const client = await createClient();

  const { data: profile, error }: any = await client
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !profile) {
    throw new Error(`Failed to get user profile: ${error?.message || 'Not found'}`);
  }

  return profile;
}

// ======================

export async function updateUserProfile(userId: string, updates: string ) {
  const client = await createClient();

  // === Strongest possible fix for update error ===
  const result = await client
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  const { data: profile, error } = result as any;

  if (error || !profile) {
    throw new Error(`Failed to update user profile: ${error?.message || 'Not found'}`);
  }

  return profile;
}

// ======================

export async function getUserById(userId: string) {
  const client = await createClient();

  const { data: user, error }: any = await client
    .from('users')
    .select('*, user_profiles(*)')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new Error(`Failed to get user: ${error?.message || 'Not found'}`);
  }

  return user;
}