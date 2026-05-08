# Telemedicine Platform - Setup Guide

Welcome to the TeleMed telemedicine platform! This guide will walk you through setting up the application.

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account (https://supabase.com)
- Fitbit Developer Account (https://dev.fitbit.com)
- Vercel account (for deployment)

## 1. Database Setup

### Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Store these in your environment variables

### Apply Database Schema

The database schema is defined in `supabase/migrations/001_create_initial_schema.sql`. To apply it:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of the migration file
4. Execute the SQL

This will create the following tables:
- `users` - User authentication and login
- `user_profiles` - User profile information (name, specialty, etc.)
- `fitbit_credentials` - Fitbit OAuth tokens and user IDs
- `health_data` - Health metrics from Fitbit
- `appointments` - Doctor-patient appointments
- `medical_records` - Patient medical records
- `health_alerts` - Health alerts and notifications
- `doctor_patient_relationships` - Doctor-patient relationships

## 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
POSTGRES_URL=your-postgres-url

# Fitbit OAuth
FITBIT_CLIENT_ID=your-fitbit-client-id
FITBIT_CLIENT_SECRET=your-fitbit-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your production URL
```

## 3. Fitbit OAuth Setup

### Register Your Application

1. Go to https://dev.fitbit.com/build/reference/web-api/oauth2-guide/
2. Register your application at https://dev.fitbit.com/
3. Set the redirect URI to: `http://localhost:3000/api/fitbit/callback`
   - For production: `https://yourdomain.com/api/fitbit/callback`
4. Copy your Client ID and Client Secret

### Update Environment Variables

Update your `.env.local` with the Fitbit credentials obtained above.

## 4. Installation & Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## 5. User Registration & Login

### Test Accounts

You can create test accounts by:

1. Going to `http://localhost:3000/auth/signup`
2. Filling in the signup form
3. Selecting either "Patient" or "Doctor" role
4. Submitting the form

### Default Login

After signup, you can login at `http://localhost:3000/auth/login` using the email and password you registered with.

## 6. Fitbit Integration

### For Patients

1. After logging in as a patient, go to the "Health Metrics" page
2. Click "Connect Fitbit Device"
3. You'll be redirected to Fitbit to authorize the application
4. After authorization, your health data will automatically sync

### Available Health Metrics

The following metrics are synced from Fitbit:
- Heart Rate
- Steps
- Sleep Duration & Quality
- Calories Burned
- Active Minutes
- Distance

## 7. Key Features

### Patient Dashboard
- View health metrics from Fitbit
- Book appointments with doctors
- View and manage medical records
- Receive health alerts

### Doctor Dashboard
- View patient list
- View patient health data
- Manage appointments
- Review patient medical records
- Add notes and recommendations

## 8. API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Fitbit Integration
- `GET /api/fitbit/callback` - OAuth callback handler
- `POST /api/fitbit/sync-data` - Sync health data from Fitbit

### Appointments
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create new appointment

### Medical Records
- `GET /api/medical-records` - Get patient's records
- `POST /api/medical-records` - Add medical record

## 9. Database Security

### Row Level Security (RLS)

The database has RLS policies enabled:

- Users can only access their own data
- Doctors can view health data of their assigned patients
- Appointments are visible to both patient and doctor involved

### Password Security

Passwords are hashed using bcrypt with a salt of 10 rounds.

## 10. Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

### Production Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Update Fitbit redirect URI to production URL
- [ ] Configure custom domain in Vercel
- [ ] Set up database backups
- [ ] Enable HTTPS
- [ ] Review and update privacy policy
- [ ] Test all features in production

## 11. Troubleshooting

### Fitbit Connection Issues
- Ensure Fitbit credentials are correctly set in environment variables
- Check that redirect URI matches in Fitbit developer settings
- Verify user is logged in before connecting Fitbit

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check that database migrations have been applied
- Ensure Supabase project is active

### Authentication Issues
- Check browser cookies are enabled
- Clear localStorage if experiencing login issues
- Verify email format is valid

## 12. Next Steps

1. Customize the application for your healthcare organization
2. Add additional features like video consultations
3. Implement payment processing for premium features
4. Set up automated health alerts
5. Add more wearable device integrations (Apple Watch, Garmin, etc.)

## Support

For issues or questions, please contact support or check the documentation.

---

**TeleMed** - Your Health, Our Priority
