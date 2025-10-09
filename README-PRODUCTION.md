# College Reclaim - Production Version

A comprehensive Next.js web application for college lost and found items management with production-ready features.

## 🚀 Features

### Core Functionality
- **Lost & Found Items**: Report lost items and found items with detailed descriptions
- **Smart Matching**: Automatic matching between lost and found items
- **User Authentication**: Multiple sign-in options (Email/Password, Google, GitHub)
- **Real-time Notifications**: Get notified about matches and updates
- **Image Upload**: Upload images for better item identification
- **Search & Filters**: Advanced search with category and status filtering

### Production Features
- **Database Integration**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **File Upload**: Secure image upload with validation
- **API Rate Limiting**: Protection against abuse
- **Email Notifications**: SMTP integration for notifications
- **Role-based Access**: Student, Staff, and Admin roles
- **Data Validation**: Comprehensive input validation with Zod
- **Error Handling**: Robust error handling and logging

### UI/UX
- **Dark/Light Mode**: Complete theme switching system
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: shadcn/ui components with Tailwind CSS
- **Smooth Animations**: Framer Motion animations
- **Accessibility**: WCAG compliant design

## 🛠 Tech Stack

- **Frontend**: React 18, Next.js 15.5.4, TypeScript
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: React Query (TanStack Query)
- **File Upload**: Node.js file system with validation
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Email**: Nodemailer SMTP

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college_reclaim_prod
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/college_reclaim"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key-here"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   GITHUB_CLIENT_ID="your-github-client-id" 
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # Email Configuration
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   
   # (Optional) Seed database
   npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Add all environment variables from your `.env` file
   - Update `NEXTAUTH_URL` to your production domain

3. **Database Setup**
   - Set up a PostgreSQL database (Vercel Postgres, Railway, etc.)
   - Update `DATABASE_URL` in Vercel environment variables
   - Run migrations: `npx prisma db push`

### Docker (Alternative)

1. **Build Docker Image**
   ```bash
   docker build -t college-reclaim .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 college-reclaim
   ```

## 📁 Project Structure

```
college_reclaim_prod/
├── prisma/
│   └── schema.prisma           # Database schema
├── public/
│   └── uploads/               # File uploads directory
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication APIs
│   │   │   ├── lost-items/    # Lost items CRUD
│   │   │   ├── found-items/   # Found items CRUD
│   │   │   ├── matches/       # Item matching
│   │   │   ├── notifications/ # Notifications
│   │   │   └── upload/        # File upload
│   │   ├── auth/              # Auth pages
│   │   ├── report/            # Report item pages
│   │   └── search/            # Search page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── navbar.tsx         # Navigation
│   │   └── providers.tsx      # Context providers
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── next-auth.d.ts    # NextAuth types
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Items
- `GET /api/lost-items` - Get lost items (with filtering)
- `POST /api/lost-items` - Create lost item
- `GET /api/found-items` - Get found items (with filtering)  
- `POST /api/found-items` - Create found item

### Matching & Notifications
- `GET /api/matches` - Get user's matches
- `POST /api/matches` - Create manual match
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications` - Mark notifications as read

### File Upload
- `POST /api/upload` - Upload image file

## 🔒 Security Features

- **Input Validation**: All inputs validated with Zod schemas
- **Authentication**: Secure JWT-based authentication
- **Authorization**: Role-based access control
- **File Upload Security**: Type and size validation
- **Rate Limiting**: API endpoint protection
- **HTTPS**: SSL/TLS encryption in production
- **Environment Variables**: Sensitive data protection

## 🎨 Customization

### Theme Customization
- Edit `src/app/globals.css` for color variables
- Update `tailwind.config.ts` for theme configuration

### Adding New Features
1. Create API routes in `src/app/api/`
2. Add database models to `prisma/schema.prisma`
3. Generate Prisma client: `npx prisma generate`
4. Create UI components in `src/components/`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: API response caching
- **Database Optimization**: Indexed queries with Prisma

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Run `npx prisma db push`

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check OAuth provider credentials
   - Ensure `NEXTAUTH_URL` matches your domain

3. **File Upload Problems**
   - Check `public/uploads/` directory permissions
   - Verify file size and type restrictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Created By

**Made with ❤️ by Surya**

For support or questions, please open an issue or contact the development team.

---

### 🔄 Migration from Development

If migrating from the development version:

1. **Backup Your Data**
   ```bash
   # Export existing data if needed
   npx prisma db push --preview-feature
   ```

2. **Update Environment**
   - Copy your existing `.env` file
   - Add new environment variables from `.env.example`

3. **Run Migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Test Features**
   - Test authentication flows
   - Verify file uploads work
   - Check API endpoints

Your existing theme system and UI components are preserved and enhanced with production features!