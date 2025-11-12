import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: 'iScholar <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to iScholar! 🎓',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f7;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 50px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🎉 Congratulations!</h1>
                        <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 18px;">Welcome to iScholar</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 50px 40px;">
                        <p style="margin: 0 0 20px 0; color: #374151; font-size: 18px; line-height: 1.6;">
                          Hi <strong>${name}</strong>,
                        </p>
                        
                        <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                          Thank you for joining iScholar! We're excited to help you find and apply for scholarships.
                        </p>
                        
                        <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                          Click the button below to verify your email and activate your account:
                        </p>
                        
                        <!-- Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${verificationUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Alternative Link -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                          <tr>
                            <td style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                If the button doesn't work, copy and paste this link:
                              </p>
                              <p style="margin: 0; word-break: break-all;">
                                <a href="${verificationUrl}" style="color: #2563eb; font-size: 14px; text-decoration: underline;">${verificationUrl}</a>
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Notice -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                          <tr>
                            <td style="background-color: #fef3c7; padding: 16px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                              <p style="margin: 0; color: #92400e; font-size: 14px;">
                                ⏱️ <strong>Note:</strong> This link expires in 24 hours.
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          If you didn't create this account, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                          Best regards,<br>
                          <strong style="color: #6b7280;">The iScholar Team</strong>
                        </p>
                        <p style="margin: 15px 0 0 0; color: #d1d5db; font-size: 12px;">
                          © ${new Date().getFullYear()} iScholar. All rights reserved.
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
    });
    
    console.log('Verification email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: 'iScholar <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Your iScholar Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello ${name},</p>
                
                <p>We received a request to reset your iScholar password. Click the button below to create a new password:</p>
                
                <p style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </p>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="background: white; padding: 15px; border-radius: 6px; word-break: break-all; font-size: 14px;">
                  ${resetUrl}
                </p>
                
                <p><strong>This link will expire in 1 hour.</strong></p>
                
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                
                <p>Best regards,<br>The iScholar Team</p>
              </div>
              <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
