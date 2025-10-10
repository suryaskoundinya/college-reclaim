# College Reclaim - Lost & Found Web Application

A comprehensive Next.js application for managing lost and found items in college environments.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/signup with NextAuth.js
- **Cloud Database Integration**: Persistent data storage with PostgreSQL
- **Lost Item Reporting**: Submit lost items with details, photos, and location
- **Found Item Reporting**: Report found items with option to hand to admin
- **Smart Search & Matching**: AI-powered matching between lost and found items
- **Real-time Notifications**: Email and in-app notifications for matches
- **Multi-device Access**: Access your data from anywhere with cloud sync
- **Admin Panel**: Complete admin dashboard for managing all reports

### Data Persistence (CRUD Operations)
- ✅ **Create**: Report new lost/found items with full details
- ✅ **Read**: View all items with advanced filtering and search
- ✅ **Update**: Edit item details, mark as resolved/returned
- ✅ **Delete**: Remove outdated or resolved reports

### User Roles
- **Students/Staff**: Can report lost/found items and search database
- **Admin**: Can verify, approve/reject reports and manage system

## 🛠 Tech Stack

- **Frontend**: React + Next.js 15 (App Router)
- **UI**: TailwindCSS + shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts (for admin analytics)
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (local or cloud)

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd college-reclaim
   npm install
   ```

2. **Environment Setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - Optional: OAuth credentials (Google, GitHub)

3. **Database Setup**
   
   **Option A: Use Free Cloud Database (Recommended)** 🌐
   
   See our comprehensive [Cloud Database Setup Guide](./CLOUD-DATABASE-SETUP.md) for:
   - ⭐ Supabase (Recommended - 500MB free)
   - 🚂 Railway ($5 monthly credit)
   - ⚡ Neon (Serverless Postgres)
   - 🐘 ElephantSQL (20MB free)
   
   **Option B: Local PostgreSQL**
   ```bash
   # Install PostgreSQL locally, then:
   createdb college_reclaim
   ```
   
   Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Visit http://localhost:3000

## 🎨 UI Components

Built with shadcn/ui for modern, accessible components:
- Cards for item displays
- Forms with validation
- Data tables for admin views
- Modals for interactions
- Toast notifications
- Navigation components

## 🔒 Authentication

- Email/password authentication
- Optional Google OAuth
- College email domain restriction (@college.edu)
- Role-based access control (Student/Staff/Admin)

## 📱 Responsive Design

- Mobile-first design approach
- Fully responsive on all devices
- Touch-friendly interface
- Progressive Web App capabilities

## 🚀 Deployment

Ready for deployment on:
- **Vercel** (Frontend - recommended)
- **Supabase/Railway/Neon** (Database - all have free tiers)
- **Render** (Alternative hosting)

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables (see `.env.example`)

3. **Configure Database**
   - Use a cloud database (see [CLOUD-DATABASE-SETUP.md](./CLOUD-DATABASE-SETUP.md))
   - Add `DATABASE_URL` to Vercel environment variables

### Build for Production
```bash
npm run build
npm start
```

📖 **Need help with cloud database?** See our detailed [Cloud Database Setup Guide](./CLOUD-DATABASE-SETUP.md)

## 🧪 Development Scripts

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Lint code
npm run lint

# Database operations
npx prisma studio      # Database GUI
npx prisma migrate dev # Run migrations
npx prisma generate    # Generate client
```

## 💾 Database Schema

College Reclaim uses PostgreSQL with Prisma ORM. The database includes:

### Tables
- **users** - User accounts, authentication, and profiles
- **lost_items** - Lost item reports with details and status
- **found_items** - Found item reports with location and details
- **matches** - AI-powered matching between lost and found items
- **notifications** - Real-time user notifications
- **accounts** - OAuth provider accounts
- **sessions** - User session management

### Item Categories
- Books, Electronics, ID Cards, Accessories, Clothing, Keys, Bags, Sports Equipment, Other

### Item Status
- `LOST` - Item is lost and being searched for
- `FOUND` - Item has been found
- `RESOLVED` - Item has been returned to owner
- `REJECTED` - Report was rejected by admin

View your database schema: `prisma/schema.prisma`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Items (CRUD Operations)
- `GET /api/lost-items` - Get all lost items (with filtering)
- `POST /api/lost-items` - Report a lost item
- `GET /api/found-items` - Get all found items (with filtering)
- `POST /api/found-items` - Report a found item

### Notifications & Matching
- `GET /api/matches` - Get potential matches for your items
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications` - Mark notifications as read

### File Upload
- `POST /api/upload` - Upload item images

All API endpoints support pagination, filtering, and search. See [API Documentation](./README-PRODUCTION.md#-api-endpoints) for details.

---

**Made with ❤️ for college communities**

> This application helps create a more connected and honest campus community by making it easier for students to recover their lost belongings and return found items to their rightful owners.
