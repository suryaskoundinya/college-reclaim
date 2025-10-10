# 🌐 Cloud Database Setup Guide for College Reclaim

This guide will help you integrate a **free cloud database** into College Reclaim to enable persistent data storage accessible from any device.

## 📋 Overview

College Reclaim is built with **PostgreSQL** and **Prisma ORM**, making it compatible with any PostgreSQL cloud provider. This guide covers setup for the most popular free cloud database options.

---

## 🎯 Quick Start (Choose Your Provider)

### ⭐ Option 1: Supabase (Recommended for Beginners)

**Why Supabase?**
- ✅ Free tier: 500MB database, 2GB bandwidth
- ✅ Built-in authentication (can replace NextAuth if needed)
- ✅ Real-time subscriptions
- ✅ Easy-to-use dashboard
- ✅ Automatic backups

**Setup Steps:**

1. **Create Account**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign up with GitHub or email

2. **Create New Project**
   - Click "New Project"
   - Enter project name: `college-reclaim`
   - Create a strong database password (save this!)
   - Select region closest to your users
   - Click "Create new project" (takes ~2 minutes)

3. **Get Database URL**
   - Go to Project Settings → Database
   - Find "Connection string" section
   - Copy the "URI" connection string
   - Replace `[YOUR-PASSWORD]` with your database password

4. **Configure Environment**
   ```bash
   # In your .env.local file
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

5. **Initialize Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

6. **Verify Connection**
   ```bash
   npm run dev
   ```

---

### 🚂 Option 2: Railway.app

**Why Railway?**
- ✅ Free tier: $5 monthly credit (enough for small apps)
- ✅ One-click PostgreSQL deployment
- ✅ Simple dashboard
- ✅ Automatic SSL certificates

**Setup Steps:**

1. **Create Account**
   - Visit [https://railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Railway creates the database automatically

3. **Get Database URL**
   - Click on the PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"

4. **Configure Environment**
   ```bash
   # In your .env.local file
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].railway.app:5432/railway"
   ```

5. **Initialize Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

---

### ⚡ Option 3: Neon (Serverless Postgres)

**Why Neon?**
- ✅ Free tier: 0.5GB storage, always-on
- ✅ Serverless architecture (scales to zero)
- ✅ Instant branching for development
- ✅ Fast provisioning

**Setup Steps:**

1. **Create Account**
   - Visit [https://neon.tech](https://neon.tech)
   - Sign up with GitHub or email

2. **Create New Project**
   - Click "Create a project"
   - Name: `college-reclaim`
   - Select region
   - Click "Create project"

3. **Get Database URL**
   - Copy the connection string shown
   - Format: `postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require`

4. **Configure Environment**
   ```bash
   # In your .env.local file
   DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require"
   ```

5. **Initialize Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

---

### 🐘 Option 4: ElephantSQL

**Why ElephantSQL?**
- ✅ Free tier: 20MB storage (good for testing)
- ✅ Simple setup
- ✅ Reliable uptime

**Setup Steps:**

1. **Create Account**
   - Visit [https://www.elephantsql.com](https://www.elephantsql.com)
   - Sign up (no credit card required)

2. **Create New Instance**
   - Click "Create New Instance"
   - Name: `college-reclaim`
   - Plan: Select "Tiny Turtle" (Free)
   - Select datacenter region
   - Click "Create instance"

3. **Get Database URL**
   - Click on your instance
   - Copy the URL shown

4. **Configure Environment**
   ```bash
   # In your .env.local file
   DATABASE_URL="postgresql://[username]:[password]@[server].db.elephantsql.com/[database]"
   ```

5. **Initialize Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

---

## 🔧 Database Schema Initialization

After setting up your cloud database, initialize the schema:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# Optional: Open Prisma Studio to view your database
npx prisma studio
```

### What Gets Created:
- ✅ **users** - User accounts and authentication
- ✅ **lost_items** - Lost item reports
- ✅ **found_items** - Found item reports
- ✅ **matches** - AI-powered item matching
- ✅ **notifications** - User notifications
- ✅ **accounts** - OAuth provider accounts
- ✅ **sessions** - User sessions

---

## ✅ Testing Your Database Connection

### 1. Run the Application
```bash
npm run dev
```

### 2. Create a Test User
- Navigate to http://localhost:3000
- Click "Sign Up"
- Create an account

