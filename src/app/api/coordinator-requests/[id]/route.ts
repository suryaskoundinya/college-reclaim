import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { action } = body; // "approve" or "reject"

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const coordinatorRequest = await prisma.coordinatorRequest.findUnique({
      where: { id },
    });

    console.log(`Processing ${action} for request ${id}:`, {
      found: !!coordinatorRequest,
      status: coordinatorRequest?.status,
      email: coordinatorRequest?.email
    });

    if (!coordinatorRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (coordinatorRequest.status !== "PENDING") {
      console.log(`Request ${id} status is ${coordinatorRequest.status}, expected PENDING`);
      return NextResponse.json(
        { error: `Request has already been processed (status: ${coordinatorRequest.status})` },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Create user account or update existing user
      const existingUser = await prisma.user.findUnique({
        where: { email: coordinatorRequest.email },
      });

      // Generate password reset OTP for setting up account
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 10);

      // Store OTP in database (expires in 24 hours)
      await prisma.passwordResetOTP.create({
        data: {
          email: coordinatorRequest.email,
          otpHash,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      if (existingUser) {
        // Update existing user to coordinator (without password)
        await prisma.user.update({
          where: { email: coordinatorRequest.email },
          data: {
            role: "COORDINATOR",
            department: coordinatorRequest.department,
            coordinatorTitle: coordinatorRequest.title,
          },
        });
      } else {
        // Create new coordinator user without password
        await prisma.user.create({
          data: {
            email: coordinatorRequest.email,
            name: coordinatorRequest.name,
            password: null, // They will set it via reset link
            role: "COORDINATOR",
            department: coordinatorRequest.department,
            coordinatorTitle: coordinatorRequest.title,
            phoneNumber: coordinatorRequest.phoneNumber,
            emailVerified: new Date(),
          },
        });
      }

      // Update request status
      await prisma.coordinatorRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
        },
      });

      // Send approval email with setup link
      console.log(`Attempting to send approval email to ${coordinatorRequest.email} with OTP: ${otp}`);
      let emailSent = false;
      let emailError = null;
      
      try {
        await sendEmail({
          to: coordinatorRequest.email,
          subject: "Coordinator Access Approved - Set Your Password",
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: white; padding: 20px; border-radius: 5px; border: 2px dashed #10b981; margin: 20px 0; text-align: center; }
                .otp-code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 5px; margin: 10px 0; }
                .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .warning { background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 20px 0; }
                .info { background: #dbeafe; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Coordinator Access Approved!</h1>
                </div>
                <div class="content">
                  <p>Dear ${coordinatorRequest.name},</p>
                  <p>Congratulations! Your coordinator access request for <strong>${coordinatorRequest.department}</strong> has been approved.</p>
                  
                  <div class="warning">
                    <strong>⚠️ Action Required:</strong> You need to set up your password before you can sign in.
                  </div>

                  <div class="otp-box">
                    <p style="margin: 0; color: #6b7280;">Your Setup Code:</p>
                    <div class="otp-code">${otp}</div>
                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Valid for 24 hours</p>
                  </div>

                  <div class="info">
                    <strong>📝 Steps to Set Up Your Account:</strong>
                    <ol style="margin: 10px 0;">
                      <li>Click the button below to go to the password setup page</li>
                      <li>Enter your email: <strong>${coordinatorRequest.email}</strong></li>
                      <li>Enter the 6-digit code shown above</li>
                      <li>Create your new password</li>
                    </ol>
                  </div>

                  <p style="text-align: center;">
                    <a href="${process.env.NEXTAUTH_URL}/auth/forgot-password" class="button">Set Up Password</a>
                  </p>

                  <p><strong>Your Coordinator Access Includes:</strong></p>
                  <ul>
                    <li>✅ Create and manage events for ${coordinatorRequest.department}</li>
                    <li>✅ Access to coordinator dashboard</li>
                    <li>✅ View event analytics and interest metrics</li>
                  </ul>

                  <p style="margin-top: 30px;">Best regards,<br>College Reclaim Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
        });
        emailSent = true;
        console.log(`✅ Approval email sent successfully to ${coordinatorRequest.email}`);
      } catch (error) {
        emailError = error;
        console.error("❌ Failed to send approval email:", error);
      }

      return NextResponse.json(
        { 
          message: emailSent 
            ? "Request approved and password setup email sent" 
            : "Request approved but email failed to send. Please contact the coordinator directly.",
          emailSent,
          email: coordinatorRequest.email,
          otp: !emailSent ? otp : undefined // Include OTP in response if email failed
        },
        { status: 200 }
      );
    } else {
      // Reject request
      await prisma.coordinatorRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
          reviewedBy: session.user.id,
        },
      });

      // Send rejection email
      try {
        await sendEmail({
        to: coordinatorRequest.email,
        subject: "Coordinator Access Request Update - College Reclaim",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Coordinator Access Request Update</h1>
                </div>
                <div class="content">
                  <p>Dear ${coordinatorRequest.name},</p>
                  <p>Thank you for your interest in becoming a coordinator for College Reclaim.</p>
                  <p>After careful review, we are unable to approve your coordinator access request at this time.</p>
                  <p>If you believe this is an error or would like to discuss this further, please contact us at:</p>
                  <p><strong>Email:</strong> collegereclaimjc@gmail.com</p>
                  <p style="margin-top: 30px;">Best regards,<br>College Reclaim Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
        });
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
        // Continue even if email fails
      }

      return NextResponse.json(
        { message: "Request rejected" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing coordinator request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
