"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

interface ProductsEmptyStateProps {
  hasFilters: boolean;
}

export default function ProductsEmptyState({
  hasFilters,
}: ProductsEmptyStateProps) {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">No products found</p>
      <p className="text-gray-400 text-sm mt-2">
        {hasFilters
          ? "Try adjusting your search or filter criteria"
          : "Get started by adding your first product"}
      </p>
    </motion.div>
  );
}

