"use client";

import { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  Lock,
  Bell,
  Check,
  CheckCheck,
  Package,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/store/slices/authSlice";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "inventory" | "alert" | "general";
  isRead: boolean;
  createdAt: Date;
  link?: string;
}

interface HeaderProps {
  user: User | null;
  userInitials: string;
  fullName: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showBackButton?: boolean;
  title?: string;
  onLogout: () => void;
}

// Mock notifications - replace with API call
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #1234 has been placed successfully",
    type: "order",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    link: "/dashboard/orders/1234",
  },
  {
    id: "2",
    title: "Low Stock Alert",
    message: "Product 'Handmade Statue' is running low on inventory",
    type: "inventory",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "3",
    title: "Order Shipped",
    message: "Order #1232 has been shipped to customer",
    type: "order",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "4",
    title: "New Review",
    message: "A new review was posted for 'Brass Statue'",
    type: "general",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "order":
      return <ShoppingCart className="w-5 h-5 text-blue-500" />;
    case "inventory":
      return <Package className="w-5 h-5 text-orange-500" />;
    case "alert":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function Header({
  user,
  userInitials,
  fullName,
  sidebarOpen,
  setSidebarOpen,
  showBackButton,
  title,
  onLogout,
}: HeaderProps) {
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
    setNotificationDropdownOpen(false);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              sidebarOpen
                ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                : "text-black hover:text-black hover:bg-gray-100"
            }`}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-md text-black hover:text-black hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {title && (
            <h1 className="text-lg sm:text-xl font-bold text-black truncate custom-font">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() =>
                setNotificationDropdownOpen(!notificationDropdownOpen)
              }
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 custom-font">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.isRead ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatTimeAgo(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setNotificationDropdownOpen(false);
                          router.push("/dashboard/notifications");
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                {userInitials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm text-black custom-font font-bold">
                  Welcome back, {user?.firstName || "Admin"}
                </div>
                <div className="text-xs text-black custom-font">{fullName}</div>
              </div>
              <ChevronDown
                className={`hidden sm:block w-4 h-4 text-black transition-transform ${
                  profileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                          {userInitials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-black custom-font">
                            {fullName}
                          </div>
                          <div className="text-xs text-black custom-font">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          router.push("/dashboard/settings");
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors custom-font"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Change Password</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors custom-font"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
