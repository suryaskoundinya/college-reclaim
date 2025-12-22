import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, department, title, phoneNumber, message } = body;

    if (!name || !email || !department || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already has a pending or approved request
    const existingRequest = await prisma.coordinatorRequest.findUnique({
      where: { email },
    });

    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        return NextResponse.json(
          { error: "You already have a pending request" },
          { status: 400 }
        );
      } else if (existingRequest.status === "APPROVED") {
        return NextResponse.json(
          { error: "Your coordinator access has already been approved. Please sign in." },
          { status: 400 }
        );
      } else if (existingRequest.status === "REJECTED") {
        // Allow resubmission by updating the existing rejected request
        console.log(`Resubmitting rejected request for ${email}`);
        const updatedRequest = await prisma.coordinatorRequest.update({
          where: { email },
          data: {
            name,
            department,
            title: title || null,
            phoneNumber: phoneNumber || null,
            message,
            status: "PENDING",
            reviewedAt: null,
            reviewedBy: null,
            updatedAt: new Date(),
          },
        });
        console.log(`Request updated to PENDING:`, {
          id: updatedRequest.id,
          status: updatedRequest.status,
          email: updatedRequest.email
        });

        // Send confirmation email for resubmission
        try {
          await sendEmail({
            to: email,
            subject: "Coordinator Request Resubmitted - College Reclaim",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #3b82f6; margin: 20px 0; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>✅ Request Resubmitted!</h1>
                    </div>
                    <div class="content">
                      <p>Dear ${name},</p>
                      <p>Your coordinator access request for <strong>${department}</strong> has been resubmitted successfully.</p>
                      
                      <div class="info-box">
                        <h3>What's Next?</h3>
                        <ul>
                          <li>📋 Your updated request is being reviewed by our admin team</li>
                          <li>⏱️ Review typically takes 1-2 business days</li>
                          <li>📧 You'll receive an email notification once reviewed</li>
                        </ul>
                      </div>

                      <p style="margin-top: 30px;">If you have any questions, please contact us at <a href="mailto:collegereclaimjc@gmail.com">collegereclaimjc@gmail.com</a>.</p>
                      <p style="margin-top: 30px;">Best regards,<br>College Reclaim Team</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send resubmission email:", emailError);
        }

        return NextResponse.json({
          message: "Request resubmitted successfully. You will be notified once reviewed.",
          request: updatedRequest,
        });
      }
    }

    // Create new coordinator request
    const coordinatorRequest = await prisma.coordinatorRequest.create({
      data: {
        name,
        email,
        department,
        title: title || null,
        phoneNumber: phoneNumber || null,
        message,
      },
    });

    // Send confirmation email to the requester
    try {
      await sendEmail({
        to: email,
        subject: "Coordinator Request Received - College Reclaim",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .checkmark { font-size: 48px; color: #10b981; text-align: center; margin: 20px 0; }
                .info-box { background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #3b82f6; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✅ Request Received!</h1>
                </div>
                <div class="content">
                  <p>Dear ${name},</p>
                  <p>Thank you for submitting your coordinator access request for <strong>${department}</strong>.</p>
                  
                  <div class="info-box">
                    <h3>What's Next?</h3>
                    <ul>
                      <li>📋 Your request is being reviewed by our admin team</li>
                      <li>⏱️ Review typically takes 1-2 business days</li>
                      <li>📧 You'll receive an email notification once reviewed</li>
                    </ul>
                  </div>

                  <p><strong>Your Request Details:</strong></p>
                  <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Department/Club:</strong> ${department}</li>
                    ${phoneNumber ? `<li><strong>Phone:</strong> ${phoneNumber}</li>` : ''}
                  </ul>

                  <p style="margin-top: 30px;">If you have any questions, please contact us at <a href="mailto:collegereclaimjc@gmail.com">collegereclaimjc@gmail.com</a>.</p>
                  <p style="margin-top: 30px;">Best regards,<br>College Reclaim Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email to requester:", emailError);
      // Continue even if email fails
    }

    // Send notification email to admin
    try {
      await sendEmail({
        to: "collegereclaimjc@gmail.com",
        subject: "New Coordinator Access Request",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #3b82f6; display: block; margin-bottom: 5px; }
                .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #3b82f6; }
                .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Coordinator Request</h1>
                </div>
                <div class="content">
                  <div class="field">
                    <span class="label">Name:</span>
                    <div class="value">${name}</div>
                  </div>
                  <div class="field">
                    <span class="label">Email:</span>
                    <div class="value">${email}</div>
                  </div>
                  <div class="field">
                    <span class="label">Department/Club:</span>
                    <div class="value">${department}</div>
                  </div>
                  ${phoneNumber ? `
                  <div class="field">
                    <span class="label">Phone:</span>
                    <div class="value">${phoneNumber}</div>
                  </div>
                  ` : ''}
                  <div class="field">
                    <span class="label">Message:</span>
                    <div class="value">${message}</div>
                  </div>
                  <p style="margin-top: 30px; text-align: center;">
                    <a href="${process.env.NEXTAUTH_URL}/admin" class="button">Review in Admin Dashboard</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      { message: "Request submitted successfully", request: coordinatorRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating coordinator request:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const requests = await prisma.coordinatorRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching coordinator requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
