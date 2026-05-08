# Telemedicine Platform - VS Code Setup Guide

This guide walks you through setting up the telemedicine application in Visual Studio Code for local development.

## Quick Start (5 minutes)

### 1. Prerequisites

Ensure you have installed:
- **Node.js 18.17+** - [Download](https://nodejs.org/)
- **npm 9+** - (comes with Node.js)
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Git** - [Download](https://git-scm.com/)

### 2. Clone/Open Project

```bash
# Open VS Code and open this project folder
# File → Open Folder → Select project directory
# Or from terminal:
cd /path/to/telemedicine-platform
code .
```

### 3. Install Dependencies

```bash
# In VS Code terminal (Ctrl+` or View → Terminal)
npm install

# Wait for completion (2-5 minutes)
```

### 4. Setup Environment Variables

```bash
# Create .env.local in project root
# Copy from .env.example and fill in your credentials

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_FITBIT_CLIENT_ID=your_fitbit_id
FITBIT_CLIENT_SECRET=your_fitbit_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Initialize Database

1. Go to Supabase dashboard
2. Open SQL Editor
3. Copy and paste content from: `supabase/migrations/001_create_initial_schema.sql`
4. Click "Run"

### 6. Start Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser. ✨

---

## Detailed Guides

Choose what you need help with:

### Getting Started
- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Complete local development setup
- **[VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)** - Verify your setup is correct
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick reference guide

### Troubleshooting
- **[ERRORS_AND_FIXES.md](./ERRORS_AND_FIXES.md)** - Solutions for common errors
- **[NPM_COMMANDS.md](./NPM_COMMANDS.md)** - npm commands reference

### Project Info
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Architecture overview
- **[SETUP.md](./SETUP.md)** - Advanced configuration

---

## What This Project Includes

✅ **Authentication System**
- Patient and Doctor user roles
- Secure password hashing
- Email/password login & signup

✅ **Patient Dashboard**
- View health metrics from Fitbit
- Schedule appointments with doctors
- Store medical records
- Monitor health alerts

✅ **Doctor Dashboard**
- View all patients and their metrics
- Schedule appointments
- Manage medical records
- Send health alerts

✅ **Fitbit Integration**
- OAuth 2.0 authentication
- Real-time health data sync
- Heart rate, steps, sleep tracking

✅ **Database**
- Supabase PostgreSQL
- Row Level Security (RLS)
- Type-safe database operations

✅ **UI/UX**
- Professional healthcare design
- Deep Blue & Teal color scheme
- Responsive mobile-first layout
- shadcn/ui components

---

## VS Code Extensions (Recommended)

For best development experience, install these extensions:

```
- Prettier (esbenp.prettier-vscode) - Code formatter
- ESLint (dbaeumer.vscode-eslint) - Code quality
- Tailwind CSS (bradlc.vscode-tailwindcss) - CSS autocomplete
- Thunder Client (rangav.vscode-thunder-client) - API testing
```

These are automatically recommended when you open the project.

---

## Common Workflows

### Starting Development

```bash
# 1. Open terminal in VS Code
# 2. Run:
npm run dev

# 3. Open http://localhost:3000
# 4. Make changes - page auto-reloads!
```

### Testing Authentication

```bash
# 1. Go to http://localhost:3000/auth/signup
# 2. Sign up as Patient
# 3. Go to http://localhost:3000/auth/login
# 4. Login with your credentials
# 5. You'll see the Patient Dashboard
```

### Debugging

```bash
# Add debug logs (with [v0] prefix):
console.log('[v0] User:', user)
console.log('[v0] Health data:', healthData)

# Open browser DevTools (F12)
# Check Console tab for your logs
# Check Network tab for API calls
```

### Building for Production

```bash
# Verify build works:
npm run build

# Start production server:
npm start
```

---

## File Structure Overview

```
project-root/
├── app/
│   ├── api/                    # API routes
│   ├── auth/                   # Auth pages (signup/login)
│   ├── patient/                # Patient pages
│   ├── doctor/                 # Doctor pages
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
│
├── lib/
│   ├── supabase/               # Supabase clients
│   ├── auth.ts                 # Auth utilities
│   └── database.types.ts       # TypeScript types
│
├── components/
│   └── ui/                     # UI components
│
├── public/                     # Static files
├── supabase/
│   └── migrations/             # Database schema
│
├── .env.example                # Example env file
├── .env.local                  # Your env (don't commit!)
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── next.config.js              # Next.js config
```

---

## Keyboard Shortcuts (VS Code)

| Shortcut | Action |
|----------|--------|
| `Ctrl+~` | Open/Close terminal |
| `Cmd+P` / `Ctrl+P` | Quick file open |
| `Cmd+Shift+P` / `Ctrl+Shift+P` | Command palette |
| `Cmd+K Cmd+0` | Fold all code |
| `Cmd+K Cmd+J` | Unfold all code |
| `F2` | Rename symbol |
| `Cmd+Click` / `Ctrl+Click` | Go to definition |
| `Cmd+/` / `Ctrl+/` | Toggle comment |

---

## Troubleshooting Quick Fixes

### "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Dev server won't start
```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9
npm run dev
```

### TypeScript errors
```bash
# Reload VS Code
Cmd+Shift+P → "Developer: Reload Window"
# Or restart VS Code completely
```

### Can't connect to Supabase
- Check `.env.local` has correct URL and key
- Verify Supabase project is active
- Restart dev server

### Fitbit OAuth not working
- Verify redirect URL in both `.env.local` and Fitbit dashboard
- Check Client ID and Client Secret are correct
- Clear browser cache and try again

---

## Getting Help

1. **Check the docs first:**
   - [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Setup issues
   - [ERRORS_AND_FIXES.md](./ERRORS_AND_FIXES.md) - Error solutions
   - [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Architecture

2. **Check the error message:**
   - Read the full error (don't skip to the end)
   - Search the error message online
   - Check if it's a known issue in docs

3. **Try common fixes:**
   - Restart dev server: Stop with Ctrl+C, run `npm run dev` again
   - Clear cache: `rm -rf .next node_modules`
   - Check environment variables in `.env.local`

4. **Debug systematically:**
   - Check browser console (F12)
   - Check terminal output
   - Add console.log() statements
   - Check Network tab for API errors

---

## Features Overview

### For Patients
- ✅ Sign up and create account
- ✅ Login securely
- ✅ Connect Fitbit device
- ✅ View real-time health metrics
- ✅ Schedule appointments with doctors
- ✅ Store and view medical records
- ✅ Receive health alerts

### For Doctors
- ✅ Sign up and create account
- ✅ Login securely
- ✅ View list of all patients
- ✅ View patient health metrics
- ✅ Schedule and manage appointments
- ✅ View and manage medical records
- ✅ Send health alerts to patients

---

## Next Steps

After successful setup:

1. ✅ **Explore the code**
   - Check `app/patient/dashboard` for patient UI
   - Check `app/doctor/dashboard` for doctor UI
   - Review `lib/auth.ts` for authentication logic

2. ✅ **Test the app**
   - Sign up as patient and doctor
   - Try different features
   - Check browser DevTools

3. ✅ **Customize**
   - Update colors in `app/globals.css`
   - Modify components in `components/`
   - Add new pages in `app/`

4. ✅ **Deploy**
   - Run `npm run build` to verify
   - Push to GitHub
   - Deploy to Vercel

---

## Project Stats

- **Lines of code:** 5,000+
- **Components:** 50+
- **API endpoints:** 8
- **Database tables:** 7
- **Build time:** ~6 seconds
- **Package size:** ~400MB (node_modules)

---

## Quick Reference

```bash
# Install and setup
npm install

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Check code quality

# Ports
http://localhost:3000   # Main app
http://localhost:3000/auth/signup      # Patient/Doctor signup
http://localhost:3000/auth/login       # Patient/Doctor login
http://localhost:3000/patient/dashboard   # Patient dashboard
http://localhost:3000/doctor/dashboard    # Doctor dashboard
```

---

## Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Fitbit API Documentation:** https://dev.fitbit.com/build/reference/web-api/
- **shadcn/ui Components:** https://ui.shadcn.com/
- **TypeScript Documentation:** https://www.typescriptlang.org/docs/
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs

---

## Important Notes

⚠️ **Never commit `.env.local`** - It contains sensitive credentials
- Already in `.gitignore`
- Each developer needs their own copy

⚠️ **Database migrations** - Only run migrations once per database
- Check Supabase SQL Editor to see current schema
- Don't re-run migrations

⚠️ **Fitbit OAuth** - Redirect URL must match exactly
- Development: `http://localhost:3000/api/fitbit/callback`
- Production: `https://yourdomain.com/api/fitbit/callback`

---

## Success Checklist

- [ ] Node.js and npm installed
- [ ] Project opened in VS Code
- [ ] `npm install` completed
- [ ] `.env.local` created with credentials
- [ ] Database initialized
- [ ] `npm run dev` starts successfully
- [ ] http://localhost:3000 loads in browser
- [ ] Can signup and login
- [ ] Dashboard displays correctly

If all items are checked ✅, you're ready to develop!

---

**Good luck! Build something amazing! 🚀**

For detailed help, see [LOCAL_SETUP.md](./LOCAL_SETUP.md) or [ERRORS_AND_FIXES.md](./ERRORS_AND_FIXES.md).
