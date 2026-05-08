# Telemedicine Platform Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │              Patient / Doctor Interface                   │   │
│  │         (React + Next.js Client Components)              │   │
│  └───────────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                                │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Frontend (Pages & Components)               │    │
│  │  • Login/Signup Pages                                   │    │
│  │  • Patient Dashboard                                    │    │
│  │  • Doctor Dashboard                                     │    │
│  │  • Health Metrics Display                               │    │
│  │  • Appointments Interface                               │    │
│  │  • Medical Records View                                 │    │
│  └──────────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Backend (API Routes)                        │    │
│  │  • POST /api/auth/signup                                │    │
│  │  • POST /api/auth/login                                 │    │
│  │  • GET /api/fitbit/callback                             │    │
│  │  • POST /api/fitbit/sync-data                           │    │
│  │  • GET/POST /api/appointments                           │    │
│  │  • GET/POST /api/medical-records                        │    │
│  │  • POST /api/health-alerts                              │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────┬────────────────────┘
                     │                        │
              HTTP/REST                  OAuth 2.0
                     │                        │
        ┌────────────┴────────────┐       ┌───┴─────────────┐
        ▼                         ▼       ▼                 ▼
┌──────────────────┐      ┌──────────────────┐    ┌─────────────────┐
│  SUPABASE DB     │      │  SESSION STORE   │    │ FITBIT API      │
│                  │      │  (Redis/DB)      │    │                 │
│  PostgreSQL      │      │                  │    │ • OAuth         │
│  Tables:         │      │  • User Sessions │    │ • Health Data   │
│  • users         │      │  • Tokens        │    │ • Device Info   │
│  • user_profiles │      │  • Refresh Tokens│    │                 │
│  • fitbit_creds  │      └──────────────────┘    └─────────────────┘
│  • health_data   │
│  • appointments  │
│  • med_records   │
│  • health_alerts │
│  • rls_policies  │
└──────────────────┘
```

---

## Authentication Flow

```
SIGNUP FLOW
───────────────────────────────────────────────────────────

User (Browser)
     │
     └─► /auth/signup [Page]
         │
         ├─ Select: Patient or Doctor
         ├─ Enter: Email, Password, Name
         ├─ Submit
         │
         └─► POST /api/auth/signup [API Route]
             │
             ├─ Validate input
             ├─ Hash password (bcryptjs)
             ├─ Insert user record
             ├─ Insert user_profile
             │
             └─► Supabase PostgreSQL
                 │
                 ├─ CREATE user
                 └─ CREATE user_profile
             │
             └─ Response: { user, message }
         │
         └─► Redirect /auth/login


LOGIN FLOW
───────────────────────────────────────────────────────────

User (Browser)
     │
     └─► /auth/login [Page]
         │
         ├─ Enter: Email, Password
         ├─ Submit
         │
         └─► POST /api/auth/login [API Route]
             │
             ├─ Query user by email
             ├─ Compare password hash
             │
             └─► Supabase PostgreSQL
                 │
                 └─ SELECT user WHERE email = ?
             │
             ├─ Get user profile
             │
             └─► Supabase PostgreSQL
                 │
                 └─ SELECT profile WHERE user_id = ?
             │
             └─ Response: { user, userType, profile }
         │
         └─► localStorage.setItem('userId', ...)
             localStorage.setItem('userType', ...)
             │
             └─► Redirect /patient/dashboard
                 OR /doctor/dashboard
```

---

## Data Flow: Health Metrics

```
FITBIT OAUTH FLOW
──────────────────────────────────────────────────────

Patient clicks "Connect Fitbit"
         │
         ├─► Redirect to Fitbit OAuth URL
         │   https://www.fitbit.com/oauth2/authorize?...
         │
         └─► User authorizes app in Fitbit
             │
             └─► Fitbit redirects back to:
                 GET /api/fitbit/callback?code=...
                 │
                 ├─ Exchange code for access token
                 │
                 └─► POST https://api.fitbit.com/oauth2/token
                     │
                     └─ Response: { access_token, refresh_token }
                 │
                 ├─ Store tokens in database
                 │
                 └─► INSERT INTO fitbit_credentials
                 │
                 └─ Redirect /patient/health-metrics


HEALTH DATA SYNC
──────────────────────────────────────────────────────

Patient Dashboard
         │
         └─► Call GET /api/fitbit/sync-data
             │
             ├─ Get stored access_token from DB
             │
             ├─ Call Fitbit API:
             │  GET /1/user/{userId}/activities/date/today.json
             │
             ├─ Parse response (steps, heart_rate, etc)
             │
             ├─ INSERT INTO health_data
             │  • user_id
             │  • date
             │  • steps
             │  • heart_rate
             │  • sleep_hours
             │  • calories_burned
             │
             └─ Response: { success, data }
             │
             └─► Display on Dashboard
