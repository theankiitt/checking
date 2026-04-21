"use client";

import { motion } from "framer-motion";
import { AlertCircle, Plus } from "lucide-react";
import { Banner } from "../api";
import { BannerCard } from "./BannerCard";

interface BannerListProps {
  banners: Banner[];
  isLoading: boolean;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onAddNew: () => void;
  togglingId: string | null;
  deletingId: string | null;
}

export function BannerList({
  banners,
  isLoading,
  onEdit,
  onDelete,
  onToggle,
  onAddNew,
  togglingId,
  deletingId,
}: BannerListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No banners found
        </h3>
        <p className="text-gray-500 mb-4">
          Create your first promotional banner to get started.
        </p>
        <button
          onClick={onAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Banner
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {banners.map((banner) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          isToggling={togglingId === banner.id}
          isDeleting={deletingId === banner.id}
        />
      ))}
    </div>
  );
}
