"use client";

import { User } from "../types";
import { Edit2, Trash2, Shield, Check, X, Key } from "lucide-react";
// import { format } from "date-fns";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => Promise<void>;
  onToggleStatus: (userId: string, isActive: boolean) => Promise<void>;
  onResetPassword: (userId: string) => Promise<void>;
  selectedUsers: Set<string>;
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  onResetPassword,
  selectedUsers,
  onSelectUser,
  onSelectAll,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No users found
        </h3>
        <p className="text-sm text-gray-500">
          Get started by creating your first staff user.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 w-10">
              <input
                type="checkbox"
                checked={
                  selectedUsers.size === users.length && users.length > 0
                }
                onChange={onSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              User
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Role
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Permissions
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Last Login
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={`border-b border-gray-100 hover:bg-gray-50 ${
                selectedUsers.has(user.id) ? "bg-blue-50" : ""
              }`}
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() => onSelectUser(user.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "MANAGER"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {user.permissions.length === 0 ? (
                    <span className="text-xs text-gray-400">
                      No permissions
                    </span>
                  ) : (
                    <>
                      {user.permissions.slice(0, 3).map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                        >
                          {perm.split(".")[0]}
                        </span>
                      ))}
                      {user.permissions.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                          +{user.permissions.length - 3}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onToggleStatus(user.id, !user.isActive)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  } transition-colors`}
                >
                  {user.isActive ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </button>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : "Never"}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit user"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => onResetPassword(user.id)}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Reset password"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                  )}
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
