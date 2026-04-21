export interface WelcomeEmailData {
  userName: string;
  email: string;
  shopUrl: string;
  supportEmail: string;
  shopName: string;
}

export function getWelcomeEmailTemplate(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${data.shopName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #EB6426 0%, #d55a21 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to ${data.shopName}!</h1>
      </div>
      
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Hello <strong>${data.userName}</strong>,
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Your account has been successfully created! We're excited to have you as a member of our community.
        </p>
        
        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #92400E; font-size: 14px; line-height: 1.6; margin: 0;">
            <strong>Your email:</strong> ${data.email}
          </p>
        </div>
        
        <h2 style="color: #333; font-size: 18px; margin: 30px 0 15px 0;">
          What you can do now:
        </h2>
        
        <ul style="color: #666; font-size: 14px; line-height: 2;">
          <li>🏠 Browse our latest products and categories</li>
          <li>🛒 Add items to your cart and checkout seamlessly</li>
          <li>❤️ Create wishlists to save your favorite items</li>
          <li>📦 Track your orders and manage deliveries</li>
          <li>💳 Save multiple addresses for faster checkout</li>
          <li>⭐ Write reviews to help other shoppers</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.shopUrl}" style="background-color: #EB6426; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Start Shopping
          </a>
        </div>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; font-size: 16px; margin: 0 0 10px 0;">
            Need Help?
          </h3>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
            Our customer support team is here for you. Reach out to us anytime at 
            <a href="mailto:${data.supportEmail}" style="color: #EB6426;">${data.supportEmail}</a>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Thank you for choosing <strong>${data.shopName}</strong>. We look forward to serving you!
        </p>
        
        <p style="color: #999; font-size: 12px; line-height: 1.6;">
          Best regards,<br>
          <strong>The ${data.shopName} Team</strong>
        </p>
      </div>
    </div>
    
    <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
      © ${new Date().getFullYear()} ${data.shopName}. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
}
