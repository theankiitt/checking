import ProductDetail from "@/features/product-detail/components/ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return <ProductDetail productSlug={slug} category="" />;
}
