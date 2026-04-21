"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserTable, UserForm } from "./components";
import { User, CreateUserInput, UpdateUserInput } from "./types";
import {
  UserPlus,
  Search,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  bulkUpdateStatus,
} from "@/services/userApi";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "STAFF" | "MANAGER">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadUsers();
  }, [pagination.page, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter === "active") params.isActive = true;
      if (statusFilter === "inactive") params.isActive = false;
      if (searchQuery) params.search = searchQuery;

      const response = await getUsers(params);
      if (response.success) {
        setUsers(
          response.data.users.map((user) => ({
            ...user,
            permissions: user.permissions || [],
            createdAt: new Date(user.createdAt),
          })),
        );
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadUsers();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleBulkActivate = async () => {
    if (selectedUsers.size === 0) {
      toast.error("Please select users first");
      return;
    }
    try {
      await bulkUpdateStatus(Array.from(selectedUsers), true);
      toast.success(`${selectedUsers.size} users activated`);
      setSelectedUsers(new Set());
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update users");
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedUsers.size === 0) {
      toast.error("Please select users first");
      return;
    }
    try {
      await bulkUpdateStatus(Array.from(selectedUsers), false);
      toast.success(`${selectedUsers.size} users deactivated`);
      setSelectedUsers(new Set());
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update users");
    }
  };

  const handleCreateUser = async (data: CreateUserInput) => {
    try {
      const response = await createUser(data);
      if (response.success && response.data?.user) {
        await loadUsers();
        toast.success("User created successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
      throw error;
    }
  };

  const handleUpdateUser = async (data: UpdateUserInput) => {
    if (!editingUser) return;

    try {
      const response = await updateUser(editingUser.id, data);
      if (response.success) {
        await loadUsers();
        setEditingUser(null);
        toast.success("User updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        const response = await deleteUser(userId);
        if (response.success) {
          await loadUsers();
          toast.success("User deleted successfully");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to delete user");
      }
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateUser(userId, { isActive });
      await loadUsers();
      toast.success(`User ${isActive ? "activated" : "deactivated"}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status");
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt("Enter new password (min 6 characters):");
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await resetPassword(userId, newPassword);
      toast.success("Password reset successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const stats = {
    total: pagination.total,
    active: users.filter((u) => u.isActive).length,
    staff: users.filter((u) => u.role === "STAFF").length,
    managers: users.filter((u) => u.role === "MANAGER").length,
  };

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.managers}
                </p>
                <p className="text-sm text-gray-500">Managers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.staff}
                </p>
                <p className="text-sm text-gray-500">Staff Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={roleFilter}
                    onChange={(e) =>
                      setRoleFilter(e.target.value as typeof roleFilter)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="STAFF">Staff</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as typeof statusFilter)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.size > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-blue-900">
                  {selectedUsers.size} user{selectedUsers.size > 1 ? "s" : ""}{" "}
                  selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkActivate}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={handleBulkDeactivate}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => setSelectedUsers(new Set())}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <UserTable
                users={filteredUsers}
                onEdit={handleEdit}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
                onResetPassword={handleResetPassword}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
              />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={pagination.page === 1}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Form Modal */}
      <UserForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={async (data) => {
          if (editingUser) {
            await handleUpdateUser(data as UpdateUserInput);
          } else {
            await handleCreateUser(data as CreateUserInput);
          }
        }}
        initialData={editingUser || undefined}
        mode={editingUser ? "edit" : "create"}
      />
    </DashboardLayout>
  );
}
