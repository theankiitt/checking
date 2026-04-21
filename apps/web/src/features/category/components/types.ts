export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

export interface CategorySection {
  title: string;
  subtitle?: string;
  items: CategoryItem[];
  linkText: string;
  linkHref: string;
}

export interface MediaItem {
  id: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  linkTo?: string;
  internalLink?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCollectionProps {
  className?: string;
}

export const COLOR_SCHEMES = [
  {
    bg: "from-amber-100 to-amber-200",
    text: "text-amber-800",
    link: "text-amber-800 hover:text-amber-900",
    button: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
  },
  {
    bg: "from-orange-100 to-orange-200",
    text: "text-orange-800",
    link: "text-orange-800 hover:text-orange-900",
    button: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
  },
  {
    bg: "from-green-100 to-green-200",
    text: "text-green-800",
    link: "text-green-800 hover:text-green-900",
    button: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
  },
  {
    bg: "from-purple-100 to-purple-200",
    text: "text-purple-800",
    link: "text-purple-800 hover:text-purple-900",
    button: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
  },
  {
    bg: "from-teal-100 to-teal-200",
    text: "text-teal-800",
    link: "text-teal-800 hover:text-teal-900",
    button: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
  },
  {
    bg: "from-pink-100 to-pink-200",
    text: "text-pink-800",
    link: "text-pink-800 hover:text-pink-900",
    button: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
  },
];

export const getCategoryColors = (index: number) =>
  COLOR_SCHEMES[index % COLOR_SCHEMES.length];

export const handleMediaError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.style.display = "none";
  const parent = target.parentElement;
  if (parent) {
    parent.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">No Image</div>`;
  }
};

export const categoryData: CategorySection[] = [
  {
    title: "Foods",
    subtitle: "Authentic Nepali Flavors",
    items: [
      { id: "1", name: "Achar", image: "/achar-layout.webp", link: "/foods" },
      { id: "2", name: "Tea", image: "/tea-layout.webp", link: "/foods" },
      {
        id: "3",
        name: "Typical Nepali",
        image: "/typical-layout.webp",
        link: "/products/foods/typical-nepali",
      },
      { id: "4", name: "Masala", image: "/masala-layout.webp", link: "/foods" },
    ],
    linkText: "Discover more",
    linkHref: "/products/foods",
  },
  {
    title: "Dress",
    subtitle: "Traditional & Modern",
    items: [
      {
        id: "1",
        name: "Sari",
        image: "/sari-layout.webp",
        link: "/products/dress",
      },
      {
        id: "2",
        name: "Lehenga",
        image: "/lehenga-layout.webp",
        link: "/products/dress",
      },
      {
        id: "3",
        name: "Gown",
        image: "/gown-layout.webp",
        link: "/products/dress",
      },
      {
        id: "4",
        name: "Cultural",
        image: "/cultural-layout.webp",
        link: "/products/dress",
      },
    ],
    linkText: "Discover more",
    linkHref: "/products/dress",
  },
  {
    title: "Gift and Souvenir",
    subtitle: "Perfect Presents",
    items: [
      {
        id: "1",
        name: "Statue",
        image: "/statue-layout.webp",
        link: "/products/gift-souvenir",
      },
      {
        id: "2",
        name: "Singing Bowl",
        image: "/singingbowl-layout.webp",
        link: "/products/gift-souvenir",
      },
      {
        id: "3",
        name: "Khukuri",
        image: "/khurkuri-layout.webp",
        link: "/products/gift-souvenir",
      },
      {
        id: "4",
        name: "Rudrakshya",
        image: "/rudrakhsya-layout.webp",
        link: "/products/gift-souvenir",
      },
    ],
    linkText: "Discover more",
    linkHref: "/products/gift-souvenir",
  },
  {
    title: "Handicrafts",
    subtitle: "Artisan Made",
    items: [
      {
        id: "1",
        name: "Carpet",
        image: "/carpet-layout.webp",
        link: "/products/handicrafts",
      },
      {
        id: "2",
        name: "Pashmina",
        image: "/pashmina-layout.webp",
        link: "/products/handicrafts",
      },
      {
        id: "3",
        name: "Woven",
        image: "/woven-layout.webp",
        link: "/products/handicrafts",
      },
      {
        id: "4",
        name: "Metal",
        image: "/metal-handicraft-300x300.png",
        link: "/products/handicrafts",
      },
    ],
    linkText: "Discover more",
    linkHref: "/products/handicrafts",
  },
];

export const getFullImageUrl = (
  imagePath: string,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444",
): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/")) return `${apiBaseUrl}${imagePath}`;
  return `${apiBaseUrl}/uploads${imagePath}`;
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = "/image.png";
};
