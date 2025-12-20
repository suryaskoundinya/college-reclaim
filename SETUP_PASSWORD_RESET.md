# Password Reset System - Quick Setup Guide

## ✅ Implementation Complete

The password reset system is now fully integrated with your Neon PostgreSQL database!

## 🚀 Quick Start (2 Minutes)

### 1. Set Up Gmail SMTP (Required)

Add these to your `.env` file:

```env
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-16-char-app-password"
```

**Get Gmail App Password:**
1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" → "Other" → Name it "College Reclaim"
4. Copy the 16-character password (no spaces)

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Test the Password Reset Flow

Visit: http://localhost:3000/auth/forgot-password

## 📁 Files Created/Modified

### ✅ Database
- `prisma/schema.prisma` - Added `PasswordResetOTP` model
- Database synced with Neon DB (table created)

### ✅ API Routes
- `src/app/api/auth/send-otp/route.ts` - Send OTP endpoint
- `src/app/api/auth/verify-otp/route.ts` - Verify OTP & reset password

### ✅ Frontend
- `src/app/auth/forgot-password/page.tsx` - Complete UI with 2-step flow
- `src/app/auth/signin/page.tsx` - Already has "Forgot Password?" link

### ✅ Utilities
- `src/lib/email.ts` - Gmail SMTP email sender with HTML template

### ✅ Documentation
- `.env.example` - Environment variables template
- `PASSWORD_RESET_DOCS.md` - Full documentation

## 🧪 Test Flow

1. **Request OTP:**
   - Go to: http://localhost:3000/auth/forgot-password
   - Enter your email
   - Click "Send OTP"
   - Check your Gmail inbox

2. **Reset Password:**
   - Enter the 6-digit OTP from email
   - Enter new password (min 8 characters)
   - Confirm password
   - Click "Reset Password"

3. **Sign In:**
   - Automatically redirected to sign-in
   - Use new password to log in

## 🔒 Security Features

✅ OTPs hashed with bcrypt (10 rounds)
✅ Passwords hashed with bcrypt (12 rounds)
✅ Email enumeration protection
✅ 10-minute OTP expiry
✅ One-time use OTPs
✅ Single active OTP per email
✅ No plain-text storage

## 💰 Cost

**$0/month** - Everything is free!
- Gmail SMTP: Free (500 emails/day)
- Neon DB: Free tier
- Vercel: Free hosting

## 🐛 Troubleshooting

### Email not sending?
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Make sure you used App Password (not regular Gmail password)
- Enable 2FA on your Google account first

### OTP not working?
- OTPs expire after 10 minutes
- Check spam folder
- Try requesting a new OTP

### Database error?
- Your Neon DB is already configured and working ✅
- The `password_reset_otps` table was created successfully

## 📚 Full Documentation

See `PASSWORD_RESET_DOCS.md` for complete documentation including:
- Detailed setup instructions
- API documentation
- Security analysis
- Production deployment guide
- Troubleshooting guide

## 🎉 Ready to Use!

The system is production-ready. Just add your Gmail credentials to `.env` and you're good to go!

**Next Steps:**
1. Add `EMAIL_USER` and `EMAIL_PASS` to your `.env`
2. Test the forgot password flow
3. Deploy to production when ready

---

**Questions?** Check `PASSWORD_RESET_DOCS.md` for detailed documentation.
