"use client";

import { motion } from "framer-motion";
import { Plus, Filter } from "lucide-react";

interface ProductsPageHeaderProps {
  filteredProductsLength: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  onAddProduct: () => void;
}

export default function ProductsPageHeader({
  filteredProductsLength,
  showFilters,
  onToggleFilters,
  onAddProduct,
}: ProductsPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600 mt-1">
          Manage your product catalog ({filteredProductsLength} products)
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleFilters}
          className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
            showFilters
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>

        <motion.button
          onClick={onAddProduct}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </motion.button>
      </div>
    </div>
  );
}

