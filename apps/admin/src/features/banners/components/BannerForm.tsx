"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Banner, CreateBannerInput, UpdateBannerInput } from "../api";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isActive: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  banner: Banner | null;
  isSubmitting: boolean;
  onSubmit: (data: CreateBannerInput | UpdateBannerInput) => void;
  onClose: () => void;
}

export function BannerForm({
  banner,
  isSubmitting,
  onSubmit,
  onClose,
}: BannerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (banner) {
      reset({ title: banner.title, isActive: banner.isActive });
    } else {
      reset({ title: "", isActive: true });
    }
  }, [banner, reset]);

  const onFormSubmit = (data: BannerFormData) => {
    onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {banner ? "Edit Banner" : "Create New Banner"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Banner title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                {...register("isActive")}
                type="checkbox"
                id="isActive"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-700"
              >
                Active (visible on website)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSubmitting
                ? "Saving..."
                : banner
                  ? "Update Banner"
                  : "Create Banner"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
