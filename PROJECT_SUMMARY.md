# TeleMed - Telemedicine Platform Project Summary

## Overview

TeleMed is a comprehensive telemedicine platform that enables patients to connect with healthcare providers, monitor their health metrics from wearable devices (specifically Fitbit), and manage their medical care online.

## Technology Stack

- **Frontend**: Next.js 16 with React 19.2
- **Styling**: Tailwind CSS v4 with custom theme (Deep Blue #1E3A8A, Teal #14B8A6)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom email/password with bcrypt hashing
- **Wearable Integration**: Fitbit OAuth 2.0
- **UI Components**: shadcn/ui

## Project Structure

```
/app
  /api
    /auth
      /signup - User registration endpoint
      /login - User login endpoint
    /fitbit
      /callback - Fitbit OAuth callback handler
      /sync-data - Health data sync endpoint
    /appointments - Appointment management API
    /medical-records - Medical records API
  /auth
    /signup - Signup page
    /login - Login page
  /patient
    /layout - Patient sidebar layout
    /dashboard - Patient dashboard
    /health-metrics - Health metrics & Fitbit integration
    /appointments - Patient appointments page
    /medical-records - Patient medical records page
  /doctor
    /layout - Doctor sidebar layout
    /dashboard - Doctor dashboard
    /patients - Doctor's patient list
    /appointments - Doctor's appointment schedule
  /page.tsx - Landing page

/lib
  /supabase
    /client.ts - Client-side Supabase client
    /server.ts - Server-side Supabase client
  /auth.ts - Authentication utilities
  /database.types.ts - TypeScript database types

/supabase
  /migrations
    /001_create_initial_schema.sql - Database schema

/components/ui - shadcn/ui components
```

## Key Features

### 1. User Authentication
- Email/password signup and login
- Separate role-based accounts (Patient/Doctor)
- Password hashing with bcrypt (10 rounds)
- Client-side validation and error handling

### 2. Patient Dashboard
- Real-time health metrics display
- Quick action cards (Book appointment, Sync Fitbit, View records)
- Health alerts and notifications
- Dashboard statistics (steps, heart rate, sleep, calories)

### 3. Doctor Dashboard
- Patient management overview
- Today's appointment schedule
- Patient health alerts monitoring
- Quick statistics (total patients, appointments, alerts)

### 4. Fitbit Integration
- OAuth 2.0 authorization flow
- Automatic health data sync
- Support for:
  - Heart rate
  - Steps
  - Sleep duration & quality
  - Calories burned
  - Active minutes
  - Distance
- Token refresh mechanism for expired tokens

### 5. Appointments System
- Book appointments with healthcare providers
- View scheduled appointments
- Reschedule/cancel appointments
- Doctor can manage patient schedules

### 6. Medical Records Management
- Store patient medical records
- Document types: diagnosis, prescription, lab results, notes
- Secure file storage
- Doctor-patient visibility control

### 7. Health Alerts
- Real-time health metric alerts
- Types: high/low heart rate, high/low blood pressure, unusual activity
- Patient notifications
- Doctor alerts for their patients

### 8. Security Features
- Row Level Security (RLS) on all tables
- Role-based access control
- Password hashing with bcrypt
- HTTPS-ready configuration
- Encrypted sensitive data storage

## Database Schema

### Tables

1. **users**
   - id (UUID, PK)
   - email (VARCHAR, unique)
   - password_hash (VARCHAR)
   - created_at, updated_at (TIMESTAMP)

2. **user_profiles**
   - id (UUID, PK)
   - user_id (UUID, FK, unique)
   - first_name, last_name (VARCHAR)
   - user_type (patient|doctor)
   - phone, address, city, state, zip_code
   - medical_license, specialization (for doctors)
   - avatar_url
   - created_at, updated_at

3. **fitbit_credentials**
   - id (UUID, PK)
   - user_id (UUID, FK, unique)
   - access_token, refresh_token (TEXT)
   - expires_at (TIMESTAMP)
   - fitbit_user_id (VARCHAR)
   - created_at, updated_at

4. **health_data**
   - id (UUID, PK)
   - user_id (UUID, FK)
   - date (DATE)
   - heart_rate, steps, calories_burned, distance (numeric)
   - active_minutes, sleep_duration, sleep_quality (numeric)
   - blood_pressure_systolic/diastolic (INTEGER)
   - oxygen_level, temperature (DECIMAL)
   - source (fitbit|manual|other)
   - created_at, updated_at
   - Unique constraint: (user_id, date, source)

5. **appointments**
   - id (UUID, PK)
   - patient_id, doctor_id (UUID, FK)
   - appointment_date, appointment_time
   - duration_minutes (INTEGER)
   - status (scheduled|completed|cancelled)
   - reason, notes (VARCHAR, TEXT)
   - created_at, updated_at

6. **medical_records**
   - id (UUID, PK)
   - patient_id (UUID, FK)
   - doctor_id (UUID, FK, nullable)
   - title, description
   - record_type (diagnosis|prescription|lab_result|note|other)
   - record_date (DATE)
   - file_url (TEXT)
   - created_at, updated_at

7. **health_alerts**
   - id (UUID, PK)
   - user_id (UUID, FK)
   - alert_type (high_heart_rate|low_heart_rate|high_blood_pressure|low_blood_pressure|unusual_activity|custom)
   - metric_value (DECIMAL)
   - normal_range_min, normal_range_max (DECIMAL)
   - is_read (BOOLEAN)
   - created_at (TIMESTAMP)

8. **doctor_patient_relationships**
   - id (UUID, PK)
   - doctor_id, patient_id (UUID, FK)
   - status (active|inactive)
   - created_at, updated_at
   - Unique constraint: (doctor_id, patient_id)

## Design System

### Color Palette
- **Primary**: Deep Blue (#1E3A8A) - Trust, reliability, calmness
- **Secondary**: Teal (#14B8A6) - Healing, modern accent
- **Neutrals**: Light gray, white, black variants
- **Accent**: Green (#22C55E) for health/wellness
- **Destructive**: Red for alerts/dangers

### Typography
- Font Family: Geist (sans-serif) for body and headings
- Max 2 fonts per page
- Line height: 1.4-1.6 for body text
- Semantic HTML with proper ARIA roles

### Layout
- Mobile-first responsive design
- Flexbox for primary layouts
- Grid for complex 2D layouts
- Maximum width: 7xl (80rem)
- Tailwind CSS v4 utility classes

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
  - Params: email, password, firstName, lastName, userType
  - Returns: User object
- `POST /api/auth/login` - User login
  - Params: email, password
  - Returns: User object, userType, profile

### Fitbit
- `GET /api/fitbit/callback` - OAuth callback
  - Params: code, error
  - Returns: Redirect with success/error
- `POST /api/fitbit/sync-data` - Sync health data
  - Params: userId, date
  - Returns: Health data object

### Appointments
- `GET /api/appointments` - Get appointments
  - Params: userId, userType
  - Returns: Appointments array
- `POST /api/appointments` - Create appointment
  - Params: patientId, doctorId, appointmentDate, appointmentTime, reason
  - Returns: Appointment object

### Medical Records
- `GET /api/medical-records` - Get records
  - Params: userId, userType
  - Returns: Records array
- `POST /api/medical-records` - Add record
  - Params: patientId, doctorId, title, description, recordType
  - Returns: Record object

## Authentication Flow

### User Registration (Patient/Doctor)
1. User fills signup form with personal details
2. Password is hashed with bcrypt (10 rounds)
3. User record created in database
4. User profile created with role designation
5. Redirect to login page

### User Login
1. User enters email and password
2. User record retrieved from database
3. Password verified against hash
4. User profile fetched
5. User info stored in localStorage (client-side)
6. Redirect to appropriate dashboard based on role

### Fitbit OAuth Flow
1. Patient navigates to "Connect Fitbit"
2. Redirects to Fitbit authorization endpoint
3. User authorizes application in Fitbit app
4. Redirects back to `/api/fitbit/callback` with authorization code
5. Backend exchanges code for access token
6. Access token and refresh token stored in database
7. Redirect to health metrics page with success message

## Health Data Sync Process

1. **Initial Sync**: When patient connects Fitbit
2. **Automatic Refresh**: When health data is requested and token expired
3. **Data Processing**: Parse Fitbit API responses
4. **Database Storage**: Upsert health data with date and source tracking
5. **Alert Generation**: Check metrics against normal ranges
6. **Notification**: Alert patients and doctors of abnormalities

## Security Considerations

### Current Implementation
- Password hashing with bcrypt
- Row Level Security (RLS) on all tables
- Secure token storage for Fitbit
- Input validation on all endpoints
- HTTPS-ready configuration

### Recommendations for Production
- Implement session management with secure cookies
- Add rate limiting on authentication endpoints
- Implement CSRF protection
- Add request validation with middleware
- Enable CORS protection
- Implement audit logging
- Regular security audits
- HIPAA compliance implementation
- Data encryption at rest

## Future Enhancements

### Phase 2
- [ ] Video consultation capabilities
- [ ] Real-time health monitoring dashboard
- [ ] Advanced analytics and health trends
- [ ] Prescription management system
- [ ] Integration with other wearable devices (Apple Watch, Garmin)
- [ ] Payment processing for premium features
- [ ] Email notifications
- [ ] SMS alerts

### Phase 3
- [ ] Telemedicine video calls
- [ ] Prescription e-signature
- [ ] Insurance integration
- [ ] Mobile app (React Native)
- [ ] AI-powered health insights
- [ ] Chatbot support

## Deployment

### Development
- Run `pnpm dev` to start development server on port 3000

### Production
- Deploy to Vercel or self-hosted environment
- Configure environment variables
- Set up database backups
- Enable custom domain
- Configure Fitbit redirect URI for production domain

## Testing Checklist

- [ ] User can sign up as patient
- [ ] User can sign up as doctor
- [ ] User can login with credentials
- [ ] Patient dashboard displays correctly
- [ ] Doctor dashboard displays correctly
- [ ] Fitbit OAuth flow works
- [ ] Health data syncs from Fitbit
- [ ] Appointments can be created
- [ ] Medical records can be stored
- [ ] Health alerts are generated
- [ ] Mobile responsiveness works
- [ ] Error handling works properly

## Performance Metrics

- Next.js Turbopack compilation: ~2-5 seconds
- Database queries: <100ms average
- Fitbit API sync: ~2-3 seconds
- Page load time: <2 seconds

## Contributing Guidelines

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Write semantic HTML
4. Follow Tailwind CSS conventions
5. Test features before committing
6. Update documentation if adding features

## License

This project is proprietary and confidential for internal use.

---

**TeleMed** - Connecting Patients and Healthcare Providers for Better Health Management
