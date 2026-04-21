"use client";

import { useState } from "react";
import {
  CreateUserInput,
  UpdateUserInput,
  PERMISSIONS,
  PERMISSION_CATEGORIES,
  PERMISSION_PRESETS,
  User,
} from "../types";
import { UserPlus, Shield, X, Zap } from "lucide-react";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
  initialData?: User;
  mode: "create" | "edit";
}

export function UserForm({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    username: initialData?.username || "",
    password: "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    role:
      (initialData?.role as "STAFF" | "MANAGER") ||
      ("STAFF" as "STAFF" | "MANAGER"),
    permissions: initialData?.permissions || [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const data: CreateUserInput = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
          role: formData.role,
          permissions: formData.permissions,
        };
        await onSubmit(data);
      } else {
        const data: UpdateUserInput = {
          email: formData.email,
          username: formData.username,
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
          role: formData.role,
          permissions: formData.permissions,
        };
        await onSubmit(data);
      }
      onClose();
    } catch (error) {
      // Error is handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p: string) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const toggleCategoryPermissions = (categoryId: string, enabled: boolean) => {
    const categoryPermissions = PERMISSIONS.filter(
      (p) => p.category === categoryId,
    );
    if (enabled) {
      setFormData((prev) => ({
        ...prev,
        permissions: [
          ...new Set([
            ...prev.permissions,
            ...categoryPermissions.map((p) => p.id),
          ]),
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter(
          (p: string) => !categoryPermissions.find((cp) => cp.id === p),
        ),
      }));
    }
  };

  const applyPreset = (preset: (typeof PERMISSION_PRESETS)[number]) => {
    setFormData((prev) => ({
      ...prev,
      permissions: [...new Set([...prev.permissions, ...preset.permissions])],
    }));
  };

  const clearPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  const groupedPermissions = PERMISSION_CATEGORIES.map((category) => ({
    ...category,
    permissions: PERMISSIONS.filter((p) => p.category === category.id),
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl transform transition-all max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              {mode === "create" ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Create New User
                  </h3>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Edit User
                  </h3>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="John"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="johndoe"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {mode === "create" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "STAFF" | "MANAGER",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quick Presets
                </label>
                <button
                  type="button"
                  onClick={clearPermissions}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {PERMISSION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                    title={preset.description}
                  >
                    <Zap className="w-3 h-3" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions ({formData.permissions.length} selected)
              </label>
              <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {groupedPermissions.map((category) => {
                  const categoryPermissionIds = category.permissions.map(
                    (p) => p.id,
                  );
                  const checkedCount = formData.permissions.filter(
                    (p: string) => categoryPermissionIds.includes(p),
                  ).length;
                  const allChecked =
                    checkedCount === category.permissions.length;
                  const someChecked = checkedCount > 0 && !allChecked;

                  return (
                    <div
                      key={category.id}
                      className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                    >
                      <label className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          ref={(el) => {
                            if (el)
                              (el as HTMLInputElement).indeterminate =
                                someChecked;
                          }}
                          onChange={(e) =>
                            toggleCategoryPermissions(
                              category.id,
                              e.target.checked,
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-900">
                          {category.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({checkedCount}/{category.permissions.length})
                        </span>
                      </label>
                      <div className="ml-6 space-y-1">
                        {category.permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(
                                permission.id,
                              )}
                              onChange={() => togglePermission(permission.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">
                              {permission.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                    ? "Create User"
                    : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
