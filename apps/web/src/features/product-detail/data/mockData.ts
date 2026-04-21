import { Product, Review } from "../types";

export const MOCK_PRODUCT: Product = {
  id: "prod_001",
  name: "Traditional Nepali Silver Pashmina Shawl",
  slug: "traditional-nepali-silver-pashmina-shawl",
  description:
    "<p>Experience the finest craftsmanship of Nepal with this beautiful Traditional Nepali Silver Pashmina Shawl. Made from 100% pure cashmere pashmina wool.</p><p>Each piece is hand-woven by skilled artisans using traditional techniques passed down through generations.</p>",
  shortDescription:
    "Hand-woven pure Pashmina shawl with intricate silver embroidery",
  price: 299,
  comparePrice: 399,
  sku: "NP-SHW-001",
  quantity: 15,
  image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
  images: [
    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800",
    "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800",
    "https://images.unsplash.com/photo-1617634070319-f0ad43a96124?w=800",
  ],
  category: { id: "cat_001", name: "Handicrafts", slug: "handicrafts" },
  averageRating: 4.5,
  reviewCount: 128,
  variants: [
    { id: "var_001", name: "Color", value: "Silver", price: 299, quantity: 8 },
    { id: "var_002", name: "Color", value: "Gold", price: 349, quantity: 7 },
  ],
  brand: { id: "brand_001", name: "GharSamma", logo: "/logo.png" },
  attributes: [
    { id: "attr_001", name: "Material", value: "100% Pashmina Wool" },
    { id: "attr_002", name: "Size", value: "200cm x 80cm" },
    { id: "attr_003", name: "Weight", value: "450g" },
    { id: "attr_004", name: "Origin", value: "Kathmandu, Nepal" },
  ],
  dimensions: { unit: "cm", width: 80, height: 200, length: 0.5 },
  weight: "450",
  weightUnit: "g",
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev_001",
    userName: "Sarah M.",
    rating: 5,
    comment: "Absolutely stunning shawl! The quality is exceptional.",
    date: "2024-01-15",
    verified: true,
    title: "Stunning craftsmanship",
  },
  {
    id: "rev_002",
    userName: "Michael R.",
    rating: 4,
    comment: "Beautiful piece. Shipping took a bit longer than expected.",
    date: "2024-01-10",
    verified: true,
    title: "Beautiful but slow shipping",
  },
];

export const MOCK_RELATED_PRODUCTS: Product[] = [
  {
    id: "rel_001",
    name: "Handcrafted Brass Singing Bowl",
    slug: "handcrafted-brass-singing-bowl",
    description: "",
    shortDescription: "",
    price: 89,
    quantity: 10,
    image: "https://images.unsplash.com/photo-1590224458430-6e2b79c2d1c9?w=400",
    images: [
      "https://images.unsplash.com/photo-1590224458430-6e2b79c2d1c9?w=400",
    ],
    category: { id: "cat_002", name: "Puja Items", slug: "puja" },
    averageRating: 4.8,
    reviewCount: 95,
  },
  {
    id: "rel_002",
    name: "Traditional Thangka Painting",
    slug: "traditional-thangka-painting",
    description: "",
    shortDescription: "",
    price: 199,
    quantity: 5,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400",
    ],
    category: { id: "cat_001", name: "Handicrafts", slug: "handicrafts" },
    averageRating: 4.6,
    reviewCount: 72,
  },
];

export const MOCK_POPULAR_PRODUCTS: Product[] = [
  {
    id: "pop_001",
    name: "Handwoven Pashmina Scarf - Multi Color",
    slug: "handwoven-pashmina-scarf-multi",
    description: "",
    shortDescription: "",
    price: 159,
    comparePrice: 199,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400",
    ],
    category: { id: "cat_001", name: "Handicrafts", slug: "handicrafts" },
    averageRating: 4.9,
    reviewCount: 234,
  },
  {
    id: "pop_002",
    name: "Nepali Buddhist Prayer Flags Set",
    slug: "nepali-prayer-flags-set",
    description: "",
    shortDescription: "",
    price: 29,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1599697782481-a4d5a02a9a1e?w=400",
    images: [
      "https://images.unsplash.com/photo-1599697782481-a4d5a02a9a1e?w=400",
    ],
    category: { id: "cat_001", name: "Handicrafts", slug: "handicrafts" },
    averageRating: 4.7,
    reviewCount: 189,
  },
  {
    id: "pop_003",
    name: "Handmade Cotton Table Runner",
    slug: "handmade-cotton-table-runner",
    description: "",
    shortDescription: "",
    price: 49,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400",
    images: ["https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400"],
    category: { id: "cat_001", name: "Handicrafts", slug: "handicrafts" },
    averageRating: 4.5,
    reviewCount: 156,
  },
];

export const MOCK_FAQS = [
  {
    question: "What is the delivery time?",
    answer: "Standard delivery takes 5-7 business days.",
  },
  {
    question: "Can I return this product?",
    answer: "Yes, we offer a 14-day return policy.",
  },
];
