"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Plus, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { ProductFormData } from "../../types/product";
import { useProductImageUpload } from "../../hooks/useProductImageUpload";
import toast from "react-hot-toast";

interface MediaTabProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
}

const getImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder-image.jpg";
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
      return `${baseUrl}${url}`;
    }
    if (!url.includes("/") && !url.startsWith("http")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
      return `${baseUrl}/uploads/${url}`;
    }
    return url;
  };

export default function MediaTab({ formData, onChange }: MediaTabProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const { uploadImages, uploading } = useProductImageUpload();

  const images = formData.images || [];

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Show local preview immediately using blob URLs
    const localPreviews = fileArray.map(file => URL.createObjectURL(file));
    
    // Keep existing images but don't include blob: ones that failed before
    const existingRealImages = images.filter(img => !img.startsWith('blob:'));
    const allImages = [...existingRealImages, ...localPreviews];
    onChange("images", allImages);

    try {
      const result = await uploadImages(fileArray);

      if (result && result.images.length > 0) {
        const imagePaths = result.images.map((img) => img.path);
        
        // Replace blob URLs with server paths in order
        let pathIndex = 0;
        const finalImages = allImages.map(img => {
          if (img.startsWith('blob:') && pathIndex < imagePaths.length) {
            const path = imagePaths[pathIndex];
            pathIndex++;
            return path;
          }
          return img;
        });
        
        onChange("images", finalImages);
        toast.success("Images uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload. Showing local preview only.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange("images", newImages);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSetThumbnail = (index: number) => {
    onChange("thumbnail", images[index]);
    toast.success("Thumbnail set");
  };

  const handleAddImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      onChange("images", [...images, url.trim()]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Product Images ({images.length})
        </h3>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            uploading
              ? "border-blue-400 bg-blue-50 cursor-not-allowed"
              : isDragging
              ? "border-orange-500 bg-orange-50 cursor-pointer"
              : "border-gray-300 hover:border-orange-400 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            onClick={(e) => {
              e.stopPropagation();
            }}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-blue-600 font-medium">
                Uploading images...
              </p>
              <p className="text-sm text-blue-500 mt-2">
                Please wait
              </p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                Drag and drop images here, or{" "}
                <span className="text-orange-600">browse</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports: JPG, PNG, WebP (Max 100MB each)
              </p>
            </>
          )}
        </div>

        {/* Add Image URL Button */}
        <button
          onClick={handleAddImageUrl}
          className="mt-3 flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add image from URL
        </button>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                onClick={handleImageClick}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all cursor-pointer"
              >
                {imageErrors[index] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                ) : (
                  <img
                    src={getImageUrl(image)}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                )}

                {/* Thumbnail Badge */}
                {formData.thumbnail === image && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Thumbnail
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100" onClick={handleImageClick}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSetThumbnail(index);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-green-50 transition-colors"
                    title="Set as thumbnail"
                  >
                    <ImageIcon className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Image Number */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thumbnail Section */}
      {images.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Thumbnail</h4>
              <p className="text-sm text-blue-700 mt-1">
                Click the <ImageIcon className="w-3 h-3 inline" /> icon on any image above to set it as the main product thumbnail.
              </p>
              {formData.thumbnail && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={getImageUrl(formData.thumbnail)}
                    alt="Current thumbnail"
                    className="w-16 h-16 object-cover rounded-lg border border-blue-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-sm text-blue-800">
                    Current thumbnail set
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Product Videos ({(formData.videos || []).length})
        </h3>
        <div className="space-y-3">
          {(formData.videos || []).map((video, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{video}</p>
              </div>
              <button
                onClick={() => {
                  const newVideos = (formData.videos || []).filter(
                    (_, i) => i !== index,
                  );
                  onChange("videos", newVideos);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const url = prompt("Enter video URL:");
              if (url && url.trim()) {
                onChange("videos", [...(formData.videos || []), url.trim()]);
              }
            }}
            className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add video URL
          </button>
        </div>
      </div>
    </div>
  );
}