```

---

## Database Schema

```
USERS TABLE
───────────────────────────────────────────
id             UUID (PK)
email          VARCHAR (UNIQUE)
password_hash  VARCHAR
created_at     TIMESTAMP
updated_at     TIMESTAMP

USER_PROFILES TABLE
───────────────────────────────────────────
id             UUID (PK)
user_id        UUID (FK → users.id)
first_name     VARCHAR
last_name      VARCHAR
user_type      ENUM ('patient', 'doctor')
phone          VARCHAR
address        VARCHAR
medical_license VARCHAR (doctor only)
specialization VARCHAR (doctor only)
created_at     TIMESTAMP

FITBIT_CREDENTIALS TABLE
───────────────────────────────────────────
id             UUID (PK)
user_id        UUID (FK → users.id)
fitbit_user_id VARCHAR
access_token   VARCHAR (encrypted)
refresh_token  VARCHAR (encrypted)
expires_at     TIMESTAMP
created_at     TIMESTAMP
updated_at     TIMESTAMP

HEALTH_DATA TABLE
───────────────────────────────────────────
id             UUID (PK)
user_id        UUID (FK → users.id)
date           DATE
steps          INTEGER
heart_rate     INTEGER
sleep_hours    DECIMAL
calories_burned INTEGER
data_source    VARCHAR (fitbit/manual)
created_at     TIMESTAMP

APPOINTMENTS TABLE
───────────────────────────────────────────
id             UUID (PK)
patient_id     UUID (FK → users.id)
doctor_id      UUID (FK → users.id)
date_time      TIMESTAMP
duration_mins  INTEGER
status         ENUM ('scheduled','completed','cancelled')
notes          TEXT
created_at     TIMESTAMP
updated_at     TIMESTAMP

MEDICAL_RECORDS TABLE
───────────────────────────────────────────
id             UUID (PK)
patient_id     UUID (FK → users.id)
doctor_id      UUID (FK → users.id)
record_type    VARCHAR (prescription/test/report)
content        TEXT
file_url       VARCHAR
created_at     TIMESTAMP
updated_at     TIMESTAMP

HEALTH_ALERTS TABLE
───────────────────────────────────────────
id             UUID (PK)
patient_id     UUID (FK → users.id)
doctor_id      UUID (FK → users.id)
alert_type     VARCHAR (heart_rate/blood_pressure/etc)
description    TEXT
severity       ENUM ('low','medium','high','critical')
status         ENUM ('active','resolved')
created_at     TIMESTAMP
```

---

## Component Hierarchy

```
ROOT LAYOUT (app/layout.tsx)
├─ HTML
└─ Body
   ├─ Navigation
   ├─ Main Content
   │  ├─ Page Routes
   │  │  ├─ / (Landing Page)
   │  │  │  ├─ Hero Section
   │  │  │  ├─ Features List
   │  │  │  └─ CTA Buttons
   │  │  │
   │  │  ├─ /auth/signup
   │  │  │  └─ SignUpForm
   │  │  │     ├─ Email Input
   │  │  │     ├─ Password Input
   │  │  │     ├─ Name Inputs
   │  │  │     ├─ Role Selector
   │  │  │     └─ Submit Button
   │  │  │
   │  │  ├─ /auth/login
   │  │  │  └─ LoginForm
   │  │  │     ├─ Email Input
   │  │  │     ├─ Password Input
   │  │  │     └─ Submit Button
   │  │  │
   │  │  ├─ /patient/dashboard
   │  │  │  ├─ Header (Greeting, Logout)
   │  │  │  ├─ Health Summary Cards
   │  │  │  │  ├─ Steps Card
   │  │  │  │  ├─ Heart Rate Card
   │  │  │  │  ├─ Sleep Card
   │  │  │  │  └─ Calories Card
   │  │  │  ├─ Quick Actions
   │  │  │  │  ├─ Connect Fitbit Button
   │  │  │  │  ├─ Book Appointment Button
   │  │  │  │  └─ View Records Button
   │  │  │  └─ Recent Appointments
   │  │  │
   │  │  ├─ /patient/health-metrics
   │  │  │  ├─ Metrics Chart
   │  │  │  ├─ Date Range Selector
   │  │  │  ├─ Metric Cards
   │  │  │  └─ Alert List
   │  │  │
   │  │  ├─ /patient/appointments
   │  │  │  ├─ Book Appointment Form
   │  │  │  ├─ Appointments List
   │  │  │  └─ Appointment Details
   │  │  │
   │  │  ├─ /patient/medical-records
   │  │  │  ├─ Upload Record Form
   │  │  │  └─ Records List
   │  │  │
   │  │  ├─ /doctor/dashboard
   │  │  │  ├─ Header (Greeting, Logout)
   │  │  │  ├─ Patient Summary
   │  │  │  │  ├─ Total Patients Card
   │  │  │  │  ├─ Today's Appointments Card
   │  │  │  │  └─ Alert Count Card
   │  │  │  ├─ Upcoming Appointments
   │  │  │  └─ Patient List
   │  │  │
   │  │  ├─ /doctor/patients
   │  │  │  ├─ Search/Filter
   │  │  │  ├─ Patients Table
   │  │  │  │  ├─ Patient Name
   │  │  │  │  ├─ Health Metrics
   │  │  │  │  ├─ Last Checkup
   │  │  │  │  └─ View Details Button
   │  │  │  └─ Patient Detail View
   │  │  │
   │  │  └─ /doctor/appointments
   │  │     ├─ Appointments Calendar
   │  │     ├─ Appointments List
   │  │     └─ Appointment Details
   │  │
   │  └─ UI Components (from /components/ui)
   │     ├─ Button
   │     ├─ Card
   │     ├─ Input
   │     ├─ Form
   │     ├─ Table
   │     ├─ Dialog
   │     ├─ Alert
   │     └─ ... 40+ more components
   │
   ├─ Footer
   └─ Analytics

