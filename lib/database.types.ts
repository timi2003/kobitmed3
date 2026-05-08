export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          user_type: 'patient' | 'doctor'
          date_of_birth: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          medical_license: string | null
          specialization: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          user_type: 'patient' | 'doctor'
          date_of_birth?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          medical_license?: string | null
          specialization?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          user_type?: 'patient' | 'doctor'
          date_of_birth?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          medical_license?: string | null
          specialization?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fitbit_credentials: {
        Row: {
          id: string
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: string
          fitbit_user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: string
          fitbit_user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          refresh_token?: string
          expires_at?: string
          fitbit_user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      health_data: {
        Row: {
          id: string
          user_id: string
          date: string
          heart_rate: number | null
          steps: number | null
          calories_burned: number | null
          distance: number | null
          active_minutes: number | null
          sleep_duration: number | null
          sleep_quality: number | null
          blood_pressure_systolic: number | null
          blood_pressure_diastolic: number | null
          oxygen_level: number | null
          temperature: number | null
          source: 'fitbit' | 'manual' | 'other'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          heart_rate?: number | null
          steps?: number | null
          calories_burned?: number | null
          distance?: number | null
          active_minutes?: number | null
          sleep_duration?: number | null
          sleep_quality?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          oxygen_level?: number | null
          temperature?: number | null
          source?: 'fitbit' | 'manual' | 'other'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          heart_rate?: number | null
          steps?: number | null
          calories_burned?: number | null
          distance?: number | null
          active_minutes?: number | null
          sleep_duration?: number | null
          sleep_quality?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          oxygen_level?: number | null
          temperature?: number | null
          source?: 'fitbit' | 'manual' | 'other'
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          duration_minutes: number
          status: 'scheduled' | 'completed' | 'cancelled'
          notes: string | null
          reason: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_time: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled'
          notes?: string | null
          reason: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          appointment_date?: string
          appointment_time?: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled'
          notes?: string | null
          reason?: string
          created_at?: string
          updated_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string | null
          title: string
          description: string
          record_type: 'diagnosis' | 'prescription' | 'lab_result' | 'note' | 'other'
          record_date: string
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id?: string | null
          title: string
          description: string
          record_type?: 'diagnosis' | 'prescription' | 'lab_result' | 'note' | 'other'
          record_date?: string
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string | null
          title?: string
          description?: string
          record_type?: 'diagnosis' | 'prescription' | 'lab_result' | 'note' | 'other'
          record_date?: string
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_alerts: {
        Row: {
          id: string
          user_id: string
          alert_type: 'high_heart_rate' | 'low_heart_rate' | 'high_blood_pressure' | 'low_blood_pressure' | 'unusual_activity' | 'custom'
          metric_value: number
          normal_range_min: number | null
          normal_range_max: number | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          alert_type: 'high_heart_rate' | 'low_heart_rate' | 'high_blood_pressure' | 'low_blood_pressure' | 'unusual_activity' | 'custom'
          metric_value: number
          normal_range_min?: number | null
          normal_range_max?: number | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          alert_type?: 'high_heart_rate' | 'low_heart_rate' | 'high_blood_pressure' | 'low_blood_pressure' | 'unusual_activity' | 'custom'
          metric_value?: number
          normal_range_min?: number | null
          normal_range_max?: number | null
          is_read?: boolean
          created_at?: string
        }
      }
      doctor_patient_relationships: {
        Row: {
          id: string
          doctor_id: string
          patient_id: string
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          patient_id: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          patient_id?: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
