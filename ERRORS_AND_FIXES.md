# Common Errors and Solutions

This guide helps you troubleshoot common errors you might encounter when developing locally.

## TypeScript & Compilation Errors

### Error: "Cannot find module '@/lib/...'"

**Cause:** TypeScript path alias is not resolved correctly.

**Solution:**
```bash
# 1. Verify tsconfig.json has correct paths
# Should have: "@/*": ["./*"]

# 2. Restart VS Code (Cmd+Shift+P → "Developer: Reload Window")

# 3. Clear TypeScript cache
rm -rf .next/

# 4. Rebuild
npm run build
```

---

### Error: "Type 'X' is not assignable to type 'Y'"

**Cause:** TypeScript type mismatch in your code.

**Solution:**
1. Check the file with the error
2. Look at the exact type expected vs. provided
3. Cast if necessary: `value as ExpectedType`

Example:
```typescript
// Before (error)
const user: UserProfile = userData

// After (fixed)
const user: UserProfile = userData as UserProfile
```

---

### Error: "Property 'X' does not exist on type 'Y'"

**Cause:** Accessing a property that doesn't exist on the object.

**Solution:**
1. Check the type definition in `lib/database.types.ts`
2. Verify the property name is correct
3. Use optional chaining if property might not exist: `user?.property`

---

## Next.js Build Errors

### Error: "useSearchParams() should be wrapped in a suspense boundary"

**Cause:** Using `useSearchParams()` in a Server Component without Suspense.

**Solution:**
```typescript
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Wrap component using useSearchParams
function SearchComponent() {
  const searchParams = useSearchParams()
  return <div>{searchParams.get('q')}</div>
}

// In your page:
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent />
    </Suspense>
  )
}
```

**Status:** ✅ Already fixed in `/app/auth/login/page.tsx`

---

### Error: "Unsupported metadata viewport"

**Cause:** `viewport` property in `metadata` export instead of separate `viewport` export.

**Solution:**
```typescript
// Before (wrong)
export const metadata = {
  title: 'Page',
  viewport: { width: 'device-width' }
}

// After (correct)
export const metadata = {
  title: 'Page'
}

export const viewport = {
  width: 'device-width'
}
```

**Status:** ✅ Already fixed in `/app/layout.tsx`

---

### Error: "Failed to compile" after file changes

**Cause:** File has syntax errors or missing imports.

**Solution:**
```bash
# 1. Check error message carefully
# 2. Fix the error in the file
# 3. Save the file
# 4. Server should auto-reload

# If not:
# Stop server (Ctrl+C) and restart
npm run dev
```

---

## Runtime Errors

### Error: "Cannot read property 'X' of undefined"

**Cause:** Trying to access property on undefined object.

**Solution:**
1. Check if object exists before accessing
2. Use optional chaining: `obj?.property`
3. Use nullish coalescing: `obj?.property ?? defaultValue`

```typescript
// Before (error)
const email = user.email

// After (safe)
const email = user?.email ?? 'unknown'
```

---

### Error: "Fetch failed" or "Network error"

**Cause:** API route not responding or URL is wrong.

**Solution:**
```bash
# 1. Verify dev server is running
# 2. Check URL is correct: /api/auth/login (not /api/auth/login/)
# 3. Check Supabase credentials in .env.local
# 4. Check browser console for details

# 5. Test API manually
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe","userType":"patient"}'
```

---

### Error: "Invalid email or password"

**Cause:** User doesn't exist or password is incorrect.

**Solution:**
1. Make sure you signed up first at `/auth/signup`
2. Use same email and password you signed up with
3. Check for typos in email/password
4. Try signing up with a new email

---

## Database Errors

### Error: "relation 'users' does not exist"

**Cause:** Database tables haven't been created.

**Solution:**
1. Go to Supabase dashboard
2. Go to SQL Editor
3. Paste SQL from `supabase/migrations/001_create_initial_schema.sql`
4. Click "Run"
5. Verify all tables are created in "Tables" menu

---

### Error: "new row violates row-level security policy"

**Cause:** RLS policy prevents insert/update operation.

**Solution:**
1. Check RLS policies in Supabase dashboard
2. Ensure current user has permission
3. Temporarily disable RLS to debug:
   - Go to Authentication → Policies
   - Review the policies for the table
   - Make sure conditions match your user

---

### Error: "PGRST116: 'id' violates foreign key constraint"

**Cause:** Trying to insert record with non-existent foreign key.

**Solution:**
1. Ensure referenced record exists first
2. Check that IDs match between tables
3. Insert parent record before child record

---

## Environment Variable Errors

### Error: "NEXT_PUBLIC_SUPABASE_URL is undefined"

**Cause:** Environment variable not set in `.env.local`.

**Solution:**
1. Create `.env.local` in project root
2. Copy content from `.env.example`
3. Fill in actual values from Supabase dashboard
4. **Do NOT commit `.env.local` to Git**
5. Restart dev server: `npm run dev`

