export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  comparePrice?: number;
  isOnSale?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  averageRating?: number;
  reviewCount?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface SliderSection {
  id: string;
  title: string;
  subtitle?: string;
  products: Product[];
}
