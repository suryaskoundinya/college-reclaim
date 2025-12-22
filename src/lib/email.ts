import nodemailer from 'nodemailer'

// Create reusable transporter using Gmail SMTP
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true, // Use connection pooling
    maxConnections: 1, // Limit connections to avoid rate limits
    maxMessages: 3, // Max messages per connection
    rateDelta: 1000, // 1 second between messages
    rateLimit: 1, // Max 1 message per rateDelta
  })
}

interface SendOTPEmailParams {
  to: string
  otp: string
  expiryMinutes: number
}

export async function sendOTPEmail({ to, otp, expiryMinutes }: SendOTPEmailParams): Promise<void> {
  const transporter = createTransporter()

  const mailOptions = {
    from: {
      name: 'College ReClaim',
      address: process.env.EMAIL_USER!,
    },
    to,
    subject: 'Password Reset OTP - College ReClaim',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset OTP</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">College ReClaim</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Password Reset Request</h2>
                      <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                        You requested to reset your password. Use the OTP below to proceed with resetting your password.
                      </p>
                      
                      <!-- OTP Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 2px dashed #667eea;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                            <p style="margin: 0; color: #667eea; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #856404; font-size: 14px;">
                          ⚠️ <strong>Important:</strong> This OTP will expire in <strong>${expiryMinutes} minutes</strong>. 
                          If you didn't request this password reset, please ignore this email.
                        </p>
                      </div>
                      
                      <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                        For security reasons, never share this OTP with anyone. Our team will never ask for your OTP.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                        This is an automated email. Please do not reply to this message.
                      </p>
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        © ${new Date().getFullYear()} College ReClaim. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      College ReClaim - Password Reset OTP
      
      You requested to reset your password. Use the OTP below to proceed:
      
      OTP: ${otp}
      
      This OTP will expire in ${expiryMinutes} minutes.
      
      If you didn't request this password reset, please ignore this email.
      
      For security reasons, never share this OTP with anyone.
      
      © ${new Date().getFullYear()} College ReClaim
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Failed to send OTP email. Please try again later.')
  }
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<void> {
  console.log(`📧 Attempting to send email to: ${to}, Subject: ${subject}`);
  
  const transporter = createTransporter()

  const mailOptions = {
    from: {
      name: 'College Reclaim',
      address: process.env.EMAIL_USER!,
    },
    to,
    subject,
    html,
    text: text || '',
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent successfully to ${to}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error)
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function verifyEmailConfiguration(): Promise<boolean> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}
