"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  NotificationList,
  NotificationForm,
  DeleteConfirmModal,
  useNotifications,
  useCreateNotification,
  useUpdateNotification,
  useDeleteNotification,
  useCleanupExpiredNotifications,
  Notification,
  CreateNotificationInput,
  UpdateNotificationInput,
  NotificationFilters,
} from "@/features/notifications";
import { Search, Filter, Trash2, Plus } from "lucide-react";

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "" as "INFO" | "SUCCESS" | "WARNING" | "ERROR" | undefined,
    status: "" as "UNREAD" | "READ" | "ARCHIVED" | undefined,
    userId: "",
    isGlobal: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useNotifications(filters as unknown as NotificationFilters);
  const createMutation = useCreateNotification();
  const updateMutation = useUpdateNotification();
  const deleteMutation = useDeleteNotification();
  const cleanupMutation = useCleanupExpiredNotifications();

  const notifications = data?.notifications || [];
  const pagination = data?.pagination;

  const handleCreate = () => {
    setSelectedNotification(null);
    setShowForm(true);
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (data: CreateNotificationInput | UpdateNotificationInput) => {
    try {
      if (selectedNotification) {
        await updateMutation.mutateAsync({ id: selectedNotification.id, data: data as UpdateNotificationInput });
      } else {
        await createMutation.mutateAsync(data as CreateNotificationInput);
      }
      setShowForm(false);
      refetch();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteConfirm = async () => {
    if (notificationToDelete) {
      try {
        await deleteMutation.mutateAsync(notificationToDelete);
        setShowDeleteModal(false);
        setNotificationToDelete(null);
        refetch();
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const handleCleanupExpired = async () => {
    try {
      await cleanupMutation.mutateAsync();
      refetch();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <DashboardLayout title="Notification Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Notification Management
            </h1>
            <p className="text-gray-600">
              Create and manage system notifications
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCleanupExpired}
              disabled={cleanupMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Cleanup Expired
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Notification
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="INFO">Info</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <select
              value={filters.isGlobal}
              onChange={(e) => handleFilterChange("isGlobal", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Global</option>
              <option value="false">User</option>
            </select>
          </div>
        </div>

        {/* Notification List */}
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleCreate}
          deletingId={deleteMutation.isPending ? notificationToDelete : null}
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded ${
                    page === pagination.page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <NotificationForm
            notification={selectedNotification}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            onSubmit={handleFormSubmit}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setNotificationToDelete(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
