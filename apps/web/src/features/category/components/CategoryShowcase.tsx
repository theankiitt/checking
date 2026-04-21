import { Suspense } from "react";
import { CategorySection } from "./types";
import CategoryShowcaseRow from "./CategoryGrid/CategoryShowcaseRow";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  internalLink: string | null;
  children: {
    id: string;
    name: string;
    slug: string;
    image: string;
    internalLink: string | null;
  }[];
}

const FALLBACK_SECTIONS: CategorySection[] = [
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
        name: "Statue",
        image: "/statue-layout.webp",
        link: "/products/statues",
      },
      {
        id: "3",
        name: "Jewellery",
        image: "/jewellery-layout.webp",
        link: "/products/jewellery",
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
];

function CategoryShowcaseSkeleton() {
  return (
    <div className="relative -mt-8 bg-[#F0F2F5] w-full max-w-8xl mx-4 sm:mx-6 md:mx-12 pb-12">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="flex overflow-x-auto gap-6 pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 h-80 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

async function getCategorySections(): Promise<CategorySection[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/categories?active=true`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return FALLBACK_SECTIONS;
    }

    const data = await response.json();

    if (!data.success || !data.data?.categories?.length) {
      return FALLBACK_SECTIONS;
    }

    const sections: CategorySection[] = [];

    data.data.categories.forEach((cat: Category) => {
      const section: CategorySection = {
        title: cat.name,
        subtitle: `Explore our ${cat.name.toLowerCase()} collection`,
        items: [],
        linkText: "Discover more",
        linkHref: cat.internalLink || `/products/${cat.slug}`,
      };

      if (cat.children && cat.children.length > 0) {
        cat.children.slice(0, 4).forEach((child) => {
          section.items.push({
            id: child.id,
            name: child.name,
            image: child.image || "/achar-layout.webp",
            link: child.internalLink || `/products/${cat.slug}/${child.slug}`,
          });
        });
      } else {
        section.items.push({
          id: cat.id,
          name: cat.name,
          image: cat.image || "/achar-layout.webp",
          link: cat.internalLink || `/products/${cat.slug}`,
        });
        for (let i = 1; i < 4; i++) {
          section.items.push({
            id: `${cat.id}-${i}`,
            name: `${cat.name} ${i}`,
            image: cat.image || "/achar-layout.webp",
            link: cat.internalLink || `/products/${cat.slug}`,
          });
        }
      }

      sections.push(section);
    });

    return sections.length > 0 ? sections : FALLBACK_SECTIONS;
  } catch (error) {
    return FALLBACK_SECTIONS;
  }
}

export default function CategoryShowcase() {
  return (
    <Suspense fallback={<CategoryShowcaseSkeleton />}>
      <CategoryShowcaseContent />
    </Suspense>
  );
}

async function CategoryShowcaseContent() {
  const sections = await getCategorySections();

  return (
    <div className="relative -mt-8 bg-[#F0F2F5] w-full max-w-8xl mx-4 sm:mx-6 md:mx-12 pb-12">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-xl md:text-3xl font-semibold font-bricolage text-gray-900">
            Top Categories{" "}
            <span className="font-bold font-bricolage not-italic">
              We Serve
            </span>
          </h2>
        </div>

        <CategoryShowcaseRow sections={sections} colorScheme="orange" />
      </div>
    </div>
  );
}
