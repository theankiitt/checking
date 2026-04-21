export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderInvoiceEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  supportEmail: string;
  shopName: string;
  shopLogo?: string;
}

export function getOrderInvoiceTemplate(data: OrderInvoiceEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          NPR ${item.price.toFixed(2)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          NPR ${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${data.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <div style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background-color: #EB6426; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmation</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">
          Thank you for your order!
        </p>
      </div>
      
      <div style="padding: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h2 style="color: #333; margin: 0 0 10px 0; font-size: 20px;">Order Details</h2>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">
              <strong>Order #:</strong> ${data.orderNumber}
            </p>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">
              <strong>Date:</strong> ${data.orderDate}
            </p>
            ${
              data.trackingNumber
                ? `
            <p style="color: #666; font-size: 14px; margin: 5px 0;">
              <strong>Tracking #:</strong> ${data.trackingNumber}
            </p>
            `
                : ""
            }
          </div>
          <div style="text-align: right;">
            <h2 style="color: #333; margin: 0 0 10px 0; font-size: 20px;">${data.shopName}</h2>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">Order Confirmation</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #666; font-size: 14px;">
                Item
              </th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #666; font-size: 14px;">
                Qty
              </th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #666; font-size: 14px;">
                Price
              </th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; color: #666; font-size: 14px;">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        
        <div style="display: flex; justify-content: flex-end;">
          <table style="width: 300px;">
            <tr>
              <td style="padding: 8px; color: #666; font-size: 14px;">Subtotal:</td>
              <td style="padding: 8px; text-align: right; color: #333; font-size: 14px;">
                NPR ${data.subtotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #666; font-size: 14px;">Tax:</td>
              <td style="padding: 8px; text-align: right; color: #333; font-size: 14px;">
                NPR ${data.taxAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #666; font-size: 14px;">Shipping:</td>
              <td style="padding: 8px; text-align: right; color: #333; font-size: 14px;">
                NPR ${data.shippingAmount.toFixed(2)}
              </td>
            </tr>
            ${
              data.discountAmount > 0
                ? `
            <tr style="color: #10B981;">
              <td style="padding: 8px; font-size: 14px;">Discount:</td>
              <td style="padding: 8px; text-align: right; font-size: 14px;">
                -NPR ${data.discountAmount.toFixed(2)}
              </td>
            </tr>
            `
                : ""
            }
            <tr style="border-top: 2px solid #e5e7eb;">
              <td style="padding: 12px 8px; color: #333; font-size: 16px; font-weight: bold;">
                Total:
              </td>
              <td style="padding: 12px 8px; text-align: right; color: #EB6426; font-size: 18px; font-weight: bold;">
                NPR ${data.total.toFixed(2)}
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">Shipping Address</h3>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">
            ${data.shippingAddress.street}
          </p>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
          </p>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">
            ${data.shippingAddress.country}
          </p>
          ${
            data.shippingAddress.phone
              ? `
          <p style="color: #666; font-size: 14px; margin: 5px 0;">
            Phone: ${data.shippingAddress.phone}
          </p>
          `
              : ""
          }
          <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
            <strong>Payment Method:</strong> ${data.paymentMethod}
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Thank you for shopping with us! We'll send you another email when your order ships.
        </p>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          If you have any questions, please contact us at 
          <a href="mailto:${data.supportEmail}" style="color: #EB6426;">${data.supportEmail}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; line-height: 1.6; text-align: center;">
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
