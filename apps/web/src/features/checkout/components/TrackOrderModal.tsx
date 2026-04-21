"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Order {
  orderNumber: string;
  status: string;
  createdAt: string;
  totalAmount: number;
}

interface TrackingResult {
  error?: string;
  orderNumber?: string;
  status?: string;
  createdAt?: string;
  totalAmount?: number;
}

export default function TrackOrderModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(
    null,
  );
  const [isTrackingOrder, setIsTrackingOrder] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      alert("Please enter an order number");
      return;
    }

    setIsTrackingOrder(true);
    setTrackingResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
      const response = await fetch(`${apiUrl}/api/v1/orders/${orderNumber}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setTrackingResult(data.data.order);
      } else {
        setTrackingResult({
          error: "Order not found. Please check your order number.",
        });
      }
    } catch (error) {
      setTrackingResult({
        error: "Unable to track order. Please try again later.",
      });
    } finally {
      setIsTrackingOrder(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setOrderNumber("");
    setTrackingResult(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Track Order
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F0F2F5] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-[#F0F2F5] z-10">
          <h2 className="text-2xl font-bold text-gray-900 custom-font">
            Track Your Order
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
              Enter Your Order Number
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-123456"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-black"
                onKeyDown={(e) => e.key === "Enter" && handleTrackOrder()}
              />
              <button
                onClick={handleTrackOrder}
                disabled={isTrackingOrder}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTrackingOrder ? "Tracking..." : "Track Order"}
              </button>
            </div>
          </div>

          {trackingResult && (
            <div className="mt-6">
              {trackingResult.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{trackingResult.error}</p>
                </div>
              ) : (
                <OrderDetails order={trackingResult} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderDetails({ order }: { order: NonNullable<TrackingResult> }) {
  const timelineSteps = [
    { status: "pending", label: "Order Placed", color: "bg-green-500" },
    { status: "processing", label: "Order Confirmed", color: "bg-blue-500" },
    { status: "shipped", label: "Shipped", color: "bg-blue-600" },
    { status: "delivered", label: "Delivered", color: "bg-green-600" },
  ];

  const currentStepIndex = timelineSteps.findIndex(
    (step) => step.status === order.status,
  );

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 custom-font">
        Order Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-lg font-semibold text-gray-900">
            {order.orderNumber}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="text-lg font-semibold text-blue-600 capitalize">
            {order.status}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Order Date</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(order.createdAt!).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-lg font-semibold text-gray-900">
            ${order.totalAmount}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Order Timeline</h4>
        <div className="space-y-3">
          {timelineSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            return (
              <div key={step.status} className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${isCompleted ? step.color : "bg-gray-300"}`}
                />
                <div>
                  <p
                    className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {step.label}
                  </p>
                  {isCompleted && index === 0 && (
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt!).toLocaleString()}
                    </p>
                  )}
                  {step.status === "shipped" &&
                    order.status !== "delivered" && (
                      <p className="text-sm text-gray-600">
                        On its way to you...
                      </p>
                    )}
                  {step.status === "delivered" &&
                    order.status === "delivered" && (
                      <p className="text-sm text-gray-600">
                        Your order has been delivered!
                      </p>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
