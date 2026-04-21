import { apiClient } from "@/lib/api/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isVerified?: boolean;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export async function sendVerificationEmail(
  email: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const data = await apiClient.post<{ success: boolean; message?: string }>(
      "/api/v1/auth/send-verification-email",
      { email },
    );
    return data;
  } catch (error) {
    return { success: false, message: "Failed to send verification email" };
  }
}

export async function verifyEmail(
  token: string,
): Promise<{ success: boolean; user?: AuthUser }> {
  try {
    const data = await apiClient.post<{ success: boolean; user?: AuthUser }>(
      "/api/v1/auth/verify-email",
      { token },
    );
    return data;
  } catch (error) {
    return { success: false };
  }
}

export async function register(userData: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ success: boolean; user?: AuthUser; tokens?: AuthTokens }> {
  try {
    const data = await apiClient.post<{
      success: boolean;
      user?: AuthUser;
      tokens?: AuthTokens;
    }>("/api/v1/auth/register", userData);
    return data;
  } catch (error) {
    return { success: false };
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{
  success: boolean;
  user?: AuthUser;
  tokens?: AuthTokens;
}> {
  try {
    const data = await apiClient.post<{
      success: boolean;
      user?: AuthUser;
      tokens?: AuthTokens;
    }>("/api/v1/auth/login", { email, password });
    return data;
  } catch (error) {
    return { success: false };
  }
}
