import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  accessToken: null,
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAdminToken = async (): Promise<string | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const response = await fetch(`${apiUrl}/api/v1/admin/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data?.accessToken || null;
  } catch (error) {
    return null;
  }
};

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      if (refreshPromise) {
        return await refreshPromise;
      }

      refreshPromise = refreshAdminToken();
      const token = await refreshPromise;
      refreshPromise = null;

      if (!token) {
        return rejectWithValue("Token refresh failed");
      }

      return token;
    } catch (error) {
      refreshPromise = null;
      return rejectWithValue("Token refresh failed");
    }
  },
);

// Async thunk for fetching user profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (accessToken: string | null, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${apiUrl}/api/v1/admin/profile`, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (!res.ok) {
        return rejectWithValue("Failed to fetch profile");
      }

      const data = await res.json();
      return { user: data.user, accessToken };
    } catch (error) {
      return rejectWithValue("Network error");
    }
  },
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
      const loginUrl = `${apiUrl}/api/v1/admin/login`;

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Send cookies automatically
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (jsonError) {
          errorData = {
            message: response.statusText || "Login failed",
            status: response.status,
          };
        }
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `Login failed with status ${response.status}`;
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      const result = await response.json();
      // Token is stored in httpOnly cookie by the server
      return result.user;
    } catch (error: any) {
      const errorMessage = error.message || "Network error";
      toast.error(
        `Failed to connect to API server. Please check if the server is running.`,
      );
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
      const response = await fetch(`${apiUrl}/api/v1/admin/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return rejectWithValue("Logout failed");
      }

      toast.success("Logged out successfully");
      return null;
    } catch (error) {
      return rejectWithValue("Network error during logout");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        refreshToken.fulfilled,
        (state, action: PayloadAction<string | null>) => {
          state.isLoading = false;
          state.accessToken = action.payload;
        },
      )
      .addCase(refreshToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
      });

    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (
          state,
          action: PayloadAction<{ user: User; accessToken: string | null }>,
        ) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
