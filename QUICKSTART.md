# TeleMed Quick Start Guide

Get up and running with the TeleMed platform in 5 minutes!

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd telemedicine-platform
pnpm install
```

## 2. Configure Environment

Copy the environment template and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with:
- Supabase URL and keys
- Fitbit OAuth credentials

## 3. Setup Database

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase/migrations/001_create_initial_schema.sql`
4. Execute the SQL in Supabase

## 4. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## 5. Test the Platform

### Create Test Accounts

**Patient Account:**
- Go to http://localhost:3000/auth/signup
- Select "Patient"
- Fill in details and submit

**Doctor Account:**
- Go to http://localhost:3000/auth/signup
- Select "Doctor"
- Fill in details and submit

### Explore Features

**Patient Features:**
1. Login as patient at http://localhost:3000/auth/login
2. Dashboard: View health metrics
3. Health Metrics: Connect Fitbit device
4. Appointments: Book appointments
5. Medical Records: View medical history

**Doctor Features:**
1. Login as doctor at http://localhost:3000/auth/login
2. Dashboard: View patient statistics
3. Patients: View patient list and health data
4. Appointments: Manage appointment schedule

## Common Tasks

### Connect Fitbit Device (Patient)

1. Login as patient
2. Go to "Health Metrics"
3. Click "Connect Fitbit Device"
4. Authorize in Fitbit
5. Health data will sync automatically

### Book an Appointment (Patient)

1. Go to "Appointments" page
2. Click "Book New Appointment"
3. Select doctor and date/time
4. Confirm booking

### View Patient Health Data (Doctor)

1. Login as doctor
2. Go to "My Patients"
3. Click on a patient name
4. View their health metrics and records

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   ├── auth/                   # Auth pages
│   ├── patient/                # Patient routes
│   ├── doctor/                 # Doctor routes
│   └── page.tsx                # Landing page
├── lib/
│   ├── supabase/              # Supabase clients
│   ├── auth.ts                # Auth utilities
│   └── database.types.ts      # TypeScript types
├── components/                 # React components
├── supabase/migrations/       # Database migrations
└── public/                    # Static assets
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Authentication logic |
| `lib/supabase/client.ts` | Client-side DB access |
| `lib/supabase/server.ts` | Server-side DB access |
| `app/api/fitbit/callback/route.ts` | Fitbit OAuth handler |
| `app/api/fitbit/sync-data/route.ts` | Health data sync |

## Troubleshooting

### "Fitbit connection failed"
- Check that FITBIT_CLIENT_ID and FITBIT_CLIENT_SECRET are set
- Verify the redirect URI in Fitbit settings matches your app URL
- Clear browser cookies and try again

### "Database connection error"
- Verify SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
- Check that migrations have been executed in Supabase
- Ensure Supabase project is active

### "Password doesn't match"
- Confirm you're entering the same password in both fields
- Password must be at least 8 characters

## Database Queries

### View Users
```sql
SELECT id, email FROM users LIMIT 10;
```

### View Patient Profiles
```sql
SELECT * FROM user_profiles WHERE user_type = 'patient';
```

### View Health Data
```sql
SELECT * FROM health_data WHERE date = '2026-05-05' LIMIT 5;
```

### View Appointments
```sql
SELECT * FROM appointments WHERE status = 'scheduled';
```

## Useful Commands

```bash
# Format code
pnpm run format

# Type check
pnpm run type-check

# Build for production
pnpm run build

# Start production server
pnpm run start

# View Supabase logs
# Go to Supabase dashboard > Logs
```

## Next Steps

1. Read the full [SETUP.md](SETUP.md) for detailed configuration
2. Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture overview
3. Explore the codebase and understand the data flow
4. Customize colors, branding, and features
5. Deploy to Vercel or your hosting provider

## Support

- Supabase Docs: https://supabase.com/docs
- Fitbit API: https://dev.fitbit.com/build/reference/web-api/
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

## Key Endpoints

```
GET  /                          # Landing page
POST /api/auth/signup           # Register
POST /api/auth/login            # Login
GET  /api/fitbit/callback       # Fitbit OAuth
POST /api/fitbit/sync-data      # Sync health data
GET  /api/appointments          # Get appointments
POST /api/appointments          # Create appointment
GET  /api/medical-records       # Get records
POST /api/medical-records       # Add record
```

## Architecture Overview

```
┌─────────────────────────────────────────┐
│        Next.js Application              │
├─────────────────────────────────────────┤
│  Pages (Patient/Doctor Dashboard)       │
│  API Routes (Auth, Fitbit, Records)     │
├─────────────────────────────────────────┤
│  Supabase PostgreSQL Database           │
│  - Users & Profiles                     │
│  - Health Data                          │
│  - Appointments                         │
│  - Medical Records                      │
├─────────────────────────────────────────┤
│  External Services                      │
│  - Fitbit OAuth & API                   │
│  - (Future: Video, SMS, Email)          │
└─────────────────────────────────────────┘
```

---

Ready to go! Happy coding! 🚀
