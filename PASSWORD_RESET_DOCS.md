# Password Reset System Documentation

## Overview

This is a production-ready, secure email OTP-based password reset system for the College Reclaim application. The implementation follows security best practices and uses zero paid services.

## Features

✅ **Security First**
- OTPs are hashed with bcrypt (10 rounds) before storage
- Passwords are hashed with bcrypt (12 rounds)
- No plain-text storage of sensitive data
- Email enumeration protection
- One-time use OTPs
- Single active OTP per email
- Automatic expiry (10 minutes)

✅ **Zero Cost**
- Uses Gmail SMTP (free)
- Neon PostgreSQL (free tier)
- No SMS services
- No paid email services

✅ **Production Ready**
- TypeScript for type safety
- Next.js 15 App Router
- Prisma ORM with PostgreSQL
- Full error handling
- Loading states
- User-friendly UI

## Tech Stack

- **Frontend**: React, Next.js 15, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **Email**: Nodemailer with Gmail SMTP
- **Security**: bcryptjs for hashing

## Installation & Setup

### 1. Install Dependencies

All required dependencies are already in `package.json`:
```bash
npm install
```

### 2. Database Setup

Run Prisma migration to create the `PasswordResetOTP` table:

```bash
npx prisma migrate dev --name add_password_reset_otp
```

Generate Prisma Client:
```bash
npx prisma generate
```

### 3. Email Configuration (Gmail SMTP)

#### Step-by-step Gmail Setup:

1. **Enable 2-Factor Authentication** on your Google Account:
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "College Reclaim" as the name
   - Click "Generate"
   - Copy the 16-character password

3. **Update Environment Variables**:
   ```env
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-16-char-app-password"
   ```

### 4. Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update the following variables:
```env
DATABASE_URL="your-neon-postgres-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-16-char-app-password"
```

### 5. Run the Application

```bash
npm run dev
```

Visit: http://localhost:3000/auth/forgot-password

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── send-otp/
│   │       │   └── route.ts          # Send OTP API endpoint
│   │       └── verify-otp/
│   │           └── route.ts          # Verify OTP & reset password
│   └── auth/
│       ├── forgot-password/
│       │   └── page.tsx              # Forgot password page
│       └── signin/
│           └── page.tsx              # Sign in page (includes link)
├── lib/
│   ├── email.ts                      # Email utility with nodemailer
│   └── prisma.ts                     # Prisma client
└── components/
    └── ui/                           # shadcn/ui components

prisma/
└── schema.prisma                     # Database schema
```

## Database Schema

### PasswordResetOTP Model

```prisma
model PasswordResetOTP {
  id        String   @id @default(cuid())
  email     String
  otpHash   String   // Hashed OTP (bcrypt 10 rounds)
  expiresAt DateTime // Expiry time (10 minutes from creation)
  createdAt DateTime @default(now())

  @@index([email])
  @@map("password_reset_otps")
}
```

## API Endpoints

### 1. Send OTP - POST `/api/auth/send-otp`

**Request Body:**
```json
{
  "email": "user@college.edu"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "If an account with that email exists, an OTP has been sent.",
  "expiryMinutes": 10
}
```

**Response (Error):**
```json
{
  "error": "Invalid email format"
}
```

**Behavior:**
1. Validates email format
2. Checks if user exists (but always returns success message)
3. Deletes any existing OTPs for the email
4. Generates 6-digit numeric OTP
5. Hashes OTP with bcrypt (10 rounds)
6. Stores hashed OTP in database
7. Sends email via Gmail SMTP
8. Returns success message (prevents email enumeration)

### 2. Verify OTP & Reset Password - POST `/api/auth/verify-otp`

**Request Body:**
```json
{
  "email": "user@college.edu",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now sign in with your new password."
}
```

**Response (Error):**
```json
{
  "error": "Invalid or expired OTP"
}
```

**Behavior:**
1. Validates inputs (email, OTP format, password length)
2. Finds OTP record for email
3. Checks if OTP has expired
4. Verifies OTP using bcrypt.compare
5. Hashes new password (bcrypt 12 rounds)
6. Updates user password in transaction
7. Deletes OTP record (one-time use)
8. Returns success message

## Security Features

### 1. Email Enumeration Protection
The system always returns a success message when sending OTP, regardless of whether the email exists. This prevents attackers from discovering valid email addresses.

### 2. Hashed OTPs
OTPs are never stored in plain text. They are hashed using bcrypt with 10 rounds before storage.

### 3. Password Hashing
New passwords are hashed using bcrypt with 12 rounds (higher security than OTPs).

### 4. Single Active OTP
Only one OTP can be active per email at a time. Requesting a new OTP invalidates the previous one.

### 5. One-Time Use
OTPs are deleted immediately after successful use, preventing reuse.

### 6. Time-Limited OTPs
OTPs expire after 10 minutes. Expired OTPs are automatically rejected and deleted.

### 7. Input Validation
- Email format validation
- OTP must be exactly 6 digits
- Password must be at least 8 characters
- Password confirmation matching

### 8. No Sensitive Data Logging
The system never logs OTPs or passwords.

## User Flow

### Forgot Password Flow

1. **User clicks "Forgot Password"** on sign-in page
2. **Enter email** → System sends OTP email
3. **Check email** → User receives OTP (valid 10 minutes)
4. **Enter OTP** and new password
5. **Submit** → Password reset successful
6. **Redirect to sign-in** page

### Email Template

The OTP email includes:
- Professional HTML design
- Clear OTP display (large, monospace font)
- Expiry warning (10 minutes)
- Security reminder
- College Reclaim branding

## Testing

### Test the Send OTP API

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@college.edu"}'
```

