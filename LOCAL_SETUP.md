# Local Development Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18.17+ (Download from https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (Download from https://git-scm.com/)
- **Visual Studio Code** (https://code.visualstudio.com/)
- **Supabase Account** (Free at https://supabase.com/)
- **Fitbit Developer Account** (at https://dev.fitbit.com/)

## Step 1: Clone/Setup the Project

```bash
# Navigate to your projects directory
cd ~/Projects

# Clone the repository (if using Git)
git clone <your-repo-url> telemedicine-platform
cd telemedicine-platform

# Or if copying files directly, navigate to the project folder
cd telemedicine-platform
```

## Step 2: Install Dependencies

```bash
# Install all npm dependencies
npm install

# This will install all packages listed in package.json
# It may take 2-5 minutes to complete
```

**Troubleshooting:**
- If you see permission errors: Try `npm install --prefer-offline --no-audit`
- If you see package conflicts: Delete `package-lock.json` and run `npm install` again

## Step 3: Set Up Environment Variables

### Create .env.local file

1. In the project root, create a file named `.env.local` (copy from `.env.example`)
2. Fill in the required environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Fitbit OAuth Configuration
NEXT_PUBLIC_FITBIT_CLIENT_ID=your_fitbit_client_id_here
FITBIT_CLIENT_SECRET=your_fitbit_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### How to get these values:

**For Supabase:**
1. Go to https://app.supabase.com
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy the Project URL and anon key
5. Paste them in `.env.local`

**For Fitbit:**
1. Go to https://dev.fitbit.com/build/reference/web-api/oauth2-guide/
2. Create an OAuth 2.0 application
3. Set Redirect URL to: `http://localhost:3000/api/fitbit/callback`
4. Copy Client ID and Client Secret
5. Paste them in `.env.local`

## Step 4: Set Up Supabase Database

Before running the app, initialize your Supabase database:

1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Click "New Query"
5. Copy and paste the SQL from `supabase/migrations/001_create_initial_schema.sql`
6. Click "Run"

This creates all necessary tables with proper security policies.

## Step 5: Open in VS Code

```bash
# Open the project in Visual Studio Code
code .

# VS Code will automatically:
# - Use the TypeScript in node_modules
# - Enable IntelliSense for all dependencies
# - Format code on save (if Prettier is installed)
```

## Step 6: Start Development Server

```bash
# Start the development server
npm run dev

# You should see output like:
# ▲ Next.js 16.2.4 (Turbopack)
#   Local:        http://localhost:3000
```

Open http://localhost:3000 in your browser to see the app.

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Common Issues and Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Environment variables not loading

**Solution:**
1. Create `.env.local` in the project root (not in app/ or lib/)
2. Restart the dev server after adding variables
3. Make sure variable names start with `NEXT_PUBLIC_` for client-side access

### Issue: Supabase connection errors

**Solution:**
1. Check that NEXT_PUBLIC_SUPABASE_URL is a valid URL
2. Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
3. Try accessing Supabase dashboard to confirm service is running

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
# Then: taskkill /PID <PID> /F
```

### Issue: "Cannot find module @/lib/..." errors

**Solution:**
1. Check tsconfig.json has correct path mappings
2. Ensure files exist at the specified paths
3. Restart VS Code

## Project Structure

```
/vercel/share/v0-project/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── fitbit/               # Fitbit OAuth & data sync
│   │   └── ...                   # Other endpoints
│   ├── patient/                  # Patient pages
│   │   ├── dashboard/
│   │   ├── health-metrics/
│   │   └── ...
│   ├── doctor/                   # Doctor pages
│   │   ├── dashboard/
│   │   └── patients/
│   ├── auth/                     # Auth pages
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # UI components (shadcn)
│   └── ...
├── lib/                          # Utility functions
│   ├── supabase/                 # Supabase clients
│   ├── auth.ts                   # Auth helpers
│   └── database.types.ts         # TypeScript types
├── public/                       # Static assets
├── supabase/                     # Supabase migrations
├── .env.example                  # Example env file
├── .env.local                    # Your local env (don't commit!)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── next.config.js                # Next.js config
```

## Database Schema

The application uses these main tables:

- **users** - User accounts with hashed passwords
- **user_profiles** - Extended user information (patient/doctor specific)
- **fitbit_credentials** - Fitbit OAuth tokens (encrypted)
- **health_data** - Synced health metrics from Fitbit
- **appointments** - Doctor-patient appointments
- **medical_records** - Patient medical documents
- **health_alerts** - Alerts for abnormal metrics

All tables have Row Level Security (RLS) policies to protect user data.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Fitbit Integration
- `GET /api/fitbit/callback` - OAuth callback
- `POST /api/fitbit/sync-data` - Sync health data

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment

### Medical Records
- `GET /api/medical-records` - List records
- `POST /api/medical-records` - Upload record

## Testing the App Locally

1. **Sign up as a patient:**
   - Go to http://localhost:3000/auth/signup
   - Select "Patient" role
   - Fill in credentials
   - Click "Sign Up"

2. **Sign up as a doctor:**
   - Go to http://localhost:3000/auth/signup
   - Select "Doctor" role
   - Fill in credentials
   - Click "Sign Up"

3. **Login:**
   - Go to http://localhost:3000/auth/login
   - Enter credentials
   - You'll be redirected to your dashboard

4. **Connect Fitbit (Patient only):**
   - Go to patient dashboard
   - Click "Connect Fitbit Device"
   - Follow the OAuth flow
   - Health metrics will sync automatically

## Debugging

### Enable debug logging

Add `[v0]` prefix to console logs to track execution:

```javascript
console.log('[v0] User login attempt:', email)
```

### Check browser console

Press `F12` to open developer tools and check the Console tab for errors.

### Check terminal output

Watch the terminal where `npm run dev` is running for server-side errors.

## Next Steps

1. Set up the database with SQL migration
2. Configure Supabase and Fitbit credentials
3. Start the dev server
4. Test authentication flow
5. Connect Fitbit device
6. Explore the dashboards

## Support

If you encounter issues:

1. Check that all environment variables are set
2. Verify Node.js version: `node --version`
3. Clear cache: `npm cache clean --force`
4. Delete `.next` folder and rebuild: `rm -rf .next && npm run dev`
5. Check that Supabase project is active
6. Verify Fitbit OAuth credentials are correct

For more help, refer to:
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Fitbit API Docs: https://dev.fitbit.com/build/reference/web-api/
