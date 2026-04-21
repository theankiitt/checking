import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export type SliderImage = {
  id: string;
  imageUrl: string;
  internalLink: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FormData = {
  imageUrl: string;
  internalLink: string;
  isActive: boolean;
};

export type UseSlidersReturn = {
  sliders: SliderImage[];
  loading: boolean;
  error: string | null;
  isDeleting: (id: string) => boolean;
  isToggling: (id: string) => boolean;
  fetchSliders: () => Promise<void>;
  createSlider: (data: FormData) => Promise<boolean>;
  updateSlider: (id: string, data: Partial<FormData>) => Promise<boolean>;
  deleteSlider: (id: string) => Promise<boolean>;
  toggleSlider: (id: string, isActive: boolean) => Promise<boolean>;
  reorderSliders: (sliders: SliderImage[]) => Promise<boolean>;
};

export const useSliders = (): UseSlidersReturn => {
  const [sliders, setSliders] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const isDeleting = useCallback((id: string) => deletingIds.has(id), [deletingIds]);
  const isToggling = useCallback((id: string) => togglingIds.has(id), [togglingIds]);

  const fetchSliders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/sliders`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      if (data.success) setSliders(data.data.sliders || []);
    } catch {
      setError("Failed to fetch sliders");
    } finally {
      setLoading(false);
    }
  }, []);

  const createSlider = useCallback(
    async (formData: FormData): Promise<boolean> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/sliders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...formData, order: sliders.length + 1 }),
        });

        if (!response.ok) throw new Error("Failed to create");

        const data = await response.json();
        if (data.success) {
          setSliders((prev) => [...prev, data.data.slider]);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [sliders.length],
  );

  const updateSlider = useCallback(
    async (id: string, formData: Partial<FormData>): Promise<boolean> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/sliders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update");

        const data = await response.json();
        if (data.success) {
          setSliders((prev) =>
            prev.map((s) => (s.id === id ? data.data.slider : s)),
          );
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [],
  );

  const deleteSlider = useCallback(async (id: string): Promise<boolean> => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id));
      const response = await fetch(`${API_BASE_URL}/api/v1/sliders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete");

      const data = await response.json();
      if (data.success) {
        setSliders((prev) => prev.filter((s) => s.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  const toggleSlider = useCallback(
    async (id: string, isActive: boolean): Promise<boolean> => {
      try {
        setTogglingIds((prev) => new Set(prev).add(id));
        const response = await fetch(`${API_BASE_URL}/api/v1/sliders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isActive: !isActive }),
        });

        if (response.ok) {
          setSliders((prev) =>
            prev.map((s) =>
              s.id === id ? { ...s, isActive: !s.isActive } : s,
            ),
          );
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [],
  );

  const reorderSliders = useCallback(
    async (reorderedSliders: SliderImage[]): Promise<boolean> => {
      try {
        await Promise.all(
          reorderedSliders.map((slider) =>
            fetch(`${API_BASE_URL}/api/v1/sliders/${slider.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ order: slider.order }),
            }),
          ),
        );
        setSliders(reorderedSliders);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  return {
    sliders,
    loading,
    error,
    isDeleting,
    isToggling,
    fetchSliders,
    createSlider,
    updateSlider,
    deleteSlider,
    toggleSlider,
    reorderSliders,
  };
};