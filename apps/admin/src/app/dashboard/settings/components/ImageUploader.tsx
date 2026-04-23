import React, { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  currentImage: string;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  aspectRatio?: string;
}

export function ImageUploader({
  label,
  currentImage,
  onUpload,
  isUploading,
  aspectRatio = "aspect-square",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        await onUpload(file);
      }
    },
    [onUpload],
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        await onUpload(file);
      }
    },
    [onUpload],
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
  }, []);

  const displayImage = preview || currentImage;

  return (
    <div>
      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isUploading}
        />

        {displayImage ? (
          <div className="relative p-4">
            <div className="flex items-center space-x-4">
              <div
                className={`relative w-20 h-20 ${aspectRatio} flex-shrink-0`}
              >
                <img
                  src={displayImage}
                  alt={label}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                {!isUploading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {preview
                    ? "New image selected"
                    : currentImage
                      ? "Current image"
                      : "No image"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Drag & drop or click to replace
                </p>
              </div>
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-600">Uploading...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              {isDragging ? (
                <Upload className="w-6 h-6 text-blue-500" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isDragging ? "Drop image here" : "Drag & drop image"}
            </p>
            <p className="text-xs text-gray-500">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
