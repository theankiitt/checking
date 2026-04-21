import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export type UseImageUploadReturn = {
  uploadImage: (file: File) => Promise<string>;
  uploading: boolean;
};

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/api/v1/upload/slider`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      if (data.success) return data.data.url;
      throw new Error(data.message || "Upload failed");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploadImage, uploading };
};