import { sendEmail } from "./email.service";
import { logger } from "@/utils/logger";
import {
  getOrderInvoiceTemplate,
  type OrderInvoiceEmailData,
} from "../templates/emails";

export async function sendOrderConfirmationEmail(
  orderData: OrderInvoiceEmailData,
): Promise<boolean> {
  try {
    const emailHtml = getOrderInvoiceTemplate(orderData);

    const success = await sendEmail({
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber} - ${orderData.shopName}`,
      html: emailHtml,
    });

    if (success) {
      logger.info(
        `Order confirmation email sent to ${orderData.customerEmail}`,
      );
    }

    return success;
  } catch (error) {
    logger.error("Failed to send order confirmation email:", error);
    return false;
  }
}

export async function sendWelcomeEmail(
  email: string,
  userName: string,
): Promise<boolean> {
  try {
    const { getWelcomeEmailTemplate } = await import("../templates/emails");
    const emailHtml = getWelcomeEmailTemplate({
      userName,
      email,
      shopUrl: process.env.FRONTEND_URL || "http://localhost:4000",
      supportEmail: "support@gharsamma.com",
      shopName: "Ghar Samma",
    });

    return await sendEmail({
      to: email,
      subject: "Welcome to Ghar Samma! 🎉",
      html: emailHtml,
    });
  } catch (error) {
    logger.error("Failed to send welcome email:", error);
    return false;
  }
}

export async function sendPasswordChangedEmail(
  email: string,
  userName: string,
  changedAt: Date,
): Promise<boolean> {
  try {
    const { getPasswordResetConfirmationTemplate } = await import(
      "../templates/emails"
    );
    const emailHtml = getPasswordResetConfirmationTemplate({
      userName,
      resetTime: changedAt.toLocaleString(),
      supportEmail: "support@gharsamma.com",
    });

    return await sendEmail({
      to: email,
      subject: "Password Changed Successfully - Ghar Samma",
      html: emailHtml,
    });
  } catch (error) {
    logger.error("Failed to send password changed email:", error);
    return false;
  }
}
