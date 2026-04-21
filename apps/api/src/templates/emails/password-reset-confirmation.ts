export interface PasswordResetConfirmationEmailData {
  userName: string;
  resetTime: string;
  supportEmail: string;
}

export function getPasswordResetConfirmationTemplate(
  data: PasswordResetConfirmationEmailData,
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed Successfully</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background-color: #10B981; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✓ Password Changed Successfully</h1>
      </div>
      
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Hello ${data.userName},
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Your password was successfully changed on <strong>${data.resetTime}</strong>.
        </p>
        
        <div style="background-color: #F3F4F6; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0;">
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
            <strong>Didn't make this change?</strong><br>
            If you didn't change your password, please contact our support team immediately at 
            <a href="mailto:${data.supportEmail}" style="color: #EB6426;">${data.supportEmail}</a>
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          For your security, we recommend:
        </p>
        
        <ul style="color: #666; font-size: 14px; line-height: 1.8;">
          <li>Using a strong, unique password</li>
          <li>Not using the same password on multiple sites</li>
          <li>Enabling two-factor authentication</li>
        </ul>
        
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
