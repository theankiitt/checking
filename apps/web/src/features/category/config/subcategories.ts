// Subcategory definitions for each main category
// Used when API doesn't return hierarchical category data
export const CATEGORY_SUBCATEGORIES: Record<string, Array<{
  id: string;
  name: string;
  slug: string;
  image: string;
}>> = {
  achar: [
    {
      id: "achar-veg",
      name: "Veg Achar",
      slug: "veg-achar",
      image: "/uploads/categories/achar-veg.jpg",
    },
    {
      id: "achar-non-veg",
      name: "Non-Veg Achar",
      slug: "non-veg-achar",
      image: "/uploads/categories/achar-non-veg.jpg",
    },
    {
      id: "achar-mixed",
      name: "Mixed Achar",
      slug: "mixed-achar",
      image: "/uploads/categories/achar-mixed.jpg",
    },
    {
      id: "achar-special",
      name: "Special Achar",
      slug: "special-achar",
      image: "/uploads/categories/achar-special.jpg",
    },
  ],
  "veg-achar": [],
  "non-veg-achar": [],
  snacks: [
    {
      id: "snacks-chips",
      name: "Chips",
      slug: "chips",
      image: "/uploads/categories/snacks-chips.jpg",
    },
    {
      id: "snacks-noodles",
      name: "Noodles",
      slug: "noodles",
      image: "/uploads/categories/snacks-noodles.jpg",
    },
    {
      id: "snacks-biscuits",
      name: "Biscuits",
      slug: "biscuits",
      image: "/uploads/categories/snacks-biscuits.jpg",
    },
  ],
  statue: [
    {
      id: "statue-buddha",
      name: "Buddha",
      slug: "buddha",
      image: "/uploads/categories/statue-buddha.jpg",
    },
    {
      id: "statue-ganesh",
      name: "Ganesh",
      slug: "ganesh",
      image: "/uploads/categories/statue-ganesh.jpg",
    },
    {
      id: "statue-krishna",
      name: "Krishna",
      slug: "krishna",
      image: "/uploads/categories/statue-krishna.jpg",
    },
  ],
};

// Get subcategories for a given category slug
export const getSubCategories = (categorySlug: string) => {
  const baseSlug = categorySlug.split("-")[0]?.toLowerCase();
  const result = CATEGORY_SUBCATEGORIES[baseSlug] || [];
  return result;
};
