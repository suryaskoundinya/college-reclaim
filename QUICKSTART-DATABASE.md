# 🚀 Quick Start: Cloud Database Integration

This guide will get you up and running with a cloud database in **under 10 minutes**.

## 📋 Prerequisites

- [x] Node.js 18+ installed
- [x] College Reclaim repository cloned
- [x] npm packages installed (`npm install`)

## 🎯 Option 1: Supabase (Easiest - Recommended)

### 1. Create Free Supabase Account (2 minutes)

1. Visit [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub

### 2. Create New Project (2 minutes)

1. Click "New Project"
2. Fill in details:
   - **Name**: `college-reclaim`
   - **Database Password**: (create a strong password - SAVE THIS!)
   - **Region**: Select closest to you
3. Click "Create new project"
4. Wait ~2 minutes for project creation

### 3. Get Database Connection String (1 minute)

1. In your project, go to **Settings** → **Database**
2. Scroll to "Connection string" section
3. Select **"URI"** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres:your-password@db.abcdefghijklmnop.supabase.co:5432/postgres
```

### 4. Configure Environment (1 minute)

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local
nano .env.local  # or use your favorite editor
```

Update these lines:
```env
DATABASE_URL="postgresql://postgres:your-password@db.abcdefghijklmnop.supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### 5. Initialize Database (2 minutes)

```bash
# Set up the database schema
npm run db:setup

# This runs:
# - npx prisma generate (creates Prisma client)
# - npx prisma db push (creates all tables)
```

You should see:
```
✔ Generated Prisma Client
Your database is now in sync with your schema.
```

### 6. Start Application (30 seconds)

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### 7. Test It Out! ✅

1. **Sign Up**: Create a new account
2. **Report Lost Item**: Go to "Report Lost Item"
3. **View Your Item**: Check that it appears in the list
4. **Verify in Database**:
   ```bash
   npm run db:studio
   ```
   - Opens http://localhost:5555
   - Click on `users` table - see your account
   - Click on `lost_items` table - see your item

## 🎉 Success!

You now have:
- ✅ Cloud database connected
- ✅ Data persisting in the cloud
- ✅ Multi-device access enabled
- ✅ All CRUD operations working

---

## 🎯 Option 2: Railway (Alternative)

### 1. Create Railway Account
1. Visit [https://railway.app](https://railway.app)
2. Sign in with GitHub

### 2. Create Database
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Railway creates database automatically

### 3. Get Connection URL
1. Click on PostgreSQL service
2. Go to "Connect" tab
3. Copy "Postgres Connection URL"

### 4. Configure & Run
```bash
# Edit .env.local
DATABASE_URL="<paste Railway URL here>"

# Initialize and run
npm run db:setup
npm run dev
```

---

## 🎯 Option 3: Neon (Serverless)

### 1. Create Neon Account
1. Visit [https://neon.tech](https://neon.tech)
2. Sign in with GitHub or email

### 2. Create Project
1. Click "Create a project"
2. Name: `college-reclaim`
3. Select region
4. Click "Create project"

### 3. Get Connection String
- Copy the connection string shown
- Add `?sslmode=require` at the end

### 4. Configure & Run
```bash
# Edit .env.local
DATABASE_URL="<paste Neon URL>?sslmode=require"

# Initialize and run
npm run db:setup
npm run dev
```

---

## 🐛 Troubleshooting

### "Can't reach database server"
```bash
# Check your DATABASE_URL
cat .env.local | grep DATABASE_URL

# Verify it starts with postgresql://
```

### "Authentication failed"
```bash
# Double-check your database password
# Reset it in your cloud provider if needed
```

### "Module not found: @prisma/client"
```bash
# Regenerate Prisma client
npm run db:generate
```

### "Schema not in sync"
```bash
# Push schema again
npm run db:push
```

---

## 📚 Next Steps

1. **Deploy to Production**: See [CLOUD-DATABASE-SETUP.md](./CLOUD-DATABASE-SETUP.md)
2. **Add OAuth**: Configure Google/GitHub login in `.env.local`
3. **Explore API**: See [README-PRODUCTION.md](./README-PRODUCTION.md#-api-endpoints)
4. **Manage Data**: Use `npm run db:studio` to browse database

---

## 💡 Helpful Commands

```bash
# Database management
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:studio      # Open database GUI
npm run db:migrate     # Create migration (production)
npm run db:setup       # Complete setup (generate + push)

# Application
npm run dev            # Start development server
npm run build          # Build for production
npm start              # Start production server
```

---

## 🆘 Need Help?

- 📖 [Full Database Setup Guide](./CLOUD-DATABASE-SETUP.md)
- 📖 [Database Integration Status](./DATABASE-INTEGRATION.md)
- 📖 [Main README](./README.md)
- 🐛 [Open an Issue](https://github.com/suryaskoundinya/college-reclaim/issues)

---

**Made with ❤️ for college communities** 🎓

**Time to completion**: 5-10 minutes ⏱️
