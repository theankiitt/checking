export interface ForgotPasswordEmailData {
  userName: string;
  resetLink: string;
  expiryTime: string;
}

export function getForgotPasswordEmailTemplate(
  data: ForgotPasswordEmailData,
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background-color: #EB6426; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Request</h1>
      </div>
      
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Hello ${data.userName},
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to reset it:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" style="background-color: #EB6426; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Or copy and paste this link into your browser:
        </p>
        
        <p style="color: #EB6426; font-size: 12px; word-break: break-all;">
          ${data.resetLink}
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          This link will expire in <strong>${data.expiryTime}</strong>.
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          If you didn't request this password reset, you can safely ignore this email. Your password won't be changed.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; line-height: 1.6;">
          Best regards,<br>
          <strong>The Ghar Samma Team</strong>
        </p>
      </div>
    </div>
    
    <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
      © ${new Date().getFullYear()} Ghar Samma. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
}
