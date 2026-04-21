"use client";

import { useState } from "react";
import { Edit, Trash, Eye, Plus, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "../types";
import { getFullImageUrl } from "../hooks/useCategories";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string, name: string) => void;
  onAddSub: (category: Category) => void;
  onImagePreview: (image: string) => void;
  isDeleting: (id: string) => boolean;
}

const ITEMS_PER_PAGE = 3;

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  onAddSub,
  onImagePreview,
  isDeleting,
}: CategoryCardProps) {
  const [subPage, setSubPage] = useState(1);
  const [expandedNested, setExpandedNested] = useState<Record<string, boolean>>({});
  const [showSubCategories, setShowSubCategories] = useState(false);

  const subCategories = category.subCategories || [];
  const totalSubPages = Math.ceil(subCategories.length / ITEMS_PER_PAGE);
  const paginatedSubs = subCategories.slice(
    (subPage - 1) * ITEMS_PER_PAGE,
    subPage * ITEMS_PER_PAGE,
  );

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-96 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-42 w-full bg-gradient-to-br from-gray-50 to-gray-100">
          {category.image ? (
            <img
              src={getFullImageUrl(category.image)}
              alt={category.name}
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = "/image.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xl font-bold">{category.name.charAt(0)}</span>
              </div>
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => onImagePreview(category.image)}
              className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transform hover:scale-110 transition-all"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Badge */}
          {subCategories.length > 0 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>{subCategories.length}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 ">
            {category.name}
          </h3>
          
          {category.internalLink && (
            <p className="text-lg text-gray-800 mb-3 ">
              {category.internalLink}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 pt-2">
            <button
              onClick={() => onEdit(category)}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onAddSub(category)}
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sub</span>
            </button>
            <button
              onClick={() => onDelete(category.id, category.name)}
              disabled={isDeleting(category.id)}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting(category.id) ? (
                <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash className="w-3.5 h-3.5" />
              )}
              <span>Delete</span>
            </button>
          </div>

          {/* Toggle Sub-categories Button */}
          {subCategories.length > 0 && (
            <button
              onClick={() => setShowSubCategories(!showSubCategories)}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-md font-medium text-gray-700 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {showSubCategories ? "Hide" : "Show"} Sub-categories ({subCategories.length})
              </span>
              {showSubCategories ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sub-categories (Expandable) */}
      <AnimatePresence>
        {showSubCategories && subCategories.length > 0 && (
          <motion.div
            className="mt-3 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-1.5">
              {paginatedSubs.map((subCategory) => (
                <SubCategoryItem
                  key={subCategory.id}
                  subCategory={subCategory}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddSub={onAddSub}
                  onImagePreview={onImagePreview}
                  isDeleting={isDeleting}
                  expandedNested={expandedNested}
                  onToggleNested={(id) =>
                    setExpandedNested((prev) => ({ ...prev, [id]: !prev[id] }))
                  }
                />
              ))}
            </div>

            {totalSubPages > 1 && (
              <div className="flex justify-center gap-1 pt-2">
                {Array.from({ length: totalSubPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setSubPage(page)}
                    className={`w-7 h-7 text-xs rounded-md transition-colors ${
                      subPage === page
                        ? "bg-orange-500 text-white font-medium"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SubCategoryItemProps {
  subCategory: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string, name: string) => void;
  onAddSub: (category: Category) => void;
  onImagePreview: (image: string) => void;
  isDeleting: (id: string) => boolean;
  expandedNested: Record<string, boolean>;
  onToggleNested: (id: string) => void;
}

function SubCategoryItem({
  subCategory,
  onEdit,
  onDelete,
  onAddSub,
  onImagePreview,
  isDeleting,
  expandedNested,
  onToggleNested,
}: SubCategoryItemProps) {
  const nestedSubs = subCategory.subCategories || [];
  const isExpanded = expandedNested[subCategory.id] || false;
  const displayNested = isExpanded ? nestedSubs : nestedSubs.slice(0, 3);
  const hasMoreNested = nestedSubs.length > 3;

  return (
    <motion.div
      className="bg-gray-50 rounded-lg overflow-hidden transition-colors"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <h5 className="text-sm font-semibold text-gray-900">{subCategory.name}</h5>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                subCategory.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {subCategory.status}
            </span>
            {subCategory.hasChildren && nestedSubs.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-100 text-blue-700">
                {nestedSubs.length} sub
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onImagePreview(subCategory.image)}
            className="text-gray-500 hover:text-orange-600 p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(subCategory)}
            className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAddSub(subCategory)}
            className="text-green-600 hover:bg-green-50 p-1.5 rounded transition-colors"
            title="Add Sub"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(subCategory.id, subCategory.name)}
            disabled={isDeleting(subCategory.id)}
            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors disabled:opacity-50"
            title="Delete"
          >
            {isDeleting(subCategory.id) ? (
              <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {nestedSubs.length > 0 && (
          <div className="mt-3 space-y-1.5 pl-4">
            <div className="flex items-center justify-between">
              <h6 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                Sub-items ({nestedSubs.length})
              </h6>
            </div>
            <div className="space-y-1">
              {displayNested.map((nested) => (
                <div
                  key={nested.id}
                  className="flex items-center justify-between p-2 bg-white rounded-md hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-orange-400 rounded-full" />
                    <span className="text-xs text-gray-900 truncate max-w-[120px]">{nested.name}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onImagePreview(nested.image)}
                      className="text-gray-500 hover:text-orange-600 p-1 rounded"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onEdit(nested)}
                      className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDelete(nested.id, nested.name)}
                      disabled={isDeleting(nested.id)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded disabled:opacity-50"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {hasMoreNested && (
              <button
                onClick={() => onToggleNested(subCategory.id)}
                className="w-full py-1.5 px-2 bg-orange-50 hover:bg-orange-100 text-orange-600 text-[10px] font-medium rounded transition-colors"
              >
                {isExpanded ? "See Less" : `See More (${nestedSubs.length - 3} more)`}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