### Test the Verify OTP API

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@college.edu",
    "otp":"123456",
    "newPassword":"newPassword123"
  }'
```

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to send OTP email" | Gmail credentials invalid | Check EMAIL_USER and EMAIL_PASS in .env |
| "Invalid OTP format" | OTP is not 6 digits | Ensure OTP contains exactly 6 numeric digits |
| "OTP has expired" | OTP older than 10 minutes | Request a new OTP |
| "Invalid OTP" | Wrong OTP entered | Check email and enter correct OTP |
| "Password must be at least 8 characters" | Password too short | Use a password with 8+ characters |

## Maintenance

### Cleanup Expired OTPs

Expired OTPs are automatically deleted when verification fails. For additional cleanup, you can create a cron job:

```typescript
// Optional: Clean up expired OTPs daily
await prisma.passwordResetOTP.deleteMany({
  where: {
    expiresAt: {
      lt: new Date()
    }
  }
})
```

## Production Deployment

### Environment Variables (Production)

```env
DATABASE_URL="your-production-neon-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-new-secret-for-production"
EMAIL_USER="your-production-gmail@gmail.com"
EMAIL_PASS="your-production-app-password"
```

### Vercel Deployment

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Post-Deployment Checklist

- ✅ Test forgot password flow end-to-end
- ✅ Verify email delivery
- ✅ Check OTP expiry works correctly
- ✅ Test password reset functionality
- ✅ Verify error handling
- ✅ Monitor email sending logs

## Troubleshooting

### Email Not Sending

1. **Check Gmail App Password**:
   - Ensure 2FA is enabled
   - Regenerate app password if needed
   - No spaces in app password

2. **Check Environment Variables**:
   ```bash
   echo $EMAIL_USER
   echo $EMAIL_PASS
   ```

3. **Check Gmail Settings**:
   - Enable "Less secure app access" if needed
   - Check Gmail sending limits (500 emails/day)

### OTP Not Working

1. **Check Database**:
   ```sql
   SELECT * FROM password_reset_otps WHERE email = 'user@example.com';
   ```

2. **Check OTP Expiry**:
   - Ensure system time is correct
   - Check if OTP is within 10 minutes

3. **Check Hashing**:
   - Verify bcryptjs is installed
   - Check bcrypt rounds configuration

## Cost Analysis

| Service | Free Tier | Used For |
|---------|-----------|----------|
| Neon PostgreSQL | 0.5 GB storage | Database |
| Gmail SMTP | 500 emails/day | OTP emails |
| Vercel | Unlimited hobby projects | Hosting |
| **Total** | **$0/month** | |

## Future Enhancements

Potential improvements (not required for MVP):

- [ ] Rate limiting for OTP requests
- [ ] Account lockout after multiple failed attempts
- [ ] SMS OTP as alternative (would require paid service)
- [ ] Email templates customization admin panel
- [ ] OTP attempt tracking
- [ ] Admin dashboard for monitoring

## Support

For issues or questions:
- Check logs in Vercel/deployment platform
- Verify environment variables are set correctly
- Test email configuration separately
- Check Prisma schema is migrated

## License

Part of College Reclaim application.

---

**Last Updated**: December 20, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
