export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  quantity: number;
  image: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
  variants?: Array<{
    id: string;
    name: string;
    value: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  brand?: {
    id: string;
    name: string;
    logo?: string;
  };
  attributes?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  dimensions?: {
    unit: string;
    width?: number;
    height?: number;
    length?: number;
  };
  weight?: string;
  weightUnit?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string | null;
  date: string;
  verified: boolean;
  title?: string | null;
  images?: string[];
}

export interface CustomField {
  id: string;
  name: string;
  value: string;
}

export interface ProductContextType {
  product: Product | null;
  reviews: Review[];
  relatedProducts: Product[];
  loading: boolean;
  categoryDetails: any;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  selectedVariant: number;
  setSelectedVariant: (index: number) => void;
  isWishlisted: boolean;
  setIsWishlisted: (value: boolean) => void;
}
