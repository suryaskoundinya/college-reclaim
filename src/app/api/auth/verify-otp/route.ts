import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const PASSWORD_BCRYPT_ROUNDS = 12
const MIN_PASSWORD_LENGTH = 8

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp, newPassword } = body

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!otp || typeof otp !== 'string') {
      return NextResponse.json(
        { error: 'OTP is required' },
        { status: 400 }
      )
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` },
        { status: 400 }
      )
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Find the most recent OTP for this email
    const otpRecord = await prisma.passwordResetOTP.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: 'desc' },
    })

    // Check if OTP exists
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      // Delete expired OTP
      await prisma.passwordResetOTP.delete({
        where: { id: otpRecord.id },
      })

      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP using bcrypt compare
    const isOTPValid = await bcrypt.compare(otp, otpRecord.otpHash)

    if (!isOTPValid) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      // Delete OTP record even if user not found
      await prisma.passwordResetOTP.delete({
        where: { id: otpRecord.id },
      })

      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash new password with 12 rounds
    const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_BCRYPT_ROUNDS)

    // Update user password and delete OTP in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetOTP.delete({
        where: { id: otpRecord.id },
      }),
    ])

    // Also delete any other OTPs for this email
    await prisma.passwordResetOTP.deleteMany({
      where: { email: normalizedEmail },
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password reset successfully. You can now sign in with your new password.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
