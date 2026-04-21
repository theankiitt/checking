"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, Eye, EyeOff, Clock, Loader2 } from "lucide-react";
import { Banner } from "../api";

interface BannerCardProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isToggling: boolean;
  isDeleting: boolean;
}

export function BannerCard({
  banner,
  onEdit,
  onDelete,
  onToggle,
  isToggling,
  isDeleting,
}: BannerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {banner.title?.replace(/<[^>]*>/g, "")}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                banner.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {banner.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                Updated: {new Date(banner.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onToggle(banner.id)}
              disabled={isToggling}
              className={`p-2 rounded-lg ${
                banner.isActive
                  ? "text-orange-600 hover:bg-orange-50"
                  : "text-green-600 hover:bg-green-50"
              } disabled:opacity-50`}
              title={banner.isActive ? "Deactivate" : "Activate"}
            >
              {isToggling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : banner.isActive ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onEdit(banner)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(banner.id)}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
              title="Delete"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
