# Local Setup Verification Checklist

Use this checklist to ensure your local development environment is properly configured.

## Pre-Installation Checklist

- [ ] Node.js 18.17+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Visual Studio Code installed
- [ ] Supabase account created at https://supabase.com/
- [ ] Fitbit developer account created at https://dev.fitbit.com/

## Project Setup Checklist

- [ ] Project cloned or copied to local machine
- [ ] Terminal opened in project root
- [ ] `npm install` completed successfully
- [ ] `.env.local` file created in project root
- [ ] All required environment variables added to `.env.local`:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_FITBIT_CLIENT_ID`
  - [ ] `FITBIT_CLIENT_SECRET`
  - [ ] `NEXT_PUBLIC_APP_URL` (set to `http://localhost:3000`)

## Database Setup Checklist

- [ ] Supabase project created
- [ ] SQL migration executed (from `supabase/migrations/001_create_initial_schema.sql`)
- [ ] All tables created in Supabase:
  - [ ] `users`
  - [ ] `user_profiles`
  - [ ] `fitbit_credentials`
  - [ ] `health_data`
  - [ ] `appointments`
  - [ ] `medical_records`
  - [ ] `health_alerts`
- [ ] Row Level Security (RLS) policies verified

## Build Verification Checklist

```bash
# Run these commands and verify they pass:

npm run build
# Expected output: ✓ Compiled successfully
# ○ (Static)   prerendered as static content
# ƒ (Dynamic)  server-rendered on demand

npm run dev
# Expected output: ▲ Next.js 16.2.4
#                 Local: http://localhost:3000
```

- [ ] Build completes without errors
- [ ] Dev server starts successfully
- [ ] No TypeScript errors in terminal
- [ ] No console warnings (except Next.js telemetry)

## Application Functionality Checklist

### Authentication
- [ ] Signup page loads at `http://localhost:3000/auth/signup`
- [ ] Can signup as Patient role
- [ ] Can signup as Doctor role
- [ ] Password validation works (min 8 characters)
- [ ] Duplicate email error shown
- [ ] Login page loads at `http://localhost:3000/auth/login`
- [ ] Can login with signup credentials
- [ ] Redirects to correct dashboard (patient or doctor)

### Patient Features
- [ ] Patient dashboard loads
- [ ] Can view health metrics section
- [ ] Can view appointments section
- [ ] Can view medical records section
- [ ] Health metrics display sample data
- [ ] UI is responsive on mobile and desktop

### Doctor Features
- [ ] Doctor dashboard loads
- [ ] Can view patient list
- [ ] Can view appointments section
- [ ] Doctor-specific features visible
- [ ] UI is responsive on mobile and desktop

### General Features
- [ ] Page navigation works
- [ ] Logout functionality available
- [ ] No JavaScript errors in browser console
- [ ] No network errors (red items in Network tab)
- [ ] Styling looks professional with theme colors

## Browser Console Verification

Open browser DevTools (F12) and check:

- [ ] No red errors in Console
- [ ] No CORS errors
- [ ] No "Refused to frame" errors
- [ ] Network requests return 200 status
- [ ] API calls work (check Network tab)

## VS Code Verification

- [ ] VS Code opens project without errors
- [ ] IntelliSense works (try typing in a .ts file)
- [ ] Go to definition works (Cmd+click on imports)
- [ ] No red squiggly lines for errors
- [ ] TypeScript version shows in bottom right
- [ ] Recommended extensions installed

## Environment Variable Verification

```bash
# In project root, verify .env.local exists and contains:
cat .env.local

# Should output something like:
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# NEXT_PUBLIC_FITBIT_CLIENT_ID=xxx
# FITBIT_CLIENT_SECRET=xxx
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] `.env.local` file exists
- [ ] All 5 variables are present
- [ ] No empty values
- [ ] No quotes around values
- [ ] File is in `.gitignore` (so it won't be committed)

## Common Issues Verification

- [ ] Dev server restarts when files change
- [ ] Page reloads when you change a component
- [ ] Errors clear when you fix the issue
- [ ] Database is reachable (test with API request)
- [ ] Fitbit OAuth redirect URL matches in both places:
  - [ ] `.env.local`: `http://localhost:3000/api/fitbit/callback`
  - [ ] Fitbit Developer Dashboard: same URL

## Performance Verification

- [ ] Page loads in less than 3 seconds
- [ ] Interactions respond immediately
- [ ] No noticeable lag in forms
- [ ] Images load properly
- [ ] Dark mode toggle works (if enabled)

## Final Verification

```bash
# Run full test sequence:

# 1. Clear and rebuild
rm -rf .next node_modules
npm install

# 2. Build
npm run build

# 3. Start dev server
npm run dev

# 4. Open browser
open http://localhost:3000
# or
start http://localhost:3000
```

- [ ] All installation steps complete
- [ ] No errors in console
- [ ] Application loads and functions
- [ ] Can signup/login
- [ ] Can navigate between pages
- [ ] Data persists on refresh

## Troubleshooting Completed

If you encountered issues, verify you completed the fixes:

- [ ] Read LOCAL_SETUP.md for setup instructions
- [ ] Read ERRORS_AND_FIXES.md for error solutions
- [ ] Read PROJECT_SUMMARY.md for architecture overview
- [ ] Checked that build passes with `npm run build`
- [ ] Verified all environment variables are set
- [ ] Verified database is initialized

## Ready to Develop!

Once all checkboxes are marked ✓, you're ready to:

- [ ] Start building features
- [ ] Run tests
- [ ] Deploy to production
- [ ] Share with team members

If any item is not passing, refer to:
- **LOCAL_SETUP.md** - for setup instructions
- **ERRORS_AND_FIXES.md** - for error solutions
- **PROJECT_SUMMARY.md** - for architecture details

Good luck! 🚀
