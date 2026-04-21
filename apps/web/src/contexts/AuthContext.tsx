"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      // Check if refresh token exists in localStorage first
      const storedRefreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;
      if (!storedRefreshToken) {
        return null;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444"}/api/v1/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        // Clear invalid tokens
        if (typeof window !== "undefined") {
          localStorage.removeItem("refreshToken");
        }
        return null;
      }

      const data = await response.json();
      const newToken = data.data?.accessToken;

      if (newToken) {
        setAccessToken(newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      return null;
    }
  }, []);

  const fetchUserProfile = useCallback(
    async (token: string): Promise<User | null> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444"}/api/v1/auth/profile`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return data.data?.user || null;
      } catch (error) {
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Try to refresh token on page load
        const newToken = await refreshToken();

        if (newToken) {
          // Fetch user profile with new token
          const userData = await fetchUserProfile(newToken);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshToken, fetchUserProfile]);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444"}/api/v1/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const { user: userData, accessToken: token } = data.data;
      setUser(userData);
      setAccessToken(token);
      router.push("/account");
    } catch (error: any) {
      setError(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444"}/api/v1/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const { user: userData, accessToken: token } = data.data;
      setUser(userData);
      setAccessToken(token);
      router.push("/account");
    } catch (error: any) {
      setError(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444"}/api/v1/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
    } finally {
      setUser(null);
      setAccessToken(null);
      router.push("/login");
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        error,
        isAuthModalOpen,
        login,
        register,
        logout,
        refreshToken,
        clearError,
        updateUser,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
