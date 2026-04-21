"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from "../hooks";
import { transformProductData } from "../utils";

export function useProductMutations() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const createProduct = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        const transformedData = transformProductData(data, false);
        await createProductMutation.mutateAsync(transformedData);
        toast.success("Product created successfully!");
        router.refresh();
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create product";
        toast.error(message);
        return false;
      }
    },
    [createProductMutation, router],
  );

  const updateProduct = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      try {
        const transformedData = transformProductData(data, true);
        await updateProductMutation.mutateAsync({ id, data: transformedData });
        toast.success("Product updated successfully!");
        router.refresh();
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update product";
        toast.error(message);
        return false;
      }
    },
    [updateProductMutation, router],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteProductMutation.mutateAsync(id);
        toast.success("Product deleted successfully!");
        router.refresh();
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete product";
        toast.error(message);
        return false;
      }
    },
    [deleteProductMutation, router],
  );

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(
          ids.map((id) => deleteProductMutation.mutateAsync(id)),
        );
        toast.success(`${ids.length} products deleted successfully!`);
        router.refresh();
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete some products";
        toast.error(message);
        return false;
      }
    },
    [deleteProductMutation, router],
  );

  const bulkUpdateStatus = useCallback(
    async (ids: string[], isActive: boolean) => {
      try {
        await Promise.all(
          ids.map((id) =>
            updateProductMutation.mutateAsync({ id, data: { isActive } }),
          ),
        );
        toast.success(
          `${ids.length} products status updated to ${isActive ? "active" : "inactive"}!`,
        );
        router.refresh();
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update some products";
        toast.error(message);
        return false;
      }
    },
    [updateProductMutation, router],
  );

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDelete,
    bulkUpdateStatus,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
}
