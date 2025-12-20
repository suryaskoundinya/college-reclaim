import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendOTPEmail } from '@/lib/email'

const OTP_LENGTH = 6
const OTP_EXPIRY_MINUTES = 10
const BCRYPT_ROUNDS = 10

// Generate 6-digit numeric OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists (but always return success to prevent email enumeration)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Always return success message, even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'If an account with that email exists, an OTP has been sent.' 
        },
        { status: 200 }
      )
    }

    // Delete any existing OTPs for this email (single active OTP per email)
    await prisma.passwordResetOTP.deleteMany({
      where: { email: normalizedEmail },
    })

    // Generate OTP
    const otp = generateOTP()

    // Hash OTP with bcrypt
    const otpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS)

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    // Store hashed OTP in database
    await prisma.passwordResetOTP.create({
      data: {
        email: normalizedEmail,
        otpHash,
        expiresAt,
      },
    })

    // Send OTP email
    try {
      await sendOTPEmail({
        to: normalizedEmail,
        otp,
        expiryMinutes: OTP_EXPIRY_MINUTES,
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      
      // Clean up OTP record if email fails
      await prisma.passwordResetOTP.deleteMany({
        where: { email: normalizedEmail },
      })

      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'If an account with that email exists, an OTP has been sent.',
        expiryMinutes: OTP_EXPIRY_MINUTES
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
