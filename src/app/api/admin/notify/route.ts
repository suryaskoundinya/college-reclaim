import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { subject, message, recipientEmail } = await request.json()

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 })
    }

    let users: { email: string; name: string | null; id: string }[] = []

    if (recipientEmail) {
      // Send to specific email
      const user = await prisma.user.findUnique({
        where: { email: recipientEmail },
        select: { email: true, name: true, id: true }
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      users = [user]
    } else {
      // Get all users (no email verification filter)
      users = await prisma.user.findMany({
        select: { email: true, name: true, id: true }
      })
    }

    // Send emails to all users with individual tracking
    const emailResults = await Promise.allSettled(
      users.map((user: { email: string; name: string | null; id: string }) => 
        sendEmail({
          to: user.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">College Reclaim Notification</h2>
              <p>Hello ${user.name || 'there'},</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                ${message.split('\n').map((line: string) => `<p style="margin: 10px 0;">${line}</p>`).join('')}
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                This is an official notification from College Reclaim.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="color: #9ca3af; font-size: 12px;">
                College Reclaim - Lost & Found Platform<br>
                Email: collegereclaimjc@gmail.com
              </p>
            </div>
          `
        }).then(() => ({ email: user.email, userId: user.id, success: true }))
          .catch(err => ({ email: user.email, userId: user.id, success: false, error: err.message }))
      )
    )

    const successful = emailResults.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = emailResults.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
    
    // Create in-app notifications for all users (regardless of email success)
    try {
      await prisma.notification.createMany({
        data: users.map(user => ({
          userId: user.id,
          title: subject,
          message: message,
          type: 'INFO',
          read: false
        }))
      })
      console.log(`✅ Created ${users.length} in-app notifications`)
    } catch (notifError) {
      console.error('❌ Failed to create in-app notifications:', notifError)
      // Continue even if in-app notifications fail
    }
    
    if (failed.length > 0) {
      const failedEmails = failed.map(r => r.status === 'fulfilled' ? r.value.email : 'unknown')
      console.error(`Failed to send to ${failed.length} users:`, failedEmails)
      
      if (successful === 0) {
        return NextResponse.json({ 
          error: "All emails failed to send. Please check email configuration.",
          hint: "Make sure EMAIL_USER and EMAIL_PASS are correct in .env.local. Use Gmail App Password, not regular password.",
          failedEmails 
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        success: true,
        message: `Sent to ${successful} users. ${failed.length} failed.`,
        failedEmails 
      }, { status: 207 }) // Multi-status
    }

    return NextResponse.json({ 
      success: true, 
      message: recipientEmail 
        ? `Notification sent to ${recipientEmail}` 
        : `Notification sent to ${successful} users successfully!` 
    })
  } catch (error) {
    console.error("Error sending notifications:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}
