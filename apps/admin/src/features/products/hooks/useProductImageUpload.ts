import { useState } from "react";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

export interface UploadedImage {
  url: string;
  path: string;
  originalName: string;
  size: number;
  filename: string;
  mimetype: string;
}

export interface UploadResult {
  images: UploadedImage[];
  count: number;
}

export function useProductImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = async (
    files: File[],
  ): Promise<UploadResult | null> => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append each file to the FormData
      files.forEach((file) => {
        formData.append("images", file);
      });

      // Get token from localStorage or cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_token="))
        ?.split("=")[1];

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/upload/product/multiple`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        },
      );

      if (response.data?.success) {
        return response.data.data as UploadResult;
      }

      throw new Error(response.data?.error || "Upload failed");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to upload images";

      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    uploadImages,
    uploading,
    error,
    resetError,
  };
}
