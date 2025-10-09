# College Reclaim - Lost & Found Web Application

A comprehensive Next.js application for managing lost and found items in college environments.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/signup with NextAuth.js
- **Lost Item Reporting**: Submit lost items with details, photos, and location
- **Found Item Reporting**: Report found items with option to hand to admin
- **Smart Search & Matching**: AI-powered matching between lost and found items
- **Real-time Notifications**: Email and in-app notifications for matches
- **Admin Panel**: Complete admin dashboard for managing all reports

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
- PostgreSQL database

### Installation

1. **Clone and Install**
   ```bash
   cd college_reclaim
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/college_reclaim"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
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
- **Supabase** (Database)
- **Render** (Alternative hosting)

### Build for Production
```bash
npm run build
npm start
```

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

---

**Made with ❤️ for college communities**

> This application helps create a more connected and honest campus community by making it easier for students to recover their lost belongings and return found items to their rightful owners.
