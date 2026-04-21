"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Save, Loader2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Notification, CreateNotificationInput, UpdateNotificationInput } from "../api";

const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]),
  userId: z.string().optional(),
  isGlobal: z.boolean(),
  expiresAt: z.string().optional(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

interface NotificationFormProps {
  notification: Notification | null;
  isSubmitting: boolean;
  onSubmit: (data: CreateNotificationInput | UpdateNotificationInput) => void;
  onClose: () => void;
}

export function NotificationForm({
  notification,
  isSubmitting,
  onSubmit,
  onClose,
}: NotificationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "INFO",
      userId: "",
      isGlobal: false,
      expiresAt: "",
    },
  });

  const isGlobal = watch("isGlobal");

  useEffect(() => {
    if (notification) {
      reset({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        userId: notification.userId || "",
        isGlobal: notification.isGlobal,
        expiresAt: notification.expiresAt ? new Date(notification.expiresAt).toISOString().slice(0, 16) : "",
      });
    } else {
      reset({
        title: "",
        message: "",
        type: "INFO",
        userId: "",
        isGlobal: false,
        expiresAt: "",
      });
    }
  }, [notification, reset]);

  const onFormSubmit = (data: NotificationFormData) => {
    const submitData = {
      ...data,
      userId: data.isGlobal ? undefined : data.userId || undefined,
      expiresAt: data.expiresAt || undefined,
    };
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {notification ? "Edit Notification" : "Create Notification"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter notification title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              {...register("message")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter notification message"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="INFO">Info</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  {...register("isGlobal")}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Send to all users (Global notification)
                </label>
              </div>
              {!isGlobal && (
                <input
                  {...register("userId")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user ID (leave empty for global)"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date (Optional)
            </label>
            <div className="relative">
              <input
                {...register("expiresAt")}
                type="datetime-local"
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Leave empty for no expiration
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {notification ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}