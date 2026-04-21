import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "@/utils/logger";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(String(env.SMTP_PORT || "587"), 10),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<boolean> {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    logger.info("Email service not configured. Would send email:");
    logger.info("To:", to);
    logger.info("Subject:", subject);
    logger.info("Preview (first 200 chars):", html.substring(0, 200));
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"Ghar Samma" <${env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    logger.error("Failed to send email:", error);
    return false;
  }
}

export async function verifyEmailConnection(): Promise<boolean> {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    logger.info("Email service not configured");
    return false;
  }

  try {
    await transporter.verify();
    logger.info("Email service connected successfully");
    return true;
  } catch (error) {
    logger.error("Email service connection failed:", error);
    return false;
  }
}

export default transporter;
