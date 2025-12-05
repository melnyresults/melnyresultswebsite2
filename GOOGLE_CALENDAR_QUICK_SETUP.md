# Google Calendar Integration - Quick Setup Guide

## Problem

You're seeing a "401 Missing authorization header" error because the OAuth credentials haven't been configured yet.

## Solution

Follow these steps to set up Google Calendar integration:

### Step 1: Create Google Cloud Project (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Name it something like **"Booking System"**
4. Click **"Create"**

### Step 2: Enable Calendar API (1 minute)

1. In your new project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Calendar API"**
3. Click on it and click **"Enable"**

### Step 3: Create OAuth Credentials (5 minutes)

1. Go to **"APIs & Services"** → **"Credentials"**

2. Click **"Create Credentials"** → **"OAuth client ID"**

3. If prompted to configure consent screen:
   - Click **"Configure Consent Screen"**
   - Choose **"External"** (unless you have a Workspace account)
   - Fill in required fields:
     - App name: Your app name
     - User support email: Your email
     - Developer contact: Your email
   - Click **"Save and Continue"**
   - On Scopes page, click **"Add or Remove Scopes"**
   - Search and add these scopes:
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/calendar.readonly`
   - Click **"Save and Continue"**
   - Add yourself as a test user (your email)
   - Click **"Save and Continue"**

4. Back to **"Create OAuth client ID"**:
   - Application type: **"Web application"**
   - Name: **"Booking System"**

5. Add **Authorized redirect URIs**:
   ```
   https://hjzwwognrulmaebsjjwd.supabase.co/functions/v1/google-oauth
   ```

   **IMPORTANT:** This must be the exact URL. No trailing slashes, no additional parameters.

   For local development with Supabase CLI, also add:
   ```
   http://localhost:54321/functions/v1/google-oauth
   ```

6. Click **"Create"**

7. **SAVE THESE VALUES** - You'll need them in the next step:
   - Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
   - Client Secret (looks like: `GOCSPx-xxxxx`)

### Step 4: Configure Supabase Environment Variables (2 minutes)

You need to add these environment variables to your Supabase project:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **hjzwwognrulmaebsjjwd**
3. Go to **"Project Settings"** → **"Edge Functions"** → **"Environment Variables"**
4. Add these three variables:

   **Variable 1:**
   - Name: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Client ID from Step 3 (e.g., `123456789.apps.googleusercontent.com`)

   **Variable 2:**
   - Name: `GOOGLE_CLIENT_SECRET`
   - Value: Your Client Secret from Step 3 (e.g., `GOCSPx-xxxxxxxxxxxx`)

   **Variable 3:**
   - Name: `GOOGLE_REDIRECT_URI`
   - Value: `https://hjzwwognrulmaebsjjwd.supabase.co/functions/v1/google-oauth`

   **Optional Variable 4:**
   - Name: `APP_URL`
   - Value: `http://localhost:5173` (for development) or your production domain

5. Click **"Save"** for each variable

### Step 5: Update Local .env File (1 minute)

Add these to your local `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://hjzwwognrulmaebssjjwd.supabase.co/functions/v1/google-oauth
APP_URL=http://localhost:5173
```

Replace the values with your actual credentials from Step 3.

### Step 6: Test the Integration

1. Restart your dev server if running
2. Log in to your app
3. Go to Settings tab in the Dashboard
4. Click **"Connect Calendar"**
5. A popup should open with Google's OAuth consent screen
6. Sign in and grant permissions
7. You should be redirected back and see "Google Calendar connected successfully!"

## Troubleshooting

### Still getting 401 error?

**Check these:**
1. All environment variables are set in Supabase Dashboard (especially the 3 required ones)
2. Edge function has been deployed successfully
3. You've added the redirect URI exactly as shown in Google Cloud Console

### "redirect_uri_mismatch" error?

The redirect URI in Google Cloud Console must **exactly** match:
```
https://hjzwwognrulmaebsjjwd.supabase.co/functions/v1/google-oauth
```

No trailing slashes, no typos, no query parameters.

### "access_denied" error?

Make sure you:
1. Added the required scopes in OAuth consent screen
2. Added yourself as a test user
3. Granted all permissions when Google asks

### "unauthorized_client" error?

1. Make sure you enabled Google Calendar API in Step 2
2. Verify your Client ID and Client Secret are correct
3. Check that the OAuth consent screen is fully configured

### Getting configuration errors?

If you see "Google Calendar integration is not configured", it means the environment variables are missing in Supabase. Go back to Step 4 and add them.

## Security Notes

- Never commit `GOOGLE_CLIENT_SECRET` to version control
- Keep it in `.env` file (which should be in `.gitignore`)
- The secret is only used in Edge Functions (server-side)
- Only `VITE_GOOGLE_CLIENT_ID` is safe to expose to the browser

## What Happens After Setup?

Once configured, your app will:
1. Let users connect their Google Calendar
2. Check their calendar for conflicts when showing available booking slots
3. Automatically create calendar events when bookings are confirmed
4. Send calendar invites to guests
5. Keep tokens refreshed automatically

## Need More Help?

See the full guide: `GOOGLE_CALENDAR_INTEGRATION_GUIDE.md`

Or check the [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2/web-server)
