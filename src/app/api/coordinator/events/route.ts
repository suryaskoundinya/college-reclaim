import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is coordinator or admin
    if (session.user.role !== "COORDINATOR" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Coordinator access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, date, time, venue, clubOrDept, contactInfo, imageUrl } = body;

    if (!title || !description || !date || !time || !venue || !clubOrDept) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        venue,
        clubOrDept,
        contactInfo: contactInfo || null,
        imageUrl: imageUrl || null,
        postedByUserId: session.user.id,
      },
    });

    // Send email notifications to all users
    try {
      const users = await prisma.user.findMany({
        where: {
          emailVerified: { not: null },
        },
        select: {
          email: true,
          name: true,
        },
      });

      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const emailPromises = users.map((user) =>
        sendEmail({
          to: user.email,
          subject: `New Event: ${title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .detail-row { display: flex; margin: 12px 0; padding: 12px; background: #f3f4f6; border-radius: 6px; }
                .detail-label { font-weight: bold; color: #667eea; min-width: 120px; }
                .detail-value { color: #374151; }
                .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
                img { max-width: 100%; border-radius: 8px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 New Event Alert!</h1>
                </div>
                <div class="content">
                  <p>Hi ${user.name || 'there'},</p>
                  <p>A new event has been posted by ${clubOrDept}. Here are the details:</p>
                  
                  <div class="event-details">
                    <h2 style="color: #667eea; margin-top: 0;">${title}</h2>
                    <p style="color: #6b7280;">${description}</p>
                    
                    ${imageUrl ? `<img src="${imageUrl}" alt="${title}" />` : ''}
                    
                    <div class="detail-row">
                      <span class="detail-label">📅 Date:</span>
                      <span class="detail-value">${formattedDate}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">🕐 Time:</span>
                      <span class="detail-value">${time}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">📍 Venue:</span>
                      <span class="detail-value">${venue}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">🏛️ Organized by:</span>
                      <span class="detail-value">${clubOrDept}</span>
                    </div>
                    
                    <div class="detail-row">
                      <span class="detail-label">👤 Posted by:</span>
                      <span class="detail-value">${session.user.name}${session.user.coordinatorTitle ? ` (${session.user.coordinatorTitle})` : ''}</span>
                    </div>
                    
                    ${contactInfo ? `
                    <div class="detail-row">
                      <span class="detail-label">📧 Contact:</span>
                      <span class="detail-value">${contactInfo}</span>
                    </div>
                    ` : ''}
                  </div>
                  
                  <center>
                    <a href="${process.env.NEXTAUTH_URL}/events" class="button">
                      View All Events
                    </a>
                  </center>
                  
                  <div class="footer">
                    <p>This email was sent to you because you are registered on College Reclaim.</p>
                    <p>Don't want to miss out on events? Keep your notifications enabled!</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        }).catch((error) => {
          console.error(`Failed to send email to ${user.email}:`, error);
        })
      );

      await Promise.allSettled(emailPromises);
      console.log(`Event notification sent to ${users.length} users`);
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError);
      // Don't fail the request if emails fail
    }

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
