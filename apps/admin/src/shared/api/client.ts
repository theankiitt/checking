import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "@/store/store";
import { clearAuth } from "@/store/slices/authSlice";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 0,
    public response?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL: `${baseUrl}/api/v1`,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
          if (isRefreshing) {
            return new Promise((resolve) => {
              subscribeTokenRefresh((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          isRefreshing = true;

          try {
            const apiUrl =
              process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
            const response = await axios.post(
              `${apiUrl}/api/v1/admin/refresh-token`,
              {},
              { withCredentials: true },
            );

            if (response.data?.success && response.data?.data?.accessToken) {
              const newToken = response.data.data.accessToken;
              onTokenRefreshed(newToken);
              isRefreshing = false;

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            isRefreshing = false;
            refreshSubscribers = [];
          }

          if (typeof window !== "undefined") {
            store.dispatch(clearAuth());
            window.location.href = "/";
          }
        }
        return Promise.reject(this.handleError(error));
      },
    );
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return new ApiError(
        error.response?.data?.error || error.message || "Network error",
        error.response?.status || 0,
        error.response?.data,
      );
    }
    if (error instanceof ApiError) {
      return error;
    }
    return new ApiError("Unknown error", 0);
  }

  private async request<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    endpoint: string,
    data?: unknown,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    try {
      const config = method === "get" ? { params } : undefined;
      const body = method !== "get" ? data : undefined;

      const response = await this.client.request<ApiResponse<T>>({
        method,
        url: endpoint,
        data: body,
        ...config,
      });

      if (!response.data.success) {
        throw new ApiError(
          response.data.message || "Request failed",
          response.status,
          response.data,
        );
      }

      return response.data.data as T;
    } catch (error) {
      // If it's already an ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error;
      }
      // Otherwise handle it
      throw this.handleError(error);
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    return this.request<T>("get", endpoint, undefined, params);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>("post", endpoint, data);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>("put", endpoint, data);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>("patch", endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("delete", endpoint);
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(
        endpoint,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (!response.data.success) {
        throw new ApiError("Request failed", response.status, response.data);
      }

      return response.data.data as T;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
