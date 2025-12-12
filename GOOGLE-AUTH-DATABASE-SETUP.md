# Google Authentication & Database Setup Guide

This guide will help you set up Google Authentication and PostgreSQL database for cross-device data persistence.

## 🗄️ Step 1: Set Up Database (Choose One Option)

### Option A: Supabase (Recommended - Free & Easy)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up for a free account
   - Click "New Project"

2. **Configure Project**
   - Organization: Your name or organization
   - Project Name: `college-reclaim`
   - Database Password: Create a strong password (SAVE THIS!)
   - Region: Choose closest to your location
   - Click "Create new project"

3. **Get Database URL**
   - Wait for project to initialize (1-2 minutes)
   - Go to "Project Settings" (gear icon)
   - Click "Database" in sidebar
   - Find "Connection string" section
   - Select "Transaction" mode
   - Copy the connection string
   - It looks like: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

4. **Update .env.local**
   - Open `.env.local` file
   - Replace the `DATABASE_URL` with your Supabase connection string
   - Replace `[YOUR-PASSWORD]` in the URL with your actual password

### Option B: Local PostgreSQL

1. **Install PostgreSQL**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE college_reclaim;
   \q
   ```

3. **Update .env.local**
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/college_reclaim"
   ```

## 🔐 Step 2: Set Up Google OAuth

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create or Select Project**
   - Click project dropdown at top
   - Click "NEW PROJECT"
   - Project name: `College Reclaim`
   - Click "CREATE"

3. **Enable Google+ API**
   - In the search bar, type "Google+ API"
   - Click on it
   - Click "ENABLE"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" (for testing)
   - Click "CREATE"
   - Fill in:
     - App name: `College Reclaim`
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE"
   - Skip scopes, test users for now
   - Click "BACK TO DASHBOARD"

5. **Create OAuth Credentials**
   - Go to "Credentials" tab
   - Click "CREATE CREDENTIALS"
   - Select "OAuth client ID"
   - Application type: "Web application"
   - Name: `College Reclaim Web`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://your-domain.vercel.app` (add your production URL)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-domain.vercel.app/api/auth/callback/google`
   - Click "CREATE"

6. **Copy Credentials**
   - You'll see a popup with:
     - Client ID (looks like: `123456-abc.apps.googleusercontent.com`)
     - Client Secret (looks like: `GOCSPX-abc123xyz`)
   - Copy both values

7. **Update .env.local**
   - Open `.env.local`
   - Replace `GOOGLE_CLIENT_ID` with your Client ID
   - Replace `GOOGLE_CLIENT_SECRET` with your Client Secret

## 🚀 Step 3: Initialize Database

Run these commands in your terminal:

```bash
# Navigate to project directory
cd c:\Users\surya\Desktop\code\college_reclaim_prod

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

## ✅ Step 4: Test Your Setup

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test Google Login**
   - Open http://localhost:3000
   - Click "Sign In"
   - Click "Sign in with Google"
   - You should be redirected to Google login
   - After login, you should be redirected back to your app

3. **Verify Database**
   - After logging in, your user data should be stored in the database
   - You can view it in:
     - Supabase: Go to "Table Editor" in your project
     - Local: Run `npx prisma studio` to open database GUI

## 🌐 Step 5: Deploy to Production (Vercel)

1. **Add Environment Variables to Vercel**
   - Go to https://vercel.com
   - Select your project
   - Go to "Settings" > "Environment Variables"
   - Add all variables from `.env.local`:
     - `DATABASE_URL` (your Supabase URL)
     - `NEXTAUTH_URL` (your production URL: https://your-app.vercel.app)
     - `NEXTAUTH_SECRET` (same secret)
     - `GOOGLE_CLIENT_ID` (same ID)
     - `GOOGLE_CLIENT_SECRET` (same secret)

2. **Update Google OAuth**
   - Go back to Google Cloud Console
   - Add your Vercel production URL to:
     - Authorized JavaScript origins: `https://your-app.vercel.app`
     - Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`

3. **Deploy**
   - Push your code to GitHub
   - Vercel will automatically deploy
   - Or run: `vercel --prod`

## 🔍 Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Console exactly matches:
  - `http://localhost:3000/api/auth/callback/google` (for local)
  - `https://your-domain.vercel.app/api/auth/callback/google` (for production)

### Database connection errors
- Check your DATABASE_URL is correct
- For Supabase: Make sure password is correct in the connection string
- For local: Make sure PostgreSQL service is running

### "NEXTAUTH_URL" errors
- Local: Should be `http://localhost:3000`
- Production: Should be your full Vercel URL (no trailing slash)

## 📱 Cross-Device Access

Once deployed with Supabase/PostgreSQL:
- ✅ Users can log in from any device
- ✅ All listed items are stored in cloud database
- ✅ Items listed on one device appear on all devices
- ✅ User session persists across devices
- ✅ Real-time data synchronization

## 🎉 You're Done!

Your app now has:
- ✅ Google Authentication
- ✅ PostgreSQL cloud database
- ✅ Cross-device data persistence
- ✅ Production-ready setup

Need help? Check the logs:
- Development: Terminal output
- Production: Vercel dashboard > Logs
- Database: Supabase dashboard > Logs