### 3. Report a Lost Item
- Sign in
- Click "Report Lost Item"
- Fill in details and submit

### 4. Verify in Database
```bash
# Open Prisma Studio
npx prisma studio
```
- Navigate to http://localhost:5555
- Check the `users` and `lost_items` tables

---

## 🔐 Security Best Practices

### 1. Protect Your Database URL
```bash
# Never commit .env files
# Add to .gitignore (already configured)
.env*
```

### 2. Use Strong Passwords
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't reuse passwords

### 3. Enable SSL (if available)
Most cloud providers enforce SSL by default. If using a custom setup, ensure SSL is enabled:
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### 4. Restrict IP Access (Optional)
Some providers allow IP whitelisting:
- Supabase: Project Settings → Database → Connection Pooling
- Railway: Automatically secured
- Neon: No IP restrictions needed

---

## 🚀 Deployment to Production

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add cloud database integration"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [https://vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `NEXTAUTH_URL` (your Vercel URL)
     - `NEXTAUTH_SECRET`
     - OAuth credentials (if using)

3. **Run Database Migration**
   Vercel will automatically run `prisma generate` during build

---

## 📊 Database Management

### View Data
```bash
# Open Prisma Studio (GUI for your database)
npx prisma studio
```

### Backup Database
Most cloud providers offer automatic backups:
- **Supabase**: Daily automatic backups
- **Railway**: Point-in-time recovery
- **Neon**: Automatic backups every 24h

### Manual Backup
```bash
# Export data (requires pg_dump)
pg_dump [DATABASE_URL] > backup.sql

# Restore data
psql [DATABASE_URL] < backup.sql
```

---

## 🔄 CRUD Operations (Already Implemented!)

College Reclaim already has complete CRUD operations:

### ✅ Create
- **POST** `/api/lost-items` - Report lost item
- **POST** `/api/found-items` - Report found item
- **POST** `/api/auth/signup` - Create user account

### ✅ Read
- **GET** `/api/lost-items` - Get all lost items (with filters)
- **GET** `/api/found-items` - Get all found items (with filters)
- **GET** `/api/matches` - Get potential matches
- **GET** `/api/notifications` - Get user notifications

### ✅ Update
- **PATCH** `/api/notifications` - Mark notifications as read
- Items can be updated by authenticated users

### ✅ Delete
- Items can be deleted by authenticated users (cascading deletes)

---

## 🐛 Troubleshooting

### Connection Errors

**Error**: `Can't reach database server`
- ✅ Check DATABASE_URL is correct
- ✅ Verify database is running
- ✅ Check firewall/IP restrictions
- ✅ Ensure SSL is configured correctly

**Error**: `Authentication failed`
- ✅ Verify password in DATABASE_URL
- ✅ Check username is correct
- ✅ Reset database password if needed

**Error**: `P1001: Can't reach database server`
- ✅ Check internet connection
- ✅ Verify cloud database is not paused
- ✅ Check region/endpoint is correct

### Migration Errors

**Error**: `Schema not in sync`
```bash
# Reset and re-sync schema
npx prisma db push --force-reset
```

**Warning**: This deletes all data! Only use in development.

---

## 📈 Free Tier Limits

| Provider | Storage | Bandwidth | Connections | Cost |
|----------|---------|-----------|-------------|------|
| **Supabase** | 500MB | 2GB/month | 60 | Free |
| **Railway** | Unlimited | Unlimited | Unlimited | $5/month credit |
| **Neon** | 512MB | 5GB/month | 100 | Free |
| **ElephantSQL** | 20MB | N/A | 5 | Free |

---

## 🎓 Best Practices

1. **Start with Supabase** - Best for beginners
2. **Use environment variables** - Never hardcode credentials
3. **Enable backups** - Protect your data
4. **Monitor usage** - Stay within free tier limits
5. **Use connection pooling** - For production apps
6. **Test locally first** - Before deploying to production

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Neon Documentation](https://neon.tech/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

## ✅ You're All Set!

Your College Reclaim app now has:
- ✅ Persistent cloud database
- ✅ Multi-device access
- ✅ Complete CRUD operations
- ✅ Secure authentication
- ✅ Automatic data sync

**Questions?** Check the [main README](./README.md) or open an issue on GitHub.

---

**Made with ❤️ for college communities** 🎓
