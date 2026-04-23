"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import EnhancedProductForm from "@/features/products/components/EnhancedProductForm";
import AdvancedProductFilter from "@/components/AdvancedProductFilter";
import BulkOperations from "@/features/products/components/BulkOperations";
import DashboardLayout from "@/components/DashboardLayout";
import {
  productFilterSchema,
  ProductFilterData,
} from "@/schemas/productSchema";
import { getApiBaseUrl } from "@/utils/api";
import DeleteAlert from "@/features/products/components/DeleteAlert";
import { CompleteProductData } from "@/schemas/productFormSchema";
import ProductsPagination from "@/features/products/components/ProductsPagination";
import ProductsEmptyState from "@/features/products/components/ProductsEmptyState";
import { AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import { useProducts, useProductMutations } from "@/features/products/hooks";
import { Product } from "@/shared/types";
import { ProductFormData } from "@/features/products/types/product";
import { transformProductData } from "@/features/products/utils";
import ProductPreviewModal from "@/features/products/components/ProductPreviewModal";
import Link from "next/link";

// Helper to get correct image URL from API
const getProductImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("data:")) return imagePath; // base64
  if (imagePath.startsWith("http")) return imagePath; // full URL
  // Relative path from API - prepend API base URL
  const API_BASE_URL = getApiBaseUrl();
  return `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export default function ProductsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    productId: "",
    productName: "",
    productImage: "",
  });
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      children?: Array<{ id: string; name: string; slug: string }>;
    }>
  >([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error,
    refetch: refetchProducts,
  } = useProducts({ page: 1, limit: 100 });

  const products = productsData?.products || [];
  const apiPagination = productsData?.pagination;

  const {
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDelete,
    bulkUpdateStatus,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProductMutations();

  const {
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = useProductMutations();

  const {
    control,
    watch,
    reset: resetFilters,
    formState: { errors: filterErrors },
  } = useForm<ProductFilterData>({
    defaultValues: {
      search: "",
      categoryId: "",
      isActive: undefined,
      priceMin: undefined,
      priceMax: undefined,
      stockMin: undefined,
      stockMax: undefined,
      isFeatured: undefined,
      isDigital: undefined,
      dateFrom: "",
      dateTo: "",
      sortBy: "createdAt" as const,
      sortOrder: "desc" as const,
    },
  });

  const watchedFilters = watch();

  const fetchCategories = async () => {
    try {
      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const mappedCategories = (data.data.categories || []).map(
            (cat: any) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
              _count: cat._count,
              children:
                cat.children?.map((child: any) => ({
                  id: child.id,
                  name: child.name,
                  slug:
                    child.slug || child.name.toLowerCase().replace(/\s+/g, "-"),
                  _count: child._count,
                  children:
                    child.children?.map((grandchild: any) => ({
                      id: grandchild.id,
                      name: grandchild.name,
                      slug:
                        grandchild.slug || grandchild.name.toLowerCase().replace(/\s+/g, "-"),
                      _count: grandchild._count,
                    })) || [],
                })) || [],
            }),
          );
          setCategories(mappedCategories);
        }
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleProductSubmit = useCallback(
    async (data: any) => {
      const transformedData = transformProductData(data, !!editingProduct);

      try {
        if (editingProduct) {
          const result = await updateProductMutation.mutateAsync({
            id: editingProduct.id,
            data: transformedData,
          });
          if (result) {
            toast.success("Product updated successfully!");
            setShowAddModal(false);
            setEditingProduct(null);
            refetchProducts();
          }
        } else {
          const result = await createProductMutation.mutateAsync(transformedData);
          if (result) {
            toast.success("Product created successfully!");
            setShowAddModal(false);
            setEditingProduct(null);
            refetchProducts();
          }
        }
      } catch (error: any) {

        // Show detailed validation errors
        const errorData = error?.response?.data || error?.response || {};
        const details = errorData?.details || errorData?.error || error?.message;

        if (details && Array.isArray(details)) {
          const errorMsg = details.map((d: any) => `${d.field || d.path || ''}: ${d.message || d}`).join("\n");
          toast.error(`Validation Error:\n${errorMsg}`, { duration: 8000 });
        } else if (details && typeof details === 'string') {
          toast.error(details, { duration: 8000 });
        } else if (errorData?.error && typeof errorData.error === 'string') {
          toast.error(errorData.error, { duration: 8000 });
        } else if (error?.message && typeof error.message === 'string') {
          toast.error(error.message, { duration: 8000 });
        } else {
          toast.error(editingProduct ? "Failed to update product" : "Failed to create product", { duration: 8000 });
        }
      }
    },
    [
      editingProduct,
      createProductMutation,
      updateProductMutation,
      refetchProducts,
    ],
  );

  const handleEditProduct = useCallback(async (product: Product) => {
    try {
      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(
        `${API_BASE_URL}/api/v1/products/${product.id}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.product) {
          const productData = result.data.product;
          const completeProductData = {
            ...productData,
            shortDescription: productData.shortDescription || "",
            disclaimer: productData.disclaimer || "",
            ingredients: productData.ingredients || "",
            additionalDetails: productData.additionalDetails || "",
            materialCare: productData.materialCare || "",
            showIngredients: productData.showIngredients || false,
            showDisclaimer: productData.showDisclaimer || false,
            showAdditionalDetails: productData.showAdditionalDetails || false,
            showMaterialCare: productData.showMaterialCare || false,
            slug: productData.slug || productData.productCode || "",
            categoryId: productData.categoryId || "",
            subCategoryId: productData.subCategoryId || "",
            pricingTiers: productData.pricingTiers || [],
            currencyPrices: productData.currencyPrices || [],
            attributes: productData.attributes || [],
          };
          setEditingProduct(completeProductData);
        } else {
          setEditingProduct(product);
        }
      } else {
        setEditingProduct(product);
      }
    } catch (error) {
      setEditingProduct(product);
    }

    setShowAddModal(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const product = products.find((p: Product) => p.id === id);
      if (product) {
        setDeleteAlert({
          isOpen: true,
          productId: id,
          productName: product.name,
          productImage:
            product.images && product.images.length > 0
              ? product.images[0]
              : "",
        });
      }
    },
    [products],
  );

  const confirmDelete = useCallback(async () => {
    try {
      await deleteProductMutation.mutateAsync(deleteAlert.productId);
      toast.success("Product deleted successfully!");
      setSelectedProducts((prev) =>
        prev.filter((productId) => productId !== deleteAlert.productId),
      );
      setDeleteAlert({
        isOpen: false,
        productId: "",
        productName: "",
        productImage: "",
      });
      refetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  }, [deleteAlert.productId, deleteProductMutation, refetchProducts]);

  const cancelDelete = useCallback(() => {
    setDeleteAlert({
      isOpen: false,
      productId: "",
      productName: "",
      productImage: "",
    });
  }, []);

  const handleStatusChange = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        await updateProductMutation.mutateAsync({
          id,
          data: { isActive },
        });
        toast.success(
          `Product ${isActive ? "activated" : "deactivated"} successfully!`,
        );
        refetchProducts();
      } catch {
        toast.error("Failed to update product status");
      }
    },
    [updateProductMutation, refetchProducts],
  );

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingProduct(null);
  }, []);

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(
          ids.map((id) => deleteProductMutation.mutateAsync(id)),
        );
        toast.success(`${ids.length} products deleted successfully!`);
        setSelectedProducts([]);
        refetchProducts();
      } catch {
        toast.error("Failed to delete some products");
      }
    },
    [deleteProductMutation, refetchProducts],
  );

  const handleBulkStatusChange = useCallback(
    async (ids: string[], isActive: boolean) => {
      try {
        await Promise.all(
          ids.map((id) =>
            updateProductMutation.mutateAsync({ id, data: { isActive } }),
          ),
        );
        toast.success(
          `${ids.length} products ${isActive ? "activated" : "deactivated"}!`,
        );
        setSelectedProducts([]);
        refetchProducts();
      } catch {
        toast.error("Failed to update some products");
      }
    },
    [updateProductMutation, refetchProducts],
  );

  const handleBulkFeaturedToggle = useCallback(async (ids: string[]) => {
    toast("Bulk featured toggle feature coming soon!", { icon: "ℹ️" });
  }, []);

  const handleProductSelect = useCallback((id: string, selected: boolean) => {
    setSelectedProducts((prev) =>
      selected ? [...prev, id] : prev.filter((productId) => productId !== id),
    );
  }, []);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedProducts(products.map((p: Product) => p.id));
      } else {
        setSelectedProducts([]);
      }
    },
    [products],
  );

  const handleFilterChange = useCallback(() => {}, []);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    return products.filter((product: Product) => {
      const {
        search,
        categoryId,
        priceMin,
        priceMax,
        stockMin,
        stockMax,
        isFeatured,
        isDigital,
        dateFrom,
        dateTo,
      } = watchedFilters;

      const category =
        typeof product.category === "string"
          ? product.category
          : product.category?.name || "";

      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.sku || "").toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase()) ||
        (product.description || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory = !categoryId || product.categoryId === categoryId;

      const matchesPrice =
        (!priceMin || product.price >= priceMin) &&
        (!priceMax || product.price <= priceMax);

      const matchesStock =
        (!stockMin || (product.stock || 0) >= stockMin) &&
        (!stockMax || (product.stock || 0) <= stockMax);

      const matchesFeatured =
        isFeatured === undefined || product.isFeatured === isFeatured;

      const matchesDigital =
        isDigital === undefined || product.isDigital === isDigital;

      const productDate = product.createdAt
        ? new Date(product.createdAt)
        : new Date();
      const matchesDate =
        (!dateFrom || productDate >= new Date(dateFrom)) &&
        (!dateTo || productDate <= new Date(dateTo));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesStock &&
        matchesFeatured &&
        matchesDigital &&
        matchesDate
      );
    });
  }, [products, watchedFilters]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const activeProducts = filteredProducts.filter((p) => p.isActive).length;
    const lowStock = filteredProducts.filter(
      (p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10,
    ).length;
    const outOfStock = filteredProducts.filter((p) => (p.stock || 0) === 0).length;
    const avgPrice =
      totalProducts > 0
        ? filteredProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts
        : 0;

    return { totalProducts, activeProducts, lowStock, outOfStock, avgPrice };
  }, [filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [watchedFilters]);

  return (
    <DashboardLayout title="Product Management" showBackButton={true}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your product catalog and inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                showFilters
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                {stats.activeProducts}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stats.totalProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Total Products</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600">
                {stats.totalProducts > 0 ? Math.round((stats.activeProducts / stats.totalProducts) * 100) : 0}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stats.activeProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Active Products</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                <ArrowUpRight className="w-3 h-3" />
                Low
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stats.lowStock}</p>
            <p className="text-xs text-gray-500 mt-1">Low Stock Items</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                <ArrowDownRight className="w-3 h-3" />
                0
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stats.outOfStock}</p>
            <p className="text-xs text-gray-500 mt-1">Out of Stock</p>
          </motion.div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdvancedProductFilter
                onFilterChange={handleFilterChange}
                categories={categories}
                isLoading={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        {!isLoadingProducts && !error && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span> of{" "}
              <span className="font-medium text-gray-900">{filteredProducts.length}</span> products
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoadingProducts && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-3 bg-gray-200 rounded w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16" /></td>
                      <td className="px-6 py-4"><div className="flex justify-end gap-2">{[1,2,3].map(j => <div key={j} className="w-8 h-8 bg-gray-200 rounded-lg" />)}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoadingProducts && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Products
            </h3>
            <p className="text-red-600 mb-4">
              {error instanceof Error ? error.message : "Failed to load products"}
            </p>
            <button
              onClick={() => refetchProducts()}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Table View */}
        {!isLoadingProducts && !error && paginatedProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedProducts.map((product: Product, index: number) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={getProductImageUrl(product.images[0])}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {typeof product.category === "string"
                            ? product.category
                            : product.category?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-semibold text-gray-900">
                            ${(Number(product.price) || 0).toFixed(2)}
                          </span>
                          {product.comparePrice && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              ${(Number(product.comparePrice) || 0).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusChange(product.id, !product.isActive)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            product.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-green-600" : "bg-gray-400"}`} />
                          {product.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewProduct(product)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
        />

        {/* Empty State */}
        {!isLoadingProducts && !error && filteredProducts.length === 0 && (
          <ProductsEmptyState
            hasFilters={
              !!watchedFilters.search ||
              !!watchedFilters.categoryId ||
              watchedFilters.isActive !== undefined
            }
          />
        )}

        {/* Modals */}
        <EnhancedProductForm
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSubmit={handleProductSubmit}
          initialData={(editingProduct as any) || undefined}
          isLoading={
            createProductMutation.isPending || updateProductMutation.isPending
          }
          categories={categories}
        />

        <DeleteAlert
          isOpen={deleteAlert.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          productName={deleteAlert.productName}
          productImage={deleteAlert.productImage}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteAlert.productName}"? This action cannot be undone and will permanently remove the product from your inventory.`}
        />

        <AnimatePresence>
          {previewProduct && (
            <ProductPreviewModal
              product={previewProduct}
              onClose={() => setPreviewProduct(null)}
              onEdit={() => {
                setPreviewProduct(null);
                handleEditProduct(previewProduct);
              }}
            />
          )}
        </AnimatePresence>

        <BulkOperations
          selectedProducts={selectedProducts}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkFeaturedToggle={handleBulkFeaturedToggle}
          onClearSelection={() => setSelectedProducts([])}
          totalProducts={filteredProducts.length}
        />
      </div>
    </DashboardLayout>
  );
}