LAYOUT HIERARCHY
app/patient/layout.tsx
├─ Sidebar Navigation
├─ User Menu
├─ Main Content
└─ Logout Button

app/doctor/layout.tsx
├─ Sidebar Navigation
├─ User Menu
├─ Main Content
└─ Logout Button
```

---

## API Endpoint Architecture

```
AUTHENTICATION ENDPOINTS
──────────────────────────────────────────────
POST /api/auth/signup
  Input: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    userType: 'patient' | 'doctor'
  }
  Output: { user, message }
  Status: 201 (Created) | 400 | 409 (Conflict)

POST /api/auth/login
  Input: { email, password }
  Output: { user, userType, profile }
  Status: 200 | 401 (Unauthorized)


FITBIT INTEGRATION ENDPOINTS
──────────────────────────────────────────────
GET /api/fitbit/callback?code=...&state=...
  Purpose: OAuth callback from Fitbit
  Process: Exchange code for token, store credentials
  Redirect: /patient/dashboard

POST /api/fitbit/sync-data
  Purpose: Sync health metrics from Fitbit
  Input: { userId }
  Output: { success, data, lastSync }
  Status: 200 | 401 | 500


DATA ENDPOINTS
──────────────────────────────────────────────
GET /api/appointments
  Query: ?patientId=... or ?doctorId=...
  Output: { appointments: [] }
  Status: 200

POST /api/appointments
  Input: {
    patientId: string,
    doctorId: string,
    dateTime: string,
    duration: number,
    notes?: string
  }
  Output: { appointment }
  Status: 201

GET /api/medical-records
  Query: ?userId=...&type=...
  Output: { records: [] }
  Status: 200

POST /api/medical-records
  Input: FormData with file + metadata
  Output: { record }
  Status: 201
```

---

## State Management

```
CLIENT-SIDE STATE
─────────────────────────────────────────────
localStorage
├─ userId              // Current user ID
├─ userType            // 'patient' | 'doctor'
├─ sessionToken        // Auth token (if used)
└─ preferences         // User preferences

React State (useContext or hooks)
├─ AuthContext
│  ├─ user
│  ├─ isLoading
│  └─ error
├─ DashboardContext
│  ├─ healthData
│  ├─ appointments
│  └─ alerts
└─ NotificationContext
   ├─ notifications
   └─ toasts

SERVER-SIDE STATE
─────────────────────────────────────────────
Supabase Database
├─ User data
├─ Health metrics
├─ Appointments
├─ Medical records
└─ Credentials (encrypted)

Session Storage
├─ JWT tokens (future enhancement)
├─ Refresh tokens
└─ Session metadata
```

---

## Security Layers

```
FRONTEND SECURITY
──────────────────────────────────────────────
✓ Input validation (React Hook Form)
✓ XSS protection (React sanitization)
✓ CSRF protection (SameSite cookies)
✓ Content Security Policy headers
✓ HTTPS only in production
✓ No sensitive data in localStorage

BACKEND SECURITY
──────────────────────────────────────────────
✓ Password hashing (bcryptjs)
✓ Input validation (all endpoints)
✓ SQL injection prevention (parameterized queries)
✓ Rate limiting (future enhancement)
✓ CORS configuration
✓ Environment variables for secrets

