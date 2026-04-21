"use client";

import { motion } from "framer-motion";
import { AlertCircle, Plus, Bell, BellOff } from "lucide-react";
import { Notification } from "../api";
import { NotificationCard } from "./NotificationCard";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onEdit: (notification: Notification) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  deletingId: string | null;
}

export function NotificationList({
  notifications,
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
  deletingId,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No notifications found
        </h3>
        <p className="text-gray-500 mb-4">
          Create your first notification to get started.
        </p>
        <button
          onClick={onAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" />
          Create Notification
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">
            Manage system notifications and user communications
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Notification
        </button>
      </div>

      <motion.div
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingId === notification.id}
          />
        ))}
      </motion.div>
    </div>
  );
}