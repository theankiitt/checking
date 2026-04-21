"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, Clock, Loader2, Bell, Users, User, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Notification } from "../api";

interface NotificationCardProps {
  notification: Notification;
  onEdit: (notification: Notification) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "SUCCESS":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "WARNING":
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case "ERROR":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "SUCCESS":
      return "bg-green-100 text-green-800 border-green-200";
    case "WARNING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ERROR":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "READ":
      return "bg-gray-100 text-gray-800";
    case "ARCHIVED":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-orange-100 text-orange-800";
  }
};

export function NotificationCard({
  notification,
  onEdit,
  onDelete,
  isDeleting,
}: NotificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {getTypeIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                {notification.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {notification.message}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
              {notification.type}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
              {notification.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </div>
            {notification.isGlobal ? (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Global</span>
              </div>
            ) : notification.user ? (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{notification.user.firstName} {notification.user.lastName}</span>
              </div>
            ) : null}
            {notification.expiresAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Expires: {new Date(notification.expiresAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(notification)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit notification"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(notification.id)}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete notification"
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