DATABASE SECURITY
──────────────────────────────────────────────
✓ Row Level Security (RLS) policies
✓ Encrypted fields (passwords, tokens)
✓ Foreign key constraints
✓ Audit logs (created_at, updated_at)
✓ User isolation (RLS policies)
✓ Backup and recovery procedures

OAUTH SECURITY
──────────────────────────────────────────────
✓ PKCE flow for mobile/desktop apps
✓ Secure token storage (DB encrypted)
✓ Token refresh mechanism
✓ Scope limitations (health data only)
✓ State parameter validation
✓ HTTPS redirect URIs only
```

---

## Deployment Architecture

```
LOCAL DEVELOPMENT
──────────────────────────────────────────────
Your Machine
    ↓
npm run dev (http://localhost:3000)
    ↓
Supabase Cloud (Remote DB)


VERCEL DEPLOYMENT (Production)
──────────────────────────────────────────────
Git Repository (GitHub)
    ↓
Push to main branch
    ↓
Vercel Auto-Deploy
    ├─ Build: npm run build
    ├─ Test: npm run lint
    ├─ Deploy: https://your-domain.com
    └─ CDN: Vercel Edge Network
    ↓
Supabase Cloud (Remote DB)
    ↓
Fitbit API (External)
```

---

## Data Flow Examples

### Patient Signup Flow
```
1. User visits /auth/signup
2. Selects "Patient" role
3. Enters email, password, name
4. Clicks "Sign Up"
5. POST /api/auth/signup
   ├─ Validate input
   ├─ Hash password
   ├─ Create user record in DB
   ├─ Create user_profile record
   └─ Return success
6. User redirected to /auth/login
```

### Health Data Sync Flow
```
1. Patient visits /patient/dashboard
2. Clicks "Sync Fitbit Data"
3. Call POST /api/fitbit/sync-data
   ├─ Get access token from DB
   ├─ Call Fitbit API
   ├─ Parse response
   ├─ Save to health_data table
   └─ Return results
4. Display updated metrics
```

### Appointment Booking Flow
```
1. Patient visits /patient/appointments
2. Enters date, time, doctor
3. Clicks "Request Appointment"
4. POST /api/appointments
   ├─ Validate inputs
   ├─ Check doctor availability
   ├─ Create appointment record
   ├─ Send notification to doctor
   └─ Return confirmation
5. Show "Appointment Scheduled"
```

---

## Performance Optimization

```
FRONTEND OPTIMIZATION
──────────────────────────────────────────────
✓ Code splitting (Next.js automatic)
✓ Image optimization (next/image)
✓ Dynamic imports for heavy components
✓ CSS-in-JS for smaller bundles
✓ Minification and compression
✓ CDN for static assets

BACKEND OPTIMIZATION
──────────────────────────────────────────────
✓ Database indexing on frequently queried fields
✓ Query optimization (select only needed fields)
✓ Connection pooling (Supabase)
✓ Response caching (future enhancement)
✓ Pagination for large datasets
✓ API response compression

RUNTIME OPTIMIZATION
──────────────────────────────────────────────
✓ Turbopack for faster builds
✓ Hot Module Replacement (HMR)
✓ Lazy loading routes
✓ Efficient state management
✓ Debouncing for frequent events
```

---

## Monitoring & Logging

```
LOGGING POINTS
──────────────────────────────────────────────
✓ Authentication events
✓ API requests/responses
✓ Database operations
✓ Fitbit API calls
✓ Errors and exceptions
✓ User actions (future analytics)

ERROR HANDLING
──────────────────────────────────────────────
✓ Try-catch in all async operations
✓ Error boundaries in React
✓ Detailed error messages (dev)
✓ Generic errors (production)
✓ Error recovery mechanisms
✓ User notification on errors
```

---

## Future Enhancements

```
SHORT-TERM (Next Sprint)
──────────────────────────────────────────────
□ Email notifications
□ SMS alerts
□ Real-time websocket updates
□ Advanced health analytics
□ Medical record sharing

MEDIUM-TERM (Roadmap)
──────────────────────────────────────────────
□ Video consultation support
□ Prescription management
□ Insurance integration
□ Multi-language support
□ Mobile native apps

LONG-TERM (Vision)
──────────────────────────────────────────────
□ AI-powered health insights
□ Predictive diagnostics
□ Hospital/Clinic integration
□ Insurance claims processing
□ Regulatory compliance (HIPAA, GDPR)
```

---

This architecture is designed to be:
- **Scalable** - Can handle growing user base
- **Secure** - Protects patient data
- **Performant** - Fast load times
- **Maintainable** - Clear code organization
- **Extensible** - Easy to add features
