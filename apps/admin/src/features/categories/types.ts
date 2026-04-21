export type Category = {
  id: string;
  name: string;
  image: string;
  internalLink?: string;
  createdAt: string;
  status: "active" | "inactive";
  parentId?: string;
  subCategories?: Category[];
  isSubCategory?: boolean;
  totalQuantity?: number;
  availableUnits?: number;
  level?: number;
  hasChildren?: boolean;
  disclaimer?: string;
  additionalDetails?: string;
  faqs?: string;
};

export type CategoryFormData = {
  name: string;
  image: string;
  internalLink: string;
  status: "active" | "inactive";
  parentId: string;
  isSubCategory: boolean;
  disclaimer?: string;
  additionalDetails?: string;
  faqs?: string;
};