```bash
# Correct file location:
/vercel/share/v0-project/.env.local

# NOT in these locations:
/vercel/share/v0-project/app/.env.local    ❌
/vercel/share/v0-project/.env              ❌ (wrong name)
```

---

### Error: "Cannot read property of undefined" in API route

**Cause:** Environment variable not available in server-side code.

**Solution:**
- In API routes, use `process.env.FITBIT_CLIENT_SECRET` (without `NEXT_PUBLIC_`)
- On client side, use `process.env.NEXT_PUBLIC_SUPABASE_URL` (with `NEXT_PUBLIC_`)

---

## Fitbit Integration Errors

### Error: "Invalid redirect_uri"

**Cause:** Fitbit OAuth redirect URL doesn't match what's registered.

**Solution:**
1. Go to https://dev.fitbit.com/build/reference/web-api/oauth2-guide/
2. In your app settings, set Redirect URL to: `http://localhost:3000/api/fitbit/callback`
3. Restart dev server
4. Try OAuth flow again

---

### Error: "Invalid client_id or client_secret"

**Cause:** Wrong credentials in `.env.local`.

**Solution:**
1. Go to Fitbit dev dashboard
2. Copy exact Client ID (not Client Secret)
3. Copy exact Client Secret
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_FITBIT_CLIENT_ID=your_exact_id
   FITBIT_CLIENT_SECRET=your_exact_secret
   ```
5. Restart server
6. Verify with: `echo $NEXT_PUBLIC_FITBIT_CLIENT_ID`

---

### Error: "Fitbit API rate limit exceeded"

**Cause:** Too many API requests in short time.

**Solution:**
- Fitbit allows ~150 requests per hour
- Wait ~1 hour before retrying
- Implement request queuing in production

---

## Port and Process Errors

### Error: "Error: listen EADDRINUSE: address already in use :::3000"

**Cause:** Another process is already using port 3000.

**Solution:**

**macOS/Linux:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

---

### Error: "npm: command not found"

**Cause:** Node.js/npm not installed or not in PATH.

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install it (npm comes with Node.js)
3. Restart terminal
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

---

## IDE and Editor Errors

### Error: "TypeScript Language Server crashed"

**Cause:** VS Code TypeScript service has issues.

**Solution:**
```
1. Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
2. Type "Developer: Reload Window"
3. Press Enter

Or restart VS Code completely
```

---

### Error: "Can't find tsconfig.json"

**Cause:** VS Code is not in the project root directory.

**Solution:**
1. Open VS Code
2. File → Open Folder
3. Select the project root (`/vercel/share/v0-project`)
4. Click Open

---

### IntelliSense not working

**Cause:** TypeScript service not finding types.

**Solution:**
```bash
# 1. Ensure you're using workspace TypeScript
# Press Cmd+Shift+P (Ctrl+Shift+P on Windows)
# Type "TypeScript: Select TypeScript Version"
# Choose "Use Workspace Version"

# 2. Restart VS Code
# 3. Delete .next folder and rebuild
rm -rf .next
npm run dev
```

---

## Common Command Errors

### Error: "command not found: npm"

**Cause:** npm is not installed or not in system PATH.

**Solution:**
```bash
# Check if Node/npm installed
node --version
npm --version

# If not installed, download from https://nodejs.org/
# Then restart terminal and try again
```

---

### Error: "The system cannot find the path specified"

**Cause:** Running commands from wrong directory.

**Solution:**
```bash
# Make sure you're in project root
cd ~/Projects/telemedicine-platform

# Then run npm commands
npm install
npm run dev
```

---

## Help and Support

If you see an error not listed here:

1. **Read the error message carefully** - it usually tells you what's wrong
2. **Check the file and line number** mentioned in the error
3. **Search the error in Google** or GitHub issues
4. **Check environment variables** are set correctly
5. **Try clearing cache:**
   ```bash
   rm -rf node_modules .next package-lock.json
   npm install
   npm run dev
   ```

---

## Debugging Tips

### Enable debug logging

Add `[v0]` prefix to track execution:
```typescript
console.log('[v0] User signup attempt:', email)
console.log('[v0] Fitbit API response:', response)
```

### Check browser DevTools

Press `F12` to open Developer Tools:
- **Console tab** - JavaScript errors
- **Network tab** - API requests/responses
- **Storage tab** - localStorage/sessionStorage

### Monitor server logs

Watch terminal where `npm run dev` is running:
- Compilation errors
- API route logs
- Database connection errors

---

## Quick Health Check

Run these commands to verify your setup:

```bash
# Check Node version
node --version    # Should be 18.17+

# Check npm version
npm --version     # Should be 9+

# Check Git
git --version

# Check .env.local exists
cat .env.local    # Should show your env variables

# Run build
npm run build     # Should succeed with no errors

# Start dev server
npm run dev       # Should start on http://localhost:3000
```

If all these pass, your setup is correct! 🎉
