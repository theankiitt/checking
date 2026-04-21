"use client";

import { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import toast from "react-hot-toast";

interface CustomOrder {
  id: string;
  userId: string | null;
  userEmail: string | null;
  category: string | null;
  customizationType: string | null;
  productName: string | null;
  description: string | null;
  budget: string | null;
  deadline: string | null;
  contactMethod: string;
  phone: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CustomOrdersPage() {
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const statusOptions = [
    { value: "all", label: "All Requests" },
    { value: "PENDING", label: "Pending" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  useEffect(() => {
    loadCustomOrders();
  }, [statusFilter, pagination.page]);

  const loadCustomOrders = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/customization?${params}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setCustomOrders(data.data.requests || []);
        setPagination(data.data.pagination || pagination);
      }
    } catch (error) {
      toast.error("Failed to load custom orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
      const response = await fetch(`${API_BASE_URL}/api/v1/customization/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`Status updated to ${newStatus.toLowerCase()}`);
        loadCustomOrders();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CONTACTED":
        return <MessageCircle className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusChangeOptions = (currentStatus: string) => {
    const allStatuses = ["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"];
    return allStatuses
      .filter((s) => s !== currentStatus)
      .map((s) => ({
        value: s,
        label: `Mark as ${s.charAt(0) + s.slice(1).toLowerCase()}`,
        color: getStatusColor(s),
      }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = customOrders.filter((order) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (order.phone && order.phone.toLowerCase().includes(term)) ||
      (order.userEmail && order.userEmail.toLowerCase().includes(term)) ||
      (order.description && order.description.toLowerCase().includes(term)) ||
      (order.category && order.category.toLowerCase().includes(term))
    );
  });

  if (isLoading && customOrders.length === 0) {
    return (
      <DashboardLayout title="Custom Orders">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Custom Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Custom Order Requests
            </h1>
            <p className="text-gray-600">
              Manage customer customization requests
            </p>
          </div>
          <button
            onClick={loadCustomOrders}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Platform
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.phone || "N/A"}
                        </div>
                        {order.userEmail && (
                          <div className="text-sm text-gray-500">
                            {order.userEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.contactMethod === "whatsapp"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {order.contactMethod === "whatsapp" ? (
                          <MessageCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Phone className="w-3 h-3 mr-1" />
                        )}
                        {order.contactMethod.charAt(0).toUpperCase() +
                          order.contactMethod.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900 capitalize">
                        {order.category || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {order.description || "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">
                          {order.status.toLowerCase()}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="text-sm">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600">
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px]">
                          {getStatusChangeOptions(order.status).map(
                            (option) => (
                              <button
                                key={option.value}
                                onClick={() =>
                                  updateOrderStatus(order.id, option.value)
                                }
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${option.color}`}
                              >
                                {option.label}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No custom order requests found</p>
              </div>
            )}
          </div>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} requests
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: pageNum }))
                    }
                    className={`px-3 py-1 border rounded-lg ${
                      pagination.page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
