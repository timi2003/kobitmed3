-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('patient', 'doctor')),
  date_of_birth DATE,
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(10),
  medical_license VARCHAR(100),
  specialization VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fitbit_credentials table
CREATE TABLE IF NOT EXISTS fitbit_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  fitbit_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_data table
CREATE TABLE IF NOT EXISTS health_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  heart_rate INTEGER,
  steps INTEGER,
  calories_burned DECIMAL(8,2),
  distance DECIMAL(10,2),
  active_minutes INTEGER,
  sleep_duration DECIMAL(5,2),
  sleep_quality INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  oxygen_level DECIMAL(5,2),
  temperature DECIMAL(5,2),
  source VARCHAR(50) NOT NULL DEFAULT 'fitbit' CHECK (source IN ('fitbit', 'manual', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, source)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  record_type VARCHAR(50) NOT NULL DEFAULT 'note' CHECK (record_type IN ('diagnosis', 'prescription', 'lab_result', 'note', 'other')),
  record_date DATE NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_alerts table
CREATE TABLE IF NOT EXISTS health_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('high_heart_rate', 'low_heart_rate', 'high_blood_pressure', 'low_blood_pressure', 'unusual_activity', 'custom')),
  metric_value DECIMAL(10,2) NOT NULL,
  normal_range_min DECIMAL(10,2),
  normal_range_max DECIMAL(10,2),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctor_patient_relationships table
CREATE TABLE IF NOT EXISTS doctor_patient_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(doctor_id, patient_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX idx_fitbit_credentials_user_id ON fitbit_credentials(user_id);
CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_date ON health_data(date);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX idx_health_alerts_user_id ON health_alerts(user_id);
CREATE INDEX idx_doctor_patient_relationships_doctor_id ON doctor_patient_relationships(doctor_id);
CREATE INDEX idx_doctor_patient_relationships_patient_id ON doctor_patient_relationships(patient_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitbit_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_patient_relationships ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "users_own_access" ON users FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "profiles_own_access" ON user_profiles FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "fitbit_own_access" ON fitbit_credentials FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "health_data_own_access" ON health_data FOR ALL USING (auth.uid()::text = user_id::text);

-- Doctors can view patient health data for their patients
CREATE POLICY "doctor_view_patient_health" ON health_data FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM doctor_patient_relationships
    WHERE doctor_id = auth.uid()::uuid
    AND patient_id = health_data.user_id
    AND status = 'active'
  )
);

-- Appointments policies
CREATE POLICY "appointments_own_access" ON appointments FOR ALL USING (
  auth.uid()::text = patient_id::text OR auth.uid()::text = doctor_id::text
);

-- Medical records policies
CREATE POLICY "medical_records_own_access" ON medical_records FOR ALL USING (
  auth.uid()::text = patient_id::text OR auth.uid()::text = doctor_id::text
);

-- Health alerts policies
CREATE POLICY "health_alerts_own_access" ON health_alerts FOR ALL USING (auth.uid()::text = user_id::text);

-- Doctor patient relationships
CREATE POLICY "doctor_patient_relationships_own_access" ON doctor_patient_relationships FOR ALL USING (
  auth.uid()::text = doctor_id::text OR auth.uid()::text = patient_id::text
);
