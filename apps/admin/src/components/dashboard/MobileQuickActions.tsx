"use client";

import { useRouter } from "next/navigation";

interface MobileQuickActionsProps {
  onNavigate: (itemId: string) => void;
}

export function MobileQuickActions({ onNavigate }: MobileQuickActionsProps) {
  const actions = [
    { id: "all-products", label: "Products" },
    { id: "all-orders", label: "Orders" },
    { id: "all-customers", label: "Customers" },
    { id: "sales-analytics", label: "Analytics" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-2 overflow-x-auto">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
