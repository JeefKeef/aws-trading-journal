# Phase 1: Authentication Setup - Complete Guide

## ✅ What We've Implemented

### 1. Middleware (`middleware.ts`)
- ✅ Protects all app routes (`/dashboard`, `/chat`, `/trades`, etc.)
- ✅ Redirects unauthenticated users to `/login` with return URL
- ✅ Redirects authenticated users away from auth pages
- ✅ Handles session refresh automatically

### 2. Supabase Clients
- ✅ `lib/supabase/client.ts` - Browser client for client components
- ✅ `lib/supabase/server.ts` - Server client for API routes/server components
- ✅ Proper cookie handling for SSR

### 3. Auth Context (`lib/contexts/auth-context.tsx`)
- ✅ Global authentication state
- ✅ User object access across app
- ✅ Sign out functionality
- ✅ Auto-refresh on auth state changes

### 4. Updated Components
- ✅ `/login` page - Email/password + Google/GitHub OAuth
- ✅ `TopNav` - Shows user email, sign out button
- ✅ Root layout - Wraps app with `AuthProvider`
- ✅ OAuth callback handler (`/auth/callback`)

### 5. Database Schema
- ✅ Created `supabase-core-schema.sql` with all tables:
  - `user_profiles`
  - `conversations` & `messages`
  - `trades`
  - `user_preferences`
  - `notifications`
  - `calendar_events`
- ✅ All RLS policies configured
- ✅ Auto-create profile/preferences on signup
- ✅ Proper indexes and triggers

---

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization, name your project (e.g., "signal-trading")
4. Choose database password (save it!)
5. Select region (pick closest to your users)
6. Click "Create new project"
7. Wait ~2 minutes for provisioning

### Step 2: Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - `Project URL` (starts with `https://xxx.supabase.co`)
   - `anon/public key` (long JWT token)
   - `service_role key` (different long JWT - KEEP SECRET!)

### Step 3: Configure Auth Providers

#### A. Enable Email/Password Auth
1. Go to **Authentication** → **Providers**
2. Find "Email" and make sure it's enabled (should be by default)
3. Configure email templates if desired (optional)

#### B. Enable Google OAuth
1. In **Authentication** → **Providers**, click "Google"
2. Toggle "Enable Sign in with Google"
3. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
4. Paste Client ID and Client Secret in Supabase
5. Save

#### C. Enable GitHub OAuth
1. In **Authentication** → **Providers**, click "GitHub"
2. Toggle "Enable Sign in with GitHub"
3. **Get GitHub OAuth Credentials:**
   - Go to [GitHub Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Application name: "Signal Trading"
   - Homepage URL: `http://localhost:3000` (for dev)
   - Authorization callback URL: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Register application
   - Copy Client ID
   - Generate Client Secret
4. Paste Client ID and Client Secret in Supabase
5. Save

### Step 4: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy contents of `supabase-core-schema.sql`
4. Paste into editor
5. Click "Run" (bottom right)
6. ✅ Should see "Success. No rows returned"
7. Repeat for `supabase-journal-schema.sql`

### Step 5: Add Environment Variables

Create `.env.local` in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (keep existing)
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
```

**⚠️ IMPORTANT:** Make sure `.env.local` is in `.gitignore`!

### Step 6: Install Dependencies

```bash
npm install @supabase/ssr @supabase/supabase-js
```

### Step 7: Test the Setup

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test signup flow:**
   - Go to `http://localhost:3000/login`
   - Click "Sign up" link
   - Create account with email/password
   - Should redirect to `/dashboard`

3. **Test middleware protection:**
   - Sign out
   - Try to access `http://localhost:3000/dashboard`
   - Should redirect to `/login?redirect=/dashboard`

4. **Test sign in:**
   - Sign in with credentials you just created
   - Should redirect back to dashboard
   - Check TopNav - should show your email

5. **Test sign out:**
   - Click avatar in TopNav
   - Click "Sign out"
   - Should redirect to `/login`
   - Try accessing dashboard again - should redirect to login

6. **Test OAuth (optional):**
   - Click "Google" button on login
   - Complete Google auth flow
   - Should redirect back and create account

### Step 8: Verify Database

1. Go to Supabase Dashboard → **Table Editor**
2. Check that tables were created:
   - ✅ `user_profiles`
   - ✅ `user_preferences`
   - ✅ `conversations`
   - ✅ `messages`
   - ✅ `trades`
   - ✅ `notifications`
   - ✅ `calendar_events`
   - ✅ `journal_folders`
   - ✅ `journal_notes`

3. After signing up, check `user_profiles` and `user_preferences` tables
4. Should see 1 row with your user ID

---

## 🐛 Troubleshooting

### Issue: "Invalid API key"
**Solution:** Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct in `.env.local`. Restart dev server after changes.

### Issue: OAuth providers not working
**Solution:** 
1. Verify callback URL is correct: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
2. Check Client ID and Secret are pasted correctly
3. Make sure provider is "Enabled" in Supabase

### Issue: RLS policies blocking queries
**Solution:** Check that:
1. User is authenticated (`auth.uid()` returns value)
2. Queries are using Supabase client (not bypassing RLS)
3. RLS policies are correct for the operation

### Issue: Middleware not protecting routes
**Solution:** 
1. Clear browser cookies
2. Restart Next.js dev server
3. Check `middleware.ts` is in project root
4. Verify `matcher` config includes the routes

### Issue: Session not persisting
**Solution:**
1. Check cookies are enabled in browser
2. Verify `@supabase/ssr` is installed
3. Check middleware is refreshing session correctly

---

## 🎯 Next Steps (Phase 2)

Now that authentication is working, you can:

1. **Test with multiple users:**
   - Create 2-3 accounts
   - Verify data isolation (each user only sees their data)

2. **Start implementing API routes:**
   - Begin with `/api/trades` (simplest)
   - Follow the pattern in `BACKEND_IMPLEMENTATION_PLAN.md`

3. **Update pages to fetch real data:**
   - Start with Dashboard (replace mock trades)
   - Then Trades page
   - Then Chat (add persistence)

4. **Enable Realtime (optional):**
   - Test Supabase Realtime for notifications
   - Add live updates to TopNav

---

## 📚 Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Check for TypeScript errors
npx tsc --noEmit

# Check for lint errors
npm run lint
```

---

## ✅ Phase 1 Complete Checklist

- [x] Middleware created and protecting routes
- [x] Supabase clients configured (browser + server)
- [x] Auth context provider implemented
- [x] Login page with email/password + OAuth
- [x] TopNav updated with sign out
- [x] OAuth callback handler created
- [x] Database schema created (core tables)
- [x] RLS policies enabled on all tables
- [x] Auto-create profile/preferences on signup
- [ ] Supabase project created (DO THIS)
- [ ] Auth providers configured (DO THIS)
- [ ] Environment variables added (DO THIS)
- [ ] Database schema run in Supabase (DO THIS)
- [ ] Auth flow tested end-to-end (DO THIS)

---

**You're ready to start Phase 2!** 🎉

The authentication foundation is solid. Now you can start building API routes and connecting your pages to real data.
