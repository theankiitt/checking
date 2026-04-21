import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
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

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/admin/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const newToken = response.data?.data?.accessToken;
    if (newToken) {
      accessToken = newToken;
      setAccessToken(newToken);
      return newToken;
    }
    return null;
  } catch (error) {
    accessToken = null;
    setAccessToken(null);
    return null;
  }
};

class AdminApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL: `${baseUrl}/api/v1/admin`,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            let newToken: string | null;

            if (refreshPromise) {
              newToken = await refreshPromise;
            } else {
              refreshPromise = refreshToken();
              newToken = await refreshPromise;
              refreshPromise = null;
            }

            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }

            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          } catch (refreshError) {
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(endpoint, {
        params,
      });
      if (!response.data.success) {
        throw new ApiError(
          response.data.error || "Request failed",
          response.status,
          response.data,
        );
      }
      return response.data.data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (axios.isAxiosError(error)) {
        const apiError = new ApiError(
          error.response?.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
            ? (error.response.data as any).error
            : error.message || "Network error",
          error.response?.status || 0,
          error.response?.data,
        );
        throw apiError;
      }
      throw new ApiError("Unknown error", 0);
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(endpoint, data);
      if (!response.data.success) {
        throw new ApiError(
          response.data.error || "Request failed",
          response.status,
          response.data,
        );
      }
      return response.data.data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (axios.isAxiosError(error)) {
        const apiError = new ApiError(
          error.response?.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
            ? (error.response.data as any).error
            : error.message || "Network error",
          error.response?.status || 0,
          error.response?.data,
        );
        throw apiError;
      }
      throw new ApiError("Unknown error", 0);
    }
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(endpoint, data);
      if (!response.data.success) {
        throw new ApiError(
          response.data.error || "Request failed",
          response.status,
          response.data,
        );
      }
      return response.data.data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (axios.isAxiosError(error)) {
        const apiError = new ApiError(
          error.response?.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
            ? (error.response.data as any).error
            : error.message || "Network error",
          error.response?.status || 0,
          error.response?.data,
        );
        throw apiError;
      }
      throw new ApiError("Unknown error", 0);
    }
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(endpoint, data);
      if (!response.data.success) {
        throw new ApiError(
          response.data.error || "Request failed",
          response.status,
          response.data,
        );
      }
      return response.data.data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (axios.isAxiosError(error)) {
        const apiError = new ApiError(
          error.response?.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
            ? (error.response.data as any).error
            : error.message || "Network error",
          error.response?.status || 0,
          error.response?.data,
        );
        throw apiError;
      }
      throw new ApiError("Unknown error", 0);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(endpoint);
      if (!response.data.success) {
        throw new ApiError(
          response.data.error || "Request failed",
          response.status,
          response.data,
        );
      }
      return response.data.data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (axios.isAxiosError(error)) {
        const apiError = new ApiError(
          error.response?.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
            ? (error.response.data as any).error
            : error.message || "Network error",
          error.response?.status || 0,
          error.response?.data,
        );
        throw apiError;
      }
      throw new ApiError("Unknown error", 0);
    }
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
        throw new ApiError(
          response.data.error || "Request failed",
          response.status,
          response.data,
        );
      }
      return response.data.data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (axios.isAxiosError(error)) {
        const apiError = new ApiError(
          error.response?.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data
            ? (error.response.data as any).error
            : error.message || "Network error",
          error.response?.status || 0,
          error.response?.data,
        );
        throw apiError;
      }
      throw new ApiError("Unknown error", 0);
    }
  }
}

export const adminApiClient = new AdminApiClient();
